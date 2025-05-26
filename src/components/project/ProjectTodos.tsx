
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectTodosProps {
  projectId: string;
}

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_by: string;
  created_at: string;
  completed_at?: string;
  completed_by?: string;
  creator: {
    name: string;
    username: string;
  };
}

const ProjectTodos = ({ projectId }: ProjectTodosProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, [projectId]);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('project_todos')
        .select(`
          *,
          creator:created_by!inner (
            name,
            username
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        title: "Error",
        description: "Failed to load todos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    setIsAddingTodo(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_todos')
        .insert([{
          project_id: projectId,
          title: newTodoTitle,
          description: newTodoDescription || null,
          created_by: user.id
        }])
        .select(`
          *,
          creator:created_by!inner (
            name,
            username
          )
        `)
        .single();

      if (error) throw error;

      setTodos(prev => [data, ...prev]);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    } finally {
      setIsAddingTodo(false);
    }
  };

  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updates: any = {
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        completed_by: completed ? user.id : null
      };

      const { error } = await supabase
        .from('project_todos')
        .update(updates)
        .eq('id', todoId);

      if (error) throw error;

      setTodos(prev => prev.map(todo => 
        todo.id === todoId 
          ? { ...todo, ...updates }
          : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      const { error } = await supabase
        .from('project_todos')
        .delete()
        .eq('id', todoId);

      if (error) throw error;

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const incompleteTodos = todos.filter(todo => !todo.completed);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>To-Do List ({incompleteTodos.length} remaining)</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Todo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Todo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="todo-title">Title</Label>
                  <Input
                    id="todo-title"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="Enter todo title"
                  />
                </div>
                <div>
                  <Label htmlFor="todo-description">Description (optional)</Label>
                  <Textarea
                    id="todo-description"
                    value={newTodoDescription}
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                    placeholder="Enter todo description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddTodo}
                    disabled={isAddingTodo || !newTodoTitle.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isAddingTodo ? 'Adding...' : 'Add Todo'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No todos yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Incomplete Todos */}
              {incompleteTodos.map((todo) => (
                <div key={todo.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) => handleToggleTodo(todo.id, !!checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">{todo.title}</h4>
                    {todo.description && (
                      <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Created by {todo.creator?.name} on {new Date(todo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Completed Todos */}
              {completedTodos.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Completed ({completedTodos.length})
                  </h3>
                  {completedTodos.map((todo) => (
                    <div key={todo.id} className="flex items-start space-x-3 p-3 border rounded-lg opacity-60">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={(checked) => handleToggleTodo(todo.id, !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 line-through">{todo.title}</h4>
                        {todo.description && (
                          <p className="text-sm text-gray-600 mt-1 line-through">{todo.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Completed on {todo.completed_at ? new Date(todo.completed_at).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTodos;
