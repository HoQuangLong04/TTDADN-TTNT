import sys, speech_recognition as sr, json

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

r = sr.Recognizer()

with sr.Microphone() as source:
    print("Hiệu chuẩn môi trường 1 giây...", file=sys.stderr)
    r.adjust_for_ambient_noise(source, duration=1)
    print("Đang ghi âm...", file=sys.stderr)
    try:
        audio = r.listen(source, timeout=5, phrase_time_limit=8)
    except sr.WaitTimeoutError:
        print(json.dumps({"error": "Không nghe bạn nói gì."}))
        sys.exit(0)

try:
    text = r.recognize_google(audio, language='vi-VN')
    print(json.dumps({"transcript": text}))
except sr.UnknownValueError:
    print(json.dumps({"error": "Không hiểu bạn nói gì."}))
except sr.RequestError as e:
    print(json.dumps({"error": f"Lỗi kết nối: {e}"}))
