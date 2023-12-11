import React from "react";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { ChevronDoubleLeftIcon } from "@heroicons/react/solid";
import { supabase } from "../../utils/supabase";
import { Layout } from "../../components/Layout";
import { CommentForm } from "../../components/CommentForm";
import { CommentItem } from "../../components/CommentItem";
import { Note } from "../../types/types";

const getAllNoteIds = async () => {
  const { data: ids } = await supabase.from("notes").select("id");
  return ids!.map((id) => {
    return {
      params: {
        id: String(id.id),
      },
    };
  });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllNoteIds();

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ id: string }>) => {
  console.log("ISR Invoked - details page");
  const { data: note } = await supabase
    .from("notes")
    .select("*, comments(*)")
    .eq("id", params!.id)
    .single();

  const { data } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true });
  console.log(data);

  return {
    props: {
      note,
    },
    revalidate: false,
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const NotePage: NextPage<Props> = ({ note }) => {
  return (
    <Layout title="NoteDetail">
      <p className="text-3xl font-semibold text-blue-500">{note?.title}</p>
      <div className="m-8 rounded-lg p-4 shadow-lg">
        <p>{note?.content}</p>
      </div>
      <ul className="my-2">
        {note?.comments.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            content={comment.content}
            user_id={comment.user_id}
          />
        ))}
      </ul>
      <CommentForm noteId={note!.id} />
      <Link href={"/note"} prefetch={false}>
        <ChevronDoubleLeftIcon className="my-6 h-6 w-6 cursor-pointer text-blue-500" />
      </Link>
    </Layout>
  );
};

export default NotePage;
