export default async function (fastify, options) {
  fastify.get('/users', async (request, reply) => {
    return { users: [ 'ana', 'joao', 'maria' ] }
  })
  fastify.post('/users', async (request, reply) => {
    const { name } = request.body
    return { message: `User ${name} created` }
  })
}
