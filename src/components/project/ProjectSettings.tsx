
import React, { useState } from 'react';
import { Project } from '@/types/project';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useProjectOperations } from '@/hooks/useProjectOperations';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Project title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  genre: z.string().optional(),
  visibility: z.enum(['public', 'private', 'connections_only']).default('private'),
  deadline: z.date().optional(),
  bpm: z.number().optional(),
  key: z.string().optional(),
  daw: z.string().optional(),
  version_approval_enabled: z.boolean().default(false),
})

interface ProjectSettingsProps {
  project: Project;
  onUpdate?: (updates: any) => void;
}

const ProjectSettings = ({ project, onUpdate }: ProjectSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateProject } = useProjectOperations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project.title,
      description: project.description || "",
      genre: project.genre || "",
      visibility: project.visibility,
      deadline: project.deadline ? new Date(project.deadline) : undefined,
      bpm: project.bpm || undefined,
      key: project.key || undefined,
      daw: project.daw || undefined,
      version_approval_enabled: project.version_approval_enabled || false,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const updates = {
        title: data.title,
        description: data.description,
        genre: data.genre,
        visibility: data.visibility,
        deadline: data.deadline ? data.deadline.toISOString() : undefined,
        bpm: data.bpm || undefined,
        key: data.key || undefined,
        daw: data.daw || undefined,
        version_approval_enabled: data.version_approval_enabled,
      };

      await updateProject(project.id, updates);
      onUpdate?.(updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Settings</h2>
        <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancel" : "Edit"}</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input disabled={!isEditing} placeholder="Enter project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea disabled={!isEditing} placeholder="Enter project description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input disabled={!isEditing} placeholder="Enter project genre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <Select disabled={!isEditing} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="connections_only">Connections Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Deadline</FormLabel>
                <DatePicker
                  disabled={!isEditing}
                  onSelect={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select deadline"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bpm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BPM</FormLabel>
                <FormControl>
                  <Input
                    disabled={!isEditing}
                    type="number"
                    placeholder="Enter BPM"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Input disabled={!isEditing} placeholder="Enter key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="daw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DAW</FormLabel>
                <FormControl>
                  <Input disabled={!isEditing} placeholder="Enter DAW" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="version_approval_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Enable Version Approval</FormLabel>
                </div>
                <FormControl>
                  <Switch disabled={!isEditing} checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {isEditing && (
            <Button type="submit">Update Project</Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ProjectSettings;
