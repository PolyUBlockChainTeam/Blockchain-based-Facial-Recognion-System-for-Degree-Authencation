from deepface import DeepFace
result = DeepFace.verify(
  img1_path = "D:\downloads\imgs\20240201165644184.jpg",
  img2_path = "D:\downloads\imgs\20240201165704984.jpg",
)
print(result)