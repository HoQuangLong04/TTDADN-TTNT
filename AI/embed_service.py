# # embed_service.py
# import os
# from fastapi import FastAPI
# from pydantic import BaseModel
# from sentence_transformers import SentenceTransformer, util
# import uvicorn

# # Init
# app = FastAPI()
# # Load model fine-tuned
# model_path = os.getenv('MODEL_PATH', 'models/command-matching-model')
# model = SentenceTransformer(model_path)
# print(f"🔍 Loaded model from: {model_path}")
# print(f"> Transcript: {req.transcript}")
# print(f"> Commands: {req.commands}")
# print(f"> Similarities: {sims}")

# class SimilarityRequest(BaseModel):
#     transcript: str
#     commands: list[str]

# @app.post('/similarity')
# async def similarity(req: SimilarityRequest):
#     # Debug: log input
#     print(f">>> Similarity request - transcript: {req.transcript}, commands: {req.commands}")
#     # Encode transcript và commands
#     emb_trans = model.encode(req.transcript, convert_to_tensor=True)
#     embs_cmds = model.encode(req.commands, convert_to_tensor=True)
#     sims = util.cos_sim(emb_trans, embs_cmds)[0].cpu().tolist()
#     print(f">>> Similarities computed: {sims}")
#     return {'similarities': sims}

# if __name__ == '__main__':
#     uvicorn.run(app, host='0.0.0.0', port=int(os.getenv('PORT', 8000)))

# embed_service.py
import os
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import uvicorn

# Init
app = FastAPI()
# Load model fine-tuned
model_path = os.getenv('MODEL_PATH', 'models/command-matching-model')
model = SentenceTransformer(model_path)
print(f"🔍 Loaded model from: {model_path}")

class SimilarityRequest(BaseModel):
    transcript: str
    commands: list[str]

@app.post('/similarity')
async def similarity(req: SimilarityRequest):
  
    print(f">>> Similarity request - transcript: {req.transcript}, commands: {req.commands}")
    
   
    emb_trans = model.encode(req.transcript, convert_to_tensor=True)
    embs_cmds = model.encode(req.commands, convert_to_tensor=True)
    sims = util.cos_sim(emb_trans, embs_cmds)[0].cpu().tolist()
    
    print(f">>> Similarities computed: {sims}")
    return {'similarities': sims}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.getenv('PORT', 8000)))
