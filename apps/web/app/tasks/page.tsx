"use client" //Componnete será executado  no lado do cliente

// Importa hooks do React e componentes da interface
import { useEffect, useState } from "react"
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

// Define o formato de uma tarefa
interface Task {
  id: string
  title: string
  completed: boolean
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]) // Armazena todas as tarefas
  const [title, setTitle] = useState("")         // Armazena o título digitado
  const [search, setSearch] = useState("")       // Armazena o texto de busca

  // Quando a página carrega, busca as tarefas da API
  useEffect(() => {
    fetch("http://127.0.0.1:3001/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])

  // Cria uma nova tarefa
  const createTask = async () => {
    if (!title.trim()) return // impede tarefa vazia

    const res = await fetch("http://127.0.0.1:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }), // envia o título
    })

    const newTask = await res.json()
    setTasks(prev => [...prev, newTask]) // adiciona nova tarefa no estado
    setTitle("") // limpa o campo de input
  }

  // Exclui uma tarefa
  const deleteTask = async (id: string) => {
    const res = await fetch(`http://127.0.0.1:3001/tasks/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      // remove a tarefa da lista atual
      setTasks(prev => prev.filter(task => task.id !== id))
    }
  }

  // Marca a tarefa como concluída
  const markAsDone = async (id: string) => {
    const res = await fetch(`http://127.0.0.1:3001/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    })

    const updated = await res.json()

    // atualiza o status da tarefa no estado
    setTasks(prev =>
      prev.map(task => (task.id === updated.id ? updated : task))
    )
  }

  // Filtra as tarefas com base no texto digitado na busca
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6">

      {/* Botão flutuante que abre o modal */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition"
            aria-label="Adicionar tarefa"
          >
            <Plus size={32} />
          </button>
        </DialogTrigger>

        {/* Modal com input e botão Salvar */}
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
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cabeçalho com título e barra de busca */}
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
            className="pl-10 bg-zinc-900 text-zinc-100 border border-zinc-700 placeholder:text-zinc-500 rounded-full"
          />
        </div>
      </header>

      {/* Lista de tarefas filtradas pela busca */}
      <section className="space-y-10">
        {filteredTasks.map(task => (
          <Card
            key={task.id}
            className="relative left-10 p-4 bg-zinc-900 border border-zinc-700 w-140"
          >
            <div className="flex justify-between items-center">
              {/* Exibe o título e o status */}
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

              {/* Botões de ação: excluir e concluir */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => deleteTask(task.id)}
                  className="px-4 py-1 text-sm bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"
                >
                  EXCLUIR
                </Button>

                {!task.completed && (
                  <button
                    onClick={() => markAsDone(task.id)}
                    className="w-8 h-8 rounded-full border-2 border-zinc-500 hover:bg-zinc-700 transition"
                    aria-label="Marcar como concluída"
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
      </section>
    </main>
  )
}