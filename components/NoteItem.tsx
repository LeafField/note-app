import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { supabase } from "../utils/supabase";
import { useStore } from "../store";
import { useMutateNote } from "../hooks/useMutateNote";
import { Spinner } from "./Spinner";
import { Note } from "../types/types";

type Props = Omit<Note, "created_at" | "note_id" | "comments">;

export const NoteItem: FC<Props> = ({ content, id, title, user_id }) => {
  const [userId, setUserId] = useState<string | undefined>("");
  const update = useStore((state) => state.updateEditedNote);
  const { deleteNoteMutation } = useMutateNote();

  useEffect(() => {
    const getUserId = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        setUserId(user.id);
      }
    };
    getUserId();
  }, []);

  if (deleteNoteMutation.isLoading) {
    return <Spinner />;
  }

  return (
    <li className="my-2">
      <Link href={`/note/${id}`} prefetch={false}>
        <span className="cursor-pointer hover:text-pink-600">{title}</span>
      </Link>
      {userId === user_id && (
        <div className="float-right ml-20 flex">
          <PencilAltIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => update({ id, content, title })}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => deleteNoteMutation.mutate(id)}
          />
        </div>
      )}
    </li>
  );
};
