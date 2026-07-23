import multer from 'multer'
import path from 'path'

const uploadDir = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads')

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, name)
  },
})

const allowedMimePrefixes = [
  'application/pdf',
  'video/',
  'application/zip',
  'image/',
]

function acceptFile(_req: Express.Request, file: Express.Multer.File, _cb: multer.FileFilterCallback) {
  const ok = allowedMimePrefixes.some(prefix => file.mimetype.startsWith(prefix) || file.mimetype === prefix)
  if (!ok) {
    return _cb(new Error('Unsupported file type. Please upload PDF, video, image, or ZIP files.'))
  }
  _cb(null, true)
}

export const singleResourceUpload = multer({ storage, fileFilter: acceptFile, limits: { fileSize: 50 * 1024 * 1024 } })