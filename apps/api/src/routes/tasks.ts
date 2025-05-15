// Importa a função uuidv4 para gerar IDs únicos
import { v4 as uuidv4 } from 'uuid'

// Define o formato de uma tarefa
interface Task {
  id: string
  title: string
  completed: boolean
}

// Cria um array em memória para armazenar as tarefas
const tasks: Task[] = []

// Função que registra as rotas no Fastify
export default async function (fastify, options) {

  //Essa rota retorna todas as tarefas
  fastify.get('/tasks', async () => {
    return tasks
  })

  //Essa rota cria uma nova tarefa
  fastify.post('/tasks', async (request, reply) => {
    const { title } = request.body

    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false
    }

    tasks.push(newTask)
    return newTask
  })

  //Essa rota busca uma tarefa pelo ID
  fastify.get('/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const task = tasks.find(t => t.id === id)

    if (!task) {
      reply.code(404)
      return { error: 'Tarefa não encontrada' }
    }

    return task
  })

  //Essa rota remove uma tarefa
  fastify.delete('/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const index = tasks.findIndex(t => t.id === id)

    if (index === -1) {
      reply.code(404)
      return { error: 'Tarefa não encontrada' }
    }

    tasks.splice(index, 1)
    return { message: 'Tarefa deletada com sucesso' }
  })

  //Essa rota atualiza título e/ou status da tarefa
  fastify.patch('/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { title, completed } = request.body as Partial<Task>

    //🔎 Procura a tarefa pelo ID
    const task = tasks.find(t => t.id === id)

    //Se não encontrar a tarefa, retorna erro 404
    if (!task) {
        reply.code(404) // Retorna o status HTTP 404 (não encontrada)
        return { error: 'Tarefa não encontrada' } // Retorna mensagem de erro
    }

    //Se o título foi enviado, atualiza
    if (title !== undefined) task.title = title

    //Se o status foi enviado, atualiza
    if (completed !== undefined) task.completed = completed

    return task
  })
}