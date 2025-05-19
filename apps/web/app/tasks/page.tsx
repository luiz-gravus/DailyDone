"use client" // componente será executado no lado do cliente

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash } from "lucide-react"
import {
  useGetTasks,
  usePostTasks,
  useDeleteTasksId,
  usePatchTasksId,
} from "@/hooks"
import { useQueryClient } from "@tanstack/react-query"
/** Tipos do backend - Kubb gerou em apps/api/src/gen/types */
import type { 
  GetTasksQueryResponse, 
  PostTasksMutationRequest
  // Tasks as TaskType removido, será derivado de GetTasksQueryResponse
} from "../../../api/src/gen/types" // Caminho relativo corrigido

/* Derivações a partir da spec */
// GetTasksQueryResponse já é o array de tarefas.
type TaskType = GetTasksQueryResponse[number] // Tipo de uma tarefa individual

export default function TasksPage() {
  const [title,  setTitle]  = useState("")
  const [search, setSearch] = useState("")
  const queryClient = useQueryClient()
  /* Busca (tipada) com TanStack Query */
  // O hook useGetTasks retorna { data, isLoading, error, ... }, onde data é ResponseConfig<GetTasksQueryResponse>
  // E GetTasksQueryResponse é o array de tarefas.
  const { data: tasksResponse, isLoading, error } = useGetTasks(
    { title: search || undefined }, // Parâmetros da query
    { query: { queryKey: ["getTasks", search] } } // Opções do useQuery, incluindo queryKey dinâmico
  )
  
  // Extrai o array de tarefas de tasksResponse.data
  const tasks = tasksResponse?.data

  /* Hook para criar nova tarefa */
  const createTaskMutation = usePostTasks({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getTasks", search] })
        
        // A query getTasks será invalidada automaticamente pelo TanStack Query
        // devido à configuração padrão ou se QueryClient.invalidateQueries for chamado nos hooks.
      },
      onError: (err) => {
        console.error("Erro ao criar tarefa:", err)
      },
    },
  })

  /* Cria nova tarefa */
  const createTask = async () => {
    if (!title.trim()) return
    // PostTasksMutationRequest é o tipo do corpo da requisição
    createTaskMutation.mutate({ data: { title } as PostTasksMutationRequest })
  }

  /* Hook para excluir tarefa */
  const deleteTaskMutation = useDeleteTasksId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getTasks", search] })
      },
      onError: (err) => {
        console.error("Erro ao excluir tarefa:", err)
      },
    },
  })

  /* Exclui tarefa */
  const deleteTask = async (id: string) => {
    deleteTaskMutation.mutate({ id })
  }

  /* Hook para marcar como concluída */
  const markAsDoneMutation = usePatchTasksId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getTasks", search] })
      },
      onError: (err) => {
        console.error("Erro ao marcar tarefa como concluída:", err)
      },
    },
  })

  /* Marca como concluída */
  const markAsDone = async (id: string) => {
    // O corpo para PatchTasksId precisa ser { completed: true }
    markAsDoneMutation.mutate({ id, data: { completed: true } })
  }

  if (isLoading) return <p className="text-white p-6">Carregando tarefas...</p>
  if (error) return <p className="text-red-500 p-6">Erro ao carregar tarefas: {error.message}</p>

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6">
      {/* Botão flutuante */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="fixed bottom-10 right-10 w-16 h-16 rounded-full
                       bg-blue-600 text-white flex items-center justify-center
                       shadow-md hover:bg-blue-700 transition"
            aria-label="Adicionar tarefa"
          >
            <Plus size={32} />
          </button>
        </DialogTrigger>

        {/* Modal nova tarefa */}
        <DialogContent className="bg-zinc-900 border border-zinc-700 text-zinc-100">
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              placeholder="Título da tarefa"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="bg-zinc-800 text-zinc-100"
            />
            <Button
              onClick={createTask}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              disabled={createTaskMutation.isPending} // Desabilitar botão durante a mutação
            >
              {createTaskMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cabeçalho */}
      <header className="relative flex items-center justify-center mb-6 h-16">
        <h1 className="absolute left-10 text-xl font-bold text-zinc-100">
          DailyDone
        </h1>

        <div className="relative w-140">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <Input
            placeholder="Buscar tarefas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900 text-zinc-100 border border-zinc-700
                       placeholder:text-zinc-500 rounded-full"
          />
        </div>
      </header>

      {/* Lista de tarefas */}
      <section className="space-y-10">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task: TaskType) => ( // Usar TaskType aqui
            <Card
              key={task.id}
              className="mx-auto p-4 bg-zinc-900 border border-zinc-700
                         w-full max-w-3xl"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p
                    className={`text-zinc-100 text-lg font-bold ${
                      task.completed ? "text-zinc-500 line-through" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <span className="text-xs text-zinc-500">
                    {task.completed ? "Concluída" : "Pendente"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => deleteTask(task.id)}
                    className="px-4 py-1 text-sm bg-zinc-800 text-white
                               border border-zinc-600 hover:bg-zinc-700"
                    disabled={deleteTaskMutation.isPending && deleteTaskMutation.variables?.id === task.id} // Feedback visual para exclusão
                  >
                    {deleteTaskMutation.isPending && deleteTaskMutation.variables?.id === task.id ? (
                      <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash size={16} />
                    )}
                  </Button>

                  {!task.completed && (
                    <button
                      onClick={() => markAsDone(task.id)}
                      className={`w-8 h-8 rounded-full border-2 border-zinc-500
                                 hover:bg-zinc-700 transition flex items-center justify-center
                                 ${markAsDoneMutation.isPending && markAsDoneMutation.variables?.id === task.id ? "opacity-50 cursor-not-allowed" : ""}`}
                      aria-label="Marcar como concluída"
                      disabled={markAsDoneMutation.isPending && markAsDoneMutation.variables?.id === task.id}
                    >
                      {markAsDoneMutation.isPending && markAsDoneMutation.variables?.id === task.id && (
                        <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-zinc-400 text-center">Nenhuma tarefa encontrada.</p>
        )}
      </section>
    </main>
  )
}