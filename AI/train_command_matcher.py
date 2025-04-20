# # train_command_matcher.py
# import os
# import csv
# from sentence_transformers import SentenceTransformer, InputExample, losses
# from torch.utils.data import DataLoader

# def load_data(csv_path):
#     examples = []
#     with open(csv_path, encoding='utf8') as f:
#         reader = csv.DictReader(f)
#         for row in reader:
#             examples.append(
#                 InputExample(texts=[row['text1'], row['text2']], label=float(row['label']))
#             )
#     return examples


# def main():
#     # Tạo thư mục lưu model nếu chưa có
#     os.makedirs('models/command-matching-model', exist_ok=True)

#     # Load data
#     train_examples = load_data('data/commands.csv')
#     train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=16)
#     train_loss = losses.CosineSimilarityLoss(model=None)  # model set dưới

#     # Load pretrained multilingual model
#     # model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
#     model = SentenceTransformer(
#     'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
#     cache_folder='D:/Code_2025/huggingface_cache'
#     )


#     train_loss.model = model

#     # Huấn luyện
#     model.fit(
#         train_objectives=[(train_dataloader, train_loss)],
#         epochs=5,
#         warmup_steps=int(len(train_dataloader) * 0.1),
#         output_path='models/command-matching-model'
#     )
#     print("✔️ Training completed. Model saved to 'models/command-matching-model'")

# if __name__ == '__main__':
#     main()



# train_command_matcher.py
import os
import shutil
import csv
from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader

def load_data(csv_path):
    examples = []
    with open(csv_path, encoding='utf8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            examples.append(
                InputExample(texts=[row['text1'], row['text2']], label=float(row['label']))
            )
    return examples


def main():
    model_dir = 'models/command-matching-model'
    # Nếu thư mục model tồn tại, xóa để train mới hoàn toàn
    if os.path.exists(model_dir):
        print(f"🔄 Removing existing model directory: {model_dir}")
        shutil.rmtree(model_dir)
    # Tạo lại thư mục lưu model
    os.makedirs(model_dir, exist_ok=True)

    # Load data
    train_examples = load_data('data/commands.csv')
    train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=16)
    train_loss = losses.CosineSimilarityLoss(model=None)

    # Load pretrained multilingual model
    model = SentenceTransformer(
        'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
        cache_folder='D:/Code_2025/huggingface_cache'
    )
    train_loss.model = model

    # Huấn luyện
    print("🚀 Starting training...")
    model.fit(
        train_objectives=[(train_dataloader, train_loss)],
        epochs=5,
        warmup_steps=int(len(train_dataloader) * 0.1),
        output_path=model_dir
    )
    print(f"✔️ Training completed. New model saved to '{model_dir}'")

if __name__ == '__main__':
    main()