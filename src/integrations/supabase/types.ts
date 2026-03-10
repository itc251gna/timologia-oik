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
      vendors: {
        Row: {
          afm: string
          ar_ent: string | null
          ar_parastatikou: string | null
          created_at: string
          dikaiouxos_plir: string | null
          eponymia: string | null
          etos: string | null
          foreas: string | null
          foros_20: string | null
          foros_3: string | null
          foros_4: string | null
          foros_8: string | null
          id: string
          im_exoflisis: string | null
          im_parastatikou: string | null
          katigoria: string | null
          kod_prom: string
          original_id: string | null
          plirotea_axia: string | null
          st_ent: string | null
          synoliki_axi: string | null
          synolo_kratiseon: string | null
          updated_at: string
          ΑΑ: string | null
        }
        Insert: {
          afm: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Update: {
          afm?: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom?: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Relationships: []
      }
      vendors_2020: {
        Row: {
          afm: string
          ar_ent: string | null
          ar_parastatikou: string | null
          created_at: string
          dikaiouxos_plir: string | null
          eponymia: string | null
          etos: string | null
          foreas: string | null
          foros_20: string | null
          foros_3: string | null
          foros_4: string | null
          foros_8: string | null
          id: string
          im_exoflisis: string | null
          im_parastatikou: string | null
          katigoria: string | null
          kod_prom: string
          original_id: string | null
          plirotea_axia: string | null
          st_ent: string | null
          synoliki_axi: string | null
          synolo_kratiseon: string | null
          updated_at: string
          ΑΑ: string | null
        }
        Insert: {
          afm: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Update: {
          afm?: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom?: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Relationships: []
      }
      vendors_2021: {
        Row: {
          afm: string
          ar_ent: string | null
          ar_parastatikou: string | null
          created_at: string
          dikaiouxos_plir: string | null
          eponymia: string | null
          etos: string | null
          foreas: string | null
          foros_20: string | null
          foros_3: string | null
          foros_4: string | null
          foros_8: string | null
          id: string
          im_exoflisis: string | null
          im_parastatikou: string | null
          katigoria: string | null
          kod_prom: string
          original_id: string | null
          plirotea_axia: string | null
          st_ent: string | null
          synoliki_axi: string | null
          synolo_kratiseon: string | null
          updated_at: string
          ΑΑ: string | null
        }
        Insert: {
          afm: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Update: {
          afm?: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom?: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Relationships: []
      }
      vendors_2022: {
        Row: {
          afm: string
          ar_ent: string | null
          ar_parastatikou: string | null
          created_at: string
          dikaiouxos_plir: string | null
          eponymia: string | null
          etos: string | null
          foreas: string | null
          foros_20: string | null
          foros_3: string | null
          foros_4: string | null
          foros_8: string | null
          id: string
          im_exoflisis: string | null
          im_parastatikou: string | null
          katigoria: string | null
          kod_prom: string
          original_id: string | null
          plirotea_axia: string | null
          st_ent: string | null
          synoliki_axi: string | null
          synolo_kratiseon: string | null
          updated_at: string
          ΑΑ: string | null
        }
        Insert: {
          afm: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Update: {
          afm?: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom?: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Relationships: []
      }
      vendors_2023: {
        Row: {
          afm: string
          ar_ent: string | null
          ar_parastatikou: string | null
          created_at: string
          dikaiouxos_plir: string | null
          eponymia: string | null
          etos: string | null
          foreas: string | null
          foros_20: string | null
          foros_3: string | null
          foros_4: string | null
          foros_8: string | null
          id: string
          im_exoflisis: string | null
          im_parastatikou: string | null
          katigoria: string | null
          kod_prom: string
          original_id: string | null
          plirotea_axia: string | null
          st_ent: string | null
          synoliki_axi: string | null
          synolo_kratiseon: string | null
          updated_at: string
          ΑΑ: string | null
        }
        Insert: {
          afm: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Update: {
          afm?: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom?: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Relationships: []
      }
      vendors_2024: {
        Row: {
          afm: string
          ar_ent: string | null
          ar_parastatikou: string | null
          created_at: string
          dikaiouxos_plir: string | null
          eponymia: string | null
          etos: string | null
          foreas: string | null
          foros_20: string | null
          foros_3: string | null
          foros_4: string | null
          foros_8: string | null
          id: string
          im_exoflisis: string | null
          im_parastatikou: string | null
          katigoria: string | null
          kod_prom: string
          original_id: string | null
          plirotea_axia: string | null
          st_ent: string | null
          synoliki_axi: string | null
          synolo_kratiseon: string | null
          updated_at: string
          ΑΑ: string | null
        }
        Insert: {
          afm: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Update: {
          afm?: string
          ar_ent?: string | null
          ar_parastatikou?: string | null
          created_at?: string
          dikaiouxos_plir?: string | null
          eponymia?: string | null
          etos?: string | null
          foreas?: string | null
          foros_20?: string | null
          foros_3?: string | null
          foros_4?: string | null
          foros_8?: string | null
          id?: string
          im_exoflisis?: string | null
          im_parastatikou?: string | null
          katigoria?: string | null
          kod_prom?: string
          original_id?: string | null
          plirotea_axia?: string | null
          st_ent?: string | null
          synoliki_axi?: string | null
          synolo_kratiseon?: string | null
          updated_at?: string
          ΑΑ?: string | null
        }
        Relationships: []
      }
      years: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          table_name: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          table_name: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          table_name?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_vendor_table_for_year: {
        Args: { year_input: number }
        Returns: string
      }
      delete_vendor_table_for_year: {
        Args: { year_input: number }
        Returns: string
      }
      get_available_years: {
        Args: Record<PropertyKey, never>
        Returns: {
          year: number
          table_name: string
          is_active: boolean
        }[]
      }
      truncate_vendors_2020_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      truncate_vendors_2021_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      truncate_vendors_2022_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      truncate_vendors_2023_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      truncate_vendors_2024_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      truncate_vendors_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
