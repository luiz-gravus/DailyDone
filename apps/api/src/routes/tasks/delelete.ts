import { FastifyTypedInstance } from '../../index.js'
import { deleteTaskSchema } from './types.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function deleteTask(app: FastifyTypedInstance) {
  app.delete(
    '/tasks/:id',
    {
      schema: deleteTaskSchema
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }

      try {
        await prisma.task.delete({
          where: { id }
        })
        
        return reply.status(204).send()
      } catch {
        return reply.status(404).send({ error: 'Tarefa não encontrada' })
      }
    }
  )
}