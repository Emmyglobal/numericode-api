import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound, forbidden } from '../utils/response'

interface ForumCategoryRow {
  id: string; course_id: string | null; name: string; description: string | null
  position: number; created_at: Date
}

interface ForumThreadRow {
  id: string; category_id: string; user_id: string; title: string; body: string
  is_pinned: boolean; is_locked: boolean; view_count: number; created_at: Date; updated_at: Date
}

interface ForumPostRow {
  id: string; thread_id: string; user_id: string; body: string
  is_solution: boolean; created_at: Date; updated_at: Date
}

// ─── Forum Categories ────────────────────────────────────────────────────────

export async function listForumCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params
    let { rows } = await query<ForumCategoryRow>(
      'SELECT * FROM forum_categories WHERE course_id = $1 ORDER BY position',
      [courseId]
    )

    // Auto-create default categories if none exist for this course
    if (rows.length === 0) {
      const { rows: newRows } = await query<ForumCategoryRow>(
        `INSERT INTO forum_categories (course_id, name, description, position) VALUES
         ($1, 'General Discussion', 'General questions and discussions about the course', 0),
         ($1, 'Homework Help', 'Get help with assignments and homework', 1)
        ON CONFLICT DO NOTHING
        RETURNING *`,
        [courseId]
      )
      rows = newRows
    }

    return ok(res, rows.map(c => ({
      id: c.id, courseId: c.course_id, name: c.name, description: c.description,
      position: c.position, createdAt: c.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function createForumCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId, name, description, position } = req.body as {
      courseId?: string; name: string; description?: string; position?: number
    }
    
    if (!name) return fail(res, 'Category name is required', 400)
    
    const { rows: [category] } = await query<ForumCategoryRow>(
      `INSERT INTO forum_categories (course_id, name, description, position)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [courseId || null, name, description || '', position || 0]
    )
    
    return ok(res, {
      id: category.id, courseId: category.course_id, name: category.name,
      description: category.description, position: category.position,
      createdAt: category.created_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

export async function updateForumCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, position } = req.body as {
      name?: string; description?: string; position?: number
    }
    
    const { rows: [category] } = await query<ForumCategoryRow>(
      `UPDATE forum_categories SET
        name = COALESCE($1, name), description = COALESCE($2, description),
        position = COALESCE($3, position)
       WHERE id = $4 RETURNING *`,
      [name, description, position, req.params.categoryId]
    )
    
    if (!category) return notFound(res, 'Category not found')
    
    return ok(res, {
      id: category.id, courseId: category.course_id, name: category.name,
      description: category.description, position: category.position,
      createdAt: category.created_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function deleteForumCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query('DELETE FROM forum_categories WHERE id = $1 RETURNING id', [req.params.categoryId])
    if (!rows[0]) return notFound(res, 'Category not found')
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

// ─── Forum Threads ───────────────────────────────────────────────────────────

export async function listForumThreads(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoryId } = req.params
    const { rows } = await query<ForumThreadRow & { user_name: string }>(
      `SELECT ft.*, u.name as user_name
       FROM forum_threads ft
       JOIN users u ON u.id = ft.user_id
       WHERE ft.category_id = $1
       ORDER BY ft.is_pinned DESC, ft.created_at DESC`,
      [categoryId]
    )
    
    return ok(res, rows.map(t => ({
      id: t.id, categoryId: t.category_id, userId: t.user_id, userName: t.user_name,
      title: t.title, body: t.body, isPinned: t.is_pinned, isLocked: t.is_locked,
      viewCount: t.view_count, createdAt: t.created_at.toISOString(), updatedAt: t.updated_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function getForumThread(req: Request, res: Response, next: NextFunction) {
  try {
    const { threadId } = req.params
    
    // Increment view count
    await query('UPDATE forum_threads SET view_count = view_count + 1 WHERE id = $1', [threadId])
    
    const { rows: [thread] } = await query<ForumThreadRow & { user_name: string }>(
      `SELECT ft.*, u.name as user_name
       FROM forum_threads ft
       JOIN users u ON u.id = ft.user_id
       WHERE ft.id = $1`,
      [threadId]
    )
    
    if (!thread) return notFound(res, 'Thread not found')
    
    return ok(res, {
      id: thread.id, categoryId: thread.category_id, userId: thread.user_id,
      userName: thread.user_name, title: thread.title, body: thread.body,
      isPinned: thread.is_pinned, isLocked: thread.is_locked, viewCount: thread.view_count,
      createdAt: thread.created_at.toISOString(), updatedAt: thread.updated_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function createForumThread(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoryId, title, body } = req.body as { categoryId: string; title: string; body: string }
    
    if (!title || !body) return fail(res, 'Title and body are required', 400)
    
    const { rows: [thread] } = await query<ForumThreadRow>(
      `INSERT INTO forum_threads (category_id, user_id, title, body)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [categoryId, req.user!.userId, title, body]
    )
    
    return ok(res, {
      id: thread.id, categoryId: thread.category_id, userId: thread.user_id,
      title: thread.title, body: thread.body, isPinned: thread.is_pinned,
      isLocked: thread.is_locked, viewCount: thread.view_count,
      createdAt: thread.created_at.toISOString(), updatedAt: thread.updated_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

export async function updateForumThread(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, body, isPinned, isLocked } = req.body as {
      title?: string; body?: string; isPinned?: boolean; isLocked?: boolean
    }
    
    const { rows: [thread] } = await query<ForumThreadRow>(
      `UPDATE forum_threads SET
        title = COALESCE($1, title), body = COALESCE($2, body),
        is_pinned = COALESCE($3, is_pinned), is_locked = COALESCE($4, is_locked),
        updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [title, body, isPinned, isLocked, req.params.threadId]
    )
    
    if (!thread) return notFound(res, 'Thread not found')
    
    return ok(res, {
      id: thread.id, categoryId: thread.category_id, userId: thread.user_id,
      title: thread.title, body: thread.body, isPinned: thread.is_pinned,
      isLocked: thread.is_locked, viewCount: thread.view_count,
      createdAt: thread.created_at.toISOString(), updatedAt: thread.updated_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function deleteForumThread(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query('DELETE FROM forum_threads WHERE id = $1 RETURNING id', [req.params.threadId])
    if (!rows[0]) return notFound(res, 'Thread not found')
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

// ─── Forum Posts ─────────────────────────────────────────────────────────────

export async function listForumPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { threadId } = req.params
    const { rows } = await query<ForumPostRow & { user_name: string }>(
      `SELECT fp.*, u.name as user_name
       FROM forum_posts fp
       JOIN users u ON u.id = fp.user_id
       WHERE fp.thread_id = $1
       ORDER BY fp.created_at ASC`,
      [threadId]
    )
    
    return ok(res, rows.map(p => ({
      id: p.id, threadId: p.thread_id, userId: p.user_id, userName: p.user_name,
      body: p.body, isSolution: p.is_solution,
      createdAt: p.created_at.toISOString(), updatedAt: p.updated_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function createForumPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { threadId } = req.params
    const { body } = req.body as { body: string }
    
    if (!body) return fail(res, 'Post body is required', 400)
    
    // Check if thread is locked
    const { rows: [thread] } = await query<{ is_locked: boolean }>(
      'SELECT is_locked FROM forum_threads WHERE id = $1',
      [threadId]
    )
    if (!thread) return notFound(res, 'Thread not found')
    if (thread.is_locked) return fail(res, 'This thread is locked', 403)
    
    const { rows: [post] } = await query<ForumPostRow>(
      `INSERT INTO forum_posts (thread_id, user_id, body)
       VALUES ($1, $2, $3) RETURNING *`,
      [threadId, req.user!.userId, body]
    )
    
    return ok(res, {
      id: post.id, threadId: post.thread_id, userId: post.user_id,
      body: post.body, isSolution: post.is_solution,
      createdAt: post.created_at.toISOString(), updatedAt: post.updated_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

export async function updateForumPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { body, isSolution } = req.body as { body?: string; isSolution?: boolean }
    
    const { rows: [post] } = await query<ForumPostRow>(
      `UPDATE forum_posts SET
        body = COALESCE($1, body), is_solution = COALESCE($2, is_solution),
        updated_at = NOW()
       WHERE id = $3 AND thread_id = $4 RETURNING *`,
      [body, isSolution, req.params.postId, req.params.threadId]
    )
    
    if (!post) return notFound(res, 'Post not found')
    
    return ok(res, {
      id: post.id, threadId: post.thread_id, userId: post.user_id,
      body: post.body, isSolution: post.is_solution,
      createdAt: post.created_at.toISOString(), updatedAt: post.updated_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function deleteForumPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query(
      'DELETE FROM forum_posts WHERE id = $1 AND thread_id = $2 RETURNING id',
      [req.params.postId, req.params.threadId]
    )
    if (!rows[0]) return notFound(res, 'Post not found')
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchForumPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.query
    const searchTerm = `%${q}%`
    
    const { rows } = await query<ForumThreadRow & { category_name: string; user_name: string }>(
      `SELECT ft.*, fc.name as category_name, u.name as user_name
       FROM forum_threads ft
       JOIN forum_categories fc ON fc.id = ft.category_id
       JOIN users u ON u.id = ft.user_id
       WHERE ft.title ILIKE $1 OR ft.body ILIKE $1
       ORDER BY ft.is_pinned DESC, ft.created_at DESC
       LIMIT 50`,
      [searchTerm]
    )
    
    return ok(res, rows.map(t => ({
      id: t.id, categoryId: t.category_id, categoryName: t.category_name,
      userId: t.user_id, userName: t.user_name, title: t.title,
      body: t.body, isPinned: t.is_pinned, viewCount: t.view_count,
      createdAt: t.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}