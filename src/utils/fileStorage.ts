import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import type { Request } from 'express'

// ─── Supabase Storage (persistent) with local-disk fallback ──────────────────
//
// When SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are configured, uploaded files
// are stored in Supabase Storage (a public bucket) so they survive redeploys on
// ephemeral hosts like Render. Otherwise we fall back to the local `uploads/`
// directory (which is auto-created) so uploads keep working out of the box.
//
// To enable persistent storage create a PUBLIC bucket named "resources" in the
// Supabase dashboard (Storage → New bucket → name: "resources", "Public"),
// then set:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET (=resources)
//
// The API already serves the local folder at /uploads (see src/app.ts) and CORS
// is open (`origin: true`), so public Supabase object URLs work from the Vercel
// frontend without extra configuration.

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'resources'

export const uploadDir = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads')

/** True when Supabase Storage is configured and will be used for uploads. */
export const usesSupabaseStorage = Boolean(supabaseUrl && supabaseServiceKey)

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
    : null

/**
 * Persist an uploaded file and return the public URL.
 *
 * - Supabase: returns `{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}`
 * - Local:    returns `{proto}://{host}/uploads/{filename}` (served by express.static)
 */
export async function persistUploadedFile(
  file: Express.Multer.File,
  req: Request
): Promise<string> {
  if (supabase) {
    const ext = path.extname(file.originalname || '').toLowerCase()
    const objectPath = `resources/${file.filename}${ext}`
    const data = file.buffer ?? fs.readFileSync(file.path)
    const { error } = await supabase.storage.from(storageBucket).upload(objectPath, data, {
      contentType: file.mimetype,
      upsert: true,
    })
    if (error) {
      throw new Error(`Supabase storage upload failed: ${error.message} (is the "${storageBucket}" bucket public and created?)`)
    }
    return `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${objectPath}`
  }

  const host = (req.get('x-forwarded-host') || req.get('host') || '').toString()
  const proto = (req.get('x-forwarded-proto') || req.protocol || 'http').toString()
  return `${proto}://${host}/uploads/${file.filename}`
}
