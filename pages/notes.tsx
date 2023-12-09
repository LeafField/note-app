import React from "react";
import { NextPage, GetStaticProps, InferGetStaticPropsType } from "next";
import { LogoutIcon, DocumentTextIcon } from "@heroicons/react/solid";
import { supabase } from "../utils/supabase";
import { Layout } from "../components/Layout";
import { Note } from "../types/types";
import { NoteForm } from "../components/NoteForm";
import { NoteItem } from "../components/NoteItem";

export const getStaticProps = async () => {
  console.log("ISR invoked - index page");
  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`${error.message}: ${error.details} `);
  }

  return {
    props: { notes },
    revalidate: false,
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Notes: NextPage<Props> = ({ notes }) => {
  const signOut = () => {
    supabase.auth.signOut();
  };

  return (
    <Layout title="Notes">
      <LogoutIcon
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
      <DocumentTextIcon className="h-8 w-8 text-blue-500" />
      <ul className="my-2">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            id={note.id}
            content={note.content}
            user_id={note.user_id}
            title={note.title}
          />
        ))}
      </ul>
      <NoteForm />
    </Layout>
  );
};

export default Notes;
