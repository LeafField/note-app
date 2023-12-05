import { useMutation } from "react-query";
import { supabase } from "../utils/supabase";
import { useStore } from "../store";
import { revalidateSingle } from "../utils/revalidation";
import { Comment, EditedComment } from "../types/types";

const useMutateComment = () => {
  const reset = useStore((state) => state.resetEditedComment);

  const createCommentMutation = useMutation(
    async (comment: Omit<Comment, "created_at" | "id">) => {
      const { data, error } = await supabase
        .from("comments")
        .insert(comment)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].note_id);
        reset();
        alert("successfully completed !!");
      },
      onError: (err: any) => {
        alert((err as Error).message);
        reset();
      },
    },
  );

  const updateCommentMutation = useMutation(
    async (comment: EditedComment) => {
      const { data, error } = await supabase
        .from("comments")
        .update(comment)
        .eq("id", comment.id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].note_id);
        reset();
        alert("Successfully completed !!");
      },
      onError: (err) => {
        alert((err as Error).message);
        reset();
      },
    },
  );

  const deleteCommentMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].note_id);
        reset();
        alert("Successfully completed !!");
      },
      onError: (err: any) => {
        alert((err as Error).message);
        reset();
      },
    },
  );

  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
  };
};
