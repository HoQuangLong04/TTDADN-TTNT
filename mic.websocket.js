// const io = require('socket.io-client');
// const fs = require('fs');
// const path = require('path');

// // Kết nối tới Flask-SocketIO server (chạy trên port 5000)
// const socket = io('http://localhost:5000');

// socket.on('connect', () => {
//     console.log('Connected to Python WebSocket server.');

//     // Ví dụ: gửi dữ liệu từ file audio (để test)
//     // File audio phải ở định dạng PCM 16-bit mono, 16kHz.
//     const audioFilePath = path.join(__dirname, 'audio_test.wav');
//     const readStream = fs.createReadStream(audioFilePath);

//     readStream.on('data', (chunk) => {
//         socket.emit('audio_chunk', chunk);
//     });
// });

// socket.on('transcript', (data) => {
//     console.log('Transcript:', data);
//     // Ở đây bạn có thể xử lý, ví dụ lưu vào DB, gửi đến client, ...
// });

// socket.on('transcript_partial', (data) => {
//     console.log('Partial Transcript:', data);
// });

// socket.on('disconnect', () => {
//     console.log('Disconnected from Python WebSocket server.');
// });
