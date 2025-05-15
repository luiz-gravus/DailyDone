// 📦 Importa o Fastify, CORS e as rotas
import Fastify from 'fastify'
import cors from '@fastify/cors'
import FirstRoute from './routes/our-first-route.js'
import UsersRoute from './routes/users.js'
import tasksRoute from './routes/tasks.js'

// 🚀 Cria o servidor com Fastify e ativa os logs
const fastify = Fastify({ logger: true })

// 🔁 Função principal que inicia o servidor
async function start() {
  try {
    // 🔓 Habilita CORS para permitir acesso do front-end (localhost:3000)
    await fastify.register(cors, {
      origin: true,
      methods: ['GET', 'POST', 'DELETE', 'PATCH']
    })

    // 🔗 Registra as rotas da aplicação
    fastify.register(FirstRoute)
    fastify.register(UsersRoute)
    fastify.register(tasksRoute)

    // 📡 Sobe o servidor na porta 3001, acessível em rede local
    const address = await fastify.listen({ port: 3001, host: '0.0.0.0' })

    // ✅ Log de sucesso no terminal
    fastify.log.info(`Server listening on ${address}`)
  } catch (err) {
    // ❌ Se houver erro, mostra no terminal e encerra o processo
    fastify.log.error(err)
    process.exit(1)
  }
}

// 🟢 Executa a função de inicialização
start()
