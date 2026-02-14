import { spawnSync } from 'node:child_process'

const result = spawnSync('npx', ['vite', 'build'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.error) {
  console.error('[ERROR] Failed to start Vite build:', result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
