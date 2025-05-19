import { z } from 'zod'

// Esquema comum para tarefas
const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.string().describe('ISO Date'),
  updatedAt: z.string().describe('ISO Date')
})

// 🔍 GET /tasks
export const listTasksSchema = {
  description: 'Lista todas as tarefas ou filtra por título',
  tags: ['tasks'],
  querystring: z.object({
    title: z.string().min(1).optional()
      .describe('Filtro opcional por título')
  }),
  response: {
    200: z.array(taskSchema)
      .describe('Lista de tarefas')
  }
}

// ➕ POST /tasks
export const createTaskSchema = {
  description: 'Cria uma nova tarefa',
  tags: ['tasks'],
  body: z.object({
    title: z.string().min(1)
      .describe('Título da tarefa')
  }),
  response: {
    201: taskSchema
      .describe('Tarefa criada')
  }
}

// ✏️ PATCH /tasks/:id
export const updateTaskSchema = {
  description: 'Atualiza uma tarefa existente',
  tags: ['tasks'],
  params: z.object({
    id: z.string().uuid()
      .describe('ID da tarefa')
  }),
  body: z.object({
    title: z.string().optional()
      .describe('Novo título (opcional)'),
    completed: z.boolean().optional()
      .describe('Status de conclusão (opcional)')
  }),
  response: {
    200: taskSchema
      .describe('Tarefa atualizada'),
    404: z.object({
      error: z.string()
        .describe('Mensagem de erro')
    })
  }
}

// ❌ DELETE /tasks/:id
export const deleteTaskSchema = {
  description: 'Remove uma tarefa',
  tags: ['tasks'],
  params: z.object({
    id: z.string().uuid()
      .describe('ID da tarefa')
  }),
  response: {
    204: z.null().describe('Tarefa removida com sucesso'),
    404: z.object({
      error: z.string()
        .describe('Mensagem de erro')
    })
  }
}