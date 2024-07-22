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
      boss_spells: {
        Row: {
          boss_id: string;
          duration: number;
          icon: string;
          id: number;
          name: string;
        };
        Insert: {
          boss_id: string;
          duration: number;
          icon: string;
          id: number;
          name: string;
        };
        Update: {
          boss_id?: string;
          duration?: number;
          icon?: string;
          id?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "boss_spells_boss_id_fkey";
            columns: ["boss_id"];
            isOneToOne: false;
            referencedRelation: "bosses";
            referencedColumns: ["id"];
          },
        ];
      };
      bosses: {
        Row: {
          icon: string;
          id: string;
          name: string;
          raid_id: string;
        };
        Insert: {
          icon: string;
          id?: string;
          name: string;
          raid_id: string;
        };
        Update: {
          icon?: string;
          id?: string;
          name?: string;
          raid_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bosses_raid_id_fkey";
            columns: ["raid_id"];
            isOneToOne: false;
            referencedRelation: "raids";
            referencedColumns: ["id"];
          },
        ];
      };
      character_spells: {
        Row: {
          class_id: string | null;
          cooldown: number;
          duration: number;
          icon: string;
          id: number;
          name: string;
          spec_id: string | null;
        };
        Insert: {
          class_id?: string | null;
          cooldown: number;
          duration: number;
          icon: string;
          id: number;
          name: string;
          spec_id?: string | null;
        };
        Update: {
          class_id?: string | null;
          cooldown?: number;
          duration?: number;
          icon?: string;
          id?: number;
          name?: string;
          spec_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "spells_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "spells_spec_id_fkey";
            columns: ["spec_id"];
            isOneToOne: false;
            referencedRelation: "specs";
            referencedColumns: ["id"];
          },
        ];
      };
      characters: {
        Row: {
          class_id: string | null;
          guild_id: string | null;
          id: string;
          name: string;
          spec_id: string | null;
        };
        Insert: {
          class_id?: string | null;
          guild_id?: string | null;
          id?: string;
          name: string;
          spec_id?: string | null;
        };
        Update: {
          class_id?: string | null;
          guild_id?: string | null;
          id?: string;
          name?: string;
          spec_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "characters_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_guild_id_fkey";
            columns: ["guild_id"];
            isOneToOne: false;
            referencedRelation: "guilds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_spec_id_fkey";
            columns: ["spec_id"];
            isOneToOne: false;
            referencedRelation: "specs";
            referencedColumns: ["id"];
          },
        ];
      };
      classes: {
        Row: {
          color: string;
          id: string;
          name: string;
        };
        Insert: {
          color: string;
          id?: string;
          name: string;
        };
        Update: {
          color?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      guild_members: {
        Row: {
          guild_id: string | null;
          joined_at: string | null;
          role: string;
          user_id: string | null;
        };
        Insert: {
          guild_id?: string | null;
          joined_at?: string | null;
          role: string;
          user_id?: string | null;
        };
        Update: {
          guild_id?: string | null;
          joined_at?: string | null;
          role?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "guild_members_guild_id_fkey";
            columns: ["guild_id"];
            isOneToOne: false;
            referencedRelation: "guilds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guild_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      guilds: {
        Row: {
          battlenet_id: number;
          id: string;
          name: string;
          realm: string;
          region: string | null;
        };
        Insert: {
          battlenet_id: number;
          id?: string;
          name: string;
          realm: string;
          region?: string | null;
        };
        Update: {
          battlenet_id?: number;
          id?: string;
          name?: string;
          realm?: string;
          region?: string | null;
        };
        Relationships: [];
      };
      raids: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      roster_characters: {
        Row: {
          character_id: string;
          roster_id: string;
        };
        Insert: {
          character_id: string;
          roster_id: string;
        };
        Update: {
          character_id?: string;
          roster_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "roster_characters_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "roster_characters_roster_id_fkey";
            columns: ["roster_id"];
            isOneToOne: false;
            referencedRelation: "rosters";
            referencedColumns: ["id"];
          },
        ];
      };
      rosters: {
        Row: {
          guild_id: string;
          id: string;
          name: string;
        };
        Insert: {
          guild_id: string;
          id?: string;
          name: string;
        };
        Update: {
          guild_id?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rosters_guild_id_fkey";
            columns: ["guild_id"];
            isOneToOne: true;
            referencedRelation: "guilds";
            referencedColumns: ["id"];
          },
        ];
      };
      specs: {
        Row: {
          class_id: string;
          id: string;
          name: string;
        };
        Insert: {
          class_id: string;
          id?: string;
          name: string;
        };
        Update: {
          class_id?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "specs_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          battlenet_id: number;
          id: string;
          name: string;
        };
        Insert: {
          battlenet_id: number;
          id?: string;
          name: string;
        };
        Update: {
          battlenet_id?: number;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;
