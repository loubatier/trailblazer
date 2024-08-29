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
          color: string;
          duration: number;
          icon: string;
          id: number;
          name: string;
        };
        Insert: {
          boss_id: string;
          color?: string;
          duration: number;
          icon: string;
          id: number;
          name: string;
        };
        Update: {
          boss_id?: string;
          color?: string;
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
          position: number;
          raid_id: string;
          slug: string;
        };
        Insert: {
          icon: string;
          id?: string;
          name: string;
          position: number;
          raid_id: string;
          slug?: string;
        };
        Update: {
          icon?: string;
          id?: string;
          name?: string;
          position?: number;
          raid_id?: string;
          slug?: string;
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
      character_classes: {
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
      character_specs: {
        Row: {
          class_id: string;
          color: string;
          id: string;
          name: string;
        };
        Insert: {
          class_id: string;
          color?: string;
          id?: string;
          name: string;
        };
        Update: {
          class_id?: string;
          color?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "specs_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "character_classes";
            referencedColumns: ["id"];
          },
        ];
      };
      character_spells: {
        Row: {
          class_id: string | null;
          color: string;
          cooldown: number;
          duration: number;
          icon: string;
          id: number;
          name: string;
          spec_id: string | null;
        };
        Insert: {
          class_id?: string | null;
          color: string;
          cooldown: number;
          duration: number;
          icon: string;
          id: number;
          name: string;
          spec_id?: string | null;
        };
        Update: {
          class_id?: string | null;
          color?: string;
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
            referencedRelation: "character_classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "spells_spec_id_fkey";
            columns: ["spec_id"];
            isOneToOne: false;
            referencedRelation: "character_specs";
            referencedColumns: ["id"];
          },
        ];
      };
      guild_members: {
        Row: {
          guild_id: string;
          joined_at: string | null;
          role: string;
          user_id: string;
        };
        Insert: {
          guild_id: string;
          joined_at?: string | null;
          role: string;
          user_id: string;
        };
        Update: {
          guild_id?: string;
          joined_at?: string | null;
          role?: string;
          user_id?: string;
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
          slug: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      roster_characters: {
        Row: {
          class_id: string;
          id: string;
          name: string;
          roster_id: string;
          spec_id: string;
        };
        Insert: {
          class_id: string;
          id?: string;
          name: string;
          roster_id: string;
          spec_id: string;
        };
        Update: {
          class_id?: string;
          id?: string;
          name?: string;
          roster_id?: string;
          spec_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "roster_characters_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "character_classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "roster_characters_roster_id_fkey";
            columns: ["roster_id"];
            isOneToOne: false;
            referencedRelation: "rosters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "roster_characters_spec_id_fkey";
            columns: ["spec_id"];
            isOneToOne: false;
            referencedRelation: "character_specs";
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
      timeline_boss_spells: {
        Row: {
          id: string;
          spell_id: number;
          timeline_id: string;
          timing: number;
        };
        Insert: {
          id?: string;
          spell_id: number;
          timeline_id?: string;
          timing: number;
        };
        Update: {
          id?: string;
          spell_id?: number;
          timeline_id?: string;
          timing?: number;
        };
        Relationships: [
          {
            foreignKeyName: "timeline_boss_spells_spell_id_fkey";
            columns: ["spell_id"];
            isOneToOne: false;
            referencedRelation: "boss_spells";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "timeline_boss_spells_timeline_id_fkey";
            columns: ["timeline_id"];
            isOneToOne: false;
            referencedRelation: "timelines";
            referencedColumns: ["id"];
          },
        ];
      };
      timeline_character_spells: {
        Row: {
          character_id: string;
          id: string;
          row_id: string;
          spell_id: number;
          timeline_id: string;
          timing: number;
        };
        Insert: {
          character_id: string;
          id?: string;
          row_id: string;
          spell_id: number;
          timeline_id?: string;
          timing?: number;
        };
        Update: {
          character_id?: string;
          id?: string;
          row_id?: string;
          spell_id?: number;
          timeline_id?: string;
          timing?: number;
        };
        Relationships: [
          {
            foreignKeyName: "timeline_character_spells_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "roster_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "timeline_character_spells_row_id_fkey";
            columns: ["row_id"];
            isOneToOne: false;
            referencedRelation: "timeline_roster_rows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "timeline_character_spells_spell_id_fkey";
            columns: ["spell_id"];
            isOneToOne: false;
            referencedRelation: "character_spells";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "timeline_character_spells_timeline_id_fkey";
            columns: ["timeline_id"];
            isOneToOne: false;
            referencedRelation: "timelines";
            referencedColumns: ["id"];
          },
        ];
      };
      timeline_roster_rows: {
        Row: {
          id: string;
          is_active: boolean;
          position: number;
          timeline_id: string;
        };
        Insert: {
          id?: string;
          is_active?: boolean;
          position: number;
          timeline_id: string;
        };
        Update: {
          id?: string;
          is_active?: boolean;
          position?: number;
          timeline_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_timeline";
            columns: ["timeline_id"];
            isOneToOne: false;
            referencedRelation: "timelines";
            referencedColumns: ["id"];
          },
        ];
      };
      timelines: {
        Row: {
          boss_id: string;
          difficulty: Database["public"]["Enums"]["difficulty_enum"];
          id: string;
          roster_id: string;
          timer: number;
        };
        Insert: {
          boss_id: string;
          difficulty: Database["public"]["Enums"]["difficulty_enum"];
          id?: string;
          roster_id: string;
          timer?: number;
        };
        Update: {
          boss_id?: string;
          difficulty?: Database["public"]["Enums"]["difficulty_enum"];
          id?: string;
          roster_id?: string;
          timer?: number;
        };
        Relationships: [
          {
            foreignKeyName: "timelines_boss_id_fkey";
            columns: ["boss_id"];
            isOneToOne: false;
            referencedRelation: "bosses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "timelines_roster_id_fkey";
            columns: ["roster_id"];
            isOneToOne: false;
            referencedRelation: "rosters";
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
      delete_timeline_roster_row: {
        Args: {
          row_id: string;
        };
        Returns: undefined;
      };
      update_timeline_character_spell: {
        Args: {
          tcs_id: string;
          new_timing: number;
          new_row: string;
          new_character: string;
        };
        Returns: {
          updated_timing: number;
          updated_row_id: string;
          updated_character_id: string;
        }[];
      };
      update_timeline_roster_row: {
        Args: {
          row_id: string;
          new_position: number;
          new_is_active: boolean;
        };
        Returns: {
          updated_position: number;
          updated_is_active: boolean;
        }[];
      };
    };
    Enums: {
      difficulty_enum: "normal" | "heroic" | "mythic";
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
