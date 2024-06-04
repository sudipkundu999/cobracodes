import React, { useState } from "react";
import type { DefaultAddNoteForm } from "@/types";
import { api, type RouterOutputs } from "@/utils/api";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";

type Topic = RouterOutputs["topic"]["getAll"][0];

interface AddNoteProps {
  topics: Topic[];
  setNoteTopicId: React.Dispatch<React.SetStateAction<string>>;
}

const AddNote: React.FC<AddNoteProps> = ({ topics, setNoteTopicId }) => {
  const defaultFormState = { title: "", content: "", topicId: "" };
  const [form, setForm] = useState<DefaultAddNoteForm>(defaultFormState);
  const [error, setError] = useState("");
  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      setNoteTopicId(form.topicId);
      setForm(defaultFormState);
    },
    onError(error, variables, context) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { value, id } = e.target;
    if (id === "title") {
      form.title = value;
    } else if (id === "content") {
      form.content = value;
    } else {
      form.topicId = value;
    }
    setForm({ ...form });
  };

  const onCreateClickHandler = () => {
    setError("");
    createNote.mutate({
      title: form.title,
      content: form.content,
      topicId: form.topicId,
    });
  };

  const isFormValid =
    form.topicId == "" ||
    !form.title.match(/[a-zA-Z]/g) ||
    !form.content.match(/[a-zA-Z]/g);

  return (
    <div className="mt-10">
      <FormControl
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <FormLabel style={{ width: "100%", textAlign: "center" }}>
          New Note
        </FormLabel>
        <Input
          size="lg"
          value={form.title}
          onChange={handleInputChange}
          id="title"
          placeholder="Enter Title"
        />
        <Textarea
          size="lg"
          onChange={handleInputChange}
          value={form.content}
          id="content"
          placeholder="Enter Content"
        />
        <Select
          placeholder="Select topic"
          onChange={handleInputChange}
          value={form.topicId}
          id="topicId"
        >
          {topics?.map((topic) => (
            <option value={topic.id} key={topic.id}>
              {topic.title}
            </option>
          ))}
        </Select>
        <Button
          colorScheme="blue"
          onClick={onCreateClickHandler}
          style={{ width: "100%" }}
          isDisabled={isFormValid}
        >
          Add Note
        </Button>
        <div className="text-red-600">{error}</div>
      </FormControl>
    </div>
  );
};

export default AddNote;
