// TypeScript types generated from Supabase database schema
// Generated from schema.json

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'applicant' | 'client' | 'admin'
export type ApplicantStatus = 'submitted' | 'shortlisted' | 'rejected' | 'interviewed' | 'hired'
export type CommunicationRating = 'excellent' | 'good' | 'average' | 'poor'
export type QualificationLevel = 'high_school' | 'diploma' | 'bachelor' | 'master' | 'phd'
export type WorkExperienceType = 'fresher' | 'experienced'

export interface Database {
  public: {
    Tables: {
      applicants: {
        Row: {
          id: string
          user_id: string | null
          client_id: string | null
          name: string
          phone: string
          email: string
          city: string
          skill: string | null
          communication: string | null
          job_role: string | null
          education_level: string | null
          education_board: string | null
          medium: string | null
          course_degree: string | null
          university: string | null
          percentage: string | null
          passing_year: number | null
          experience_type: string | null
          total_experience: string | null
          current_company: string | null
          current_designation: string | null
          current_ctc: string | null
          expected_ctc: string | null
          key_skills: string | null
          notice_period: string | null
          availability: string | null
          resume_file: string | null
          profile_image: string | null
          status: string | null
          verified: boolean | null
          otp_verified: boolean | null
          remarks: string | null
          registration_date: string | null
          profile_complete_percent: number | null
          is_deleted: boolean | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          client_id?: string | null
          name: string
          phone: string
          email: string
          city: string
          skill?: string | null
          communication?: string | null
          job_role?: string | null
          education_level?: string | null
          education_board?: string | null
          medium?: string | null
          course_degree?: string | null
          university?: string | null
          percentage?: string | null
          passing_year?: number | null
          experience_type?: string | null
          total_experience?: string | null
          current_company?: string | null
          current_designation?: string | null
          current_ctc?: string | null
          expected_ctc?: string | null
          key_skills?: string | null
          notice_period?: string | null
          availability?: string | null
          resume_file?: string | null
          profile_image?: string | null
          status?: string | null
          verified?: boolean | null
          otp_verified?: boolean | null
          remarks?: string | null
          registration_date?: string | null
          profile_complete_percent?: number | null
          is_deleted?: boolean | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          client_id?: string | null
          name?: string
          phone?: string
          email?: string
          city?: string
          skill?: string | null
          communication?: string | null
          job_role?: string | null
          education_level?: string | null
          education_board?: string | null
          medium?: string | null
          course_degree?: string | null
          university?: string | null
          percentage?: string | null
          passing_year?: number | null
          experience_type?: string | null
          total_experience?: string | null
          current_company?: string | null
          current_designation?: string | null
          current_ctc?: string | null
          expected_ctc?: string | null
          key_skills?: string | null
          notice_period?: string | null
          availability?: string | null
          resume_file?: string | null
          profile_image?: string | null
          status?: string | null
          verified?: boolean | null
          otp_verified?: boolean | null
          remarks?: string | null
          registration_date?: string | null
          profile_complete_percent?: number | null
          is_deleted?: boolean | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string | null
          company_name: string
          contact_person: string | null
          email: string
          phone: string | null
          slug: string | null
          subscription_plan: string
          subscription_status: string | null
          payment_id: string | null
          payment_date: string | null
          subscription_start_date: string
          subscription_end_date: string | null
          max_applicants: number | null
          used_applicants: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_name: string
          contact_person?: string | null
          email: string
          phone?: string | null
          slug?: string | null
          subscription_plan: string
          subscription_status?: string | null
          payment_id?: string | null
          payment_date?: string | null
          subscription_start_date?: string
          subscription_end_date?: string | null
          max_applicants?: number | null
          used_applicants?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          company_name?: string
          contact_person?: string | null
          email?: string
          phone?: string | null
          slug?: string | null
          subscription_plan?: string
          subscription_status?: string | null
          payment_id?: string | null
          payment_date?: string | null
          subscription_start_date?: string
          subscription_end_date?: string | null
          max_applicants?: number | null
          used_applicants?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string | null
          role: UserRole
          client_id: string | null
          applicant_id: string | null
          password_changed: boolean | null
          must_change_password: boolean | null
          is_old_applicant: boolean | null
          display_name: string | null
          headline: string | null
          summary: string | null
          location: string | null
          key_skills: string | null
          resume_file: string | null
          profile_image: string | null
          profile_complete_percent: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          full_name?: string | null
          role?: UserRole
          client_id?: string | null
          applicant_id?: string | null
          password_changed?: boolean | null
          must_change_password?: boolean | null
          is_old_applicant?: boolean | null
          display_name?: string | null
          headline?: string | null
          summary?: string | null
          location?: string | null
          key_skills?: string | null
          resume_file?: string | null
          profile_image?: string | null
          profile_complete_percent?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          full_name?: string | null
          role?: UserRole
          client_id?: string | null
          applicant_id?: string | null
          password_changed?: boolean | null
          must_change_password?: boolean | null
          is_old_applicant?: boolean | null
          display_name?: string | null
          headline?: string | null
          summary?: string | null
          location?: string | null
          key_skills?: string | null
          resume_file?: string | null
          profile_image?: string | null
          profile_complete_percent?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      shortlists: {
        Row: {
          id: string
          owner_id: string
          owner_type: string
          name: string
          description: string | null
          is_shared: boolean | null
          shared_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          owner_type: string
          name: string
          description?: string | null
          is_shared?: boolean | null
          shared_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          owner_type?: string
          name?: string
          description?: string | null
          is_shared?: boolean | null
          shared_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      shortlist_items: {
        Row: {
          id: string
          shortlist_id: string
          applicant_id: string
          notes: string | null
          added_at: string
        }
        Insert: {
          id?: string
          shortlist_id: string
          applicant_id: string
          notes?: string | null
          added_at?: string
        }
        Update: {
          id?: string
          shortlist_id?: string
          applicant_id?: string
          notes?: string | null
          added_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      applicant_status: ApplicantStatus
      communication_rating: CommunicationRating
      qualification_level: QualificationLevel
      work_experience_type: WorkExperienceType
    }
  }
}

// Helper types for easier usage
export type Applicant = Database['public']['Tables']['applicants']['Row']
export type ApplicantInsert = Database['public']['Tables']['applicants']['Insert']
export type ApplicantUpdate = Database['public']['Tables']['applicants']['Update']

export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Shortlist = Database['public']['Tables']['shortlists']['Row']
export type ShortlistInsert = Database['public']['Tables']['shortlists']['Insert']
export type ShortlistUpdate = Database['public']['Tables']['shortlists']['Update']

export type ShortlistItem = Database['public']['Tables']['shortlist_items']['Row']
export type ShortlistItemInsert = Database['public']['Tables']['shortlist_items']['Insert']
export type ShortlistItemUpdate = Database['public']['Tables']['shortlist_items']['Update']













