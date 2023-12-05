export type Comment = {
  content: string;
  created_at: string;
  id: string;
  note_id: string;
  user_id: string | undefined;
};

export type Note = {
  content: string;
  created_at: string;
  id: string;
  title: string;
  user_id: string | undefined;
  comments: Comment[];
};

export type EditedComment = Omit<Comment, "created_at" | "user_id" | "note_id">;
export type EditedNote = Omit<Note, "created_at" | "user_id" | "comments">;
