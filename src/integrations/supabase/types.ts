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
      accessibility_guidelines: {
        Row: {
          aria_attributes: Json | null
          color_contrast_requirements: Json | null
          component_type: string
          created_at: string | null
          focus_management: Json | null
          id: string
          keyboard_interactions: Json | null
          reference_url: string | null
          screen_reader_requirements: Json | null
          updated_at: string | null
          wcag_criteria: Json | null
        }
        Insert: {
          aria_attributes?: Json | null
          color_contrast_requirements?: Json | null
          component_type: string
          created_at?: string | null
          focus_management?: Json | null
          id?: string
          keyboard_interactions?: Json | null
          reference_url?: string | null
          screen_reader_requirements?: Json | null
          updated_at?: string | null
          wcag_criteria?: Json | null
        }
        Update: {
          aria_attributes?: Json | null
          color_contrast_requirements?: Json | null
          component_type?: string
          created_at?: string | null
          focus_management?: Json | null
          id?: string
          keyboard_interactions?: Json | null
          reference_url?: string | null
          screen_reader_requirements?: Json | null
          updated_at?: string | null
          wcag_criteria?: Json | null
        }
        Relationships: []
      }
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
      animation_presets: {
        Row: {
          animation_type: string
          created_at: string | null
          duration: number | null
          easing: string | null
          id: string
          is_system_preset: boolean | null
          keyframes: Json
          name: string
          user_id: string | null
        }
        Insert: {
          animation_type: string
          created_at?: string | null
          duration?: number | null
          easing?: string | null
          id?: string
          is_system_preset?: boolean | null
          keyframes: Json
          name: string
          user_id?: string | null
        }
        Update: {
          animation_type?: string
          created_at?: string | null
          duration?: number | null
          easing?: string | null
          id?: string
          is_system_preset?: boolean | null
          keyframes?: Json
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      api_endpoints: {
        Row: {
          authentication_type: string | null
          created_at: string | null
          description: string | null
          headers: Json | null
          id: string
          method: string
          name: string
          query_params: Json | null
          request_body_schema: Json | null
          response_schema: Json | null
          updated_at: string | null
          url: string
          wireframe_id: string
        }
        Insert: {
          authentication_type?: string | null
          created_at?: string | null
          description?: string | null
          headers?: Json | null
          id?: string
          method: string
          name: string
          query_params?: Json | null
          request_body_schema?: Json | null
          response_schema?: Json | null
          updated_at?: string | null
          url: string
          wireframe_id: string
        }
        Update: {
          authentication_type?: string | null
          created_at?: string | null
          description?: string | null
          headers?: Json | null
          id?: string
          method?: string
          name?: string
          query_params?: Json | null
          request_body_schema?: Json | null
          response_schema?: Json | null
          updated_at?: string | null
          url?: string
          wireframe_id?: string
        }
        Relationships: []
      }
      api_state_models: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          initial_state: Json | null
          name: string
          state_schema: Json | null
          updated_at: string | null
          wireframe_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          initial_state?: Json | null
          name: string
          state_schema?: Json | null
          updated_at?: string | null
          wireframe_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          initial_state?: Json | null
          name?: string
          state_schema?: Json | null
          updated_at?: string | null
          wireframe_id?: string
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
      api_wireframe_mappings: {
        Row: {
          created_at: string | null
          data_mapping: Json | null
          element_id: string
          endpoint_id: string
          id: string
          mapping_type: string
          state_effects: Json | null
          trigger_events: Json | null
          updated_at: string | null
          wireframe_id: string
        }
        Insert: {
          created_at?: string | null
          data_mapping?: Json | null
          element_id: string
          endpoint_id: string
          id?: string
          mapping_type: string
          state_effects?: Json | null
          trigger_events?: Json | null
          updated_at?: string | null
          wireframe_id: string
        }
        Update: {
          created_at?: string | null
          data_mapping?: Json | null
          element_id?: string
          endpoint_id?: string
          id?: string
          mapping_type?: string
          state_effects?: Json | null
          trigger_events?: Json | null
          updated_at?: string | null
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_wireframe_mappings_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "api_endpoints"
            referencedColumns: ["id"]
          },
        ]
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
      code_generation_templates: {
        Row: {
          created_at: string
          description: string | null
          framework: string
          id: string
          is_active: boolean
          language: string
          name: string
          template_code: string
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          framework: string
          id?: string
          is_active?: boolean
          language: string
          name: string
          template_code: string
          updated_at?: string
          version?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          framework?: string
          id?: string
          is_active?: boolean
          language?: string
          name?: string
          template_code?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      collaborative_documents: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      color_schemes: {
        Row: {
          accessibility_rating: number | null
          created_at: string | null
          id: string
          is_system_scheme: boolean | null
          name: string
          palette: Json
          user_id: string | null
        }
        Insert: {
          accessibility_rating?: number | null
          created_at?: string | null
          id?: string
          is_system_scheme?: boolean | null
          name: string
          palette: Json
          user_id?: string | null
        }
        Update: {
          accessibility_rating?: number | null
          created_at?: string | null
          id?: string
          is_system_scheme?: boolean | null
          name?: string
          palette?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      competitive_elements: {
        Row: {
          competitor_id: string
          created_at: string
          element_type: string
          id: string
          notes: string | null
          screenshot_url: string | null
          strengths: string | null
          updated_at: string
          weaknesses: string | null
        }
        Insert: {
          competitor_id: string
          created_at?: string
          element_type: string
          id?: string
          notes?: string | null
          screenshot_url?: string | null
          strengths?: string | null
          updated_at?: string
          weaknesses?: string | null
        }
        Update: {
          competitor_id?: string
          created_at?: string
          element_type?: string
          id?: string
          notes?: string | null
          screenshot_url?: string | null
          strengths?: string | null
          updated_at?: string
          weaknesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitive_elements_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string | null
          name: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          name: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          name?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      component_adaptations: {
        Row: {
          adaptation_rules: Json
          component_type: string
          created_at: string
          device_context_id: string | null
          id: string
          priority: number | null
          updated_at: string
        }
        Insert: {
          adaptation_rules: Json
          component_type: string
          created_at?: string
          device_context_id?: string | null
          id?: string
          priority?: number | null
          updated_at?: string
        }
        Update: {
          adaptation_rules?: Json
          component_type?: string
          created_at?: string
          device_context_id?: string | null
          id?: string
          priority?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "component_adaptations_device_context_id_fkey"
            columns: ["device_context_id"]
            isOneToOne: false
            referencedRelation: "device_contexts"
            referencedColumns: ["id"]
          },
        ]
      }
      component_fields: {
        Row: {
          component_type_id: string
          created_at: string
          default_value: string | null
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
          validation: Json | null
        }
        Insert: {
          component_type_id: string
          created_at?: string
          default_value?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
          validation?: Json | null
        }
        Update: {
          component_type_id?: string
          created_at?: string
          default_value?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
          validation?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "component_fields_component_type_id_fkey"
            columns: ["component_type_id"]
            isOneToOne: false
            referencedRelation: "component_types"
            referencedColumns: ["id"]
          },
        ]
      }
      component_library_mappings: {
        Row: {
          created_at: string | null
          id: string
          library_component_name: string
          notes: string | null
          property_mappings: Json | null
          updated_at: string | null
          wireframe_component_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          library_component_name: string
          notes?: string | null
          property_mappings?: Json | null
          updated_at?: string | null
          wireframe_component_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          library_component_name?: string
          notes?: string | null
          property_mappings?: Json | null
          updated_at?: string | null
          wireframe_component_id?: string
        }
        Relationships: []
      }
      component_recommendations: {
        Row: {
          component_type: string
          context: string
          created_at: string
          id: string
          metadata: Json | null
          reasoning: string | null
          recommendation_strength: number | null
        }
        Insert: {
          component_type: string
          context: string
          created_at?: string
          id?: string
          metadata?: Json | null
          reasoning?: string | null
          recommendation_strength?: number | null
        }
        Update: {
          component_type?: string
          context?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          reasoning?: string | null
          recommendation_strength?: number | null
        }
        Relationships: []
      }
      component_specifications: {
        Row: {
          created_at: string | null
          id: string
          name: string
          properties: Json | null
          states: Json | null
          updated_at: string | null
          variations: Json | null
          wireframe_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          properties?: Json | null
          states?: Json | null
          updated_at?: string | null
          variations?: Json | null
          wireframe_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          properties?: Json | null
          states?: Json | null
          updated_at?: string | null
          variations?: Json | null
          wireframe_id?: string
        }
        Relationships: []
      }
      component_styles: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          properties: Json
          style_token: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          properties: Json
          style_token: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          properties?: Json
          style_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      component_types: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      component_usage_patterns: {
        Row: {
          component_type: string
          confidence_score: number | null
          context_name: string
          created_at: string
          id: string
          last_used: string | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          component_type: string
          confidence_score?: number | null
          context_name: string
          created_at?: string
          id?: string
          last_used?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          component_type?: string
          confidence_score?: number | null
          context_name?: string
          created_at?: string
          id?: string
          last_used?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      component_variants: {
        Row: {
          component_type_id: string
          created_at: string
          default_data: Json
          description: string | null
          id: string
          name: string
          thumbnail_url: string | null
          updated_at: string
          variant_token: string
        }
        Insert: {
          component_type_id: string
          created_at?: string
          default_data: Json
          description?: string | null
          id?: string
          name: string
          thumbnail_url?: string | null
          updated_at?: string
          variant_token: string
        }
        Update: {
          component_type_id?: string
          created_at?: string
          default_data?: Json
          description?: string | null
          id?: string
          name?: string
          thumbnail_url?: string | null
          updated_at?: string
          variant_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "component_variants_component_type_id_fkey"
            columns: ["component_type_id"]
            isOneToOne: false
            referencedRelation: "component_types"
            referencedColumns: ["id"]
          },
        ]
      }
      content_hierarchy: {
        Row: {
          created_at: string
          depth: number | null
          id: string
          metadata: Json | null
          node_type: Database["public"]["Enums"]["content_node_type"]
          parent_id: string | null
          path: string | null
          position_order: number | null
          priority: number | null
          project_id: string
          title: string
          updated_at: string
          wireframe_id: string | null
        }
        Insert: {
          created_at?: string
          depth?: number | null
          id?: string
          metadata?: Json | null
          node_type: Database["public"]["Enums"]["content_node_type"]
          parent_id?: string | null
          path?: string | null
          position_order?: number | null
          priority?: number | null
          project_id: string
          title: string
          updated_at?: string
          wireframe_id?: string | null
        }
        Update: {
          created_at?: string
          depth?: number | null
          id?: string
          metadata?: Json | null
          node_type?: Database["public"]["Enums"]["content_node_type"]
          parent_id?: string | null
          path?: string | null
          position_order?: number | null
          priority?: number | null
          project_id?: string
          title?: string
          updated_at?: string
          wireframe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_hierarchy_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_hierarchy"
            referencedColumns: ["id"]
          },
        ]
      }
      content_relationships: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          relationship_type: string
          source_id: string
          strength: number | null
          target_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          relationship_type: string
          source_id: string
          strength?: number | null
          target_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          relationship_type?: string
          source_id?: string
          strength?: number | null
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_relationships_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "content_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_relationships_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "content_hierarchy"
            referencedColumns: ["id"]
          },
        ]
      }
      content_sections: {
        Row: {
          content: string
          content_id: string | null
          created_at: string | null
          id: string
          name: string
          position_order: number | null
          section_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          content_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          position_order?: number | null
          section_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          content_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          position_order?: number | null
          section_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_sections_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "generated_content"
            referencedColumns: ["id"]
          },
        ]
      }
      content_strategy: {
        Row: {
          content_type: string
          created_at: string
          creator_id: string
          description: string | null
          guidelines: string | null
          id: string
          metadata: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          content_type: string
          created_at?: string
          creator_id: string
          description?: string | null
          guidelines?: string | null
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          creator_id?: string
          description?: string | null
          guidelines?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_wireframe_mappings: {
        Row: {
          content_id: string
          created_at: string
          element_id: string
          id: string
          notes: string | null
          updated_at: string
          validation_status: string | null
          wireframe_id: string
        }
        Insert: {
          content_id: string
          created_at?: string
          element_id: string
          id?: string
          notes?: string | null
          updated_at?: string
          validation_status?: string | null
          wireframe_id: string
        }
        Update: {
          content_id?: string
          created_at?: string
          element_id?: string
          id?: string
          notes?: string | null
          updated_at?: string
          validation_status?: string | null
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_wireframe_mappings_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_strategy"
            referencedColumns: ["id"]
          },
        ]
      }
      cultural_contexts: {
        Row: {
          color_preferences: Json | null
          created_at: string
          id: string
          language: string | null
          layout_preferences: Json | null
          name: string
          reading_direction: string | null
          region: string
          typography_adjustments: Json | null
          updated_at: string
        }
        Insert: {
          color_preferences?: Json | null
          created_at?: string
          id?: string
          language?: string | null
          layout_preferences?: Json | null
          name: string
          reading_direction?: string | null
          region: string
          typography_adjustments?: Json | null
          updated_at?: string
        }
        Update: {
          color_preferences?: Json | null
          created_at?: string
          id?: string
          language?: string | null
          layout_preferences?: Json | null
          name?: string
          reading_direction?: string | null
          region?: string
          typography_adjustments?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      cultural_design_adaptations: {
        Row: {
          adaptation_rules: Json
          component_type: string | null
          created_at: string
          cultural_context_id: string | null
          id: string
          notes: string | null
          updated_at: string
          wireframe_element_type: string | null
        }
        Insert: {
          adaptation_rules: Json
          component_type?: string | null
          created_at?: string
          cultural_context_id?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          wireframe_element_type?: string | null
        }
        Update: {
          adaptation_rules?: Json
          component_type?: string | null
          created_at?: string
          cultural_context_id?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          wireframe_element_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cultural_design_adaptations_cultural_context_id_fkey"
            columns: ["cultural_context_id"]
            isOneToOne: false
            referencedRelation: "cultural_contexts"
            referencedColumns: ["id"]
          },
        ]
      }
      data_source_mappings: {
        Row: {
          created_at: string | null
          data_source_id: string | null
          element_id: string
          field_mappings: Json
          id: string
          is_active: boolean | null
          transformation_rules: Json | null
          updated_at: string | null
          wireframe_id: string
        }
        Insert: {
          created_at?: string | null
          data_source_id?: string | null
          element_id: string
          field_mappings: Json
          id?: string
          is_active?: boolean | null
          transformation_rules?: Json | null
          updated_at?: string | null
          wireframe_id: string
        }
        Update: {
          created_at?: string | null
          data_source_id?: string | null
          element_id?: string
          field_mappings?: Json
          id?: string
          is_active?: boolean | null
          transformation_rules?: Json | null
          updated_at?: string | null
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_source_mappings_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      data_source_states: {
        Row: {
          created_at: string | null
          data_source_id: string | null
          id: string
          is_default: boolean | null
          state_data: Json
          state_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_source_id?: string | null
          id?: string
          is_default?: boolean | null
          state_data: Json
          state_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_source_id?: string | null
          id?: string
          is_default?: boolean | null
          state_data?: Json
          state_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_source_states_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      data_sources: {
        Row: {
          connection_details: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          project_id: string
          schema_definition: Json | null
          source_type: string
          updated_at: string | null
        }
        Insert: {
          connection_details: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          project_id: string
          schema_definition?: Json | null
          source_type: string
          updated_at?: string | null
        }
        Update: {
          connection_details?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          project_id?: string
          schema_definition?: Json | null
          source_type?: string
          updated_at?: string | null
        }
        Relationships: []
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
      design_asset_usage: {
        Row: {
          asset_id: string | null
          created_at: string | null
          element_id: string | null
          id: string
          usage_context: string | null
          wireframe_id: string | null
        }
        Insert: {
          asset_id?: string | null
          created_at?: string | null
          element_id?: string | null
          id?: string
          usage_context?: string | null
          wireframe_id?: string | null
        }
        Update: {
          asset_id?: string | null
          created_at?: string | null
          element_id?: string | null
          id?: string
          usage_context?: string | null
          wireframe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "design_asset_usage_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "design_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      design_asset_versions: {
        Row: {
          asset_id: string | null
          change_notes: string | null
          created_at: string | null
          created_by: string | null
          file_path: string
          file_size: number
          id: string
          version: string
        }
        Insert: {
          asset_id?: string | null
          change_notes?: string | null
          created_at?: string | null
          created_by?: string | null
          file_path: string
          file_size: number
          id?: string
          version: string
        }
        Update: {
          asset_id?: string | null
          change_notes?: string | null
          created_at?: string | null
          created_by?: string | null
          file_path?: string
          file_size?: number
          id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_asset_versions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "design_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      design_assets: {
        Row: {
          asset_type: string
          created_at: string | null
          dimensions: Json | null
          file_path: string
          file_size: number
          format: string
          id: string
          metadata: Json | null
          name: string
          project_id: string
          tags: string[] | null
          updated_at: string | null
          version: string
        }
        Insert: {
          asset_type: string
          created_at?: string | null
          dimensions?: Json | null
          file_path: string
          file_size: number
          format: string
          id?: string
          metadata?: Json | null
          name: string
          project_id: string
          tags?: string[] | null
          updated_at?: string | null
          version?: string
        }
        Update: {
          asset_type?: string
          created_at?: string | null
          dimensions?: Json | null
          file_path?: string
          file_size?: number
          format?: string
          id?: string
          metadata?: Json | null
          name?: string
          project_id?: string
          tags?: string[] | null
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      design_change_hooks: {
        Row: {
          created_at: string
          event_types: string[]
          hook_type: string
          id: string
          is_active: boolean
          project_id: string
          secret_token: string | null
          updated_at: string
          webhook_url: string
        }
        Insert: {
          created_at?: string
          event_types: string[]
          hook_type: string
          id?: string
          is_active?: boolean
          project_id: string
          secret_token?: string | null
          updated_at?: string
          webhook_url: string
        }
        Update: {
          created_at?: string
          event_types?: string[]
          hook_type?: string
          id?: string
          is_active?: boolean
          project_id?: string
          secret_token?: string | null
          updated_at?: string
          webhook_url?: string
        }
        Relationships: []
      }
      design_decisions: {
        Row: {
          created_at: string
          created_by: string
          description: string
          element_links: Json | null
          id: string
          impact: string
          rationale: string
          ref_links: Json | null
          title: string
          tradeoffs: Json | null
          updated_at: string
          wireframe_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          element_links?: Json | null
          id?: string
          impact: string
          rationale: string
          ref_links?: Json | null
          title: string
          tradeoffs?: Json | null
          updated_at?: string
          wireframe_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          element_links?: Json | null
          id?: string
          impact?: string
          rationale?: string
          ref_links?: Json | null
          title?: string
          tradeoffs?: Json | null
          updated_at?: string
          wireframe_id?: string
        }
        Relationships: []
      }
      design_deployments: {
        Row: {
          deployed_at: string
          deployed_by: string | null
          deployment_logs: string | null
          deployment_url: string | null
          design_version_id: string
          environment: string
          id: string
          status: string
        }
        Insert: {
          deployed_at?: string
          deployed_by?: string | null
          deployment_logs?: string | null
          deployment_url?: string | null
          design_version_id: string
          environment: string
          id?: string
          status?: string
        }
        Update: {
          deployed_at?: string
          deployed_by?: string | null
          deployment_logs?: string | null
          deployment_url?: string | null
          design_version_id?: string
          environment?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_deployments_design_version_id_fkey"
            columns: ["design_version_id"]
            isOneToOne: false
            referencedRelation: "design_version_control"
            referencedColumns: ["id"]
          },
        ]
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
      design_specifications: {
        Row: {
          annotations: Json
          assets: Json
          created_at: string
          creator_id: string
          description: string | null
          id: string
          measurements: Json
          specifications: Json
          status: string
          title: string
          updated_at: string
          wireframe_id: string
        }
        Insert: {
          annotations?: Json
          assets?: Json
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          measurements?: Json
          specifications?: Json
          status?: string
          title: string
          updated_at?: string
          wireframe_id: string
        }
        Update: {
          annotations?: Json
          assets?: Json
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          measurements?: Json
          specifications?: Json
          status?: string
          title?: string
          updated_at?: string
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_specifications_wireframe_id_fkey"
            columns: ["wireframe_id"]
            isOneToOne: false
            referencedRelation: "wireframes"
            referencedColumns: ["id"]
          },
        ]
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
      design_system_components: {
        Row: {
          component_type: string
          created_at: string | null
          design_tokens: Json | null
          id: string
          name: string
          project_id: string
          properties: Json | null
          thumbnail_url: string | null
          updated_at: string | null
          version: string
        }
        Insert: {
          component_type: string
          created_at?: string | null
          design_tokens?: Json | null
          id?: string
          name: string
          project_id: string
          properties?: Json | null
          thumbnail_url?: string | null
          updated_at?: string | null
          version?: string
        }
        Update: {
          component_type?: string
          created_at?: string | null
          design_tokens?: Json | null
          id?: string
          name?: string
          project_id?: string
          properties?: Json | null
          thumbnail_url?: string | null
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      design_system_guidelines: {
        Row: {
          component_types: string[]
          context: string
          created_at: string
          guideline_type: string
          id: string
          priority: number | null
          recommendation: string
          updated_at: string
        }
        Insert: {
          component_types: string[]
          context: string
          created_at?: string
          guideline_type: string
          id?: string
          priority?: number | null
          recommendation: string
          updated_at?: string
        }
        Update: {
          component_types?: string[]
          context?: string
          created_at?: string
          guideline_type?: string
          id?: string
          priority?: number | null
          recommendation?: string
          updated_at?: string
        }
        Relationships: []
      }
      design_system_sync_logs: {
        Row: {
          changes: Json | null
          completed_at: string | null
          conflicts: Json | null
          created_at: string | null
          id: string
          project_id: string
          resolved_conflicts: Json | null
          status: string
          sync_direction: string
          wireframe_id: string | null
        }
        Insert: {
          changes?: Json | null
          completed_at?: string | null
          conflicts?: Json | null
          created_at?: string | null
          id?: string
          project_id: string
          resolved_conflicts?: Json | null
          status: string
          sync_direction: string
          wireframe_id?: string | null
        }
        Update: {
          changes?: Json | null
          completed_at?: string | null
          conflicts?: Json | null
          created_at?: string | null
          id?: string
          project_id?: string
          resolved_conflicts?: Json | null
          status?: string
          sync_direction?: string
          wireframe_id?: string | null
        }
        Relationships: []
      }
      design_system_versions: {
        Row: {
          change_description: string | null
          components_snapshot: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          project_id: string
          tokens_snapshot: Json | null
          version_number: string
        }
        Insert: {
          change_description?: string | null
          components_snapshot?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          project_id: string
          tokens_snapshot?: Json | null
          version_number: string
        }
        Update: {
          change_description?: string | null
          components_snapshot?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          project_id?: string
          tokens_snapshot?: Json | null
          version_number?: string
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
      design_version_control: {
        Row: {
          commit_hash: string | null
          commit_message: string | null
          created_at: string
          created_by: string | null
          design_id: string
          id: string
          pull_request_url: string | null
          repository_url: string | null
          status: string
          version_number: string
        }
        Insert: {
          commit_hash?: string | null
          commit_message?: string | null
          created_at?: string
          created_by?: string | null
          design_id: string
          id?: string
          pull_request_url?: string | null
          repository_url?: string | null
          status?: string
          version_number: string
        }
        Update: {
          commit_hash?: string | null
          commit_message?: string | null
          created_at?: string
          created_by?: string | null
          design_id?: string
          id?: string
          pull_request_url?: string | null
          repository_url?: string | null
          status?: string
          version_number?: string
        }
        Relationships: []
      }
      design_workflow_tasks: {
        Row: {
          artifact_type: string
          assigned_to: string | null
          created_at: string
          design_artifact_id: string
          id: string
          priority: string
          task_description: string | null
          task_status: string
          task_title: string
          updated_at: string
        }
        Insert: {
          artifact_type: string
          assigned_to?: string | null
          created_at?: string
          design_artifact_id: string
          id?: string
          priority?: string
          task_description?: string | null
          task_status?: string
          task_title: string
          updated_at?: string
        }
        Update: {
          artifact_type?: string
          assigned_to?: string | null
          created_at?: string
          design_artifact_id?: string
          id?: string
          priority?: string
          task_description?: string | null
          task_status?: string
          task_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      device_contexts: {
        Row: {
          capabilities: Json | null
          category: string
          constraints: Json | null
          created_at: string
          id: string
          input_methods: string[] | null
          name: string
          orientation: string | null
          screen_size_class: string | null
          updated_at: string
        }
        Insert: {
          capabilities?: Json | null
          category: string
          constraints?: Json | null
          created_at?: string
          id?: string
          input_methods?: string[] | null
          name: string
          orientation?: string | null
          screen_size_class?: string | null
          updated_at?: string
        }
        Update: {
          capabilities?: Json | null
          category?: string
          constraints?: Json | null
          created_at?: string
          id?: string
          input_methods?: string[] | null
          name?: string
          orientation?: string | null
          screen_size_class?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      document_annotations: {
        Row: {
          content: string
          created_at: string | null
          document_id: string
          id: string
          metadata: Json | null
          parent_id: string | null
          position: Json
          status: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          document_id: string
          id?: string
          metadata?: Json | null
          parent_id?: string | null
          position: Json
          status?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          document_id?: string
          id?: string
          metadata?: Json | null
          parent_id?: string | null
          position?: Json
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_annotations_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "collaborative_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_annotations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "document_annotations"
            referencedColumns: ["id"]
          },
        ]
      }
      document_changes: {
        Row: {
          document_id: string
          id: string
          operation: string
          path: string
          timestamp: string | null
          user_id: string
          value: Json
          version: number | null
        }
        Insert: {
          document_id: string
          id?: string
          operation: string
          path: string
          timestamp?: string | null
          user_id: string
          value: Json
          version?: number | null
        }
        Update: {
          document_id?: string
          id?: string
          operation?: string
          path?: string
          timestamp?: string | null
          user_id?: string
          value?: Json
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_changes_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "collaborative_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      environment_contexts: {
        Row: {
          adaptation_guidelines: string | null
          context_type: string
          created_at: string
          id: string
          name: string
          parameters: Json
        }
        Insert: {
          adaptation_guidelines?: string | null
          context_type: string
          created_at?: string
          id?: string
          name: string
          parameters: Json
        }
        Update: {
          adaptation_guidelines?: string | null
          context_type?: string
          created_at?: string
          id?: string
          name?: string
          parameters?: Json
        }
        Relationships: []
      }
      error_handling_config: {
        Row: {
          action: string
          component: string
          created_at: string
          error_type: string
          id: string
          max_retries: number | null
          notification_endpoint: string | null
          retry_delay_ms: number | null
          severity: string
          updated_at: string
        }
        Insert: {
          action: string
          component: string
          created_at?: string
          error_type: string
          id?: string
          max_retries?: number | null
          notification_endpoint?: string | null
          retry_delay_ms?: number | null
          severity: string
          updated_at?: string
        }
        Update: {
          action?: string
          component?: string
          created_at?: string
          error_type?: string
          id?: string
          max_retries?: number | null
          notification_endpoint?: string | null
          retry_delay_ms?: number | null
          severity?: string
          updated_at?: string
        }
        Relationships: []
      }
      external_service_connections: {
        Row: {
          auth_config: Json
          connection_config: Json
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          last_sync_at: string | null
          project_id: string
          service_name: string
          service_type: string
          sync_frequency: string | null
          updated_at: string
        }
        Insert: {
          auth_config: Json
          connection_config: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          project_id: string
          service_name: string
          service_type: string
          sync_frequency?: string | null
          updated_at?: string
        }
        Update: {
          auth_config?: Json
          connection_config?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          project_id?: string
          service_name?: string
          service_type?: string
          sync_frequency?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      external_service_mappings: {
        Row: {
          connection_id: string
          created_at: string
          id: string
          is_required: boolean
          source_field: string
          target_field: string
          transformation_rule: string | null
          updated_at: string
        }
        Insert: {
          connection_id: string
          created_at?: string
          id?: string
          is_required?: boolean
          source_field: string
          target_field: string
          transformation_rule?: string | null
          updated_at?: string
        }
        Update: {
          connection_id?: string
          created_at?: string
          id?: string
          is_required?: boolean
          source_field?: string
          target_field?: string
          transformation_rule?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_service_mappings_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "external_service_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      external_service_sync_logs: {
        Row: {
          connection_id: string
          error_details: Json | null
          id: string
          records_failed: number | null
          records_processed: number | null
          records_succeeded: number | null
          status: string
          sync_completed_at: string | null
          sync_direction: string
          sync_started_at: string
        }
        Insert: {
          connection_id: string
          error_details?: Json | null
          id?: string
          records_failed?: number | null
          records_processed?: number | null
          records_succeeded?: number | null
          status?: string
          sync_completed_at?: string | null
          sync_direction: string
          sync_started_at?: string
        }
        Update: {
          connection_id?: string
          error_details?: Json | null
          id?: string
          records_failed?: number | null
          records_processed?: number | null
          records_succeeded?: number | null
          status?: string
          sync_completed_at?: string | null
          sync_direction?: string
          sync_started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_service_sync_logs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "external_service_connections"
            referencedColumns: ["id"]
          },
        ]
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
      fidelity_configurations: {
        Row: {
          animations_enabled: boolean | null
          created_at: string | null
          id: string
          level: Database["public"]["Enums"]["fidelity_level"]
          performance_mode: boolean | null
          render_quality: number | null
          shadows_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          animations_enabled?: boolean | null
          created_at?: string | null
          id?: string
          level?: Database["public"]["Enums"]["fidelity_level"]
          performance_mode?: boolean | null
          render_quality?: number | null
          shadows_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          animations_enabled?: boolean | null
          created_at?: string | null
          id?: string
          level?: Database["public"]["Enums"]["fidelity_level"]
          performance_mode?: boolean | null
          render_quality?: number | null
          shadows_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      generated_code: {
        Row: {
          accessibility_score: number | null
          code_files: Json
          created_at: string
          creator_id: string
          framework: string
          id: string
          language: string
          performance_metrics: Json | null
          specification_id: string | null
          status: string
          template_id: string | null
          updated_at: string
          wireframe_id: string
        }
        Insert: {
          accessibility_score?: number | null
          code_files?: Json
          created_at?: string
          creator_id: string
          framework: string
          id?: string
          language: string
          performance_metrics?: Json | null
          specification_id?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
          wireframe_id: string
        }
        Update: {
          accessibility_score?: number | null
          code_files?: Json
          created_at?: string
          creator_id?: string
          framework?: string
          id?: string
          language?: string
          performance_metrics?: Json | null
          specification_id?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_code_specification_id_fkey"
            columns: ["specification_id"]
            isOneToOne: false
            referencedRelation: "design_specifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_code_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "code_generation_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_code_wireframe_id_fkey"
            columns: ["wireframe_id"]
            isOneToOne: false
            referencedRelation: "wireframes"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_content: {
        Row: {
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string | null
          id: string
          page_description: string | null
          page_title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          id?: string
          page_description?: string | null
          page_title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          id?: string
          page_description?: string | null
          page_title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      journey_steps: {
        Row: {
          created_at: string
          description: string | null
          id: string
          journey_id: string
          screen_id: string | null
          step_order: number
          title: string
          transition_metadata: Json | null
          transition_type: string | null
          updated_at: string
          wireframe_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          journey_id: string
          screen_id?: string | null
          step_order: number
          title: string
          transition_metadata?: Json | null
          transition_type?: string | null
          updated_at?: string
          wireframe_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          journey_id?: string
          screen_id?: string | null
          step_order?: number
          title?: string
          transition_metadata?: Json | null
          transition_type?: string | null
          updated_at?: string
          wireframe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_steps_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "user_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      key_performance_indicators: {
        Row: {
          created_at: string
          current_value: number | null
          description: string | null
          goal_id: string | null
          id: string
          metric_type: string
          name: string
          project_id: string
          status: Database["public"]["Enums"]["kpi_status"] | null
          target_value: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          goal_id?: string | null
          id?: string
          metric_type: string
          name: string
          project_id: string
          status?: Database["public"]["Enums"]["kpi_status"] | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          goal_id?: string | null
          id?: string
          metric_type?: string
          name?: string
          project_id?: string
          status?: Database["public"]["Enums"]["kpi_status"] | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "key_performance_indicators_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "project_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_performance_indicators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      material_presets: {
        Row: {
          created_at: string | null
          id: string
          is_system_preset: boolean | null
          material_type: string
          name: string
          properties: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_system_preset?: boolean | null
          material_type: string
          name: string
          properties: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_system_preset?: boolean | null
          material_type?: string
          name?: string
          properties?: Json
          user_id?: string | null
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
      performance_budgets: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          wireframe_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          wireframe_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          wireframe_id?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          budget_id: string
          created_at: string
          current_value: number | null
          id: string
          importance: string | null
          metric_name: string
          metric_type: string
          target_value: number
          unit: string
          updated_at: string
        }
        Insert: {
          budget_id: string
          created_at?: string
          current_value?: number | null
          id?: string
          importance?: string | null
          metric_name: string
          metric_type: string
          target_value: number
          unit: string
          updated_at?: string
        }
        Update: {
          budget_id?: string
          created_at?: string
          current_value?: number | null
          id?: string
          importance?: string | null
          metric_name?: string
          metric_type?: string
          target_value?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "performance_budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: Database["public"]["Enums"]["auth_permission"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: Database["public"]["Enums"]["auth_permission"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: Database["public"]["Enums"]["auth_permission"]
        }
        Relationships: []
      }
      platform_configurations: {
        Row: {
          configuration_schema: Json
          created_at: string
          default_settings: Json
          id: string
          is_active: boolean
          platform_name: string
          platform_type: string
          updated_at: string
        }
        Insert: {
          configuration_schema: Json
          created_at?: string
          default_settings: Json
          id?: string
          is_active?: boolean
          platform_name: string
          platform_type: string
          updated_at?: string
        }
        Update: {
          configuration_schema?: Json
          created_at?: string
          default_settings?: Json
          id?: string
          is_active?: boolean
          platform_name?: string
          platform_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_transformers: {
        Row: {
          component_type: string
          created_at: string
          id: string
          platform_id: string
          platform_specific_properties: Json | null
          transformation_rules: Json
          updated_at: string
        }
        Insert: {
          component_type: string
          created_at?: string
          id?: string
          platform_id: string
          platform_specific_properties?: Json | null
          transformation_rules: Json
          updated_at?: string
        }
        Update: {
          component_type?: string
          created_at?: string
          id?: string
          platform_id?: string
          platform_specific_properties?: Json | null
          transformation_rules?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_transformers_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platform_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      presentation_feedback: {
        Row: {
          content: string | null
          created_at: string
          element_id: string | null
          feedback_type: string | null
          id: string
          metadata: Json | null
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          element_id?: string | null
          feedback_type?: string | null
          id?: string
          metadata?: Json | null
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          element_id?: string | null
          feedback_type?: string | null
          id?: string
          metadata?: Json | null
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presentation_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "presentation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      presentation_participants: {
        Row: {
          created_at: string
          email: string | null
          id: string
          joined_at: string | null
          last_active_at: string | null
          name: string | null
          role: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          joined_at?: string | null
          last_active_at?: string | null
          name?: string | null
          role?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          joined_at?: string | null
          last_active_at?: string | null
          name?: string | null
          role?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presentation_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "presentation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      presentation_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          presenter_id: string
          scheduled_at: string | null
          settings: Json | null
          started_at: string | null
          status: string
          title: string
          updated_at: string
          wireframe_id: string | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          presenter_id: string
          scheduled_at?: string | null
          settings?: Json | null
          started_at?: string | null
          status: string
          title: string
          updated_at?: string
          wireframe_id?: string | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          presenter_id?: string
          scheduled_at?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          wireframe_id?: string | null
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
      project_goals: {
        Row: {
          created_at: string
          description: string
          id: string
          priority: number | null
          project_id: string
          status: string | null
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          priority?: number | null
          project_id: string
          status?: string | null
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          priority?: number | null
          project_id?: string
          status?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_goals_project_id_fkey"
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
      regional_design_preferences: {
        Row: {
          category: string
          confidence: number | null
          created_at: string
          id: string
          preference_data: Json
          region: string
          source: string | null
        }
        Insert: {
          category: string
          confidence?: number | null
          created_at?: string
          id?: string
          preference_data: Json
          region: string
          source?: string | null
        }
        Update: {
          category?: string
          confidence?: number | null
          created_at?: string
          id?: string
          preference_data?: Json
          region?: string
          source?: string | null
        }
        Relationships: []
      }
      research_wireframe_connections: {
        Row: {
          connection_type: string
          created_at: string
          element_id: string | null
          id: string
          notes: string | null
          research_id: string
          updated_at: string
          wireframe_id: string
        }
        Insert: {
          connection_type: string
          created_at?: string
          element_id?: string | null
          id?: string
          notes?: string | null
          research_id: string
          updated_at?: string
          wireframe_id: string
        }
        Update: {
          connection_type?: string
          created_at?: string
          element_id?: string | null
          id?: string
          notes?: string | null
          research_id?: string
          updated_at?: string
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_wireframe_connections_research_id_fkey"
            columns: ["research_id"]
            isOneToOne: false
            referencedRelation: "user_research"
            referencedColumns: ["id"]
          },
        ]
      }
      responsive_configurations: {
        Row: {
          created_at: string | null
          id: string
          is_system_config: boolean | null
          name: string
          rules: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_system_config?: boolean | null
          name: string
          rules: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_system_config?: boolean | null
          name?: string
          rules?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      risk_assessment_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          risk_categories_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          risk_categories_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          risk_categories_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_risk_categories"
            columns: ["risk_categories_id"]
            isOneToOne: false
            referencedRelation: "risk_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission: Database["public"]["Enums"]["auth_permission"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission: Database["public"]["Enums"]["auth_permission"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["auth_permission"]
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      simulation_results: {
        Row: {
          average_completion_time: number | null
          behavioral_insights: string[] | null
          completion_rate: number | null
          created_by: string
          error_points: Json | null
          id: string
          scenario_id: string
          simulation_date: string
          status: Database["public"]["Enums"]["test_status"]
          user_paths: Json | null
        }
        Insert: {
          average_completion_time?: number | null
          behavioral_insights?: string[] | null
          completion_rate?: number | null
          created_by: string
          error_points?: Json | null
          id?: string
          scenario_id: string
          simulation_date?: string
          status?: Database["public"]["Enums"]["test_status"]
          user_paths?: Json | null
        }
        Update: {
          average_completion_time?: number | null
          behavioral_insights?: string[] | null
          completion_rate?: number | null
          created_by?: string
          error_points?: Json | null
          id?: string
          scenario_id?: string
          simulation_date?: string
          status?: Database["public"]["Enums"]["test_status"]
          user_paths?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "simulation_results_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "user_test_scenarios"
            referencedColumns: ["id"]
          },
        ]
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
      technical_documentation: {
        Row: {
          acceptance_criteria: Json
          created_at: string
          creator_id: string
          id: string
          implementation_notes: string | null
          specification_id: string | null
          status: string
          technical_requirements: Json
          title: string
          updated_at: string
          version: string
          wireframe_id: string
        }
        Insert: {
          acceptance_criteria?: Json
          created_at?: string
          creator_id: string
          id?: string
          implementation_notes?: string | null
          specification_id?: string | null
          status?: string
          technical_requirements?: Json
          title: string
          updated_at?: string
          version?: string
          wireframe_id: string
        }
        Update: {
          acceptance_criteria?: Json
          created_at?: string
          creator_id?: string
          id?: string
          implementation_notes?: string | null
          specification_id?: string | null
          status?: string
          technical_requirements?: Json
          title?: string
          updated_at?: string
          version?: string
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technical_documentation_specification_id_fkey"
            columns: ["specification_id"]
            isOneToOne: false
            referencedRelation: "design_specifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technical_documentation_wireframe_id_fkey"
            columns: ["wireframe_id"]
            isOneToOne: false
            referencedRelation: "wireframes"
            referencedColumns: ["id"]
          },
        ]
      }
      technical_feasibility_analysis: {
        Row: {
          browser_compatibility: Json | null
          created_at: string | null
          id: string
          implementation_challenges: Json | null
          performance_metrics: Json | null
          updated_at: string | null
          wireframe_id: string
        }
        Insert: {
          browser_compatibility?: Json | null
          created_at?: string | null
          id?: string
          implementation_challenges?: Json | null
          performance_metrics?: Json | null
          updated_at?: string | null
          wireframe_id: string
        }
        Update: {
          browser_compatibility?: Json | null
          created_at?: string | null
          id?: string
          implementation_challenges?: Json | null
          performance_metrics?: Json | null
          updated_at?: string | null
          wireframe_id?: string
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
      test_task_flows: {
        Row: {
          created_at: string
          description: string | null
          expected_path: Json | null
          id: string
          scenario_id: string
          sequence_order: number
          start_element_id: string | null
          target_element_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expected_path?: Json | null
          id?: string
          scenario_id: string
          sequence_order: number
          start_element_id?: string | null
          target_element_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expected_path?: Json | null
          id?: string
          scenario_id?: string
          sequence_order?: number
          start_element_id?: string | null
          target_element_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_task_flows_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "user_test_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_journeys: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          status?: string
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
      user_presence: {
        Row: {
          cursor_position: Json | null
          document_id: string
          focus_element: string | null
          id: string
          last_active: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          cursor_position?: Json | null
          document_id: string
          focus_element?: string | null
          id?: string
          last_active?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          cursor_position?: Json | null
          document_id?: string
          focus_element?: string | null
          id?: string
          last_active?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "collaborative_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_research: {
        Row: {
          created_at: string
          creator_id: string
          data: Json
          description: string | null
          id: string
          research_type: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          data: Json
          description?: string | null
          id?: string
          research_type: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          data?: Json
          description?: string | null
          id?: string
          research_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_test_scenarios: {
        Row: {
          created_at: string
          creator_id: string
          description: string
          difficulty_level: number | null
          estimated_completion_time: number | null
          id: string
          success_criteria: Json
          title: string
          updated_at: string
          wireframe_id: string | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          description: string
          difficulty_level?: number | null
          estimated_completion_time?: number | null
          id?: string
          success_criteria: Json
          title: string
          updated_at?: string
          wireframe_id?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string
          difficulty_level?: number | null
          estimated_completion_time?: number | null
          id?: string
          success_criteria?: Json
          title?: string
          updated_at?: string
          wireframe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_test_scenarios_wireframe_id_fkey"
            columns: ["wireframe_id"]
            isOneToOne: false
            referencedRelation: "ai_wireframes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_view_preferences: {
        Row: {
          created_at: string | null
          id: string
          show_annotations: boolean | null
          show_client_feedback: boolean | null
          show_developer_notes: boolean | null
          updated_at: string | null
          user_id: string | null
          view_role: Database["public"]["Enums"]["view_role"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          show_annotations?: boolean | null
          show_client_feedback?: boolean | null
          show_developer_notes?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          view_role?: Database["public"]["Enums"]["view_role"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          show_annotations?: boolean | null
          show_client_feedback?: boolean | null
          show_developer_notes?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          view_role?: Database["public"]["Enums"]["view_role"] | null
        }
        Relationships: []
      }
      variant_styles: {
        Row: {
          created_at: string
          priority: number
          style_id: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          priority?: number
          style_id: string
          variant_id: string
        }
        Update: {
          created_at?: string
          priority?: number
          style_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_styles_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "component_styles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_styles_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "component_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      wireframe_accessibility_mappings: {
        Row: {
          accessibility_notes: string | null
          component_type: string
          created_at: string | null
          custom_aria_attributes: Json | null
          custom_keyboard_interactions: Json | null
          element_id: string
          id: string
          updated_at: string | null
          verification_status: string | null
          wireframe_id: string
        }
        Insert: {
          accessibility_notes?: string | null
          component_type: string
          created_at?: string | null
          custom_aria_attributes?: Json | null
          custom_keyboard_interactions?: Json | null
          element_id: string
          id?: string
          updated_at?: string | null
          verification_status?: string | null
          wireframe_id: string
        }
        Update: {
          accessibility_notes?: string | null
          component_type?: string
          created_at?: string | null
          custom_aria_attributes?: Json | null
          custom_keyboard_interactions?: Json | null
          element_id?: string
          id?: string
          updated_at?: string | null
          verification_status?: string | null
          wireframe_id?: string
        }
        Relationships: []
      }
      wireframe_action_history: {
        Row: {
          action_type: string
          canvas_id: string
          component_id: string | null
          created_at: string
          id: string
          new_state: Json | null
          previous_state: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          canvas_id: string
          component_id?: string | null
          created_at?: string
          id?: string
          new_state?: Json | null
          previous_state?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          canvas_id?: string
          component_id?: string | null
          created_at?: string
          id?: string
          new_state?: Json | null
          previous_state?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_action_history_canvas_id_fkey"
            columns: ["canvas_id"]
            isOneToOne: false
            referencedRelation: "wireframe_canvas"
            referencedColumns: ["id"]
          },
        ]
      }
      wireframe_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          user_id: string
          wireframe_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          user_id: string
          wireframe_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string
          wireframe_id?: string
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
      wireframe_blueprints: {
        Row: {
          blueprint_data: Json
          created_at: string | null
          id: string
          prompt_id: string
          style_token: string | null
          updated_at: string | null
        }
        Insert: {
          blueprint_data: Json
          created_at?: string | null
          id?: string
          prompt_id: string
          style_token?: string | null
          updated_at?: string | null
        }
        Update: {
          blueprint_data?: Json
          created_at?: string | null
          id?: string
          prompt_id?: string
          style_token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_blueprints_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "wireframe_prompts"
            referencedColumns: ["id"]
          },
        ]
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
      wireframe_canvas: {
        Row: {
          canvas_state: Json
          created_at: string
          grid_settings: Json
          id: string
          is_active: boolean
          name: string
          pan_offset: Json
          project_id: string
          updated_at: string
          user_id: string
          version: number
          zoom_level: number
        }
        Insert: {
          canvas_state?: Json
          created_at?: string
          grid_settings?: Json
          id?: string
          is_active?: boolean
          name: string
          pan_offset?: Json
          project_id: string
          updated_at?: string
          user_id: string
          version?: number
          zoom_level?: number
        }
        Update: {
          canvas_state?: Json
          created_at?: string
          grid_settings?: Json
          id?: string
          is_active?: boolean
          name?: string
          pan_offset?: Json
          project_id?: string
          updated_at?: string
          user_id?: string
          version?: number
          zoom_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_canvas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "wireframe_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      wireframe_canvas_components: {
        Row: {
          canvas_id: string
          component_library_id: string | null
          component_type: string
          created_at: string
          id: string
          is_locked: boolean
          is_visible: boolean
          layer_index: number
          position: Json
          properties: Json
          size: Json
          updated_at: string
        }
        Insert: {
          canvas_id: string
          component_library_id?: string | null
          component_type: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_visible?: boolean
          layer_index?: number
          position?: Json
          properties?: Json
          size?: Json
          updated_at?: string
        }
        Update: {
          canvas_id?: string
          component_library_id?: string | null
          component_type?: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_visible?: boolean
          layer_index?: number
          position?: Json
          properties?: Json
          size?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_canvas_components_canvas_id_fkey"
            columns: ["canvas_id"]
            isOneToOne: false
            referencedRelation: "wireframe_canvas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wireframe_canvas_components_component_library_id_fkey"
            columns: ["component_library_id"]
            isOneToOne: false
            referencedRelation: "wireframe_components_library"
            referencedColumns: ["id"]
          },
        ]
      }
      wireframe_competitor_comparisons: {
        Row: {
          comparison_notes: string | null
          competitive_element_id: string
          created_at: string
          differentiation_points: string[] | null
          element_id: string
          id: string
          rating: Database["public"]["Enums"]["competitor_rating"]
          updated_at: string
          wireframe_id: string
        }
        Insert: {
          comparison_notes?: string | null
          competitive_element_id: string
          created_at?: string
          differentiation_points?: string[] | null
          element_id: string
          id?: string
          rating: Database["public"]["Enums"]["competitor_rating"]
          updated_at?: string
          wireframe_id: string
        }
        Update: {
          comparison_notes?: string | null
          competitive_element_id?: string
          created_at?: string
          differentiation_points?: string[] | null
          element_id?: string
          id?: string
          rating?: Database["public"]["Enums"]["competitor_rating"]
          updated_at?: string
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_competitor_comparisons_competitive_element_id_fkey"
            columns: ["competitive_element_id"]
            isOneToOne: false
            referencedRelation: "competitive_elements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wireframe_competitor_comparisons_wireframe_id_fkey"
            columns: ["wireframe_id"]
            isOneToOne: false
            referencedRelation: "ai_wireframes"
            referencedColumns: ["id"]
          },
        ]
      }
      wireframe_component_variants: {
        Row: {
          component_type: string
          created_at: string | null
          id: string
          preview_image_url: string | null
          properties: Json
          variant_name: string
        }
        Insert: {
          component_type: string
          created_at?: string | null
          id?: string
          preview_image_url?: string | null
          properties: Json
          variant_name: string
        }
        Update: {
          component_type?: string
          created_at?: string | null
          id?: string
          preview_image_url?: string | null
          properties?: Json
          variant_name?: string
        }
        Relationships: []
      }
      wireframe_components: {
        Row: {
          category: string
          created_at: string
          default_data: Json
          description: string | null
          fields: Json
          icon: string | null
          id: string
          name: string
          type: string
          updated_at: string
          variants: Json
        }
        Insert: {
          category: string
          created_at?: string
          default_data?: Json
          description?: string | null
          fields?: Json
          icon?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
          variants?: Json
        }
        Update: {
          category?: string
          created_at?: string
          default_data?: Json
          description?: string | null
          fields?: Json
          icon?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
          variants?: Json
        }
        Relationships: []
      }
      wireframe_components_library: {
        Row: {
          category: string
          component_type: string
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name: string
          properties: Json
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          component_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
          properties: Json
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          component_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
          properties?: Json
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wireframe_design_memory: {
        Row: {
          blueprint_id: string | null
          component_preferences: Json | null
          created_at: string | null
          id: string
          layout_patterns: Json | null
          project_id: string | null
          style_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blueprint_id?: string | null
          component_preferences?: Json | null
          created_at?: string | null
          id?: string
          layout_patterns?: Json | null
          project_id?: string | null
          style_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blueprint_id?: string | null
          component_preferences?: Json | null
          created_at?: string | null
          id?: string
          layout_patterns?: Json | null
          project_id?: string | null
          style_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_design_memory_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "wireframe_blueprints"
            referencedColumns: ["id"]
          },
        ]
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
      wireframe_generated: {
        Row: {
          blueprint_id: string
          created_at: string | null
          feedback: string | null
          id: string
          rendered_data: Json
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          blueprint_id: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          rendered_data: Json
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          blueprint_id?: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          rendered_data?: Json
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_generated_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "wireframe_blueprints"
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
      wireframe_goal_connections: {
        Row: {
          created_at: string
          element_id: string
          goal_id: string | null
          id: string
          impact_description: string | null
          kpi_id: string | null
          priority: number | null
          success_criteria: string | null
          updated_at: string
          wireframe_id: string
        }
        Insert: {
          created_at?: string
          element_id: string
          goal_id?: string | null
          id?: string
          impact_description?: string | null
          kpi_id?: string | null
          priority?: number | null
          success_criteria?: string | null
          updated_at?: string
          wireframe_id: string
        }
        Update: {
          created_at?: string
          element_id?: string
          goal_id?: string | null
          id?: string
          impact_description?: string | null
          kpi_id?: string | null
          priority?: number | null
          success_criteria?: string | null
          updated_at?: string
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_goal_connections_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "project_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wireframe_goal_connections_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "key_performance_indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wireframe_goal_connections_wireframe_id_fkey"
            columns: ["wireframe_id"]
            isOneToOne: false
            referencedRelation: "ai_wireframes"
            referencedColumns: ["id"]
          },
        ]
      }
      wireframe_multi_page_layouts: {
        Row: {
          app_description: string | null
          created_at: string | null
          id: string
          navigation_structure: Json | null
          page_layouts: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          app_description?: string | null
          created_at?: string | null
          id?: string
          navigation_structure?: Json | null
          page_layouts: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          app_description?: string | null
          created_at?: string | null
          id?: string
          navigation_structure?: Json | null
          page_layouts?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wireframe_platform_outputs: {
        Row: {
          created_at: string
          generated_by: string | null
          id: string
          output_data: Json | null
          output_url: string | null
          platform_id: string
          status: string
          updated_at: string
          validation_result: Json | null
          wireframe_id: string
        }
        Insert: {
          created_at?: string
          generated_by?: string | null
          id?: string
          output_data?: Json | null
          output_url?: string | null
          platform_id: string
          status?: string
          updated_at?: string
          validation_result?: Json | null
          wireframe_id: string
        }
        Update: {
          created_at?: string
          generated_by?: string | null
          id?: string
          output_data?: Json | null
          output_url?: string | null
          platform_id?: string
          status?: string
          updated_at?: string
          validation_result?: Json | null
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_platform_outputs_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platform_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      wireframe_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          settings: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          settings?: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          settings?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wireframe_prompts: {
        Row: {
          created_at: string | null
          id: string
          raw_input: string
          structured_intent: Json | null
          updated_at: string | null
          user_id: string | null
          visual_tone: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          raw_input: string
          structured_intent?: Json | null
          updated_at?: string | null
          user_id?: string | null
          visual_tone?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          raw_input?: string
          structured_intent?: Json | null
          updated_at?: string | null
          user_id?: string | null
          visual_tone?: string | null
        }
        Relationships: []
      }
      wireframe_risk_assessments: {
        Row: {
          created_at: string
          id: string
          mitigation_plan: Json | null
          risk_assessment_template_id: string | null
          risk_factors: Json
          risk_level: string
          status: string
          updated_at: string
          wireframe_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mitigation_plan?: Json | null
          risk_assessment_template_id?: string | null
          risk_factors?: Json
          risk_level: string
          status: string
          updated_at?: string
          wireframe_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mitigation_plan?: Json | null
          risk_assessment_template_id?: string | null
          risk_factors?: Json
          risk_level?: string
          status?: string
          updated_at?: string
          wireframe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wireframe_risk_assessments_risk_assessment_template_id_fkey"
            columns: ["risk_assessment_template_id"]
            isOneToOne: false
            referencedRelation: "risk_assessment_templates"
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
      wireframe_style_modifiers: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          properties: Json
          style_token: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          properties: Json
          style_token: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          properties?: Json
          style_token?: string
        }
        Relationships: []
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
      wireframes: {
        Row: {
          created_at: string
          data: Json
          description: string | null
          design_tokens: Json | null
          id: string
          status: string
          style_variant: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          description?: string | null
          design_tokens?: Json | null
          id?: string
          status?: string
          style_variant?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          description?: string | null
          design_tokens?: Json | null
          id?: string
          status?: string
          style_variant?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      analyze_asset_usage: {
        Args: { p_project_id: string; p_days_threshold?: number }
        Returns: Json
      }
      analyze_competitive_positioning: {
        Args: { p_wireframe_id: string }
        Returns: Json
      }
      analyze_content_hierarchy: {
        Args: { p_project_id: string }
        Returns: Json
      }
      analyze_goal_kpi_alignment: {
        Args: { p_project_id: string }
        Returns: Json
      }
      analyze_interaction_patterns: {
        Args: {
          p_user_id: string
          p_event_type?: string
          p_page_url?: string
          p_limit?: number
        }
        Returns: Json
      }
      analyze_profile_queries: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      analyze_technical_feasibility: {
        Args: { p_wireframe_id: string }
        Returns: Json
      }
      analyze_wireframe_sections: {
        Args: { p_start_date: string }
        Returns: Json
      }
      apply_design_system_to_wireframe: {
        Args: {
          p_wireframe_id: string
          p_project_id: string
          p_override_conflicts?: boolean
        }
        Returns: Json
      }
      apply_wireframe_to_design_system: {
        Args: {
          p_wireframe_id: string
          p_project_id: string
          p_override_conflicts?: boolean
        }
        Returns: Json
      }
      batch_insert_interaction_events: {
        Args: { p_events: Json }
        Returns: undefined
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      check_color_contrast_compliance: {
        Args: { p_foreground_color: string; p_background_color: string }
        Returns: Json
      }
      check_database_performance: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      check_wireframe_cache: {
        Args: { p_params_hash: string }
        Returns: Json
      }
      check_wireframe_rate_limits: {
        Args: { p_user_id: string; p_max_daily: number; p_max_hourly: number }
        Returns: Json
      }
      clear_expired_wireframe_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      compare_wireframe_versions: {
        Args: { p_version_id1: string; p_version_id2: string }
        Returns: Json
      }
      create_background_task: {
        Args: { p_task_type: string; p_input_data: Json }
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
      detect_design_system_conflicts: {
        Args: { p_project_id: string; p_wireframe_id: string; p_changes: Json }
        Returns: Json
      }
      generate_accessibility_recommendations: {
        Args: { p_component_type: string }
        Returns: Json
      }
      generate_code: {
        Args: {
          p_wireframe_id: string
          p_creator_id: string
          p_framework: string
          p_language: string
          p_specification_id?: string
          p_template_id?: string
        }
        Returns: string
      }
      generate_platform_output: {
        Args: { p_wireframe_id: string; p_platform_id: string }
        Returns: Json
      }
      generate_technical_documentation: {
        Args: {
          p_wireframe_id: string
          p_creator_id: string
          p_specification_id?: string
        }
        Returns: string
      }
      get_context_component_recommendations: {
        Args: { p_context: string; p_limit?: number }
        Returns: {
          component_type: string
          confidence: number
          reasoning: string
        }[]
      }
      get_cultural_adaptations: {
        Args: { p_component_type: string; p_region: string }
        Returns: Json
      }
      get_device_adaptations: {
        Args: { p_component_type: string; p_device_context: string }
        Returns: Json
      }
      get_error_handling_config: {
        Args: { p_component: string; p_error_type: string }
        Returns: {
          action: string
          component: string
          created_at: string
          error_type: string
          id: string
          max_retries: number | null
          notification_endpoint: string | null
          retry_delay_ms: number | null
          severity: string
          updated_at: string
        }[]
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
        Args: { p_wireframe_id: string; p_branch_name: string }
        Returns: number
      }
      get_next_pending_task: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_profile_query_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_permissions: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["auth_permission"][]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_wireframe_branches: {
        Args: { p_wireframe_id: string }
        Returns: {
          name: string
          created_at: string
          version_count: number
          latest_version_id: string
        }[]
      }
      get_wireframe_metrics: {
        Args: { p_start_date: string; p_project_id?: string }
        Returns: Json
      }
      get_wireframe_version: {
        Args: { p_version_id: string }
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
        Args: { p_wireframe_id: string }
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
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_cache_hit: {
        Args: { p_cache_id: string }
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
        Args: { user_id: string }
        Returns: boolean
      }
      is_subscribed: {
        Args: { user_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      manage_error_config: {
        Args: {
          p_action: string
          p_component?: string
          p_error_type?: string
          p_config?: Json
        }
        Returns: Json
      }
      manage_feedback_analysis: {
        Args: { p_action: string; p_data?: Json; p_user_id?: string }
        Returns: Json
      }
      manage_wireframe_design_memory: {
        Args: { p_action: string; p_user_id: string; p_data?: Json }
        Returns: Json
      }
      propagate_token_changes: {
        Args: { p_project_id: string; p_token_id: string }
        Returns: {
          component_type: string
          created_at: string | null
          design_tokens: Json | null
          id: string
          name: string
          project_id: string
          properties: Json | null
          thumbnail_url: string | null
          updated_at: string | null
          version: string
        }[]
      }
      query_interaction_events: {
        Args: { query_text: string }
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
      record_component_usage: {
        Args: { p_component_type: string; p_context_name: string }
        Returns: undefined
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
        Args: { p_event_type: string; p_details: Json; p_severity?: string }
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
      record_wireframe_generation: {
        Args:
          | {
              p_project_id: string
              p_prompt: string
              p_generation_params: Json
              p_result_data: Json
              p_success: boolean
              p_generation_time: number
            }
          | { p_user_id: string }
        Returns: string
      }
      save_wireframe_sections: {
        Args: { p_wireframe_id: string; p_sections: Json }
        Returns: {
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
        }[]
      }
      search_memory_embeddings: {
        Args:
          | {
              query_embedding: string
              match_threshold?: number
              match_count?: number
              filter_memory_type?: string
            }
          | {
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
        Args: { p_wireframe_id: string; p_branch_name: string }
        Returns: undefined
      }
      simulate_user_test: {
        Args: { p_scenario_id: string; p_iterations?: number }
        Returns: Json
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
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
      sync_external_service: {
        Args: { p_connection_id: string }
        Returns: Json
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
      transform_data_through_mapping: {
        Args: { p_mapping_id: string; p_input_data?: Json }
        Returns: Json
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
        Args: { p_wireframe_id: string; p_data: Json }
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
      user_has_permission: {
        Args: {
          p_user_id: string
          p_permission: Database["public"]["Enums"]["auth_permission"]
        }
        Returns: boolean
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
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
      auth_permission:
        | "VIEW_DASHBOARD"
        | "MANAGE_PROJECTS"
        | "EDIT_PROFILE"
        | "VIEW_ANALYTICS"
        | "MANAGE_USERS"
        | "VIEW_ADMIN_PANEL"
        | "ACCESS_PREMIUM_FEATURES"
      competitor_rating: "superior" | "equal" | "inferior"
      content_node_type: "page" | "section" | "component" | "text" | "media"
      content_type: "page" | "section" | "component"
      feedback_priority: "low" | "medium" | "high" | "urgent"
      feedback_status: "open" | "in_progress" | "resolved" | "closed"
      fidelity_level: "wireframe" | "low" | "medium" | "high"
      kpi_status: "exceeding" | "meeting" | "below"
      subscription_status:
        | "free"
        | "basic"
        | "pro"
        | "sync"
        | "sync-pro"
        | "trial"
      template_status: "active" | "archived" | "draft"
      test_status: "pending" | "in_progress" | "completed" | "failed"
      user_role:
        | "free"
        | "pro"
        | "sync"
        | "sync-pro"
        | "trial"
        | "template-buyer"
        | "admin"
      view_role: "developer" | "designer" | "client" | "manager"
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
      animation_category: [
        "morphing_shape",
        "progressive_disclosure",
        "intent_based_motion",
        "glassmorphism",
        "hover_effect",
        "modal_dialog",
        "custom_cursor",
        "scroll_animation",
        "drag_interaction",
        "magnetic_element",
        "color_shift",
        "parallax_tilt",
      ],
      auth_permission: [
        "VIEW_DASHBOARD",
        "MANAGE_PROJECTS",
        "EDIT_PROFILE",
        "VIEW_ANALYTICS",
        "MANAGE_USERS",
        "VIEW_ADMIN_PANEL",
        "ACCESS_PREMIUM_FEATURES",
      ],
      competitor_rating: ["superior", "equal", "inferior"],
      content_node_type: ["page", "section", "component", "text", "media"],
      content_type: ["page", "section", "component"],
      feedback_priority: ["low", "medium", "high", "urgent"],
      feedback_status: ["open", "in_progress", "resolved", "closed"],
      fidelity_level: ["wireframe", "low", "medium", "high"],
      kpi_status: ["exceeding", "meeting", "below"],
      subscription_status: [
        "free",
        "basic",
        "pro",
        "sync",
        "sync-pro",
        "trial",
      ],
      template_status: ["active", "archived", "draft"],
      test_status: ["pending", "in_progress", "completed", "failed"],
      user_role: [
        "free",
        "pro",
        "sync",
        "sync-pro",
        "trial",
        "template-buyer",
        "admin",
      ],
      view_role: ["developer", "designer", "client", "manager"],
    },
  },
} as const
