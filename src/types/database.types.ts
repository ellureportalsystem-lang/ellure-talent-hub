export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          admin_role: string
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          department: string | null
          email: string
          full_name: string | null
          id: string
          last_active_at: string | null
          notes: string | null
          permissions: Json | null
          phone: string | null
          requested_at: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_role?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          full_name?: string | null
          id?: string
          last_active_at?: string | null
          notes?: string | null
          permissions?: Json | null
          phone?: string | null
          requested_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_role?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_active_at?: string | null
          notes?: string | null
          permissions?: Json | null
          phone?: string | null
          requested_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applicant_achievements: {
        Row: {
          applicant_id: string
          created_at: string | null
          credential_url: string | null
          description: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          title: string
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Insert: {
          applicant_id: string
          created_at?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          title: string
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Update: {
          applicant_id?: string
          created_at?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          title?: string
          type?: Database["public"]["Enums"]["achievement_type"]
        }
        Relationships: [
          {
            foreignKeyName: "applicant_achievements_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      applicant_addresses: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          applicant_id: string
          city_id: string | null
          created_at: string | null
          district_id: string | null
          id: string
          is_primary: boolean | null
          landmark: string | null
          pincode: string | null
          state_id: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          applicant_id: string
          city_id?: string | null
          created_at?: string | null
          district_id?: string | null
          id?: string
          is_primary?: boolean | null
          landmark?: string | null
          pincode?: string | null
          state_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          applicant_id?: string
          city_id?: string | null
          created_at?: string | null
          district_id?: string | null
          id?: string
          is_primary?: boolean | null
          landmark?: string | null
          pincode?: string | null
          state_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_addresses_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      applicant_education: {
        Row: {
          applicant_id: string
          board_id: string | null
          board_name: string | null
          city_id: string | null
          course_id: string | null
          created_at: string | null
          degree_id: string | null
          district_id: string | null
          education_level: string
          field_of_study: string | null
          grade_type: string | null
          id: string
          institution_id: string | null
          institution_name: string | null
          is_highest: boolean | null
          medium: string | null
          mode: string | null
          passing_year: number | null
          percentage: number | null
          state_id: string | null
          stream: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_id: string
          board_id?: string | null
          board_name?: string | null
          city_id?: string | null
          course_id?: string | null
          created_at?: string | null
          degree_id?: string | null
          district_id?: string | null
          education_level: string
          field_of_study?: string | null
          grade_type?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          is_highest?: boolean | null
          medium?: string | null
          mode?: string | null
          passing_year?: number | null
          percentage?: number | null
          state_id?: string | null
          stream?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string
          board_id?: string | null
          board_name?: string | null
          city_id?: string | null
          course_id?: string | null
          created_at?: string | null
          degree_id?: string | null
          district_id?: string | null
          education_level?: string
          field_of_study?: string | null
          grade_type?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          is_highest?: boolean | null
          medium?: string | null
          mode?: string | null
          passing_year?: number | null
          percentage?: number | null
          state_id?: string | null
          stream?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_education_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      applicant_experience: {
        Row: {
          applicant_id: string
          city_id: string | null
          company_name: string
          created_at: string | null
          current_ctc: string | null
          department: string | null
          description: string | null
          designation: string
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          end_date: string | null
          expected_ctc: string | null
          id: string
          is_current: boolean | null
          notice_period: string | null
          skills_used: string[] | null
          start_date: string | null
          total_experience_months: number | null
          updated_at: string | null
        }
        Insert: {
          applicant_id: string
          city_id?: string | null
          company_name: string
          created_at?: string | null
          current_ctc?: string | null
          department?: string | null
          description?: string | null
          designation: string
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          end_date?: string | null
          expected_ctc?: string | null
          id?: string
          is_current?: boolean | null
          notice_period?: string | null
          skills_used?: string[] | null
          start_date?: string | null
          total_experience_months?: number | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string
          city_id?: string | null
          company_name?: string
          created_at?: string | null
          current_ctc?: string | null
          department?: string | null
          description?: string | null
          designation?: string
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          end_date?: string | null
          expected_ctc?: string | null
          id?: string
          is_current?: boolean | null
          notice_period?: string | null
          skills_used?: string[] | null
          start_date?: string | null
          total_experience_months?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_experience_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      applicant_files: {
        Row: {
          applicant_id: string
          created_at: string | null
          file_name: string | null
          file_size: number | null
          file_type: Database["public"]["Enums"]["file_type"] | null
          file_url: string
          id: string
          mime_type: string | null
          storage_bucket: string | null
          storage_path: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          applicant_id: string
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: Database["public"]["Enums"]["file_type"] | null
          file_url: string
          id?: string
          mime_type?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          applicant_id?: string
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: Database["public"]["Enums"]["file_type"] | null
          file_url?: string
          id?: string
          mime_type?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_files_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applicant_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applicant_references: {
        Row: {
          applicant_id: string
          company: string | null
          created_at: string | null
          designation: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          relationship: string | null
        }
        Insert: {
          applicant_id: string
          company?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          relationship?: string | null
        }
        Update: {
          applicant_id?: string
          company?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_references_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      applicant_search_index: {
        Row: {
          applicant_id: string
          combined_text: unknown
          current_ctc: number | null
          education_level: string | null
          education_text: string | null
          expected_ctc: number | null
          experience_text: string | null
          experience_years: number | null
          has_resume: boolean | null
          is_actively_looking: boolean | null
          location_city: string | null
          notice_period_days: number | null
          profile_complete_percent: number | null
          profile_visibility: string | null
          skills_text: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_id: string
          combined_text: unknown
          current_ctc?: number | null
          education_level?: string | null
          education_text?: string | null
          expected_ctc?: number | null
          experience_text?: string | null
          experience_years?: number | null
          has_resume?: boolean | null
          is_actively_looking?: boolean | null
          location_city?: string | null
          notice_period_days?: number | null
          profile_complete_percent?: number | null
          profile_visibility?: string | null
          skills_text?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string
          combined_text?: unknown
          current_ctc?: number | null
          education_level?: string | null
          education_text?: string | null
          expected_ctc?: number | null
          experience_text?: string | null
          experience_years?: number | null
          has_resume?: boolean | null
          is_actively_looking?: boolean | null
          location_city?: string | null
          notice_period_days?: number | null
          profile_complete_percent?: number | null
          profile_visibility?: string | null
          skills_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_search_index_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: true
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      applicant_skills: {
        Row: {
          applicant_id: string
          created_at: string | null
          id: string
          skill_level: Database["public"]["Enums"]["skill_level"] | null
          skill_name: string
          skill_type: Database["public"]["Enums"]["skill_type"] | null
          updated_at: string | null
          years_of_experience: number | null
        }
        Insert: {
          applicant_id: string
          created_at?: string | null
          id?: string
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          skill_name: string
          skill_type?: Database["public"]["Enums"]["skill_type"] | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Update: {
          applicant_id?: string
          created_at?: string | null
          id?: string
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          skill_name?: string
          skill_type?: Database["public"]["Enums"]["skill_type"] | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_skills_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      applicants: {
        Row: {
          alternate_phone: string | null
          applicant_number: string | null
          availability: string | null
          city: string
          city_current_location: string | null
          client_id: string | null
          communication: string | null
          contact: string | null
          course_degree: string | null
          course_degree_name: string | null
          created_at: string | null
          current_company: string | null
          current_ctc: string | null
          current_designation: string | null
          date: string | null
          date_of_birth: string | null
          deleted_at: string | null
          differently_abled: boolean | null
          education: string | null
          education_board: string | null
          education_level: string | null
          email: string
          email_address: string | null
          exp_ctc: string | null
          expected_ctc: string | null
          experience_type: string | null
          father_name: string | null
          gender: string | null
          github_url: string | null
          headline: string | null
          highest_qualification: string | null
          id: string
          industry_preferences: string[] | null
          is_actively_looking: boolean | null
          is_deleted: boolean | null
          is_old_applicant: boolean | null
          is_verified: boolean | null
          job_role: string | null
          key_skills: string | null
          languages_known: Json | null
          last_profile_updated_at: string | null
          linkedin_url: string | null
          marital_status: string | null
          medium: string | null
          medium_of_study: string | null
          mobile_number: string | null
          name: string
          notice_period: string | null
          open_to_relocate: boolean | null
          otp_verified: boolean | null
          passing_year: number | null
          percentage: string | null
          phone: string
          portfolio_url: string | null
          preferred_job_types: string[] | null
          preferred_locations: string[] | null
          profile_complete_percent: number | null
          profile_image: string | null
          profile_views_count: number | null
          profile_visibility:
            | Database["public"]["Enums"]["profile_visibility"]
            | null
          projects: Json | null
          registration_date: string | null
          remarks: string | null
          resume_file: string | null
          search_appearance_count: number | null
          shortlist_count: number | null
          skill: string | null
          skill_job_role_applying_for: string | null
          status: Database["public"]["Enums"]["applicant_status"] | null
          summary: string | null
          total_experience: string | null
          total_experience_numbers: string | null
          total_experience_years: number | null
          university: string | null
          university_institute_name: string | null
          updated_at: string | null
          upload_cv_any_format: string | null
          user_id: string | null
          verification_date: string | null
          verified: boolean | null
          verified_by: string | null
          work_experience: string | null
          work_mode_preferences: string[] | null
          year_of_passing: string | null
        }
        Insert: {
          alternate_phone?: string | null
          applicant_number?: string | null
          availability?: string | null
          city: string
          city_current_location?: string | null
          client_id?: string | null
          communication?: string | null
          contact?: string | null
          course_degree?: string | null
          course_degree_name?: string | null
          created_at?: string | null
          current_company?: string | null
          current_ctc?: string | null
          current_designation?: string | null
          date?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          differently_abled?: boolean | null
          education?: string | null
          education_board?: string | null
          education_level?: string | null
          email: string
          email_address?: string | null
          exp_ctc?: string | null
          expected_ctc?: string | null
          experience_type?: string | null
          father_name?: string | null
          gender?: string | null
          github_url?: string | null
          headline?: string | null
          highest_qualification?: string | null
          id?: string
          industry_preferences?: string[] | null
          is_actively_looking?: boolean | null
          is_deleted?: boolean | null
          is_old_applicant?: boolean | null
          is_verified?: boolean | null
          job_role?: string | null
          key_skills?: string | null
          languages_known?: Json | null
          last_profile_updated_at?: string | null
          linkedin_url?: string | null
          marital_status?: string | null
          medium?: string | null
          medium_of_study?: string | null
          mobile_number?: string | null
          name: string
          notice_period?: string | null
          open_to_relocate?: boolean | null
          otp_verified?: boolean | null
          passing_year?: number | null
          percentage?: string | null
          phone: string
          portfolio_url?: string | null
          preferred_job_types?: string[] | null
          preferred_locations?: string[] | null
          profile_complete_percent?: number | null
          profile_image?: string | null
          profile_views_count?: number | null
          profile_visibility?:
            | Database["public"]["Enums"]["profile_visibility"]
            | null
          projects?: Json | null
          registration_date?: string | null
          remarks?: string | null
          resume_file?: string | null
          search_appearance_count?: number | null
          shortlist_count?: number | null
          skill?: string | null
          skill_job_role_applying_for?: string | null
          status?: Database["public"]["Enums"]["applicant_status"] | null
          summary?: string | null
          total_experience?: string | null
          total_experience_numbers?: string | null
          total_experience_years?: number | null
          university?: string | null
          university_institute_name?: string | null
          updated_at?: string | null
          upload_cv_any_format?: string | null
          user_id?: string | null
          verification_date?: string | null
          verified?: boolean | null
          verified_by?: string | null
          work_experience?: string | null
          work_mode_preferences?: string[] | null
          year_of_passing?: string | null
        }
        Update: {
          alternate_phone?: string | null
          applicant_number?: string | null
          availability?: string | null
          city?: string
          city_current_location?: string | null
          client_id?: string | null
          communication?: string | null
          contact?: string | null
          course_degree?: string | null
          course_degree_name?: string | null
          created_at?: string | null
          current_company?: string | null
          current_ctc?: string | null
          current_designation?: string | null
          date?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          differently_abled?: boolean | null
          education?: string | null
          education_board?: string | null
          education_level?: string | null
          email?: string
          email_address?: string | null
          exp_ctc?: string | null
          expected_ctc?: string | null
          experience_type?: string | null
          father_name?: string | null
          gender?: string | null
          github_url?: string | null
          headline?: string | null
          highest_qualification?: string | null
          id?: string
          industry_preferences?: string[] | null
          is_actively_looking?: boolean | null
          is_deleted?: boolean | null
          is_old_applicant?: boolean | null
          is_verified?: boolean | null
          job_role?: string | null
          key_skills?: string | null
          languages_known?: Json | null
          last_profile_updated_at?: string | null
          linkedin_url?: string | null
          marital_status?: string | null
          medium?: string | null
          medium_of_study?: string | null
          mobile_number?: string | null
          name?: string
          notice_period?: string | null
          open_to_relocate?: boolean | null
          otp_verified?: boolean | null
          passing_year?: number | null
          percentage?: string | null
          phone?: string
          portfolio_url?: string | null
          preferred_job_types?: string[] | null
          preferred_locations?: string[] | null
          profile_complete_percent?: number | null
          profile_image?: string | null
          profile_views_count?: number | null
          profile_visibility?:
            | Database["public"]["Enums"]["profile_visibility"]
            | null
          projects?: Json | null
          registration_date?: string | null
          remarks?: string | null
          resume_file?: string | null
          search_appearance_count?: number | null
          shortlist_count?: number | null
          skill?: string | null
          skill_job_role_applying_for?: string | null
          status?: Database["public"]["Enums"]["applicant_status"] | null
          summary?: string | null
          total_experience?: string | null
          total_experience_numbers?: string | null
          total_experience_years?: number | null
          university?: string | null
          university_institute_name?: string | null
          updated_at?: string | null
          upload_cv_any_format?: string | null
          user_id?: string | null
          verification_date?: string | null
          verified?: boolean | null
          verified_by?: string | null
          work_experience?: string | null
          work_mode_preferences?: string[] | null
          year_of_passing?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applicants_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      boards: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          city_type: string | null
          created_at: string | null
          district_id: string | null
          id: string
          is_verified: boolean | null
          name: string
          state_id: string
          updated_at: string | null
        }
        Insert: {
          city_type?: string | null
          created_at?: string | null
          district_id?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          state_id: string
          updated_at?: string | null
        }
        Update: {
          city_type?: string | null
          created_at?: string | null
          district_id?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          state_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cities_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      client_applicant_access: {
        Row: {
          applicant_id: string
          client_id: string
          created_at: string | null
          expires_at: string | null
          granted_by: string | null
          id: string
          source_id: string | null
        }
        Insert: {
          applicant_id: string
          client_id: string
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          source_id?: string | null
        }
        Update: {
          applicant_id?: string
          client_id?: string
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_applicant_access_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_applicant_access_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_applicant_access_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_team_members: {
        Row: {
          client_id: string
          id: string
          invite_token: string | null
          invited_at: string | null
          invited_by: string | null
          is_active: boolean | null
          joined_at: string | null
          role: Database["public"]["Enums"]["team_member_role"] | null
          status: string | null
          user_id: string
        }
        Insert: {
          client_id: string
          id?: string
          invite_token?: string | null
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_member_role"] | null
          status?: string | null
          user_id: string
        }
        Update: {
          client_id?: string
          id?: string
          invite_token?: string | null
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_member_role"] | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_team_members_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          company_description: string | null
          company_logo_url: string | null
          company_name: string
          company_size: Database["public"]["Enums"]["company_size"] | null
          company_slug: string | null
          company_website: string | null
          contact_email: string | null
          contact_person: string | null
          contact_person_name: string | null
          contact_phone: string | null
          created_at: string | null
          cv_downloads_used_this_month: number | null
          email: string
          founded_year: number | null
          gst_number: string | null
          headquarters_city: string | null
          headquarters_state: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          job_postings_used: number | null
          max_applicants: number | null
          max_cv_downloads_per_month: number | null
          max_job_postings: number | null
          max_saved_searches: number | null
          max_team_members: number | null
          notes: string | null
          payment_date: string | null
          payment_id: string | null
          phone: string | null
          slug: string | null
          subscription_end_date: string | null
          subscription_plan: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          trial_end_date: string | null
          updated_at: string | null
          used_applicants: number | null
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          company_description?: string | null
          company_logo_url?: string | null
          company_name: string
          company_size?: Database["public"]["Enums"]["company_size"] | null
          company_slug?: string | null
          company_website?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_person_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          cv_downloads_used_this_month?: number | null
          email: string
          founded_year?: number | null
          gst_number?: string | null
          headquarters_city?: string | null
          headquarters_state?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          job_postings_used?: number | null
          max_applicants?: number | null
          max_cv_downloads_per_month?: number | null
          max_job_postings?: number | null
          max_saved_searches?: number | null
          max_team_members?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_id?: string | null
          phone?: string | null
          slug?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          used_applicants?: number | null
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          company_description?: string | null
          company_logo_url?: string | null
          company_name?: string
          company_size?: Database["public"]["Enums"]["company_size"] | null
          company_slug?: string | null
          company_website?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_person_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          cv_downloads_used_this_month?: number | null
          email?: string
          founded_year?: number | null
          gst_number?: string | null
          headquarters_city?: string | null
          headquarters_state?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          job_postings_used?: number | null
          max_applicants?: number | null
          max_cv_downloads_per_month?: number | null
          max_job_postings?: number | null
          max_saved_searches?: number | null
          max_team_members?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_id?: string | null
          phone?: string | null
          slug?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          used_applicants?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          last_message_at: string | null
          last_message_preview: string | null
          participant_ids: string[] | null
          participant1_id: string
          participant2_id: string
          subject: string | null
          type: string | null
          unread_count_participant1: number | null
          unread_count_participant2: number | null
          unread_counts: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          last_message_at?: string | null
          last_message_preview?: string | null
          participant_ids?: string[] | null
          participant1_id: string
          participant2_id: string
          subject?: string | null
          type?: string | null
          unread_count_participant1?: number | null
          unread_count_participant2?: number | null
          unread_counts?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          last_message_at?: string | null
          last_message_preview?: string | null
          participant_ids?: string[] | null
          participant1_id?: string
          participant2_id?: string
          subject?: string | null
          type?: string | null
          unread_count_participant1?: number | null
          unread_count_participant2?: number | null
          unread_counts?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant1_id_fkey"
            columns: ["participant1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant2_id_fkey"
            columns: ["participant2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          degree_id: string | null
          id: string
          is_verified: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          degree_id?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          degree_id?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_degree_id_fkey"
            columns: ["degree_id"]
            isOneToOne: false
            referencedRelation: "degrees"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_download_log: {
        Row: {
          applicant_id: string
          client_id: string
          downloaded_at: string | null
          downloaded_by: string
          id: string
        }
        Insert: {
          applicant_id: string
          client_id: string
          downloaded_at?: string | null
          downloaded_by: string
          id?: string
        }
        Update: {
          applicant_id?: string
          client_id?: string
          downloaded_at?: string | null
          downloaded_by?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_download_log_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cv_download_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cv_download_log_downloaded_by_fkey"
            columns: ["downloaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      degrees: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      districts: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          name: string
          state_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          state_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          state_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "districts_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          address: string | null
          city_id: string | null
          created_at: string | null
          district_id: string | null
          id: string
          institution_type: string | null
          is_verified: boolean | null
          name: string
          state_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city_id?: string | null
          created_at?: string | null
          district_id?: string | null
          id?: string
          institution_type?: string | null
          is_verified?: boolean | null
          name: string
          state_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city_id?: string | null
          created_at?: string | null
          district_id?: string | null
          id?: string
          institution_type?: string | null
          is_verified?: boolean | null
          name?: string
          state_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutions_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institutions_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institutions_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      job_alerts: {
        Row: {
          applicant_id: string
          cities: string[] | null
          created_at: string | null
          experience_max: number | null
          experience_min: number | null
          frequency: Database["public"]["Enums"]["job_alert_frequency"] | null
          id: string
          is_active: boolean | null
          job_type: string | null
          keywords: string[] | null
          last_sent_at: string | null
        }
        Insert: {
          applicant_id: string
          cities?: string[] | null
          created_at?: string | null
          experience_max?: number | null
          experience_min?: number | null
          frequency?: Database["public"]["Enums"]["job_alert_frequency"] | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          keywords?: string[] | null
          last_sent_at?: string | null
        }
        Update: {
          applicant_id?: string
          cities?: string[] | null
          created_at?: string | null
          experience_max?: number | null
          experience_min?: number | null
          frequency?: Database["public"]["Enums"]["job_alert_frequency"] | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          keywords?: string[] | null
          last_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_alerts_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      job_application_events: {
        Row: {
          application_id: string
          changed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
        }
        Insert: {
          application_id: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          application_id?: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_application_events_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_application_events_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_application_stages: {
        Row: {
          application_id: string
          changed_at: string | null
          changed_by: string | null
          id: string
          notes: string | null
          stage: Database["public"]["Enums"]["application_stage"]
        }
        Insert: {
          application_id: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          notes?: string | null
          stage: Database["public"]["Enums"]["application_stage"]
        }
        Update: {
          application_id?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          notes?: string | null
          stage?: Database["public"]["Enums"]["application_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "job_application_stages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_application_stages_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applicant_id: string
          applicant_resume_url: string | null
          applied_at: string | null
          cover_letter: string | null
          current_stage: Database["public"]["Enums"]["application_stage"] | null
          id: string
          job_id: string
          notes: string | null
          rating: number | null
          recruiter_notes: string | null
          stage_updated_at: string | null
          stage_updated_by: string | null
        }
        Insert: {
          applicant_id: string
          applicant_resume_url?: string | null
          applied_at?: string | null
          cover_letter?: string | null
          current_stage?:
            | Database["public"]["Enums"]["application_stage"]
            | null
          id?: string
          job_id: string
          notes?: string | null
          rating?: number | null
          recruiter_notes?: string | null
          stage_updated_at?: string | null
          stage_updated_by?: string | null
        }
        Update: {
          applicant_id?: string
          applicant_resume_url?: string | null
          applied_at?: string | null
          cover_letter?: string | null
          current_stage?:
            | Database["public"]["Enums"]["application_stage"]
            | null
          id?: string
          job_id?: string
          notes?: string | null
          rating?: number | null
          recruiter_notes?: string | null
          stage_updated_at?: string | null
          stage_updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_stage_updated_by_fkey"
            columns: ["stage_updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          applications_count: number | null
          city: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          education_required: string | null
          experience_level: string | null
          experience_max: number | null
          experience_min: number | null
          featured_until: string | null
          id: string
          is_featured: boolean | null
          is_salary_disclosed: boolean | null
          job_type: Database["public"]["Enums"]["job_type_enum"] | null
          location: string | null
          openings: number | null
          posted_by: string
          published_at: string | null
          required_skills: string | null
          requirements: string | null
          responsibilities: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_range: string | null
          skills_required: string[] | null
          slug: string | null
          state: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string | null
          views_count: number | null
          work_mode: Database["public"]["Enums"]["work_mode_enum"] | null
        }
        Insert: {
          application_deadline?: string | null
          applications_count?: number | null
          city?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          education_required?: string | null
          experience_level?: string | null
          experience_max?: number | null
          experience_min?: number | null
          featured_until?: string | null
          id?: string
          is_featured?: boolean | null
          is_salary_disclosed?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type_enum"] | null
          location?: string | null
          openings?: number | null
          posted_by: string
          published_at?: string | null
          required_skills?: string | null
          requirements?: string | null
          responsibilities?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_range?: string | null
          skills_required?: string[] | null
          slug?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
          work_mode?: Database["public"]["Enums"]["work_mode_enum"] | null
        }
        Update: {
          application_deadline?: string | null
          applications_count?: number | null
          city?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          education_required?: string | null
          experience_level?: string | null
          experience_max?: number | null
          experience_min?: number | null
          featured_until?: string | null
          id?: string
          is_featured?: boolean | null
          is_salary_disclosed?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type_enum"] | null
          location?: string | null
          openings?: number | null
          posted_by?: string
          published_at?: string | null
          required_skills?: string | null
          requirements?: string | null
          responsibilities?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_range?: string | null
          skills_required?: string[] | null
          slug?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
          work_mode?: Database["public"]["Enums"]["work_mode_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          conversation_id: string
          created_at: string | null
          from_user_id: string
          id: string
          is_read: boolean | null
          is_system_notification: boolean | null
          message: string
          read_at: string | null
          to_user_id: string
        }
        Insert: {
          attachment_url?: string | null
          conversation_id: string
          created_at?: string | null
          from_user_id: string
          id?: string
          is_read?: boolean | null
          is_system_notification?: boolean | null
          message: string
          read_at?: string | null
          to_user_id: string
        }
        Update: {
          attachment_url?: string | null
          conversation_id?: string
          created_at?: string | null
          from_user_id?: string
          id?: string
          is_read?: boolean | null
          is_system_notification?: boolean | null
          message?: string
          read_at?: string | null
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
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
      profile_views: {
        Row: {
          applicant_id: string
          id: string
          view_date: string | null
          viewed_at: string | null
          viewer_id: string
          viewer_type: Database["public"]["Enums"]["viewer_type"]
        }
        Insert: {
          applicant_id: string
          id?: string
          view_date?: string | null
          viewed_at?: string | null
          viewer_id: string
          viewer_type: Database["public"]["Enums"]["viewer_type"]
        }
        Update: {
          applicant_id?: string
          id?: string
          view_date?: string | null
          viewed_at?: string | null
          viewer_id?: string
          viewer_type?: Database["public"]["Enums"]["viewer_type"]
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          applicant_id: string | null
          avatar_url: string | null
          client_id: string | null
          created_at: string | null
          deactivated_at: string | null
          display_name: string | null
          email: string
          full_name: string | null
          headline: string | null
          id: string
          is_active: boolean | null
          is_old_applicant: boolean | null
          key_skills: string | null
          last_login_at: string | null
          last_login_ip: string | null
          location: string | null
          login_count: number | null
          must_change_password: boolean | null
          notification_preferences: Json | null
          password_changed: boolean | null
          phone: string | null
          profile_complete_percent: number | null
          profile_image: string | null
          resume_file: string | null
          role: Database["public"]["Enums"]["user_role"]
          summary: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_id?: string | null
          avatar_url?: string | null
          client_id?: string | null
          created_at?: string | null
          deactivated_at?: string | null
          display_name?: string | null
          email: string
          full_name?: string | null
          headline?: string | null
          id: string
          is_active?: boolean | null
          is_old_applicant?: boolean | null
          key_skills?: string | null
          last_login_at?: string | null
          last_login_ip?: string | null
          location?: string | null
          login_count?: number | null
          must_change_password?: boolean | null
          notification_preferences?: Json | null
          password_changed?: boolean | null
          phone?: string | null
          profile_complete_percent?: number | null
          profile_image?: string | null
          resume_file?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          summary?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string | null
          avatar_url?: string | null
          client_id?: string | null
          created_at?: string | null
          deactivated_at?: string | null
          display_name?: string | null
          email?: string
          full_name?: string | null
          headline?: string | null
          id?: string
          is_active?: boolean | null
          is_old_applicant?: boolean | null
          key_skills?: string | null
          last_login_at?: string | null
          last_login_ip?: string | null
          location?: string | null
          login_count?: number | null
          must_change_password?: boolean | null
          notification_preferences?: Json | null
          password_changed?: boolean | null
          phone?: string | null
          profile_complete_percent?: number | null
          profile_image?: string | null
          resume_file?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          summary?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          applicant_id: string
          id: string
          job_id: string
          saved_at: string | null
        }
        Insert: {
          applicant_id: string
          id?: string
          job_id: string
          saved_at?: string | null
        }
        Update: {
          applicant_id?: string
          id?: string
          job_id?: string
          saved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          alert_frequency: Database["public"]["Enums"]["alert_frequency"] | null
          client_id: string
          created_at: string | null
          filters: Json
          id: string
          last_run_at: string | null
          name: string
        }
        Insert: {
          alert_frequency?:
            | Database["public"]["Enums"]["alert_frequency"]
            | null
          client_id: string
          created_at?: string | null
          filters?: Json
          id?: string
          last_run_at?: string | null
          name: string
        }
        Update: {
          alert_frequency?:
            | Database["public"]["Enums"]["alert_frequency"]
            | null
          client_id?: string
          created_at?: string | null
          filters?: Json
          id?: string
          last_run_at?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlist_items: {
        Row: {
          added_at: string | null
          applicant_id: string
          id: string
          notes: string | null
          shortlist_id: string
        }
        Insert: {
          added_at?: string | null
          applicant_id: string
          id?: string
          notes?: string | null
          shortlist_id: string
        }
        Update: {
          added_at?: string | null
          applicant_id?: string
          id?: string
          notes?: string | null
          shortlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shortlist_items_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shortlist_items_shortlist_id_fkey"
            columns: ["shortlist_id"]
            isOneToOne: false
            referencedRelation: "shortlists"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlist_shares: {
        Row: {
          can_edit: boolean | null
          created_at: string | null
          id: string
          shared_by: string
          shared_with_client_id: string
          shortlist_id: string
        }
        Insert: {
          can_edit?: boolean | null
          created_at?: string | null
          id?: string
          shared_by: string
          shared_with_client_id: string
          shortlist_id: string
        }
        Update: {
          can_edit?: boolean | null
          created_at?: string | null
          id?: string
          shared_by?: string
          shared_with_client_id?: string
          shortlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shortlist_shares_shared_by_fkey"
            columns: ["shared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shortlist_shares_shared_with_client_id_fkey"
            columns: ["shared_with_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shortlist_shares_shortlist_id_fkey"
            columns: ["shortlist_id"]
            isOneToOne: false
            referencedRelation: "shortlists"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlists: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_shared: boolean | null
          name: string
          owner_id: string
          owner_type: string
          shared_token: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_shared?: boolean | null
          name: string
          owner_id: string
          owner_type: string
          shared_token?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_shared?: boolean | null
          name?: string
          owner_id?: string
          owner_type?: string
          shared_token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shortlists_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          can_bulk_download: boolean | null
          can_export_excel: boolean | null
          can_see_contact_details: boolean | null
          created_at: string | null
          display_name: string
          features: Json | null
          id: string
          is_active: boolean | null
          max_cv_downloads: number | null
          max_job_postings: number | null
          max_saved_searches: number | null
          max_team_members: number | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
        }
        Insert: {
          can_bulk_download?: boolean | null
          can_export_excel?: boolean | null
          can_see_contact_details?: boolean | null
          created_at?: string | null
          display_name: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_cv_downloads?: number | null
          max_job_postings?: number | null
          max_saved_searches?: number | null
          max_team_members?: number | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
        }
        Update: {
          can_bulk_download?: boolean | null
          can_export_excel?: boolean | null
          can_see_contact_details?: boolean | null
          created_at?: string | null
          display_name?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_cv_downloads?: number | null
          max_job_postings?: number | null
          max_saved_searches?: number | null
          max_team_members?: number | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
        }
        Relationships: []
      }
      subscription_transactions: {
        Row: {
          amount: number
          client_id: string
          created_at: string | null
          currency: string | null
          id: string
          invoice_number: string | null
          payment_gateway: string | null
          payment_id: string | null
          period_end: string | null
          period_start: string | null
          plan_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_number?: string | null
          payment_gateway?: string | null
          payment_id?: string | null
          period_end?: string | null
          period_start?: string | null
          plan_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_number?: string | null
          payment_gateway?: string | null
          payment_id?: string | null
          period_end?: string | null
          period_start?: string | null
          plan_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_transactions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_board: { Args: { p_board_name: string }; Returns: string }
      add_city: {
        Args: {
          p_city_type?: string
          p_district_id?: string
          p_name: string
          p_state_id: string
        }
        Returns: string
      }
      add_course: {
        Args: { p_category?: string; p_degree_id?: string; p_name: string }
        Returns: string
      }
      add_institution: {
        Args: {
          p_address?: string
          p_city_id?: string
          p_district_id?: string
          p_name: string
          p_state_id?: string
          p_type?: string
          p_university_id?: string
        }
        Returns: string
      }
      admin_import_applicant_row: { Args: { p_row: Json }; Returns: Json }
      calculate_profile_completion: {
        Args: { applicant_uuid: string }
        Returns: number
      }
      check_cv_download_limit: {
        Args: { p_client_id: string }
        Returns: boolean
      }
      create_notification: {
        Args: {
          p_body?: string
          p_link?: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      ensure_profile_from_auth: {
        Args: never
        Returns: {
          applicant_id: string | null
          avatar_url: string | null
          client_id: string | null
          created_at: string | null
          deactivated_at: string | null
          display_name: string | null
          email: string
          full_name: string | null
          headline: string | null
          id: string
          is_active: boolean | null
          is_old_applicant: boolean | null
          key_skills: string | null
          last_login_at: string | null
          last_login_ip: string | null
          location: string | null
          login_count: number | null
          must_change_password: boolean | null
          notification_preferences: Json | null
          password_changed: boolean | null
          phone: string | null
          profile_complete_percent: number | null
          profile_image: string | null
          resume_file: string | null
          role: Database["public"]["Enums"]["user_role"]
          summary: string | null
          timezone: string | null
          updated_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      finalize_client_signup: {
        Args: {
          p_company_name: string
          p_contact_person?: string
          p_phone?: string
        }
        Returns: Json
      }
      get_applicant_number_sequence: { Args: never; Returns: unknown }
      increment_profile_views: {
        Args: {
          p_applicant_id: string
          p_viewer_id: string
          p_viewer_type: Database["public"]["Enums"]["viewer_type"]
        }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_user: { Args: never; Returns: boolean }
      normalize_education_level: { Args: { raw: string }; Returns: string }
      parse_ctc_lpa: { Args: { raw: string }; Returns: number }
      parse_experience_years: { Args: { raw: string }; Returns: number }
      parse_notice_period_days: { Args: { raw: string }; Returns: number }
      get_resdex_applicant_profile: {
        Args: { p_applicant_id: string }
        Returns: Json
      }
      refresh_applicant_search_index: {
        Args: { p_applicant_id: string }
        Returns: undefined
      }
      safe_insert_applicant: {
        Args: {
          p_city: string
          p_communication?: string
          p_email: string
          p_job_role?: string
          p_name: string
          p_phone: string
          p_status?: Database["public"]["Enums"]["applicant_status"]
          p_user_id: string
        }
        Returns: {
          applicant_number: string
          id: string
        }[]
      }
      search_applicants: {
        Args: {
          p_cities?: string[]
          p_client_id?: string
          p_companies?: string[]
          p_current_ctc_max?: number
          p_current_ctc_min?: number
          p_education_levels?: string[]
          p_expected_ctc_max?: number
          p_expected_ctc_min?: number
          p_experience_max?: number
          p_experience_min?: number
          p_experience_type?: string
          p_gender?: string
          p_has_resume?: boolean
          p_is_actively_looking?: boolean
          p_is_old_applicant?: boolean
          p_is_verified?: boolean
          p_job_roles?: string[]
          p_limit?: number
          p_notice_period_days?: number[]
          p_offset?: number
          p_page?: number
          p_page_size?: number
          p_profile_complete_max?: number
          p_profile_complete_min?: number
          p_registered_after?: string
          p_skills?: string[]
          p_sort_dir?: string
          p_sort_field?: string
          p_sort_order?: string
          p_status?: string[]
          p_tsquery?: string
          p_updated_after?: string
          p_year_of_passing_max?: number
          p_year_of_passing_min?: number
        }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      access_source: "job" | "folder" | "manual"
      achievement_type:
        | "certification"
        | "award"
        | "publication"
        | "patent"
        | "course"
      alert_frequency: "none" | "daily" | "weekly"
      applicant_status:
        | "submitted"
        | "under_review"
        | "shortlisted"
        | "rejected"
        | "hired"
        | "on_hold"
      application_stage:
        | "applied"
        | "screening"
        | "shortlisted"
        | "interview_scheduled"
        | "interviewed"
        | "offer"
        | "rejected"
        | "withdrawn"
      communication_rating: "excellent" | "good" | "average" | "poor"
      company_size: "startup" | "small" | "medium" | "large" | "enterprise"
      employment_type:
        | "full-time"
        | "part-time"
        | "contract"
        | "internship"
        | "freelance"
      file_type: "resume" | "profile_image" | "certificate" | "other"
      job_alert_frequency: "daily" | "weekly"
      job_application_status:
        | "applied"
        | "shortlisted"
        | "rejected"
        | "interviewed"
        | "hired"
      job_status: "active" | "inactive" | "closed" | "draft"
      job_type_enum:
        | "full_time"
        | "part_time"
        | "contract"
        | "internship"
        | "freelance"
      payment_status: "pending" | "success" | "failed" | "refunded"
      profile_visibility: "public" | "private" | "clients_only"
      skill_level: "beginner" | "intermediate" | "advanced" | "expert"
      skill_type: "technical" | "soft" | "language" | "certification"
      subscription_plan_type: "free" | "basic" | "professional" | "enterprise"
      subscription_status_type:
        | "trial"
        | "active"
        | "expired"
        | "cancelled"
        | "suspended"
      team_member_role: "owner" | "admin" | "member"
      user_role: "applicant" | "client" | "admin" | "user"
      viewer_type: "admin" | "client"
      work_mode_enum: "onsite" | "remote" | "hybrid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_source: ["job", "folder", "manual"],
      achievement_type: [
        "certification",
        "award",
        "publication",
        "patent",
        "course",
      ],
      alert_frequency: ["none", "daily", "weekly"],
      applicant_status: [
        "submitted",
        "under_review",
        "shortlisted",
        "rejected",
        "hired",
        "on_hold",
      ],
      application_stage: [
        "applied",
        "screening",
        "shortlisted",
        "interview_scheduled",
        "interviewed",
        "offer",
        "rejected",
        "withdrawn",
      ],
      communication_rating: ["excellent", "good", "average", "poor"],
      company_size: ["startup", "small", "medium", "large", "enterprise"],
      employment_type: [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "freelance",
      ],
      file_type: ["resume", "profile_image", "certificate", "other"],
      job_alert_frequency: ["daily", "weekly"],
      job_application_status: [
        "applied",
        "shortlisted",
        "rejected",
        "interviewed",
        "hired",
      ],
      job_status: ["active", "inactive", "closed", "draft"],
      job_type_enum: [
        "full_time",
        "part_time",
        "contract",
        "internship",
        "freelance",
      ],
      payment_status: ["pending", "success", "failed", "refunded"],
      profile_visibility: ["public", "private", "clients_only"],
      skill_level: ["beginner", "intermediate", "advanced", "expert"],
      skill_type: ["technical", "soft", "language", "certification"],
      subscription_plan_type: ["free", "basic", "professional", "enterprise"],
      subscription_status_type: [
        "trial",
        "active",
        "expired",
        "cancelled",
        "suspended",
      ],
      team_member_role: ["owner", "admin", "member"],
      user_role: ["applicant", "client", "admin", "user"],
      viewer_type: ["admin", "client"],
      work_mode_enum: ["onsite", "remote", "hybrid"],
    },
  },
} as const

// —— Convenience aliases (use Tables<T> / Enums<T> for new code) ——
export type Profile = Tables<"profiles">
export type ProfileInsert = TablesInsert<"profiles">
export type ProfileUpdate = TablesUpdate<"profiles">
export type Applicant = Tables<"applicants">
export type ApplicantInsert = TablesInsert<"applicants">
export type ApplicantUpdate = TablesUpdate<"applicants">
export type Client = Tables<"clients">
export type ClientInsert = TablesInsert<"clients">
export type ClientUpdate = TablesUpdate<"clients">
export type Job = Tables<"jobs">
export type JobApplication = Tables<"job_applications">
export type Shortlist = Tables<"shortlists">
export type ShortlistItem = Tables<"shortlist_items">
export type AuditLog = Tables<"audit_logs">
export type Notification = Tables<"notifications">
export type UserRole = Enums<"user_role">
export type ApplicantStatus = Enums<"applicant_status">
export type ApplicationStage = Enums<"application_stage">
export type JobStatus = Enums<"job_status">
export type ProfileVisibility = Enums<"profile_visibility">
