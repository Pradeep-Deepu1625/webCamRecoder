import React, { useState } from 'react';

function RecordingApp() {
  const [webcamRecording, setWebcamRecording] = useState(false);
  const [webcamRecordedChunks, setWebcamRecordedChunks] = useState([]);
  const [screenRecording, setScreenRecording] = useState(false);
  const [screenRecordedChunks, setScreenRecordedChunks] = useState([]);

  let webcamMediaRecorder;
  let webcamStream;
  let screenMediaRecorder;
  let screenStream;

  const startWebcamRecording = async () => {
    webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcamMediaRecorder = new MediaRecorder(webcamStream);

    webcamMediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        setWebcamRecordedChunks(prevChunks => [...prevChunks, event.data]);
      }
    };

    webcamMediaRecorder.start();
    setWebcamRecording(true);
  };

  const stopWebcamRecording = () => {
    webcamMediaRecorder.stop();
    webcamStream.getTracks().forEach(track => track.stop());
    setWebcamRecording(false);
  };

  const startScreenRecording = async () => {
    screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    screenMediaRecorder = new MediaRecorder(screenStream);

    screenMediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        setScreenRecordedChunks(prevChunks => [...prevChunks, event.data]);
      }
    };

    screenMediaRecorder.start();
    setScreenRecording(true);
  };

  const stopScreenRecording = () => {
    screenMediaRecorder.stop();
    screenStream.getTracks().forEach(track => track.stop());
    setScreenRecording(false);
  };

  return (
    <div>
      <div>
        <h2>Webcam Recording</h2>
        <button onClick={startWebcamRecording} disabled={webcamRecording}>Start Webcam Recording</button>
        <button onClick={stopWebcamRecording} disabled={!webcamRecording}>Stop Webcam Recording</button>
        <video controls src={webcamRecordedChunks.length > 0 ? URL.createObjectURL(new Blob(webcamRecordedChunks)) : ''} />
      </div>
      <div>
        <h2>Screen Recording</h2>
        <button onClick={startScreenRecording} disabled={screenRecording}>Start Screen Recording</button>
        <button onClick={stopScreenRecording} disabled={!screenRecording}>Stop Screen Recording</button>
        <video controls src={screenRecordedChunks.length > 0 ? URL.createObjectURL(new Blob(screenRecordedChunks)) : ''} />
      </div>
    </div>
  );
}

export default RecordingApp;