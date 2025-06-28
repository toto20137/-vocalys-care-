export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'family' | 'municipality' | 'admin';
          subscription_status: 'active' | 'expired' | 'trial';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'family' | 'municipality' | 'admin';
          subscription_status?: 'active' | 'expired' | 'trial';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'family' | 'municipality' | 'admin';
          subscription_status?: 'active' | 'expired' | 'trial';
          updated_at?: string;
        };
      };
      beneficiaries: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          address: string | null;
          emergency_contact: string | null;
          call_schedule: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          address?: string | null;
          emergency_contact?: string | null;
          call_schedule?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string;
          address?: string | null;
          emergency_contact?: string | null;
          call_schedule?: string[] | null;
          updated_at?: string;
        };
      };
      calls: {
        Row: {
          id: string;
          beneficiary_id: string;
          status: 'pending' | 'in_progress' | 'completed' | 'failed';
          started_at: string | null;
          ended_at: string | null;
          duration: number | null;
          elevenlabs_conversation_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          beneficiary_id: string;
          status?: 'pending' | 'in_progress' | 'completed' | 'failed';
          started_at?: string | null;
          ended_at?: string | null;
          duration?: number | null;
          elevenlabs_conversation_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          beneficiary_id?: string;
          status?: 'pending' | 'in_progress' | 'completed' | 'failed';
          started_at?: string | null;
          ended_at?: string | null;
          duration?: number | null;
          elevenlabs_conversation_id?: string | null;
          updated_at?: string;
        };
      };
      summaries: {
        Row: {
          id: string;
          call_id: string;
          summary: string;
          mood: 'positive' | 'neutral' | 'negative';
          alert_level: 'none' | 'low' | 'medium' | 'high' | 'critical';
          keywords: string[] | null;
          health_mentions: string[] | null;
          concerns: string[] | null;
          transcript: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          call_id: string;
          summary: string;
          mood: 'positive' | 'neutral' | 'negative';
          alert_level?: 'none' | 'low' | 'medium' | 'high' | 'critical';
          keywords?: string[] | null;
          health_mentions?: string[] | null;
          concerns?: string[] | null;
          transcript?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          call_id?: string;
          summary?: string;
          mood?: 'positive' | 'neutral' | 'negative';
          alert_level?: 'none' | 'low' | 'medium' | 'high' | 'critical';
          keywords?: string[] | null;
          health_mentions?: string[] | null;
          concerns?: string[] | null;
          transcript?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}