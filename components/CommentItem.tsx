import React, { FC, useState, useEffect } from "react";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { supabase } from "../utils/supabase";
import { useStore } from "../store";
import { useMutateComment } from "../hooks/useMutateComment";
import { Spinner } from "./Spinner";
import { Comment } from "../types/types";

type Props = Omit<Comment, "created_at" | "note_id">;

export const CommentItem: FC<Props> = ({ id, content, user_id }) => {
  const [userId, setUserId] = useState<string | undefined>("");
  const update = useStore((state) => state.updateEditedComment);
  const { deleteCommentMutation } = useMutateComment();

  useEffect(() => {
    const getUserId = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      setUserId(user?.id);
    };
    getUserId();
  }, []);

  if (deleteCommentMutation.isLoading) {
    return <Spinner />;
  }

  return (
    <li className="my-3">
      <span>{content}</span>
      {userId === user_id && (
        <div className="float-right ml-20 flex">
          <PencilAltIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => update({ id, content })}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => deleteCommentMutation.mutate(id)}
          />
        </div>
      )}
    </li>
  );
};
