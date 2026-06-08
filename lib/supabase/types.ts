export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "college_admin" | "student" | "super_admin";
export type MembershipStatus = "active" | "pending" | "suspended";
export type DriveStatus = "draft" | "open" | "live" | "closed";
export type ApplicationStatus = "applied" | "in_progress" | "selected" | "rejected" | "withdrawn";
export type AdminRequestStatus = "pending" | "approved" | "rejected";

export type Database = {
  public: {
    Tables: {
      colleges: {
        Row: {
          id: string;
          name: string;
          code: string;
          domain: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          domain?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          domain?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      college_memberships: {
        Row: {
          id: string;
          college_id: string;
          user_id: string;
          role: UserRole;
          status: MembershipStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          user_id: string;
          role: UserRole;
          status?: MembershipStatus;
          created_at?: string;
        };
        Update: {
          role?: UserRole;
          status?: MembershipStatus;
          created_at?: string;
        };
      };
      student_profiles: {
        Row: {
          id: string;
          college_id: string;
          user_id: string;
          branch: string | null;
          batch_year: number | null;
          skills: string[];
          portfolio_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          user_id: string;
          branch?: string | null;
          batch_year?: number | null;
          skills?: string[];
          portfolio_url?: string | null;
          created_at?: string;
        };
        Update: {
          branch?: string | null;
          batch_year?: number | null;
          skills?: string[];
          portfolio_url?: string | null;
        };
      };
      admin_requests: {
        Row: {
          id: string;
          college_id: string;
          user_id: string;
          requested_role: UserRole;
          status: AdminRequestStatus;
          note: string | null;
          decided_by: string | null;
          decided_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          user_id: string;
          requested_role: UserRole;
          status?: AdminRequestStatus;
          note?: string | null;
          decided_by?: string | null;
          decided_at?: string | null;
          created_at?: string;
        };
        Update: {
          requested_role?: UserRole;
          status?: AdminRequestStatus;
          note?: string | null;
          decided_by?: string | null;
          decided_at?: string | null;
        };
      };
      activity_events: {
        Row: {
          id: string;
          college_id: string;
          actor_id: string | null;
          event_type: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          actor_id?: string | null;
          event_type: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          event_type?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
        };
      };
      drives: {
        Row: {
          id: string;
          college_id: string;
          title: string;
          company: string;
          work_type: string;
          location: string | null;
          status: DriveStatus;
          outcome_days: number;
          required_skills: string[];
          closes_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          title: string;
          company: string;
          work_type: string;
          location?: string | null;
          status?: DriveStatus;
          outcome_days?: number;
          required_skills?: string[];
          closes_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          company?: string;
          work_type?: string;
          location?: string | null;
          status?: DriveStatus;
          outcome_days?: number;
          required_skills?: string[];
          closes_at?: string | null;
        };
      };
      drive_phases: {
        Row: {
          id: string;
          drive_id: string;
          name: string;
          position: number;
          is_outcome_phase: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          drive_id: string;
          name: string;
          position: number;
          is_outcome_phase?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          position?: number;
          is_outcome_phase?: boolean;
        };
      };
      resumes: {
        Row: {
          id: string;
          student_id: string;
          college_id: string;
          label: string;
          storage_path: string;
          role_focus: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          college_id: string;
          label: string;
          storage_path: string;
          role_focus?: string | null;
          created_at?: string;
        };
        Update: {
          label?: string;
          storage_path?: string;
          role_focus?: string | null;
        };
      };
      applications: {
        Row: {
          id: string;
          drive_id: string;
          student_id: string;
          resume_id: string | null;
          current_phase_id: string | null;
          status: ApplicationStatus;
          outcome_due_at: string;
          feedback: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          drive_id: string;
          student_id: string;
          resume_id?: string | null;
          current_phase_id?: string | null;
          status?: ApplicationStatus;
          outcome_due_at: string;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          resume_id?: string | null;
          current_phase_id?: string | null;
          status?: ApplicationStatus;
          outcome_due_at?: string;
          feedback?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      join_college_workspace: {
        Args: {
          join_code: string;
          requested_role: UserRole;
        };
        Returns: {
          membership_id: string;
          college_id: string;
          college_name: string;
          role: UserRole;
          status: MembershipStatus;
        }[];
      };
      apply_to_drive: {
        Args: {
          target_drive_id: string;
          selected_resume_id?: string | null;
        };
        Returns: string;
      };
      decide_admin_request: {
        Args: {
          request_id: string;
          decision: AdminRequestStatus;
          decision_note?: string | null;
        };
        Returns: string;
      };
      log_activity: {
        Args: {
          target_college_id: string;
          event_type: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      membership_status: MembershipStatus;
      drive_status: DriveStatus;
      application_status: ApplicationStatus;
      admin_request_status: AdminRequestStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
