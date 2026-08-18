import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { uploadDir, usesSupabaseStorage } from '../utils/fileStorage'

// ── Storage ──────────────────────────────────────────────────────────────────
// If Supabase Storage is configured we keep the file in memory and push it to a
// persistent bucket. Otherwise we write to the local `uploads/` directory, which
// is auto-created so the very first upload never fails with ENOENT.
// The directory mirrors what `app.use('/uploads', express.static(...))` serves.

if (!usesSupabaseStorage) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = usesSupabaseStorage
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => {
        fs.mkdirSync(uploadDir, { recursive: true })
        cb(null, uploadDir)
      },
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname)
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
        cb(null, name)
      },
    })

// ── Allowed file types (matches the front-end file picker) ──────────────────
const allowedMimePrefixes = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.ms-', // .ppt, .xls
  'application/vnd.openxmlformats-', // .docx, .pptx, .xlsx
  'application/zip',
  'application/x-zip-compressed',
  'video/',
  'image/',
  'text/plain',
  'application/json',
]

// Common extensions kept as a safety net for mislabelled MIME types.
const allowedExtensions = [
  '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
  '.mp4', '.mov', '.avi', '.mkv', '.webm', '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.zip', '.txt',
]

function acceptFile(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const mimeOk = allowedMimePrefixes.some(
    prefix => file.mimetype.startsWith(prefix)
  )
  const extOk = allowedExtensions.includes(path.extname(file.originalname).toLowerCase())
  if (!mimeOk && !extOk) {
    return cb(new Error('Unsupported file type. Please upload PDF, DOC, PPT, XLS, video, image, or ZIP files.'))
  }
  cb(null, true)
}

export const singleResourceUpload = multer({ storage, fileFilter: acceptFile, limits: { fileSize: 50 * 1024 * 1024 } })