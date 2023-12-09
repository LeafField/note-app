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

  return <div>CommentItem</div>;
};
