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
      ai_cleanup_metrics: {
        Row: {
          created_at: string
          duration_ms: number
          entries_removed: number
          error_message: string | null
          id: string
          success: boolean
        }
        Insert: {
          created_at?: string
          duration_ms: number
          entries_removed: number
          error_message?: string | null
          id?: string
          success?: boolean
        }
        Update: {
          created_at?: string
          duration_ms?: number
          entries_removed?: number
          error_message?: string | null
          id?: string
          success?: boolean
        }
        Relationships: []
      }
      ai_content_cache: {
        Row: {
          cache_key: string
          content: string
          content_type: string
          created_at: string
          expires_at: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          cache_key: string
          content: string
          content_type: string
          created_at?: string
          expires_at: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          cache_key?: string
          content?: string
          content_type?: string
          created_at?: string
          expires_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_generation_metrics: {
        Row: {
          completion_tokens: number | null
          created_at: string
          error_message: string | null
          error_type: string | null
          feature_type: string
          id: string
          latency_ms: number
          model_used: string
          prompt_tokens: number | null
          success: boolean
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string
          error_message?: string | null
          error_type?: string | null
          feature_type: string
          id?: string
          latency_ms: number
          model_used: string
          prompt_tokens?: number | null
          success?: boolean
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string
          error_message?: string | null
          error_type?: string | null
          feature_type?: string
          id?: string
          latency_ms?: number
          model_used?: string
          prompt_tokens?: number | null
          success?: boolean
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_prompt_impressions: {
        Row: {
          id: string
          test_id: string
          timestamp: string
          user_id: string
          variant_id: string
        }
        Insert: {
          id?: string
          test_id: string
          timestamp?: string
          user_id: string
          variant_id: string
        }
        Update: {
          id?: string
          test_id?: string
          timestamp?: string
          user_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_impressions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "ai_prompt_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_prompt_impressions_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "ai_prompt_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompt_results: {
        Row: {
          error_type: string | null
          id: string
          latency_ms: number | null
          successful: boolean
          test_id: string
          timestamp: string
          token_usage: number | null
          user_id: string
          variant_id: string
        }
        Insert: {
          error_type?: string | null
          id?: string
          latency_ms?: number | null
          successful?: boolean
          test_id: string
          timestamp?: string
          token_usage?: number | null
          user_id: string
          variant_id: string
        }
        Update: {
          error_type?: string | null
          id?: string
          latency_ms?: number | null
          successful?: boolean
          test_id?: string
          timestamp?: string
          token_usage?: number | null
          user_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "ai_prompt_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_prompt_results_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "ai_prompt_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompt_tests: {
        Row: {
          confidence_threshold: number | null
          content_type: string
          created_at: string
          description: string | null
          id: string
          min_sample_size: number | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          confidence_threshold?: number | null
          content_type: string
          created_at?: string
          description?: string | null
          id?: string
          min_sample_size?: number | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          confidence_threshold?: number | null
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          min_sample_size?: number | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_prompt_variants: {
        Row: {
          id: string
          is_control: boolean
          name: string
          prompt_text: string
          system_prompt: string | null
          test_id: string
          weight: number
        }
        Insert: {
          id?: string
          is_control?: boolean
          name: string
          prompt_text: string
          system_prompt?: string | null
          test_id: string
          weight?: number
        }
        Update: {
          id?: string
          is_control?: boolean
          name?: string
          prompt_text?: string
          system_prompt?: string | null
          test_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_variants_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "ai_prompt_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_wireframes: {
        Row: {
          animations: Json | null
          created_at: string | null
          description: string | null
          design_reasoning: string | null
          design_tokens: Json | null
          feedback: string | null
          generation_params: Json | null
          id: string
          image_url: string | null
          mobile_layouts: Json | null
          project_id: string | null
          prompt: string
          quality_flags: Json | null
          rating: number | null
          status: string | null
          style_variants: Json | null
          updated_at: string | null
        }
        Insert: {
          animations?: Json | null
          created_at?: string | null
          description?: string | null
          design_reasoning?: string | null
          design_tokens?: Json | null
          feedback?: string | null
          generation_params?: Json | null
          id?: string
          image_url?: string | null
          mobile_layouts?: Json | null
          project_id?: string | null
          prompt: string
          quality_flags?: Json | null
          rating?: number | null
          status?: string | null
          style_variants?: Json | null
          updated_at?: string | null
        }
        Update: {
          animations?: Json | null
          created_at?: string | null
          description?: string | null
          design_reasoning?: string | null
          design_tokens?: Json | null
          feedback?: string | null
          generation_params?: Json | null
          id?: string
          image_url?: string | null
          mobile_layouts?: Json | null
          project_id?: string | null
          prompt?: string
          quality_flags?: Json | null
          rating?: number | null
          status?: string | null
          style_variants?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_wireframes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      animation_analytics: {
        Row: {
          animation_type: Database["public"]["Enums"]["animation_category"]
          average_duration: number | null
          browser_metrics: Json | null
          created_at: string
          device_type_metrics: Json | null
          engagement_score: number | null
          id: string
          interaction_count: number | null
          negative_feedback_count: number | null
          performance_metrics: Json | null
          positive_feedback_count: number | null
          updated_at: string
          view_count: number | null
        }
        Insert: {
          animation_type: Database["public"]["Enums"]["animation_category"]
          average_duration?: number | null
          browser_metrics?: Json | null
          created_at?: string
          device_type_metrics?: Json | null
          engagement_score?: number | null
          id?: string
          interaction_count?: number | null
          negative_feedback_count?: number | null
          performance_metrics?: Json | null
          positive_feedback_count?: number | null
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          animation_type?: Database["public"]["Enums"]["animation_category"]
          average_duration?: number | null
          browser_metrics?: Json | null
          created_at?: string
          device_type_metrics?: Json | null
          engagement_score?: number | null
          id?: string
          interaction_count?: number | null
          negative_feedback_count?: number | null
          performance_metrics?: Json | null
          positive_feedback_count?: number | null
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      animation_preferences: {
        Row: {
          accessibility_mode: boolean | null
          animation_type: Database["public"]["Enums"]["animation_category"]
          created_at: string
          device_specific_settings: Json | null
          enabled: boolean
          id: string
          intensity_preference: number | null
          reduced_motion_preference: boolean | null
          speed_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_mode?: boolean | null
          animation_type: Database["public"]["Enums"]["animation_category"]
          created_at?: string
          device_specific_settings?: Json | null
          enabled?: boolean
          id?: string
          intensity_preference?: number | null
          reduced_motion_preference?: boolean | null
          speed_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_mode?: boolean | null
          animation_type?: Database["public"]["Enums"]["animation_category"]
          created_at?: string
          device_specific_settings?: Json | null
          enabled?: boolean
          id?: string
          intensity_preference?: number | null
          reduced_motion_preference?: boolean | null
          speed_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      api_usage_metrics: {
        Row: {
          endpoint: string
          error_message: string | null
          id: string
          ip_address: string | null
          method: string
          request_payload: Json | null
          request_timestamp: string
          response_time_ms: number
          status_code: number
          user_id: string | null
        }
        Insert: {
          endpoint: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          method: string
          request_payload?: Json | null
          request_timestamp?: string
          response_time_ms: number
          status_code: number
          user_id?: string | null
        }
        Update: {
          endpoint?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          method?: string
          request_payload?: Json | null
          request_timestamp?: string
          response_time_ms?: number
          status_code?: number
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      client_access_links: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string
          designer_id: string
          expires_at: string
          id: string
          last_accessed_at: string | null
          personal_message: string | null
          project_id: string | null
          status: string
          token: string
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string
          designer_id: string
          expires_at: string
          id?: string
          last_accessed_at?: string | null
          personal_message?: string | null
          project_id?: string | null
          status?: string
          token: string
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string
          designer_id?: string
          expires_at?: string
          id?: string
          last_accessed_at?: string | null
          personal_message?: string | null
          project_id?: string | null
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_access_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_errors: {
        Row: {
          browser_info: string | null
          component_name: string | null
          error_message: string
          error_stack: string | null
          id: string
          resolution_notes: string | null
          resolved: boolean | null
          timestamp: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          browser_info?: string | null
          component_name?: string | null
          error_message: string
          error_stack?: string | null
          id?: string
          resolution_notes?: string | null
          resolved?: boolean | null
          timestamp?: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          browser_info?: string | null
          component_name?: string | null
          error_message?: string
          error_stack?: string | null
          id?: string
          resolution_notes?: string | null
          resolved?: boolean | null
          timestamp?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      client_link_deliveries: {
        Row: {
          created_at: string
          delivered_at: string | null
          delivery_type: string
          error_message: string | null
          id: string
          link_id: string
          recipient: string
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          delivery_type: string
          error_message?: string | null
          id?: string
          link_id: string
          recipient: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          delivery_type?: string
          error_message?: string | null
          id?: string
          link_id?: string
          recipient?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_link_deliveries_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "client_access_links"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notifications: {
        Row: {
          client_email: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          notification_type: string
          project_id: string
          sent_at: string | null
          status: string
        }
        Insert: {
          client_email: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          notification_type: string
          project_id: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          client_email?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          notification_type?: string
          project_id?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tasks: {
        Row: {
          client_response: Json | null
          completed_at: string | null
          created_at: string
          designer_notes: string | null
          id: string
          link_id: string
          status: string
          task_type: string
          updated_at: string
        }
        Insert: {
          client_response?: Json | null
          completed_at?: string | null
          created_at?: string
          designer_notes?: string | null
          id?: string
          link_id: string
          status?: string
          task_type: string
          updated_at?: string
        }
        Update: {
          client_response?: Json | null
          completed_at?: string | null
          created_at?: string
          designer_notes?: string | null
          id?: string
          link_id?: string
          status?: string
          task_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tasks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "client_access_links"
            referencedColumns: ["id"]
          },
        ]
      }
      design_analytics: {
        Row: {
          average_rank: number
          category: string
          design_option_id: string
          id: string
          selection_count: number
          title: string
          updated_at: string
        }
        Insert: {
          average_rank: number
          category: string
          design_option_id: string
          id?: string
          selection_count?: number
          title: string
          updated_at?: string
        }
        Update: {
          average_rank?: number
          category?: string
          design_option_id?: string
          id?: string
          selection_count?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      design_feedback: {
        Row: {
          context: Json | null
          created_at: string
          design_suggestion_id: string
          feedback_content: string | null
          feedback_type: string
          id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          design_suggestion_id: string
          feedback_content?: string | null
          feedback_type: string
          id?: string
          rating?: number | null
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          design_suggestion_id?: string
          feedback_content?: string | null
          feedback_type?: string
          id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      design_memory: {
        Row: {
          category: string
          color_scheme: Json | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          layout_pattern: Json | null
          relevance_score: number | null
          source_url: string | null
          subcategory: string | null
          tags: string[]
          title: string
          typography: Json | null
          visual_elements: Json
        }
        Insert: {
          category: string
          color_scheme?: Json | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          layout_pattern?: Json | null
          relevance_score?: number | null
          source_url?: string | null
          subcategory?: string | null
          tags: string[]
          title: string
          typography?: Json | null
          visual_elements: Json
        }
        Update: {
          category?: string
          color_scheme?: Json | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          layout_pattern?: Json | null
          relevance_score?: number | null
          source_url?: string | null
          subcategory?: string | null
          tags?: string[]
          title?: string
          typography?: Json | null
          visual_elements?: Json
        }
        Relationships: []
      }
      design_preferences: {
        Row: {
          category: string
          created_at: string
          design_option_id: string
          id: string
          notes: string | null
          rank: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          design_option_id: string
          id?: string
          notes?: string | null
          rank?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          design_option_id?: string
          id?: string
          notes?: string | null
          rank?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      design_suggestion_history: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          prompt: string
          rating: number | null
          result: Json
          used_references: string[] | null
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          prompt: string
          rating?: number | null
          result: Json
          used_references?: string[] | null
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          prompt?: string
          rating?: number | null
          result?: Json
          used_references?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      design_tokens: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          project_id: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          project_id: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          project_id?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      feedback_analysis: {
        Row: {
          action_items: Json
          category: string | null
          created_at: string
          id: string
          original_feedback: string
          priority: string | null
          project_id: string | null
          status: string
          summary: string
          tone_analysis: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_items: Json
          category?: string | null
          created_at?: string
          id?: string
          original_feedback: string
          priority?: string | null
          project_id?: string | null
          status?: string
          summary: string
          tone_analysis: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_items?: Json
          category?: string | null
          created_at?: string
          id?: string
          original_feedback?: string
          priority?: string | null
          project_id?: string | null
          status?: string
          summary?: string
          tone_analysis?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_analysis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_comments: {
        Row: {
          comment: string
          created_at: string | null
          feedback_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          feedback_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          feedback_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_comments_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      global_memories: {
        Row: {
          category: string
          content: string
          frequency: number
          id: string
          metadata: Json | null
          relevance_score: number
          timestamp: string
        }
        Insert: {
          category: string
          content: string
          frequency?: number
          id?: string
          metadata?: Json | null
          relevance_score?: number
          timestamp?: string
        }
        Update: {
          category?: string
          content?: string
          frequency?: number
          id?: string
          metadata?: Json | null
          relevance_score?: number
          timestamp?: string
        }
        Relationships: []
      }
      intake_forms: {
        Row: {
          created_at: string
          form_data: Json
          form_id: string
          id: string
          last_updated: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          form_data?: Json
          form_id: string
          id?: string
          last_updated?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          form_data?: Json
          form_id?: string
          id?: string
          last_updated?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      interaction_events: {
        Row: {
          device_type: string | null
          element_selector: string | null
          event_type: string
          id: string
          metadata: Json | null
          page_url: string
          scroll_depth: number | null
          session_id: string
          timestamp: string
          user_id: string
          viewport_height: number | null
          viewport_width: number | null
          x_position: number
          y_position: number
        }
        Insert: {
          device_type?: string | null
          element_selector?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          page_url: string
          scroll_depth?: number | null
          session_id: string
          timestamp?: string
          user_id: string
          viewport_height?: number | null
          viewport_width?: number | null
          x_position: number
          y_position: number
        }
        Update: {
          device_type?: string | null
          element_selector?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string
          scroll_depth?: number | null
          session_id?: string
          timestamp?: string
          user_id?: string
          viewport_height?: number | null
          viewport_width?: number | null
          x_position?: number
          y_position?: number
        }
        Relationships: []
      }
      memory_analysis_results: {
        Row: {
          analyzed_at: string
          category: string
          id: string
          insights: Json
          source_count: number
        }
        Insert: {
          analyzed_at?: string
          category: string
          id?: string
          insights: Json
          source_count: number
        }
        Update: {
          analyzed_at?: string
          category?: string
          id?: string
          insights?: Json
          source_count?: number
        }
        Relationships: []
      }
      memory_embeddings: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          id: string
          memory_id: string
          memory_type: string
          metadata: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          memory_id: string
          memory_type: string
          metadata?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          memory_id?: string
          memory_type?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      monitoring_configuration: {
        Row: {
          check_interval: number
          component: string
          created_at: string
          critical_threshold: number
          enabled: boolean
          id: string
          notification_enabled: boolean
          updated_at: string
          warning_threshold: number
        }
        Insert: {
          check_interval: number
          component: string
          created_at?: string
          critical_threshold: number
          enabled?: boolean
          id?: string
          notification_enabled?: boolean
          updated_at?: string
          warning_threshold: number
        }
        Update: {
          check_interval?: number
          component?: string
          created_at?: string
          critical_threshold?: number
          enabled?: boolean
          id?: string
          notification_enabled?: boolean
          updated_at?: string
          warning_threshold?: number
        }
        Relationships: []
      }
      pdf_styling_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_company_default: boolean | null
          name: string
          styling: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_company_default?: boolean | null
          name: string
          styling: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_company_default?: boolean | null
          name?: string
          styling?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          description: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          is_deleted: boolean
          project_id: string
          storage_path: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          description?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          is_deleted?: boolean
          project_id: string
          storage_path: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          description?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          is_deleted?: boolean
          project_id?: string
          storage_path?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_history: {
        Row: {
          changed_at: string
          id: string
          new_status: string
          notes: string | null
          previous_status: string | null
          project_id: string
          user_id: string
        }
        Insert: {
          changed_at?: string
          id?: string
          new_status: string
          notes?: string | null
          previous_status?: string | null
          project_id: string
          user_id: string
        }
        Update: {
          changed_at?: string
          id?: string
          new_status?: string
          notes?: string | null
          previous_status?: string | null
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_memories: {
        Row: {
          category: string
          content: string
          id: string
          metadata: Json | null
          project_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          id?: string
          metadata?: Json | null
          project_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          id?: string
          metadata?: Json | null
          project_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_email: string
          client_name: string
          created_at: string
          description: string | null
          id: string
          project_type: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_email: string
          client_name: string
          created_at?: string
          description?: string | null
          id?: string
          project_type: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_email?: string
          client_name?: string
          created_at?: string
          description?: string | null
          id?: string
          project_type?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limit_counters: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          ip_address: string | null
          key: string
          last_refill: string
          tokens: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: string | null
          key: string
          last_refill?: string
          tokens?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: string | null
          key?: string
          last_refill?: string
          tokens?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_alerts: {
        Row: {
          component: string
          created_at: string
          id: string
          is_resolved: boolean | null
          message: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
        }
        Insert: {
          component: string
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          message: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
        }
        Update: {
          component?: string
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          message?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
        }
        Relationships: []
      }
      system_health_checks: {
        Row: {
          component: string
          created_at: string
          details: Json | null
          id: string
          response_time_ms: number | null
          status: string
        }
        Insert: {
          component: string
          created_at?: string
          details?: Json | null
          id?: string
          response_time_ms?: number | null
          status: string
        }
        Update: {
          component?: string
          created_at?: string
          details?: Json | null
          id?: string
          response_time_ms?: number | null
          status?: string
        }
        Relationships: []
      }
      system_monitoring: {
        Row: {
          component: string
          created_at: string
          event_type: string
          id: string
          message: string | null
          metadata: Json | null
          status: string
          threshold: number | null
          value: number | null
        }
        Insert: {
          component: string
          created_at?: string
          event_type: string
          id?: string
          message?: string | null
          metadata?: Json | null
          status: string
          threshold?: number | null
          value?: number | null
        }
        Update: {
          component?: string
          created_at?: string
          event_type?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          status?: string
          threshold?: number | null
          value?: number | null
        }
        Relationships: []
      }
      template_purchases: {
        Row: {
          id: string
          price_paid: number
          purchase_date: string
          template_id: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          price_paid: number
          purchase_date?: string
          template_id: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          price_paid?: number
          purchase_date?: string
          template_id?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_purchases_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          preview_image_url: string | null
          price: number
          status: Database["public"]["Enums"]["template_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          preview_image_url?: string | null
          price: number
          status?: Database["public"]["Enums"]["template_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          preview_image_url?: string | null
          price?: number
          status?: Database["public"]["Enums"]["template_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_memories: {
        Row: {
          category: string
          content: string
          id: string
          metadata: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      wireframe_background_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          input_data: Json
          output_data: Json | null
          status: string
          task_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_data: Json
          output_data?: Json | null
          status?: string
          task_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_data?: Json
          output_data?: Json | null
          status?: string
          task_type?: string
        }
        Relationships: []
      }
      wireframe_cache: {
        Row: {
          created_at: string
          expires_at: string
          generation_params: Json | null
          hit_count: number
          id: string
          params_hash: string
          wireframe_data: Json
        }
        Insert: {
          created_at?: string
          expires_at: string
          generation_params?: Json | null
          hit_count?: number
          id?: string
          params_hash: string
          wireframe_data: Json
        }
        Update: {
          created_at?: string
          expires_at?: string
          generation_params?: Json | null
          hit_count?: number
          id?: string
          params_hash?: string
          wireframe_data?: Json
        }
        Relationships: []
      }
      wireframe_elements: {
        Row: {
          created_at: string | null
          element_data: Json
          element_type: string
          height: number | null
          id: string
          updated_at: string | null
          width: number | null
          wireframe_id: string | null
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          created_at?: string | null
          element_data: Json
          element_type: string
          height?: number | null
          id?: string
          updated_at?: string | null
          width?: number | null
          wireframe_id?: string | null
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          created_at?: string | null
          element_data?: Json
          element_type?: string
          height?: number | null
          id?: string
          updated_at?: string | null
          width?: number | null
          wireframe_id?: string | null
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_elements_wireframe_id_fkey"
            columns: ["wireframe_id"]
            isOneToOne: false
            referencedRelation: "ai_wireframes"
            referencedColumns: ["id"]
          },
        ]
      }
      wireframe_generation_metrics: {
        Row: {
          created_at: string | null
          generation_params: Json | null
          generation_time: number | null
          id: string
          project_id: string | null
          prompt: string
          result_data: Json | null
          success: boolean | null
        }
        Insert: {
          created_at?: string | null
          generation_params?: Json | null
          generation_time?: number | null
          id?: string
          project_id?: string | null
          prompt: string
          result_data?: Json | null
          success?: boolean | null
        }
        Update: {
          created_at?: string | null
          generation_params?: Json | null
          generation_time?: number | null
          id?: string
          project_id?: string | null
          prompt?: string
          result_data?: Json | null
          success?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_generation_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      wireframe_sections: {
        Row: {
          animation_suggestions: Json | null
          components: Json | null
          copy_suggestions: Json | null
          created_at: string | null
          description: string | null
          design_reasoning: string | null
          dynamic_elements: Json | null
          id: string
          layout_type: string
          mobile_layout: Json | null
          name: string
          position_order: number | null
          section_type: string
          style_variants: Json | null
          updated_at: string | null
          wireframe_id: string | null
        }
        Insert: {
          animation_suggestions?: Json | null
          components?: Json | null
          copy_suggestions?: Json | null
          created_at?: string | null
          description?: string | null
          design_reasoning?: string | null
          dynamic_elements?: Json | null
          id?: string
          layout_type: string
          mobile_layout?: Json | null
          name: string
          position_order?: number | null
          section_type: string
          style_variants?: Json | null
          updated_at?: string | null
          wireframe_id?: string | null
        }
        Update: {
          animation_suggestions?: Json | null
          components?: Json | null
          copy_suggestions?: Json | null
          created_at?: string | null
          description?: string | null
          design_reasoning?: string | null
          dynamic_elements?: Json | null
          id?: string
          layout_type?: string
          mobile_layout?: Json | null
          name?: string
          position_order?: number | null
          section_type?: string
          style_variants?: Json | null
          updated_at?: string | null
          wireframe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_sections_wireframe_id_fkey"
            columns: ["wireframe_id"]
            isOneToOne: false
            referencedRelation: "ai_wireframes"
            referencedColumns: ["id"]
          },
        ]
      }
      wireframe_system_events: {
        Row: {
          created_at: string
          details: Json
          event_type: string
          id: string
          severity: string
        }
        Insert: {
          created_at?: string
          details?: Json
          event_type: string
          id?: string
          severity?: string
        }
        Update: {
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          severity?: string
        }
        Relationships: []
      }
      wireframe_templates: {
        Row: {
          category: string | null
          complexity: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          preview_url: string | null
          prompt_template: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          complexity?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          preview_url?: string | null
          prompt_template: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          complexity?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          preview_url?: string | null
          prompt_template?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wireframe_versions: {
        Row: {
          branch_name: string | null
          change_description: string | null
          created_at: string | null
          created_by: string | null
          data: Json
          id: string
          is_current: boolean | null
          parent_version_id: string | null
          version_number: number
          wireframe_id: string
        }
        Insert: {
          branch_name?: string | null
          change_description?: string | null
          created_at?: string | null
          created_by?: string | null
          data: Json
          id?: string
          is_current?: boolean | null
          parent_version_id?: string | null
          version_number: number
          wireframe_id: string
        }
        Update: {
          branch_name?: string | null
          change_description?: string | null
          created_at?: string | null
          created_by?: string | null
          data?: Json
          id?: string
          is_current?: boolean | null
          parent_version_id?: string | null
          version_number?: number
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_versions_wireframe_id_fkey"
            columns: ["wireframe_id"]
            isOneToOne: false
            referencedRelation: "ai_wireframes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      memory_system_stats: {
        Row: {
          avg_clusters_per_memory: number | null
          memory_count: number | null
          memory_type: string | null
          newest_memory: string | null
          oldest_memory: string | null
        }
        Relationships: []
      }
      system_health_status: {
        Row: {
          avg_response_time_1h: number | null
          component: string | null
          issues_last_24h: number | null
          last_checked: string | null
          latest_status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      analyze_profile_queries: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      analyze_wireframe_sections: {
        Args: {
          p_start_date: string
        }
        Returns: Json
      }
      batch_insert_interaction_events: {
        Args: {
          p_events: Json
        }
        Returns: undefined
      }
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      check_database_performance: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      check_wireframe_cache: {
        Args: {
          p_params_hash: string
        }
        Returns: Json
      }
      check_wireframe_rate_limits: {
        Args: {
          p_user_id: string
          p_max_daily: number
          p_max_hourly: number
        }
        Returns: Json
      }
      clear_expired_wireframe_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      compare_wireframe_versions: {
        Args: {
          p_version_id1: string
          p_version_id2: string
        }
        Returns: Json
      }
      create_background_task: {
        Args: {
          p_task_type: string
          p_input_data: Json
        }
        Returns: string
      }
      create_system_alert: {
        Args: {
          p_severity: string
          p_message: string
          p_component: string
          p_details?: Json
        }
        Returns: string
      }
      create_wireframe_version: {
        Args: {
          p_wireframe_id: string
          p_version_number: number
          p_data: Json
          p_change_description: string
          p_created_by: string
          p_is_current: boolean
          p_parent_version_id: string
          p_branch_name: string
        }
        Returns: {
          branch_name: string | null
          change_description: string | null
          created_at: string | null
          created_by: string | null
          data: Json
          id: string
          is_current: boolean | null
          parent_version_id: string | null
          version_number: number
          wireframe_id: string
        }
      }
      get_interaction_events: {
        Args: {
          p_user_id: string
          p_event_type?: string
          p_page_url?: string
          p_limit?: number
        }
        Returns: {
          device_type: string | null
          element_selector: string | null
          event_type: string
          id: string
          metadata: Json | null
          page_url: string
          scroll_depth: number | null
          session_id: string
          timestamp: string
          user_id: string
          viewport_height: number | null
          viewport_width: number | null
          x_position: number
          y_position: number
        }[]
      }
      get_latest_version_number: {
        Args: {
          p_wireframe_id: string
          p_branch_name: string
        }
        Returns: number
      }
      get_next_pending_task: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_wireframe_branches: {
        Args: {
          p_wireframe_id: string
        }
        Returns: {
          name: string
          created_at: string
          version_count: number
          latest_version_id: string
        }[]
      }
      get_wireframe_metrics: {
        Args: {
          p_start_date: string
          p_project_id?: string
        }
        Returns: Json
      }
      get_wireframe_version: {
        Args: {
          p_version_id: string
        }
        Returns: {
          branch_name: string | null
          change_description: string | null
          created_at: string | null
          created_by: string | null
          data: Json
          id: string
          is_current: boolean | null
          parent_version_id: string | null
          version_number: number
          wireframe_id: string
        }
      }
      get_wireframe_versions: {
        Args: {
          p_wireframe_id: string
        }
        Returns: {
          branch_name: string | null
          change_description: string | null
          created_at: string | null
          created_by: string | null
          data: Json
          id: string
          is_current: boolean | null
          parent_version_id: string | null
          version_number: number
          wireframe_id: string
        }[]
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      increment_cache_hit: {
        Args: {
          p_cache_id: string
        }
        Returns: undefined
      }
      insert_interaction_event: {
        Args: {
          p_user_id: string
          p_event_type: string
          p_page_url: string
          p_x_position: number
          p_y_position: number
          p_element_selector: string
          p_session_id: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_subscribed: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      query_interaction_events: {
        Args: {
          query_text: string
        }
        Returns: {
          device_type: string | null
          element_selector: string | null
          event_type: string
          id: string
          metadata: Json | null
          page_url: string
          scroll_depth: number | null
          session_id: string
          timestamp: string
          user_id: string
          viewport_height: number | null
          viewport_width: number | null
          x_position: number
          y_position: number
        }[]
      }
      record_animation_interaction: {
        Args: {
          p_animation_type: Database["public"]["Enums"]["animation_category"]
          p_duration?: number
          p_device_info?: Json
          p_performance_metrics?: Json
          p_feedback?: string
        }
        Returns: undefined
      }
      record_audit_log: {
        Args: {
          p_user_id: string
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_metadata?: Json
          p_ip_address?: string
        }
        Returns: string
      }
      record_client_error: {
        Args: {
          p_error_message: string
          p_error_stack: string
          p_component_name: string
          p_user_id: string
          p_browser_info: string
          p_url: string
        }
        Returns: string
      }
      record_client_link_delivery: {
        Args: {
          p_link_id: string
          p_delivery_type: string
          p_recipient: string
          p_status?: string
        }
        Returns: string
      }
      record_health_check: {
        Args: {
          p_component: string
          p_status: string
          p_response_time_ms?: number
          p_details?: Json
        }
        Returns: string
      }
      record_system_event: {
        Args: {
          p_event_type: string
          p_details: Json
          p_severity?: string
        }
        Returns: undefined
      }
      record_template_purchase: {
        Args: {
          p_user_id: string
          p_template_id: string
          p_price_paid: number
          p_transaction_id: string
        }
        Returns: undefined
      }
      record_wireframe_generation:
        | {
            Args: {
              p_project_id: string
              p_prompt: string
              p_generation_params: Json
              p_result_data: Json
              p_success: boolean
              p_generation_time: number
            }
            Returns: string
          }
        | {
            Args: {
              p_user_id: string
            }
            Returns: undefined
          }
      search_memory_embeddings:
        | {
            Args: {
              query_embedding: string
              match_threshold?: number
              match_count?: number
              filter_memory_type?: string
            }
            Returns: {
              id: string
              memory_id: string
              memory_type: string
              content: string
              similarity: number
              created_at: string
              metadata: Json
            }[]
          }
        | {
            Args: {
              query_text: string
              match_threshold?: number
              match_count?: number
              filter_memory_type?: string
            }
            Returns: {
              id: string
              memory_id: string
              memory_type: string
              content: string
              similarity: number
              created_at: string
              metadata: Json
            }[]
          }
      set_versions_inactive: {
        Args: {
          p_wireframe_id: string
          p_branch_name: string
        }
        Returns: undefined
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      store_memory_embedding: {
        Args: {
          p_memory_id: string
          p_memory_type: string
          p_content: string
          p_embedding?: string
          p_metadata?: Json
        }
        Returns: string
      }
      store_wireframe_in_cache: {
        Args: {
          p_params_hash: string
          p_wireframe_data: Json
          p_expires_at: string
          p_generation_params: Json
        }
        Returns: undefined
      }
      track_interaction: {
        Args: {
          p_user_id: string
          p_event_type: string
          p_page_url: string
          p_x_position: number
          p_y_position: number
          p_element_selector?: string
          p_session_id?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      update_background_task_status: {
        Args: {
          p_task_id: string
          p_status: string
          p_output_data?: Json
          p_error_message?: string
        }
        Returns: undefined
      }
      update_wireframe_data: {
        Args: {
          p_wireframe_id: string
          p_data: Json
        }
        Returns: {
          animations: Json | null
          created_at: string | null
          description: string | null
          design_reasoning: string | null
          design_tokens: Json | null
          feedback: string | null
          generation_params: Json | null
          id: string
          image_url: string | null
          mobile_layouts: Json | null
          project_id: string | null
          prompt: string
          quality_flags: Json | null
          rating: number | null
          status: string | null
          style_variants: Json | null
          updated_at: string | null
        }
      }
      update_wireframe_with_version: {
        Args: {
          p_wireframe_id: string
          p_version_id: string
          p_wireframe_data: Json
        }
        Returns: undefined
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      animation_category:
        | "morphing_shape"
        | "progressive_disclosure"
        | "intent_based_motion"
        | "glassmorphism"
        | "hover_effect"
        | "modal_dialog"
        | "custom_cursor"
        | "scroll_animation"
        | "drag_interaction"
        | "magnetic_element"
        | "color_shift"
        | "parallax_tilt"
      subscription_status:
        | "free"
        | "basic"
        | "pro"
        | "sync"
        | "sync-pro"
        | "trial"
      template_status: "active" | "archived" | "draft"
      user_role:
        | "free"
        | "pro"
        | "sync"
        | "sync-pro"
        | "trial"
        | "template-buyer"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
