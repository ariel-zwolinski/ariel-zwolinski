import { spawnSync } from 'node:child_process'

const result = spawnSync('npx', ['vite'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.error) {
  console.error('[ERROR] Failed to start Vite dev server:', result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
