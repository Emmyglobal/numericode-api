import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound } from '../utils/response'
import { notifyUser } from '../utils/notify'

interface MessageRow {
  id: string; sender_id: string; receiver_id: string; subject: string | null
  body: string; is_read: boolean; read_at: Date | null; created_at: Date
}

interface GroupConversationRow {
  id: string; course_id: string | null; title: string; created_by: string; created_at: Date
}

interface GroupMessageRow {
  id: string; conversation_id: string; sender_id: string; body: string; created_at: Date
}

// ─── Direct Messages ─────────────────────────────────────────────────────────

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const senderId = req.user!.userId
    const { receiverId, subject, body } = req.body as { receiverId: string; subject?: string; body: string }

    if (!receiverId || !body) {
      return fail(res, 'Receiver ID and message body are required', 400)
    }

    const { rows: [message] } = await query<MessageRow>(
      `INSERT INTO messages (sender_id, receiver_id, subject, body)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [senderId, receiverId, subject || null, body]
    )

    // Send notification to receiver
    await notifyUser(
      receiverId,
      'New Message',
      `You have a new message${subject ? `: ${subject}` : ''}`,
      'general',
      '/dashboard/messages'
    )

    return ok(res, {
      id: message.id,
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      subject: message.subject,
      body: message.body,
      isRead: message.is_read,
      createdAt: message.created_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { page = '1', limit = '20' } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    const { rows } = await query<(MessageRow & { sender_name: string; receiver_name: string })>(
      `SELECT m.*, 
        sender.name as sender_name, 
        receiver.name as receiver_name
       FROM messages m
       JOIN users sender ON sender.id = m.sender_id
       JOIN users receiver ON receiver.id = m.receiver_id
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    )

    const { rows: [countResult] } = await query<{ count: string }>(
      'SELECT COUNT(*) FROM messages WHERE sender_id = $1 OR receiver_id = $1',
      [userId]
    )

    return ok(res, {
      messages: rows.map(m => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: m.sender_name,
        receiverId: m.receiver_id,
        receiverName: m.receiver_name,
        subject: m.subject,
        body: m.body,
        isRead: m.is_read,
        createdAt: m.created_at.toISOString(),
      })),
      total: Number(countResult.count),
      page: Number(page),
      limit: Number(limit),
    })
  } catch (err) { next(err) }
}

export async function getConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { userId: otherUserId } = req.params

    const { rows } = await query<(MessageRow & { sender_name: string; receiver_name: string })>(
      `SELECT m.*, 
        sender.name as sender_name, 
        receiver.name as receiver_name
       FROM messages m
       JOIN users sender ON sender.id = m.sender_id
       JOIN users receiver ON receiver.id = m.receiver_id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2)
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at ASC`,
      [userId, otherUserId]
    )

    // Mark messages as read
    await query(
      'UPDATE messages SET is_read = TRUE, read_at = NOW() WHERE receiver_id = $1 AND sender_id = $2 AND is_read = FALSE',
      [userId, otherUserId]
    )

    return ok(res, rows.map(m => ({
      id: m.id,
      senderId: m.sender_id,
      senderName: m.sender_name,
      receiverId: m.receiver_id,
      receiverName: m.receiver_name,
      subject: m.subject,
      body: m.body,
      isRead: m.is_read,
      createdAt: m.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function markMessageAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { messageId } = req.params

    const { rows } = await query(
      'UPDATE messages SET is_read = TRUE, read_at = NOW() WHERE id = $1 AND receiver_id = $2 RETURNING *',
      [messageId, userId]
    )

    if (!rows[0]) return notFound(res, 'Message not found')

    return ok(res, { success: true })
  } catch (err) { next(err) }
}

// ─── Group Conversations ─────────────────────────────────────────────────────

export async function createGroupConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const createdBy = req.user!.userId
    const { courseId, title, memberIds } = req.body as {
      courseId?: string; title: string; memberIds: string[]
    }

    if (!title) {
      return fail(res, 'Title is required', 400)
    }

    const client = await req.app.locals.dbClient || (await import('../db/pool')).getClient()

    try {
      await client.query('BEGIN')

      // Create conversation
      const { rows: [conversation] } = await client.query(
        `INSERT INTO group_conversations (course_id, title, created_by)
         VALUES ($1, $2, $3) RETURNING *`,
        [courseId || null, title, createdBy]
      )

      // Add creator as member
      await client.query(
        'INSERT INTO group_conversation_members (conversation_id, user_id) VALUES ($1, $2)',
        [conversation.id, createdBy]
      )

      // Add other members
      if (memberIds && memberIds.length > 0) {
        for (const memberId of memberIds) {
          await client.query(
            'INSERT INTO group_conversation_members (conversation_id, user_id) VALUES ($1, $2)',
            [conversation.id, memberId]
          )
        }
      }

      await client.query('COMMIT')

      return ok(res, {
        id: conversation.id,
        courseId: conversation.course_id,
        title: conversation.title,
        createdBy: conversation.created_by,
        createdAt: conversation.created_at.toISOString(),
      }, 201)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  } catch (err) { next(err) }
}

export async function getGroupConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { courseId } = req.query

    let queryStr = `
      SELECT gc.*, 
        COUNT(DISTINCT gm.user_id) as member_count,
        COUNT(DISTINCT gm2.id) as message_count
      FROM group_conversations gc
      JOIN group_conversation_members gcm ON gcm.conversation_id = gc.id
      LEFT JOIN group_conversation_members gm ON gm.conversation_id = gc.id
      LEFT JOIN group_messages gm2 ON gm2.conversation_id = gc.id
      WHERE gcm.user_id = $1
    `
    const params: unknown[] = [userId]

    if (courseId) {
      queryStr += ` AND gc.course_id = $${params.length + 1}`
      params.push(courseId)
    }

    queryStr += ' GROUP BY gc.id ORDER BY gc.created_at DESC'

    const { rows } = await query<(GroupConversationRow & { member_count: string; message_count: string })>(queryStr, params)

    return ok(res, rows.map(r => ({
      id: r.id,
      courseId: r.course_id,
      title: r.title,
      createdBy: r.created_by,
      memberCount: Number(r.member_count),
      messageCount: Number(r.message_count),
      createdAt: r.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function getGroupMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const { conversationId } = req.params
    const userId = req.user!.userId

    // Verify user is a member
    const { rows: [member] } = await query(
      'SELECT id FROM group_conversation_members WHERE conversation_id = $1 AND user_id = $2',
      [conversationId, userId]
    )

    if (!member) {
      return fail(res, 'You are not a member of this conversation', 403)
    }

    const { rows } = await query<(GroupMessageRow & { sender_name: string })>(
      `SELECT gm.*, u.name as sender_name
       FROM group_messages gm
       JOIN users u ON u.id = gm.sender_id
       WHERE gm.conversation_id = $1
       ORDER BY gm.created_at ASC`,
      [conversationId]
    )

    return ok(res, rows.map(m => ({
      id: m.id,
      conversationId: m.conversation_id,
      senderId: m.sender_id,
      senderName: m.sender_name,
      body: m.body,
      createdAt: m.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function sendGroupMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const senderId = req.user!.userId
    const { conversationId } = req.params
    const { body } = req.body as { body: string }

    if (!body) {
      return fail(res, 'Message body is required', 400)
    }

    // Verify user is a member
    const { rows: [member] } = await query(
      'SELECT id FROM group_conversation_members WHERE conversation_id = $1 AND user_id = $2',
      [conversationId, senderId]
    )

    if (!member) {
      return fail(res, 'You are not a member of this conversation', 403)
    }

    const { rows: [message] } = await query<GroupMessageRow>(
      'INSERT INTO group_messages (conversation_id, sender_id, body) VALUES ($1, $2, $3) RETURNING *',
      [conversationId, senderId, body]
    )

    return ok(res, {
      id: message.id,
      conversationId: message.conversation_id,
      senderId: message.sender_id,
      body: message.body,
      createdAt: message.created_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}