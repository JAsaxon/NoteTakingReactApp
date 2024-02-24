import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import NewNote from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./NoteList";
import NoteLayout from "./NoteLayout";
import Note from "./Note";
import EditNote from "./EditNote.tsx";
import "./styles.scss";
export type Note = {
  id: string;
} & NoteData;
export type RawNote = {
  id: string;
} & RawNoteData;
export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};
export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};
export type Tag = {
  id: string;
  label: string;
};
function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);
  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }
  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }
  function onDeleteTag(id: string) {
    setTags((prev) => {
      return prev.filter((tag) => tag.id !== id);
    });
  }
  function onEditTag(id: string, newValue: string) {
    setTags((prev) => {
      return [
        ...prev.filter((tag) => tag.id !== id),
        {
          id: id,
          label: newValue,
        },
      ];
    });
  }
  function onEditNote(data: NoteData, tags: Tag[], id: string) {
    // remove note of ID
    setNotes((prevNotes) => {
      return [
        ...prevNotes.filter((note) => {
          return note.id !== id;
        }),
        { ...data, id: id, tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }
  function onDeleteNote(id: string): void {
    setNotes((prevNotes) => {
      return [
        ...prevNotes.filter((note) => {
          return note.id !== id;
        }),
      ];
    });
  }
  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onDeleteTag={onDeleteTag}
              onEditTag={onEditTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDeleteNote={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onEditNote}
                onAddTag={addTag}
                availableTags={tags}
                onDeleteNote={onDeleteNote}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </Container>
  );
}

export default App;
