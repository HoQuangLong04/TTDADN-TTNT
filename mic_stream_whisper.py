# import sys
# sys.stdout.reconfigure(encoding='utf-8')

# import os
# os.environ["XDG_CACHE_HOME"] = "C:/Temp/whisper_cache"
# os.environ["PATH"] += os.pathsep + r"C:/Program Files (x86)/ffmpeg-7.1.1-full_build\bin"


# import queue
# import json
# import sounddevice as sd
# import soundfile as sf
# import whisper
# import time
# import os
# import tempfile

# # Cấu hình thu âm
# record_duration = 3    # thời gian ghi âm (giây)
# sample_rate = 16000    # sample rate (Whisper thường hoạt động tốt với 16kHz)

# print("Bắt đầu ghi âm...", file=sys.stderr)
# audio = sd.rec(int(record_duration * sample_rate), samplerate=sample_rate, channels=1, dtype='int16')
# sd.wait()
# print("Ghi âm hoàn tất.", file=sys.stderr)

# # Lưu audio ghi được vào file WAV tạm thời
# with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
#     tmp_filename = tmp.name
#     sf.write(tmp_filename, audio, sample_rate)
#     print(f"Audio được lưu tạm tại {tmp_filename}", file=sys.stderr)

# # Tải model Whisper (bạn có thể chọn 'tiny', 'base', 'small', 'medium', 'large')
# model = whisper.load_model("small")  # Chọn model phù hợp với tài nguyên của bạn
# print("Model Whisper đã được tải.", file=sys.stderr)

# # Dùng model để transcribe file WAV
# result = model.transcribe(tmp_filename, fp16=False, language='vi')  # fp16=False nếu chạy trên CPU
# transcript = result.get("text", "").strip()
# print(f"Transcript: {transcript}", file=sys.stderr)

# # Xóa file tạm sau khi sử dụng
# os.remove(tmp_filename)




# # In kết quả transcript dưới dạng JSON (chỉ in JSON trên stdout)
# print(json.dumps({"transcript": transcript}))
