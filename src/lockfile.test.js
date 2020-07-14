import test from 'ava'
import path from 'path'
import fs from 'fs'

const ROOT_DIR = path.join(__dirname, '..')

test('package-lock.json file does not exist', t => {
  const file = path.join(ROOT_DIR, 'package-lock.json')
  t.false(fs.existsSync(file))
})

test('yarn.lock file exist', t => {
  const file = path.join(ROOT_DIR, 'yarn.lock')
  t.true(fs.existsSync(file))
})
