// 📦 Importa o Fastify, CORS e as rotas
import Fastify from 'fastify'
import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { ZodTypeProvider, validatorCompiler, serializerCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod'
import dotenv from 'dotenv'
import tasksRoute from './routes/tasks/index.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: '.env.development' })

// ✅ Tipagem global com Zod
export type FastifyTypedInstance = FastifyInstance<
  // Tipos padrão do Fastify
  any, any, any, any,
  ZodTypeProvider
>

// ✅ Cria servidor com Type Provider
const app = Fastify({ 
  logger: true,
  ajv: {
    customOptions: {
      strictSchema: false, 
      coerceTypes: true,
    },
  },
}).withTypeProvider<ZodTypeProvider>()

// ✅ Configura validação com Zod
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

async function start() {
  try {
    // 🌍 Habilita CORS para conexão com o front
    await app.register(cors, {
      origin: true,
      methods: ['GET', 'POST', 'DELETE', 'PATCH']
    })

    // 📚 Documentação Swagger
    await app.register(swagger, {
      openapi: {
        info: {
          title: 'DailyDone API',
          description: 'API para gerenciamento de tarefas diárias',
          version: '1.0.0'
        },
        servers: [
          {
            url: 'http://localhost:3001',
            description: 'DailyDone API'
          }
        ],
        components: {
          securitySchemes: {}
        }
      },
      transform: jsonSchemaTransform
    })

    await app.register(swaggerUI, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false
      }
    })

    // 📦 Registra as rotas
    await app.register(tasksRoute)
    
    // 📄 Exporta o schema OpenAPI para um arquivo (ajuda no debug)
    app.ready(err => {
      if (err) throw err
      const swaggerJson = app.swagger()
      const swaggerYaml = yaml.dump(swaggerJson)
      fs.writeFileSync(path.join(__dirname, '..', 'swagger.yaml'), swaggerYaml)
      app.log.info('📄 Swagger YAML exportado para swagger.yaml')
    })

    // 🚀 Inicia o servidor
    const address = await app.listen({ port: 3001, host: '0.0.0.0' })
    app.log.info(`Server listening on ${address}`)
    app.log.info(`Docs: ${address}/docs`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
