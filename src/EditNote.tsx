import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
  onSubmit: (data: NoteData, tags: Tag[], id: string) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
  onDeleteNote: (id: string) => void;
};
export default function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  onDeleteNote,
}: EditNoteProps) {
  const currentNoteData = useNote();

  const titleRef = useRef<HTMLInputElement>(null);
  const markdwonRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setselectedTags] = useState<Tag[]>(currentNoteData.tags);
  const navigate = useNavigate();
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(
      {
        title: titleRef.current!.value,
        markdown: markdwonRef.current!.value,
        tags: selectedTags,
      },
      selectedTags,
      currentNoteData.id
    );
    navigate("..");
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                ref={titleRef}
                required
                defaultValue={currentNoteData.title}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                isMulti
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setselectedTags((prev) => [...prev, newTag]);
                }}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setselectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={15}
            ref={markdwonRef}
            defaultValue={currentNoteData.markdown}
          />
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Button
            variant="danger"
            onClick={() => onDeleteNote(currentNoteData.id)}
          >
            Delete
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}
