import { Blob } from 'buffer'
import t from 'tap'
import { FormData } from 'undici'
import { BusboyAdapter } from '../../../lib/adapter/busboy'
import { Storage } from '../../../lib/storage/storage'
import { createFastify } from '../../create-fastify'
import { request } from '../../request'

t.test('BusboyAdapter - addContentTypeParser', function (t) {
  t.plan(3)

  t.test('single file', async function (t) {
    t.plan(4)

    const fastify = await createFastify(t, {
      addContentTypeParser: true,
      adapter: BusboyAdapter,
      storage: Storage
    })

    const form = new FormData()
    form.append('foo', 'bar')
    form.append('file', new Blob(['hello', 'world']), 'hello_world.txt')

    const response = await request(fastify.listeningOrigin, form)
    t.equal(response.status, 200)

    const json = await response.json()

    t.equal(json.body.foo, 'bar')
    t.equal(json.body.file, 'hello_world.txt')
    t.same(json.files.file, { name: 'hello_world.txt', value: 'hello_world.txt' })
  })

  t.test('multiple fields', async function (t) {
    t.plan(4)

    const fastify = await createFastify(t, {
      addContentTypeParser: true,
      adapter: BusboyAdapter,
      storage: Storage
    })

    const form = new FormData()
    form.append('foo', 'bar')
    form.append('foo', 'baz')
    form.append('foo', 'hello')
    form.append('file', new Blob(['hello', 'world']), 'hello_world.txt')

    const response = await request(fastify.listeningOrigin, form)
    t.equal(response.status, 200)

    const json = await response.json()

    t.same(json.body.foo, ['bar', 'baz', 'hello'])
    t.equal(json.body.file, 'hello_world.txt')
    t.same(json.files.file, { name: 'hello_world.txt', value: 'hello_world.txt' })
  })

  t.test('multiple files', async function (t) {
    t.plan(4)

    const fastify = await createFastify(t, {
      addContentTypeParser: true,
      adapter: BusboyAdapter,
      storage: Storage
    })

    const form = new FormData()
    form.append('foo', 'bar')
    form.append('file', new Blob(['hello', 'world']), 'hello_world1.txt')
    form.append('file', new Blob(['hello', 'world', 'hello', 'world']), 'hello_world2.txt')
    form.append('file', new Blob(['hello', 'world', 'hello', 'world', 'hello', 'world']), 'hello_world3.txt')

    const response = await request(fastify.listeningOrigin, form)
    t.equal(response.status, 200)

    const json = await response.json()

    t.equal(json.body.foo, 'bar')
    t.same(json.body.file, ['hello_world1.txt', 'hello_world2.txt', 'hello_world3.txt'])
    t.same(json.files.file, [
      { name: 'hello_world1.txt', value: 'hello_world1.txt' },
      { name: 'hello_world2.txt', value: 'hello_world2.txt' },
      { name: 'hello_world3.txt', value: 'hello_world3.txt' }
    ])
  })
})
