
# import queue
# import sys
# sys.stdout.reconfigure(encoding='utf-8')
# import json
# import sounddevice as sd
# from vosk import KaldiRecognizer

# import sys, os
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# # from Controllers.voice_recognition_system.node_client import send_transcript_to_node  # Import hàm gửi transcript
# from Controllers.voice_recognition_system.node_client import send_transcript_to_node

# q = queue.Queue()

# def callback(indata, frames, time, status):
#     if status:
#         print(status, file=sys.stderr)
#     q.put(bytes(indata))

# def start_mic_listener(model):
#     rec = KaldiRecognizer(model, 16000)
#     with sd.RawInputStream(samplerate=16000, blocksize=8000, dtype='int16',
#                            channels=1, callback=callback):
#         print("Bắt đầu lắng nghe microphone. Hãy nói gì đó...")
#         while True:
#             data = q.get()
#             if rec.AcceptWaveform(data):
#                 result = rec.Result()
#                 result_json = json.loads(result)
#                 transcript = result_json.get("text", "")
#                 print("Kết quả cuối:", transcript)
#                 # Gửi transcript tới Node.js
#                 send_transcript_to_node(transcript)
#             else:
#                 partial_result = rec.PartialResult()
#                 partial_json = json.loads(partial_result)
#                 print("Kết quả tạm thời:", partial_json.get("partial", ""))

# if __name__ == '__main__':
#     from models.vosk_model import load_model
#     model = load_model()
#     start_mic_listener(model)
