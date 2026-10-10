import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'
import { createServer } from 'vite'

const gap = Number(process.argv[2] ?? 10)
const file = 'root/a.js'

mkdirSync('root', { recursive: true })
writeFileSync(file, 'export default 0\n')
const server = await createServer({ root: 'root', configFile: false, server: { middlewareMode: true, hmr: false } })

let lastSeen
server.watcher.on('change', (path) => (lastSeen = readFileSync(path, 'utf8')))
await sleep(1000)

let reported = 0
for (let i = 1; i <= 10; i++) {
  writeFileSync(file, `export default '${i}a'\n`)
  await sleep(gap)
  writeFileSync(file, `export default '${i}b'\n`)
  await sleep(500)
  const ok = lastSeen === `export default '${i}b'\n`
  if (ok) reported++
  console.log(`save ${i}: last change event saw ${JSON.stringify(lastSeen?.trim())}${ok ? '' : '  <- second save missed'}`)
}
console.log(`\n${gap}ms between saves: second save reported ${reported}/10`)
await server.close()
