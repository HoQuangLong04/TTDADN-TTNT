const { spawn } = require('child_process');
const voiceController = require('./voice.controller');
const dotenv = require('dotenv');
dotenv.config()

exports.startRecording = (req, res) => {
  

  // Đường dẫn tới PythonPython
  const pythonExe = process.env.PYTHON_PATH;

  // Đường dẫn tới file mic_stream
  const script = process.env.SCRIPT_PATH;


  // Chạy  file script 
  const py = spawn(pythonExe, [script]);

  let output = "";

  py.stdout.on("data", data => {
    output += data.toString();
  });

  py.stderr.on("data", data => {
    console.error("Python stderr:", data.toString().trim());
  });

  py.once("close", code => {
    console.log(`Python exited with code ${code}`);
    console.log("Raw output:", output);

    let result;
    try {
      result = JSON.parse(output);
    } catch (e) {
      console.error("JSON parse error:", e.message);
      return res.status(500).json({ error: "Invalid JSON from Python" });
    }

    const transcript = result.transcript;
    if (!transcript || typeof transcript !== "string") {
      return res.json({ transcript: null, error: result.error || "No transcript" });
    }

    // gọi đến file voice.controller 
    voiceController.handleTranscript(transcript)
      .then(() => {
        res.json({ transcript, message: "OK" });
      })
      .catch(err => {
        console.error("handleTranscript error:", err);
        res.status(500).json({ error: err.message });
      });
  });
};


