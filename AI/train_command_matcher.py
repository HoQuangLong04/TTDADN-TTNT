# train_command_matcher.py
import os
import shutil
import csv
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader
load_dotenv()
hf_cache_dir = os.getenv('HF_CACHE_DIR')


# Đọc dữ liệu huấn luyện từ file command.csv
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
    
    # Phần này là chuẩn bị dữ liệu và mô hình.
    # Nếu đã tồn tại thư mục cũ thì nó sẽ xóa thư mục đó đi và train lại từ đầu.  
    model_dir = 'models/command-matching-model'
    if os.path.exists(model_dir):
        print(f"Removing existing model directory: {model_dir}")
        shutil.rmtree(model_dir)
    os.makedirs(model_dir, exist_ok=True)

    # Thư mục chưá mô hình đã đc huấn luyện 
    train_examples = load_data('data/commands.csv')
    train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=16)
    train_loss = losses.CosineSimilarityLoss(model=None)

    # Đây thì là 1 model đã được huấn luyện sẵn để tìm độ giống nhau của các câu, nhưng ở đây mình huấn luyện thêm cái model này dựa trên dữ liệu của mình nên nó sẽ thông minh hơn.
    model = SentenceTransformer(
        'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
        # 
        cache_folder= hf_cache_dir
    )
    train_loss.model = model

    print("Starting training...")
    model.fit(
        train_objectives=[(train_dataloader, train_loss)],
        epochs=5,           # Ở đây nó sẽ học qua dữ liệu 5 lần 
        warmup_steps=int(len(train_dataloader) * 0.1),
        output_path=model_dir
    )
    print(f"Training completed. New model saved to '{model_dir}'")

if __name__ == '__main__':
    main()