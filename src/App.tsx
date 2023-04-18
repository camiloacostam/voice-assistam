import { useEffect, useState } from "react";
// import usePermissions from "./hooks/usePermissions";
import "./App.css";

function App() {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [audioRecorded, setAudioRecorded] = useState<any>(null);
  const [mediaController, setMediaController] = useState<MediaRecorder>();
  const audioChunks = [];

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => setMediaController(new MediaRecorder(stream)));
  }, []);

  mediaController &&
    mediaController.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

  mediaController &&
    mediaController.addEventListener("stop", () => {
      const audioRecorded = new Blob(audioChunks, { type: "audio/webm" });
      setAudioRecorded(audioRecorded);
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <button
        onClick={() => {
          !isListening && mediaController
            ? mediaController.start()
            : mediaController && mediaController.stop();
          setIsListening(!isListening);
        }}
      >
        {isListening ? "Recording" : "Record"}
      </button>
      {audioRecorded && (
        <audio src={URL.createObjectURL(audioRecorded)} controls />
      )}
    </div>
  );
}

export default App;
