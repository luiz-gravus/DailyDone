import { listTasks } from './list.js'
import { createTask } from './create.js'
import { updateTask } from './update.js'
import { deleteTask } from './delelete.js'
import {
    FastifyInstance,
    FastifyBaseLogger,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault
  } from 'fastify'
  
  import { ZodTypeProvider } from 'fastify-type-provider-zod'
  
  export type FastifyTypedInstance = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
  >

export async function registerTaskRoutes(app: FastifyTypedInstance) {
    await listTasks(app)
    await createTask(app)
    await updateTask(app)
    await deleteTask(app)
}

export default async function tasksRoutes(app: FastifyTypedInstance) {
    await registerTaskRoutes(app)
}
