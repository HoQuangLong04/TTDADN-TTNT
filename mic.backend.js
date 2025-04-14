// const record = require('node-record-lpcm16');
// const io = require('socket.io-client');

// // Kết nối tới Flask-SocketIO server (đang chạy trên port 5000)
// const socket = io('http://localhost:5000');

// socket.on('connect', () => {
//   console.log('Connected to Python WebSocket server.');

//   // Bắt đầu ghi âm từ microphone với các tham số phù hợp (16kHz, PCM 16-bit, mono)
//   const recording = record.record({
//     sampleRate: 16000,
//     threshold: 0, // ghi toàn bộ dữ liệu
//     verbose: false,
//     // recordProgram: 'sox' có thể thay bằng 'arecord' trên Linux nếu cần
//     recordProgram: 'sox',
//     silence: '10.0' // dừng ghi sau 10 giây im lặng (tùy chọn)
//   });

//   // Lắng nghe stream ghi âm và gửi dữ liệu từng chunk qua Socket.IO
//   recording.stream().on('data', (data) => {
//     socket.emit('audio_chunk', data);
//   });
// });

// // Nhận kết quả transcript hoàn chỉnh
// socket.on('transcript', (data) => {
//   console.log('Transcript:', data);
// });

// // Nhận kết quả transcript tạm thời
// socket.on('transcript_partial', (data) => {
//   console.log('Partial Transcript:', data);
// });

// socket.on('disconnect', () => {
//   console.log('Disconnected from Python WebSocket server.');
// });
