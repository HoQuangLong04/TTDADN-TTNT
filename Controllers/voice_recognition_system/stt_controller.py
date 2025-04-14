# # from flask import Blueprint, request, jsonify
# # import wave
# # import json
# # from models.vosk_model import load_model
# # from vosk import KaldiRecognizer

# # stt_controller = Blueprint('stt_controller', __name__)
# # model = load_model()

# # @stt_controller.route('/stt', methods=['POST'])
# # def speech_to_text():
# #     if 'audio' not in request.files:
# #         return jsonify({"error": "Không có file audio được cung cấp"}), 400

# #     audio_file = request.files['audio']
# #     wf = wave.open(audio_file, "rb")

# #     # Kiểm tra định dạng file (PCM 16-bit mono 16kHz)
# #     if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
# #         return jsonify({"error": "Audio phải là PCM 16-bit mono 16kHz"}), 400

# #     rec = KaldiRecognizer(model, wf.getframerate())
# #     results = []
# #     while True:
# #         data = wf.readframes(4000)
# #         if len(data) == 0:
# #             break
# #         if rec.AcceptWaveform(data):
# #             result = json.loads(rec.Result())
# #             results.append(result.get("text", ""))
# #     final_result = json.loads(rec.FinalResult())
# #     results.append(final_result.get("text", ""))
# #     transcript = " ".join(results)
# #     return jsonify({"transcript": transcript})
# from flask import Blueprint, request, jsonify
# import wave
# import json
# from models.vosk_model import load_model
# from vosk import KaldiRecognizer
# from Controllers.voice_recognition_system.node_client import send_transcript_to_node  # Import hàm gửi transcript

# stt_controller = Blueprint('stt_controller', __name__)
# model = load_model()


# @stt_controller.route('/stt', methods=['POST'])
# def speech_to_text():
#     if 'audio' not in request.files:
#         return jsonify({"error": "Không có file audio được cung cấp"}), 400

#     audio_file = request.files['audio']
#     wf = wave.open(audio_file, "rb")

#     if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
#         return jsonify({"error": "Audio phải là PCM 16-bit mono 16kHz"}), 400

#     rec = KaldiRecognizer(model, wf.getframerate())
#     results = []
#     while True:
#         data = wf.readframes(4000)
#         if len(data) == 0:
#             break
#         if rec.AcceptWaveform(data):
#             result = json.loads(rec.Result())
#             results.append(result.get("text", ""))
#     final_result = json.loads(rec.FinalResult())
#     results.append(final_result.get("text", ""))
#     transcript = " ".join(results)
    
#     # Gửi transcript sang Node.js
#     send_transcript_to_node(transcript)
    
#     return jsonify({"transcript": transcript})
