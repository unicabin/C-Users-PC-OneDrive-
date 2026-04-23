export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      forklifts: {
        Row: {
          id: string;
          vehicle_number: string;
          model: string;
          year: string;
          price: string;
          status: string;
          note: string;
          organization_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          vehicle_number: string;
          model: string;
          year: string;
          price: string;
          status: string;
          note: string;
          organization_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_number?: string;
          model?: string;
          year?: string;
          price?: string;
          status?: string;
          note?: string;
          organization_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          company: string;
          region: string;
          interest_model: string;
          status: string;
          memo: string;
          organization_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone: string;
          company: string;
          region: string;
          interest_model: string;
          status: string;
          memo: string;
          organization_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          company?: string;
          region?: string;
          interest_model?: string;
          status?: string;
          memo?: string;
          organization_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      consultations: {
        Row: {
          id: string;
          customer_id: string;
          customer_name: string;
          phone: string;
          company: string;
          forklift_id: string;
          model: string;
          consult_date: string;
          status: string;
          note: string;
          converted_to_shipment: boolean;
          organization_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          customer_id: string;
          customer_name: string;
          phone: string;
          company: string;
          forklift_id: string;
          model: string;
          consult_date: string;
          status: string;
          note: string;
          converted_to_shipment?: boolean;
          organization_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          customer_name?: string;
          phone?: string;
          company?: string;
          forklift_id?: string;
          model?: string;
          consult_date?: string;
          status?: string;
          note?: string;
          converted_to_shipment?: boolean;
          organization_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      shipments: {
        Row: {
          id: string;
          forklift_id: string;
          vehicle_number: string;
          customer_id: string;
          customer_name: string;
          shipment_date: string;
          transport_method: string;
          manager: string;
          note: string;
          status: string;
          consultation_id: string | null;
          organization_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          forklift_id: string;
          vehicle_number: string;
          customer_id: string;
          customer_name: string;
          shipment_date: string;
          transport_method: string;
          manager: string;
          note: string;
          status: string;
          consultation_id?: string | null;
          organization_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          forklift_id?: string;
          vehicle_number?: string;
          customer_id?: string;
          customer_name?: string;
          shipment_date?: string;
          transport_method?: string;
          manager?: string;
          note?: string;
          status?: string;
          consultation_id?: string | null;
          organization_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      as_requests: {
        Row: {
          id: string;
          forklift_id: string;
          organization_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          forklift_id: string;
          organization_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          forklift_id?: string;
          organization_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          role: string;
          organization_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          role?: string;
          organization_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          role?: string;
          organization_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
