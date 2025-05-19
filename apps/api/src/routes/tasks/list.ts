import { FastifyTypedInstance } from '../../index.js'
import { listTasksSchema } from './types.js'        // seu schema base (query, response etc.)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function listTasks(app: FastifyTypedInstance) {
  app.get(
    '/tasks',
    {
      schema: listTasksSchema,
    },
    async (request) => {
      const { title } = request.query as { title?: string }

      const tasks = await prisma.task.findMany({
        where: title
          ? { title: { contains: title, mode: 'insensitive' } }
          : undefined,
        orderBy: { createdAt: 'asc' },
      })

      // 🔄 Converte as datas para string (ISO)
      return tasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      }))
    },
  )
}