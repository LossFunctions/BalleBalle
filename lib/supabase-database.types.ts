export type Database = {
  public: {
    CompositeTypes: Record<string, never>;
    Enums: {
      order_status:
        | "checkout_pending"
        | "checkout_created"
        | "checkout_failed"
        | "paid"
        | "canceled"
        | "expired"
        | "refunded";
    };
    Functions: Record<string, never>;
    Tables: {
      inventory_adjustments: {
        Insert: {
          change_quantity: number;
          created_at?: string;
          id?: string;
          note?: string | null;
          product_id: string;
          reason: string;
        };
        Relationships: [];
        Row: {
          change_quantity: number;
          created_at: string;
          id: string;
          note: string | null;
          product_id: string;
          reason: string;
        };
        Update: {
          change_quantity?: number;
          created_at?: string;
          id?: string;
          note?: string | null;
          product_id?: string;
          reason?: string;
        };
      };
      order_items: {
        Insert: {
          created_at?: string;
          id?: string;
          image_src_snapshot: string;
          line_total_cents: number;
          order_id: string;
          product_id: string;
          quantity: number;
          subtitle_snapshot: string;
          title_snapshot: string;
          unit_amount_cents: number;
        };
        Relationships: [];
        Row: {
          created_at: string;
          id: string;
          image_src_snapshot: string;
          line_total_cents: number;
          order_id: string;
          product_id: string;
          quantity: number;
          subtitle_snapshot: string;
          title_snapshot: string;
          unit_amount_cents: number;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_src_snapshot?: string;
          line_total_cents?: number;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          subtitle_snapshot?: string;
          title_snapshot?: string;
          unit_amount_cents?: number;
          updated_at?: string;
        };
      };
      orders: {
        Insert: {
          additional_rental_block_count?: number;
          checkout_scope?: string;
          checkout_url?: string | null;
          created_at?: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          delivery_apartment?: string | null;
          delivery_city?: string | null;
          delivery_fee_cents?: number;
          delivery_notes?: string | null;
          delivery_state_region?: string | null;
          delivery_street_address?: string | null;
          delivery_zip_code?: string | null;
          extended_rental_surcharge_cents?: number;
          fulfillment_method: "pickup" | "delivery";
          id?: string;
          item_subtotal_cents?: number;
          pickup_date: string;
          rental_block_count?: number;
          rental_window_length: number;
          return_date: string;
          status?: Database["public"]["Enums"]["order_status"];
          stripe_error_message?: string | null;
          stripe_event_id?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          total_cents?: number;
          updated_at?: string;
        };
        Relationships: [];
        Row: {
          additional_rental_block_count: number;
          checkout_scope: string;
          checkout_url: string | null;
          created_at: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          delivery_apartment: string | null;
          delivery_city: string | null;
          delivery_fee_cents: number;
          delivery_notes: string | null;
          delivery_state_region: string | null;
          delivery_street_address: string | null;
          delivery_zip_code: string | null;
          extended_rental_surcharge_cents: number;
          fulfillment_method: "pickup" | "delivery";
          id: string;
          item_subtotal_cents: number;
          pickup_date: string;
          rental_block_count: number;
          rental_window_length: number;
          return_date: string;
          status: Database["public"]["Enums"]["order_status"];
          stripe_error_message: string | null;
          stripe_event_id: string | null;
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          total_cents: number;
          updated_at: string;
        };
        Update: {
          additional_rental_block_count?: number;
          checkout_scope?: string;
          checkout_url?: string | null;
          created_at?: string;
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string;
          delivery_apartment?: string | null;
          delivery_city?: string | null;
          delivery_fee_cents?: number;
          delivery_notes?: string | null;
          delivery_state_region?: string | null;
          delivery_street_address?: string | null;
          delivery_zip_code?: string | null;
          extended_rental_surcharge_cents?: number;
          fulfillment_method?: "pickup" | "delivery";
          id?: string;
          item_subtotal_cents?: number;
          pickup_date?: string;
          rental_block_count?: number;
          rental_window_length?: number;
          return_date?: string;
          status?: Database["public"]["Enums"]["order_status"];
          stripe_error_message?: string | null;
          stripe_event_id?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          total_cents?: number;
          updated_at?: string;
        };
      };
      products: {
        Insert: {
          active?: boolean;
          base_unit_amount_cents: number;
          category?: string;
          created_at?: string;
          id: string;
          image_alt: string;
          image_src: string;
          inventory_count: number;
          rental_block_days?: number;
          selection_summary: string;
          subtitle: string;
          title: string;
          updated_at?: string;
        };
        Relationships: [];
        Row: {
          active: boolean;
          base_unit_amount_cents: number;
          category: string;
          created_at: string;
          id: string;
          image_alt: string;
          image_src: string;
          inventory_count: number;
          rental_block_days: number;
          selection_summary: string;
          subtitle: string;
          title: string;
          updated_at: string;
        };
        Update: {
          active?: boolean;
          base_unit_amount_cents?: number;
          category?: string;
          created_at?: string;
          id?: string;
          image_alt?: string;
          image_src?: string;
          inventory_count?: number;
          rental_block_days?: number;
          selection_summary?: string;
          subtitle?: string;
          title?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
  };
};
