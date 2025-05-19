import { FastifyTypedInstance } from '../../index.js'
import { updateTaskSchema } from './types.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function updateTask(app: FastifyTypedInstance) {
  app.patch(
    '/tasks/:id',
    {
      schema: updateTaskSchema,
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const data = request.body as { title?: string; completed?: boolean }

      try {
        const updated = await prisma.task.update({
          where: { id },
          data
        })

        return reply.send({
          id: updated.id,
          title: updated.title,
          completed: updated.completed,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString()
        })
      } catch (error) {
        return reply.status(404).send({ error: 'Tarefa não encontrada' })
      }
    }
  )
}