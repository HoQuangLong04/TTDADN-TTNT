# # from flask import Flask

# # from Controllers.voice_recognition_system.stt_controller import stt_controller

# # import threading
# # from models.vosk_model import load_model
# # from services.mic_service import start_mic_listener

# # app = Flask(__name__)
# # app.register_blueprint(stt_controller)

# # if __name__ == '__main__':
# #     model = load_model()
# #     # Chạy mic listener trong 1 thread nền
# #     threading.Thread(target=start_mic_listener, args=(model,), daemon=True).start()
# #     app.run(host='0.0.0.0', port=5000)
# from flask import Flask, request
# from flask_socketio import SocketIO, emit
# import json
# from vosk import KaldiRecognizer
# from models.vosk_model import load_model



# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")
# model = load_model()
# recognizers = {}

# @socketio.on('connect')
# def handle_connect():
#     sid = request.sid
#     recognizers[sid] = KaldiRecognizer(model, 16000)
#     print(f"Client connected: {sid}")

# @socketio.on('disconnect')
# def handle_disconnect():
#     sid = request.sid
#     if sid in recognizers:
#         del recognizers[sid]
#     print(f"Client disconnected: {sid}")

# @socketio.on('audio_chunk')
# def handle_audio_chunk(data):
#     sid = request.sid
#     rec = recognizers.get(sid)
#     if not rec:
#         return

#     if rec.AcceptWaveform(data):
#         result = json.loads(rec.Result())
#         transcript = result.get("text", "")
#         emit('transcript', transcript)
#     else:
#         partial_result = json.loads(rec.PartialResult())
#         emit('transcript_partial', partial_result.get("partial", ""))

# if __name__ == '__main__':
#     socketio.run(app, host='0.0.0.0', port=5000)
