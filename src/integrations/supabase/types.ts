export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      connection_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          created_at: string
          id: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_invites: {
        Row: {
          event_id: string
          id: string
          invited_at: string | null
          invited_by: string
          invited_user: string
          responded_at: string | null
          status: Database["public"]["Enums"]["collaboration_status"] | null
        }
        Insert: {
          event_id: string
          id?: string
          invited_at?: string | null
          invited_by: string
          invited_user: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["collaboration_status"] | null
        }
        Update: {
          event_id?: string
          id?: string
          invited_at?: string | null
          invited_by?: string
          invited_user?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["collaboration_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "event_invites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_invites_invited_user_fkey"
            columns: ["invited_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_time: string
          id: string
          location: string | null
          name: string
          project_id: string | null
          start_time: string
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          name: string
          project_id?: string | null
          start_time: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          name?: string
          project_id?: string | null
          start_time?: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      message_limits: {
        Row: {
          created_at: string
          id: string
          message_count: number
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_count?: number
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message_count?: number
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_limits_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_limits_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_group: boolean | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_group?: boolean | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_group?: boolean | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          event_invite_id: string | null
          file_urls: string[] | null
          id: string
          project_id: string | null
          read_at: string | null
          recipient_id: string | null
          sender_id: string
          thread_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          event_invite_id?: string | null
          file_urls?: string[] | null
          id?: string
          project_id?: string | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id: string
          thread_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          event_invite_id?: string | null
          file_urls?: string[] | null
          id?: string
          project_id?: string | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_messages_event_invite"
            columns: ["event_invite_id"]
            isOneToOne: false
            referencedRelation: "event_invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          payload: Json | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          payload?: Json | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          payload?: Json | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          experience: string | null
          full_name: string | null
          genres: string[] | null
          id: string
          location: string | null
          name: string | null
          portfolio_urls: string[] | null
          profile_picture_url: string | null
          profile_setup_completed: boolean | null
          role: string | null
          skills: string[] | null
          total_plays: number
          updated_at: string | null
          username: string | null
          visibility: Database["public"]["Enums"]["visibility_type"] | null
          zip_code: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          experience?: string | null
          full_name?: string | null
          genres?: string[] | null
          id: string
          location?: string | null
          name?: string | null
          portfolio_urls?: string[] | null
          profile_picture_url?: string | null
          profile_setup_completed?: boolean | null
          role?: string | null
          skills?: string[] | null
          total_plays?: number
          updated_at?: string | null
          username?: string | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
          zip_code?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          experience?: string | null
          full_name?: string | null
          genres?: string[] | null
          id?: string
          location?: string | null
          name?: string | null
          portfolio_urls?: string[] | null
          profile_picture_url?: string | null
          profile_setup_completed?: boolean | null
          role?: string | null
          skills?: string[] | null
          total_plays?: number
          updated_at?: string | null
          username?: string | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
          zip_code?: string | null
        }
        Relationships: []
      }
      project_collaborators: {
        Row: {
          id: string
          invited_at: string | null
          joined_at: string | null
          project_id: string
          role: string | null
          role_name: string | null
          status: Database["public"]["Enums"]["collaboration_status"] | null
          user_id: string
        }
        Insert: {
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          project_id: string
          role?: string | null
          role_name?: string | null
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          user_id: string
        }
        Update: {
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          project_id?: string
          role?: string | null
          role_name?: string | null
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_collaborators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_collaborators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_editors: {
        Row: {
          accepted_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          project_id: string
          status: Database["public"]["Enums"]["collaboration_status"] | null
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          project_id: string
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          project_id?: string
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_editors_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_editors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_editors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_file_deletions: {
        Row: {
          deleted_at: string
          deleted_by: string
          file_id: string
          id: string
          project_id: string
        }
        Insert: {
          deleted_at?: string
          deleted_by: string
          file_id: string
          id?: string
          project_id: string
        }
        Update: {
          deleted_at?: string
          deleted_by?: string
          file_id?: string
          id?: string
          project_id?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_current_version: boolean | null
          is_pending_approval: boolean | null
          parent_file_id: string | null
          project_id: string
          uploaded_by: string
          version: number | null
          version_notes: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_current_version?: boolean | null
          is_pending_approval?: boolean | null
          parent_file_id?: string | null
          project_id: string
          uploaded_by: string
          version?: number | null
          version_notes?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_current_version?: boolean | null
          is_pending_approval?: boolean | null
          parent_file_id?: string | null
          project_id?: string
          uploaded_by?: string
          version?: number | null
          version_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_parent_file_id_fkey"
            columns: ["parent_file_id"]
            isOneToOne: false
            referencedRelation: "project_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_folders: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_looking_for: {
        Row: {
          created_at: string
          id: string
          payout: number | null
          project_id: string
          role: string
        }
        Insert: {
          created_at?: string
          id?: string
          payout?: number | null
          project_id: string
          role: string
        }
        Update: {
          created_at?: string
          id?: string
          payout?: number | null
          project_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_looking_for_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_todos: {
        Row: {
          completed: boolean
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          project_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          project_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          project_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_todos_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_todos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_todos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string | null
          current_phase_index: number | null
          deadline: string | null
          description: string | null
          folder_id: string | null
          genre: string | null
          id: string
          mood: string | null
          name: string | null
          owner_id: string
          phases: Json | null
          status: Database["public"]["Enums"]["project_status"] | null
          title: string | null
          updated_at: string | null
          version_approval_enabled: boolean | null
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          current_phase_index?: number | null
          deadline?: string | null
          description?: string | null
          folder_id?: string | null
          genre?: string | null
          id?: string
          mood?: string | null
          name?: string | null
          owner_id: string
          phases?: Json | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string | null
          updated_at?: string | null
          version_approval_enabled?: boolean | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          current_phase_index?: number | null
          deadline?: string | null
          description?: string | null
          folder_id?: string | null
          genre?: string | null
          id?: string
          mood?: string | null
          name?: string | null
          owner_id?: string
          phases?: Json | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string | null
          updated_at?: string | null
          version_approval_enabled?: boolean | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "project_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_attendees: {
        Row: {
          id: string
          session_id: string
          status: Database["public"]["Enums"]["collaboration_status"] | null
          user_id: string
        }
        Insert: {
          id?: string
          session_id: string
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          user_id: string
        }
        Update: {
          id?: string
          session_id?: string
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_attendees_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_time: string
          id: string
          location: string | null
          project_id: string | null
          start_time: string
          title: string
          type: Database["public"]["Enums"]["session_type"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          project_id?: string | null
          start_time: string
          title: string
          type?: Database["public"]["Enums"]["session_type"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          project_id?: string | null
          start_time?: string
          title?: string
          type?: Database["public"]["Enums"]["session_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          created_at: string | null
          duration: number | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          play_count: number
          project_id: string | null
          title: string
          user_id: string
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          play_count?: number
          project_id?: string | null
          title: string
          user_id: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          play_count?: number
          project_id?: string | null
          title?: string
          user_id?: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "songs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "songs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_participants: {
        Row: {
          id: string
          joined_at: string | null
          left_at: string | null
          thread_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          left_at?: string | null
          thread_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          left_at?: string | null
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_participants_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_links: {
        Row: {
          created_at: string | null
          id: string
          label: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      are_mutual_followers: {
        Args: { user1_id: string; user2_id: string }
        Returns: boolean
      }
      can_message_user: {
        Args: { sender_id: string; receiver_id: string }
        Returns: boolean
      }
      increment_play_count: {
        Args: { track_id: string }
        Returns: undefined
      }
      increment_user_plays: {
        Args: { user_id: string }
        Returns: undefined
      }
      user_can_access_project: {
        Args: { project_id: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      availability_period: "morning" | "afternoon" | "evening" | "custom"
      availability_status: "available" | "busy" | "partially_available"
      collaboration_status: "pending" | "accepted" | "declined" | "completed"
      notification_type:
        | "message"
        | "follow"
        | "project_invite"
        | "event_invite"
        | "collaboration_request"
      project_status: "active" | "completed" | "paused" | "cancelled"
      session_type:
        | "recording"
        | "meeting"
        | "rehearsal"
        | "mixing"
        | "mastering"
        | "writing"
        | "other"
      user_role:
        | "vocalist"
        | "producer"
        | "instrumentalist"
        | "songwriter"
        | "composer"
        | "engineer"
        | "other"
      visibility_type: "public" | "private" | "unlisted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      availability_period: ["morning", "afternoon", "evening", "custom"],
      availability_status: ["available", "busy", "partially_available"],
      collaboration_status: ["pending", "accepted", "declined", "completed"],
      notification_type: [
        "message",
        "follow",
        "project_invite",
        "event_invite",
        "collaboration_request",
      ],
      project_status: ["active", "completed", "paused", "cancelled"],
      session_type: [
        "recording",
        "meeting",
        "rehearsal",
        "mixing",
        "mastering",
        "writing",
        "other",
      ],
      user_role: [
        "vocalist",
        "producer",
        "instrumentalist",
        "songwriter",
        "composer",
        "engineer",
        "other",
      ],
      visibility_type: ["public", "private", "unlisted"],
    },
  },
} as const
