import {
  Button,
  Col,
  Row,
  Stack,
  Form,
  Card,
  Badge,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Tag } from "./App";
import styles from "./NoteList.module.css";
import { FormEvent, useMemo, useState } from "react";
type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};
type NoteListProps = {
  availableTags: Tag[];
  notes: Note[];
  onDeleteTag: (id: string) => void;
  onEditTag: (id: string, newValue: string) => void;
};
export default function NoteList({
  availableTags,
  notes,
  onDeleteTag,
  onEditTag,
}: NoteListProps) {
  const [selectedTags, setselectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [modalActive, setModalActive] = useState(false);
  const filteredNotes = useMemo(() => {
    console.log(selectedTags);
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((st) => {
            return note.tags.some((tag) => tag.id === st.id);
          }))
      );
    });
  }, [title, selectedTags, notes]);
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          {" "}
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary"> Create</Button>
            </Link>
            <Button
              variant="outline-secondary"
              onClick={() => setModalActive(true)}
            >
              Edit tags
            </Button>
          </Stack>
        </Col>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="tags">
                <Form.Label>Tags</Form.Label>
                <ReactSelect
                  isMulti
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
        </Form>
      </Row>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => {
          return (
            <Col key={note.id}>
              <NoteCard id={note.id} title={note.title} tags={note.tags} />
            </Col>
          );
        })}
      </Row>
      <EditTagsModal
        active={modalActive}
        availableTags={availableTags}
        handleClosed={() => setModalActive(false)}
        onDeleteTag={onDeleteTag}
        onEditTag={onEditTag}
      />
    </>
  );
}
function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack gap={1} direction="horizontal">
              {tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}

type EditTagsModalProps = {
  active: boolean;
  availableTags: Tag[];
  handleClosed: () => void;
  onDeleteTag: (id: string) => void;
  onEditTag: (id: string, newValue: string) => void;
};
function EditTagsModal({
  active,
  availableTags,
  handleClosed,
  onDeleteTag,
  onEditTag,
}: EditTagsModalProps) {
  function handleTagChange(e: any, id: string) {
    onEditTag(id, e.target.value);
  }
  return (
    <Modal show={active} onHide={handleClosed}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={2}>
          {availableTags.map((tag) => {
            return (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => handleTagChange(e, tag.id)}
                  />
                </Col>
                <Col xs="auto" onClick={() => onDeleteTag(tag.id)}>
                  <Button variant="danger">&times;</Button>
                </Col>
              </Row>
            );
          })}
        </Stack>
      </Modal.Body>
    </Modal>
  );
}
