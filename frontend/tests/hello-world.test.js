import assert from 'node:assert/strict'
import test from 'node:test'

function greeting(name) {
  return `Hello, ${name}!`
}

test('creates a hello-world greeting', () => {
  assert.equal(greeting('world'), 'Hello, world!')
})
