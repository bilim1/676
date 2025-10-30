export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          color: string;
          url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          icon?: string;
          color?: string;
          url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          color?: string;
          url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      home_shortcuts: {
        Row: {
          id: string;
          article_id: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          position: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          position?: number;
          created_at?: string;
        };
      };
    };
  };
}
