// // services/voskService.js
// const vosk = require('vosk');
// const mic = require('mic');
// const fs = require('fs');
// const voiceController = require('../Controllers/voice_recognition_system/voice.controller');

// const MODEL_PATH = "D:/Code_2025/Do_an_Tong_hop/Smart_home/vosk-model-vn-0.4"; // Cập nhật đường dẫn tới folder model Vosk của bạn
// const SAMPLE_RATE = 16000;

// if (!fs.existsSync(MODEL_PATH)) {
//   console.error("Model không tồn tại tại đường dẫn:", MODEL_PATH);
//   process.exit(1);
// }

// vosk.setLogLevel(0);
// const model = new vosk.Model(MODEL_PATH);

// exports.startListening = function() {
//   console.log("Khởi động microphone với Vosk...");

//   let micInstance = mic({
//     rate: SAMPLE_RATE.toString(),
//     channels: '1',
//     debug: false,
//     exitOnSilence: 6  // Dừng ghi âm sau 6 giây im lặng
//   });

//   let micInputStream = micInstance.getAudioStream();

//   // Khởi tạo recognizer với model và sample rate
//   let recognizer = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE });
  
//   micInputStream.on('data', (data) => {
//     // Nếu recognizer nhận đủ dữ liệu để cho kết quả cuối cùng, nó sẽ trả về true
//     if (recognizer.acceptWaveform(data)) {
//       let result = recognizer.result(); // Trả về kết quả cuối cùng dưới dạng object
//       console.log("Kết quả nhận dạng:", result);
//       if (result && result.text) {
//         // Chuyển transcript cho controller xử lý (ví dụ: so sánh và gửi lệnh qua MQTT)
//         voiceController.handleTranscript(result.text);
//       }
//     } else {
//       // Bạn có thể xử lý kết quả tạm thời (partial result) nếu muốn
//       let partial = recognizer.partialResult();
//       console.log("Partial result:", partial);
//     }
//   });

//   micInputStream.on('error', (err) => {
//     console.error("Lỗi microphone stream:", err);
//   });

//   micInputStream.on('silence', () => {
//     console.log("Im lặng, chờ nhận dạng tiếp...");
//   });

//   micInstance.start();
//   console.log("Đang lắng nghe với Vosk. Nhấn Ctrl+C để dừng.");
// };
