from pathlib import Path
from deepface import DeepFace

# 使用 Path 构建跨平台路径
img1_path = Path("D:/downloads/imgs/20240201165644184.jpg")
img2_path = Path("D:/downloads/imgs/20240201165704984.jpg")

# DeepFace 验证
result = DeepFace.verify(img1_path=str(img1_path), img2_path=str(img2_path))
print(result)
