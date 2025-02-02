import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { TextInput, Flex, Button } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import useAuthContext from "../hooks/useAuthContext";
import useNoteContext from "../hooks/useNoteContext";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import useNoteController from "../hooks/useNoteController";

const TextEditor = ({
  type,
  loading,
  handleSubmit,
  deleteLoading,
  handleDelete,
}) => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { dispatch } = useNoteContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { getOneNote } = useNoteController();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioURL, setAudioURL] = useState(null); // Store URL for playback

  // Persist recognition and recording across renders
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]); // Use useRef instead of let audioChunks

  // Speech-to-text setup
  useEffect(() => {
    if (!recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript + " ";
            }
          }
          if (transcript) {
            setRecordedText((prev) => prev + transcript);
            setContent((prev) => prev + transcript);
          }
        };
      }
    }
  }, []);

  // Start recording (audio + speech-to-text)
  const startRecording = async () => {
    setIsRecording(true);
    setAudioURL(null);
    setRecordedAudio(null);
    audioChunksRef.current = []; // Reset recorded audio chunks

    if (recognitionRef.current) recognitionRef.current.start();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setRecordedAudio(audioBlob);
    };

    mediaRecorderRef.current.start();
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
  });

  // Fetch existing note if updating
  useEffect(() => {
    if (user && type === "Update") {
      getOneNote(id, setTitle, setContent, editor);
    }
  }, [dispatch, user, editor]);

  const styles = {
    borderBottom: "5px solid #1971c2",
    paddingBottom:"15px"
};


  return (
    <>
      <Flex align={"center"} justify={"space-between"} mt={10}>
        <TextInput
          size="xl"
          w={500}
          variant="unstyled"
          placeholder="Note Heading Goes Here"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <Flex align={"center"} justify={"space-between"} gap={15}>
          {type === "Update" && (
            <Button
              size="md"
              loading={deleteLoading}
              type="submit"
              onClick={() => handleDelete(id)}
              color="red"
              variant="light"
            >
              Delete Note
            </Button>
          )}
          <Button
            size="md"
            loading={loading}
            type="submit"
            onClick={() => handleSubmit(title, content, recordedAudio)}
          >
            {type} Note
          </Button>
          {/* recording button */}
          <Button
            size="md"
            color="blue"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        </Flex>
      </Flex>
      <RichTextEditor style={{ border: "none" }} editor={editor}>
        <RichTextEditor.Toolbar
          mt={25}
          sx={{ display: "flex", justifyContent: "center" }}
          p={0}
          style={styles}
          onClick={() => setContent(editor.getHTML())}
        >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold w={40} h={40} />
            <RichTextEditor.Italic w={40} h={40} />
            <RichTextEditor.Underline w={40} h={40} />
            <RichTextEditor.Strikethrough w={40} h={40} />
            <RichTextEditor.ClearFormatting w={40} h={40} />
            <RichTextEditor.Highlight w={40} h={40} />
            <RichTextEditor.Code w={40} h={40} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 w={40} h={40} />
            <RichTextEditor.H2 w={40} h={40} />
            <RichTextEditor.H3 w={40} h={40} />
            <RichTextEditor.H4 w={40} h={40} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList w={40} h={40} />
            <RichTextEditor.OrderedList w={40} h={40} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft w={40} h={40} />
            <RichTextEditor.AlignCenter w={40} h={40} />
            <RichTextEditor.AlignRight w={40} h={40} />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content onInput={() => setContent(editor.getHTML())} />
      </RichTextEditor>
      {audioURL && (
        <audio controls>
          <source src={audioURL} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </>
  );
};
export default TextEditor;
