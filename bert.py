# import sys
# import json
# from transformers import AutoTokenizer, AutoModel
# import torch
# import numpy as np
# from sklearn.metrics.pairwise import cosine_similarity
# import os

# # Chuyển nơi lưu cache sang thư mục hiện tại
# os.environ["TRANSFORMERS_CACHE"] = "./transformers_cache"

# tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base", use_fast=False)
# model = AutoModel.from_pretrained("vinai/phobert-base")

# def get_sentence_embedding(sentence):
#     inputs = tokenizer(sentence, return_tensors="pt", truncation=True)
#     with torch.no_grad():
#         outputs = model(**inputs)
#     embeddings = outputs.last_hidden_state
#     mask = inputs['attention_mask'].unsqueeze(-1).expand(embeddings.size())
#     masked_embeddings = embeddings * mask
#     summed = torch.sum(masked_embeddings, 1)
#     counts = torch.clamp(mask.sum(1), min=1e-9)
#     mean_pooled = summed / counts
#     return mean_pooled[0].numpy()

# def find_best_match(input_sentence, candidate_sentences):
#     input_vec = get_sentence_embedding(input_sentence)
#     candidate_vecs = [get_sentence_embedding(s) for s in candidate_sentences]
#     similarities = cosine_similarity([input_vec], candidate_vecs)[0]
#     best_index = np.argmax(similarities)
#     return {
#         "best_sentence": candidate_sentences[best_index],
#         "similarity": float(similarities[best_index])
#     }

# if __name__ == "__main__":
#     data = json.loads(sys.stdin.read())
#     input_sentence = data["input"]
#     candidates = data["candidates"]
#     result = find_best_match(input_sentence, candidates)
#     print(json.dumps(result))



# import sys, json, os
# from transformers import AutoTokenizer, AutoModel
# import torch
# import numpy as np
# from sklearn.metrics.pairwise import cosine_similarity

# # Chuyển cache ra thư mục dự án
# os.environ["HF_HOME"] = "./transformers_cache"
# # Nếu bạn không đặt HF_HUB_TOKEN ngoài, bạn có thể đặt ở đây:
# os.environ["HF_HUB_TOKEN"] = "///////"

# # tokenizer = AutoTokenizer.from_pretrained(
# #     "vinai/phobert-base",
# #     use_fast=False,
# #     use_auth_token=True
# # )
# # model = AutoModel.from_pretrained(
# #     "vinai/phobert-base",
# #     use_auth_token=True
# # )
# tokenizer = AutoTokenizer.from_pretrained(
#     "vinai/phobert-base",
#     use_fast=False,
#     token=os.getenv("HF_HUB_TOKEN")  # <-- Sử dụng token môi trường
# )

# model = AutoModel.from_pretrained(
#     "vinai/phobert-base",
#     token=os.getenv("HF_HUB_TOKEN")  # <-- Sử dụng token môi trường
# )

# def get_sentence_embedding(sentence):
#     inputs = tokenizer(sentence, return_tensors="pt", truncation=True)
#     with torch.no_grad():
#         outputs = model(**inputs)
#     embeddings = outputs.last_hidden_state
#     mask = inputs['attention_mask'].unsqueeze(-1).expand(embeddings.size())
#     masked_embeddings = embeddings * mask
#     summed = torch.sum(masked_embeddings, 1)
#     counts = torch.clamp(mask.sum(1), min=1e-9)
#     mean_pooled = summed / counts
#     return mean_pooled[0].numpy()

# def find_best_match(input_sentence, candidate_sentences):
#     input_vec = get_sentence_embedding(input_sentence)
#     candidate_vecs = [get_sentence_embedding(s) for s in candidate_sentences]
#     similarities = cosine_similarity([input_vec], candidate_vecs)[0]
#     best_index = np.argmax(similarities)
#     return {
#         "best_sentence": candidate_sentences[best_index],
#         "similarity": float(similarities[best_index])
#     }

# if __name__ == "__main__":
#     data = json.loads(sys.stdin.read())
#     input_sentence = data["input"]
#     candidates = data["candidates"]
#     result = find_best_match(input_sentence, candidates)
#     print(json.dumps(result))


# import os
# import sys
# import json
# import requests

# # Thay bằng API key của bạn
# HF_API_TOKEN = "


# # API_URL = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{MODEL}"
# # API_URL = f"https://huggingface.co/models/{MODEL}"
# API_URL = f"https://huggingface.co/vinai/phobert-base"

# HEADERS = {
#     "Authorization": f"Bearer {HF_API_TOKEN}",
#     "Content-Type": "application/json"
# }

# def get_sentence_embedding(sentence):
#     payload = {"inputs": sentence}
#     response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=60)
#     response.raise_for_status()
#     # API trả về mảng shape [seq_len, hidden_size]
#     embeddings = response.json()
#     # Tính mean pooling
#     import numpy as np
#     arr = np.array(embeddings)
#     mask = np.ones(arr.shape[:-1])  # giả sử không cần mask vì API trả chỉ tokens
#     summed = np.sum(arr * mask[..., None], axis=0)
#     mean_pooled = summed / arr.shape[0]
#     return mean_pooled.tolist()

# def find_best_match(input_sentence, candidate_sentences):
#     import numpy as np
#     from sklearn.metrics.pairwise import cosine_similarity

#     input_vec = get_sentence_embedding(input_sentence)
#     candidate_vecs = [get_sentence_embedding(s) for s in candidate_sentences]
#     sims = cosine_similarity([input_vec], candidate_vecs)[0]
#     best_idx = int(np.argmax(sims))
#     return {
#         "best_sentence": candidate_sentences[best_idx],
#         "similarity": float(sims[best_idx])
#     }

# if __name__ == "__main__":
#     data = json.loads(sys.stdin.read())
#     inp = data["input"]
#     cands = data["candidates"]
#     result = find_best_match(inp, cands)
#     print(json.dumps(result))



# import os
# import sys
# import json
# import torch
# import numpy as np
# from transformers import AutoTokenizer, AutoModel
# from sklearn.metrics.pairwise import cosine_similarity

# MODEL_NAME = "vinai/phobert-base"

# # Tải tokenizer và model cục bộ
# tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
# model = AutoModel.from_pretrained(MODEL_NAME)
# model.eval()  # chuyển model sang chế độ eval
# if torch.cuda.is_available():
#     model.to("cuda")

# def get_sentence_embedding(sentence):
#     # Tokenize câu và tạo tensor
#     inputs = tokenizer(sentence, return_tensors="pt", truncation=True, padding=True)
#     if torch.cuda.is_available():
#         inputs = {k: v.to("cuda") for k, v in inputs.items()}
    
#     # Lấy output của model
#     with torch.no_grad():
#         outputs = model(**inputs)
#     # outputs.last_hidden_state có shape [batch_size, seq_len, hidden_size]
#     # Ta tính mean pooling theo chiều seq_len để có vector duy nhất cho câu
#     embeddings = outputs.last_hidden_state.squeeze(0).cpu().numpy()  # shape (seq_len, hidden_size)
#     mean_pooled = np.mean(embeddings, axis=0)
#     return mean_pooled.tolist()

# def find_best_match(input_sentence, candidate_sentences):
#     input_vec = np.array(get_sentence_embedding(input_sentence))
#     candidate_vecs = [np.array(get_sentence_embedding(s)) for s in candidate_sentences]
#     sims = cosine_similarity([input_vec], candidate_vecs)[0]
#     best_idx = int(np.argmax(sims))
#     return {
#         "best_sentence": candidate_sentences[best_idx],
#         "similarity": float(sims[best_idx])
#     }

# if __name__ == "__main__":
#     data = json.loads(sys.stdin.read())
#     inp = data["input"]
#     cands = data["candidates"]
#     result = find_best_match(inp, cands)
#     print(json.dumps(result))




# import os
# import sys
# import json
# import torch
# import numpy as np
# from transformers import AutoTokenizer, AutoModel
# from sklearn.metrics.pairwise import cosine_similarity

# MODEL_PATH = "D:/Code_2025/Do_an_Tong_hop/Smart_home/vn"  

# tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
# model = AutoModel.from_pretrained(MODEL_PATH)

# model.eval()  # chuyển sang chế độ eval để inference
# if torch.cuda.is_available():
#     model.to("cuda")

# def get_sentence_embedding(sentence):
#     inputs = tokenizer(sentence, return_tensors="pt", truncation=True, padding=True)
#     if torch.cuda.is_available():
#         inputs = {k: v.to("cuda") for k, v in inputs.items()}
    
#     with torch.no_grad():
#         outputs = model(**inputs)

#     # Mean pooling over token embeddings
#     embeddings = outputs.last_hidden_state.squeeze(0).cpu().numpy()
#     mean_pooled = np.mean(embeddings, axis=0)
#     return mean_pooled.tolist()

# def find_best_match(input_sentence, candidate_sentences):
#     input_vec = np.array(get_sentence_embedding(input_sentence))
#     candidate_vecs = [np.array(get_sentence_embedding(s)) for s in candidate_sentences]
#     sims = cosine_similarity([input_vec], candidate_vecs)[0]
#     best_idx = int(np.argmax(sims))
#     return {
#         "best_sentence": candidate_sentences[best_idx],
#         "similarity": float(sims[best_idx])
#     }

# if __name__ == "__main__":
#     data = json.loads(sys.stdin.read())
#     inp = data["input"]
#     cands = data["candidates"]
#     result = find_best_match(inp, cands)
#     print(json.dumps(result))
