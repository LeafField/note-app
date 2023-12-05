import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../utils/supabase";
import { useStore } from "../store";
import { revalidateList, revalidateSingle } from "../utils/revalidation";
import { Note, EditedNote } from "../types/types";

export const useMutateNote = () => {
  const reset = useStore((state) => state.resetEditedNote);

  const createNoteMutation = useMutation(
    async (note: Omit<Note, "created_at" | "id" | "comments">) => {
      const { data, error } = await supabase
        .from("notes")
        .insert(note)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        revalidateList();
        reset();
        alert("Successfully completed!!");
      },
      onError: (err: any) => {
        alert((err as Error).message);
        reset();
      },
    },
  );

  const updateNoteMutation = useMutation(
    async (note: EditedNote) => {
      const { data, error } = await supabase
        .from("notes")
        .update(note)
        .eq("id", note.id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (res) => {
        revalidateList();
        revalidateSingle(res[0].id);
        reset();
        alert("Successfully completed !!");
      },
      onError: (err: any) => {
        alert((err as Error).message);
        reset();
      },
    },
  );

  const deleteNoteMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        revalidateList();
        reset();
        alert("Successfully completed !!");
      },
      onError: (err: any) => {
        alert((err as Error).message);
        reset();
      },
    },
  );

  return { createNoteMutation, updateNoteMutation, deleteNoteMutation };
};
