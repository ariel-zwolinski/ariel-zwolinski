import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'

if (existsSync('dist')) rmSync('dist', { recursive: true, force: true })
mkdirSync('dist', { recursive: true })
cpSync('index.html', 'dist/index.html')
if (existsSync('src')) cpSync('src', 'dist/src', { recursive: true })
console.log('Build complete: dist/')
