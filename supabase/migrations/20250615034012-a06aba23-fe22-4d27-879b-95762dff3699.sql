
-- Enable Row Level Security on project_todos
ALTER TABLE project_todos ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT only todos from projects they have access to
CREATE POLICY "Users can view todos for projects they can access"
  ON project_todos
  FOR SELECT
  USING (
    public.user_can_access_project(project_id, auth.uid())
  );

-- Allow users to INSERT todos only for projects they have access to, and records their user id
CREATE POLICY "Users can insert todos for projects they can access"
  ON project_todos
  FOR INSERT
  WITH CHECK (
    public.user_can_access_project(project_id, auth.uid())
    AND created_by = auth.uid()
  );

-- Allow users to UPDATE todos for projects they can access and which they created
CREATE POLICY "Users can update their own todos for projects they can access"
  ON project_todos
  FOR UPDATE
  USING (
    public.user_can_access_project(project_id, auth.uid())
    AND created_by = auth.uid()
  )
  WITH CHECK (
    public.user_can_access_project(project_id, auth.uid())
    AND created_by = auth.uid()
  );

-- Allow users to DELETE todos for projects they can access and which they created
CREATE POLICY "Users can delete their own todos for projects they can access"
  ON project_todos
  FOR DELETE
  USING (
    public.user_can_access_project(project_id, auth.uid())
    AND created_by = auth.uid()
  );
