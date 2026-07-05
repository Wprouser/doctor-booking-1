import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { pool } from '../db.js'

const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url))
const schema = readFileSync(schemaPath, 'utf-8')

async function main() {
  await pool.query(schema)
  console.log('Migration complete: doctors and appointments tables are ready.')
  await pool.end()
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
