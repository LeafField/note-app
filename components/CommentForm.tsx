import React, { FC, FormEvent } from "react";
import { supabase } from "../utils/supabase";
import { useStore } from "../store";
import { useMutateComment } from "../hooks/useMutateComment";
import { Spinner } from "./Spinner";

type Props = {
  noteId: string;
};

export const CommentForm: FC<Props> = ({ noteId }) => {
  const { editedComment } = useStore();
  const update = useStore((state) => state.updateEditedComment);
  const { createCommentMutation, updateCommentMutation } = useMutateComment();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editedComment.id === "") {
      const user = await (await supabase.auth.getUser()).data.user;
      createCommentMutation.mutate({
        content: editedComment.content,
        note_id: noteId,
        user_id: user?.id,
      });
    } else {
      updateCommentMutation.mutate({
        id: editedComment.id,
        content: editedComment.content,
      });
    }
  };

  if (createCommentMutation.isLoading || updateCommentMutation.isLoading) {
    return <Spinner />;
  }
  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        placeholder="new comment"
        value={editedComment.content}
        onChange={(e) => update({ ...editedComment, content: e.target.value })}
        className="my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none "
      />
      <button
        type="submit"
        className="ml-2 rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        {editedComment.id ? "Update" : "Create"}
      </button>
    </form>
  );
};
