import os
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import uvicorn


app = FastAPI()
model_path = os.getenv('MODEL_PATH', 'models/command-matching-model')
model = SentenceTransformer(model_path)
print(f"Loaded model from: {model_path}")


# Định nghĩa dữ liêu jddaauf vào cho FastAPI 
class SimilarityRequest(BaseModel):
    transcript: str
    commands: list[str]

# API 
@app.post('/similarity')
async def similarity(req: SimilarityRequest):
    # print(f">>> Similarity request - transcript: {req.transcript}, commands: {req.commands}")
    
    # Ở đây kiểu như nó sẽ tạo vecto cho câu lệnh (biến chữ trong câu lệnh thành vecto số) và câu nói mà nó nhận đc 
    # thông qua cái nhận diện giọng nói, 
    # sau đó, nó sẽ tính tỉ lệ giống nhau giữa 2 câu dựa trên góc của hai vecto này, càng gần 1 thì càng giống và ngược lại với 0.
    emb_trans = model.encode(req.transcript, convert_to_tensor=True)
    embs_cmds = model.encode(req.commands, convert_to_tensor=True)
    sims = util.cos_sim(emb_trans, embs_cmds)[0].cpu().tolist()
    
    # print(f">>> Similarities computed: {sims}")
    return {'similarities': sims}

if __name__ == '__main__':
    # uvicorn.run(app, host='0.0.0.0', port=int(os.getenv('PORT', 8000)))
    # Tắt thông báo ghi gọi đến APIFast 
    uvicorn.run(app, host='0.0.0.0',  port=int(os.getenv('PORT', 8000)), log_level="warning", access_log=False)

