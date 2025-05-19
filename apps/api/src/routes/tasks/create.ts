import { FastifyTypedInstance } from '../../index.js'
import { createTaskSchema } from './types.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createTask(app: FastifyTypedInstance) {
app.post(
    '/tasks',
    {
      schema: createTaskSchema
    },
    async (request, reply) => {
      const { title } = request.body
  
      const task = await prisma.task.create({
        data: { title }
      })
  
      return reply.status(201).send({
        id: task.id,
        title: task.title,
        completed: task.completed,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      })
    }
  )
}