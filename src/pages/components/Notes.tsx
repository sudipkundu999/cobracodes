import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
} from "@chakra-ui/react";

interface NotesProps {
  topicId: string;
  noteTopicId: string;
  setNoteTopicId: React.Dispatch<React.SetStateAction<string>>;
}

const Notes: React.FC<NotesProps> = ({
  topicId,
  noteTopicId,
  setNoteTopicId,
}) => {
  const { data: sessionData, status } = useSession();
  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    { topicId: topicId },
    { enabled: sessionData?.user !== undefined }
  );

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const DeleteNoteButton: React.FC<{ noteId: string }> = ({ noteId }) => (
    <Button
      colorScheme="red"
      variant="link"
      onClick={() => deleteNote.mutate({ id: noteId })}
    >
      Delete Note
    </Button>
  );

  useEffect(() => {
    if (noteTopicId === topicId) {
      refetchNotes();
      setNoteTopicId("");
    }
  }, [noteTopicId]);

  return (
    <div className="mt-1 w-full px-1">
      <Accordion allowMultiple>
        {notes?.map((note, i) => (
          <AccordionItem key={`${note.title}-${i}`}>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                {note.title}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              {note.content}
              <div className="mt-1 w-full text-center">
                <DeleteNoteButton noteId={note.id} />
              </div>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Notes;
