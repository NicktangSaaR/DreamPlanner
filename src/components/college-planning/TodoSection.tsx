import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTodos } from "@/hooks/useTodos";
import TodoForm from "./todos/TodoForm";
import BulkImportForm from "./todos/BulkImportForm";
import TodoItem from "./todos/TodoItem";
import { useCallback } from "react";

export default function TodoSection() {
  const {
    todos,
    createTodo,
    toggleTodoStatus,
    toggleStarred,
    updateTodo,
    deleteTodo,
  } = useTodos();

  const handleCreateTodo = useCallback(async (title: string) => {
    await createTodo.mutateAsync(title);
  }, [createTodo]);

  const handleBulkImport = useCallback(async (titles: string[]) => {
    for (const title of titles) {
      if (title.trim()) {
        await createTodo.mutateAsync(title.trim());
      }
    }
  }, [createTodo]);

  const handleToggleStatus = useCallback(async (id: string, completed: boolean) => {
    await toggleTodoStatus.mutateAsync({ id, completed });
  }, [toggleTodoStatus]);

  const handleToggleStarred = useCallback(async (id: string, starred: boolean) => {
    await toggleStarred.mutateAsync({ id, starred });
  }, [toggleStarred]);

  const handleUpdateTodo = useCallback(async (id: string, title: string) => {
    await updateTodo.mutateAsync({ id, title });
  }, [updateTodo]);

  const handleDeleteTodo = useCallback(async (id: string) => {
    await deleteTodo.mutateAsync(id);
  }, [deleteTodo]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>To-Do List</CardTitle>
      </CardHeader>
      <CardContent>
        <TodoForm onSubmit={handleCreateTodo} />
        <BulkImportForm onImport={handleBulkImport} />
        <div className="h-[300px] w-full rounded-md border">
          <ScrollArea className="h-full w-full p-4">
            <div className="space-y-2">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleStatus={handleToggleStatus}
                  onToggleStarred={handleToggleStarred}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}