import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  completed_at?: string;
  created_by: string;
  completed_by?: string;
  creator: {
    name: string;
    username: string;
  };
}
interface ProjectTodosProps {
  projectId: string;
}
const ProjectTodos = ({
  projectId
}: ProjectTodosProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: ''
  });
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchTodos();
  }, [projectId]);
  const fetchTodos = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('project_todos').select(`
          *,
          creator:profiles!project_todos_created_by_fkey (
            name,
            username
          )
        `).eq('project_id', projectId).order('created_at', {
        ascending: false
      });
      if (error) throw error;

      // Filter out any todos where creator query failed
      const validTodos = (data || []).filter(todo => todo.creator && typeof todo.creator === 'object' && 'name' in todo.creator) as Todo[];
      setTodos(validTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        title: "Error",
        description: "Failed to load todos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) return;
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const {
        data,
        error
      } = await supabase.from('project_todos').insert([{
        project_id: projectId,
        title: newTodo.title,
        description: newTodo.description || null,
        created_by: user.id
      }]).select(`
          *,
          creator:profiles!project_todos_created_by_fkey (
            name,
            username
          )
        `).single();
      if (error) throw error;

      // Only add if creator data is valid
      if (data.creator && typeof data.creator === 'object' && 'name' in data.creator) {
        setTodos(prev => [data as Todo, ...prev]);
      }
      setNewTodo({
        title: '',
        description: ''
      });
      setIsDialogOpen(false);
      toast({
        title: "Todo added",
        description: "New todo has been added to the project."
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive"
      });
    }
  };
  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const updateData = {
        completed: !completed,
        completed_at: !completed ? new Date().toISOString() : null,
        completed_by: !completed ? user.id : null,
        updated_at: new Date().toISOString()
      };
      const {
        error
      } = await supabase.from('project_todos').update(updateData).eq('id', todoId);
      if (error) throw error;
      setTodos(prev => prev.map(todo => todo.id === todoId ? {
        ...todo,
        ...updateData
      } : todo));
      toast({
        title: completed ? "Todo marked as incomplete" : "Todo completed",
        description: completed ? "Todo has been marked as incomplete." : "Todo has been marked as complete."
      });
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive"
      });
    }
  };
  const handleDeleteTodo = async (todoId: string) => {
    try {
      const {
        error
      } = await supabase.from('project_todos').delete().eq('id', todoId);
      if (error) throw error;
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
      toast({
        title: "Todo deleted",
        description: "Todo has been removed from the project."
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive"
      });
    }
  };
  const completedTodos = todos.filter(todo => todo.completed);
  const incompleteTodos = todos.filter(todo => !todo.completed);
  if (loading) {
    return <div className="flex flex-col h-full min-h-0">
        <Card className="flex-1 min-h-0">
          <CardContent className="p-8 h-full">
            <div className="animate-pulse space-y-4 h-full">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="flex flex-col h-full min-h-0">
      {/* Add Todo */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between ">
          {/* Left: title + counts */}
          <div className="flex flex-col gap-1">
            <CardTitle className="mb-0">To-Do List</CardTitle>
            <div className="text-sm text-gray-600">
              {incompleteTodos.length} pending • {completedTodos.length} completed
            </div>
          </div>
          {/* Right: Add Todo button */}
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
                  <Input id="todo-title" value={newTodo.title} onChange={e => setNewTodo(prev => ({
                  ...prev,
                  title: e.target.value
                }))} placeholder="Enter todo title..." />
                </div>
                <div>
                  <Label htmlFor="todo-description">Description (optional)</Label>
                  <Textarea id="todo-description" value={newTodo.description} onChange={e => setNewTodo(prev => ({
                  ...prev,
                  description: e.target.value
                }))} placeholder="Enter todo description..." rows={3} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTodo} className="bg-purple-600 hover:bg-purple-700">
                    Add Todo
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent />
      </Card>

      {/* Scrollable todo list area */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-6 mt-4">
        {/* Incomplete Todos */}
        {incompleteTodos.length > 0 && <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                Pending ({incompleteTodos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incompleteTodos.map(todo => <div key={todo.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start space-x-3 flex-1">
                      <button onClick={() => handleToggleTodo(todo.id, todo.completed)} className="mt-1 w-5 h-5 border-2 border-gray-300 rounded-full hover:border-purple-600 transition-colors" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{todo.title}</h4>
                        {todo.description && <p className="text-sm text-gray-600 mt-1">{todo.description}</p>}
                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                          <span>Created by {todo.creator.name}</span>
                          <span>•</span>
                          <span>{new Date(todo.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTodo(todo.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>)}
              </div>
            </CardContent>
          </Card>}

        {/* Completed Todos */}
        {completedTodos.length > 0 && <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Completed ({completedTodos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedTodos.map(todo => <div key={todo.id} className="flex items-start justify-between p-4 border rounded-lg bg-green-50 hover:bg-green-100">
                    <div className="flex items-start space-x-3 flex-1">
                      <button onClick={() => handleToggleTodo(todo.id, todo.completed)} className="mt-1 w-5 h-5 bg-green-600 border-2 border-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                        <Check className="w-3 h-3 text-white" />
                      </button>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 line-through">{todo.title}</h4>
                        {todo.description && <p className="text-sm text-gray-600 mt-1 line-through">{todo.description}</p>}
                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                          <span>Created by {todo.creator.name}</span>
                          <span>•</span>
                          <span>Completed {new Date(todo.completed_at || '').toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTodo(todo.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>)}
              </div>
            </CardContent>
          </Card>}

        {/* Empty State */}
        {todos.length === 0 && <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No todos yet</p>
              <p className="text-sm text-gray-400">Add your first todo to get started</p>
            </CardContent>
          </Card>}
      </div>
    </div>;
};
export default ProjectTodos;