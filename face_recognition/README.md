# 如何安装与运行项目

## 安装方式一：通过 `pip install -e .` 安装

1. 确保已安装 Python (>=3.7) 和 pip。
2. 克隆项目到本地：
```bash
cd deepface
```
3. 创建并激活一个虚拟环境（可选但推荐）：
```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
```
4. 安装项目及依赖：
```bash
pip install -e .
```

## 安装方式二：通过 Conda 安装

1. 确保已安装 Conda。
2. 使用 `environment.yml` 文件创建并激活 Conda 环境：
```bash
conda env create -f environment.yml
conda activate deepface_env
```
3. 确认安装成功，测试环境：
```bash
python -c "from deepface import DeepFace; print(DeepFace)"
```

# 启动PY服务器（开放API接口）

Linux
```bash
cd scripts
./service.sh
```
Windows：
```bash
cd deepface_change/deepface/api/src
python api.py
```


# How to Use DeepFace API

This guide demonstrates how to call the DeepFace API using `fetch` in JavaScript (for browsers) and `httpie` (a CLI tool for making HTTP requests).

---

## Endpoints

- `/represent` - Generate embeddings for an image.
- `/verify` - Compare two images to verify if they belong to the same person.
- `/analyze` - Perform demographic analysis on an image (e.g., age, gender, emotion).

### Base URL
Assume the API is hosted locally:
http://localhost:5000

---

## Fetch API Usage (JavaScript)

### Represent
```javascript
fetch('http://localhost:5000/represent', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        img: "<image_base64_or_url>",
        model_name: "VGG-Face",
        detector_backend: "opencv",
        enforce_detection: true,
        align: true
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Verify
```javascript
fetch('http://localhost:5000/verify', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        img1: "<image1_base64_or_url>",
        img2: "<image2_base64_or_url>",
        model_name: "VGG-Face",
        detector_backend: "opencv",
        distance_metric: "cosine",
        enforce_detection: true,
        align: true
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Analyze
```javascript
fetch('http://localhost:5000/analyze', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        img: "<image_base64_or_url>",
        actions: ["age", "gender", "emotion", "race"],
        detector_backend: "opencv",
        enforce_detection: true,
        align: true
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

---

## HTTPie Usage (Command Line)

### Represent
```bash
http POST http://localhost:5000/represent \
    img="<image_base64_or_url>" \
    model_name="VGG-Face" \
    detector_backend="opencv" \
    enforce_detection:=true \
    align:=true
```

```bash
http POST http://localhost:5000/represent img="<image_base64_or_url>" model_name="VGG-Face" detector_backend="opencv" enforce_detection:=true align:=true
```


### Verify
```bash
http POST http://localhost:5000/verify \
    img1="<image1_base64_or_url>" \
    img2="<image2_base64_or_url>" \
    model_name="VGG-Face" \
    detector_backend="opencv" \
    distance_metric="cosine" \
    enforce_detection:=true \
    align:=true
```

```bash
http POST http://localhost:5000/verify img1="<image1_base64_or_url>" img2="<image2_base64_or_url>" model_name="VGG-Face" detector_backend="opencv" distance_metric="cosine" enforce_detection:=true align:=true
```

### Analyze
```bash
http POST http://localhost:5000/analyze \
    img="<image_base64_or_url>" \
    actions:='["age", "gender", "emotion", "race"]' \
    detector_backend="opencv" \
    enforce_detection:=true \
    align:=true
```

```bash
http POST http://localhost:5000/analyze img="<image_base64_or_url>" actions:='["age", "gender", "emotion", "race"]' detector_backend="opencv" enforce_detection:=true align:=true
```

---

## Notes

1. Replace `<image_base64_or_url>` and `<image1_base64_or_url>` with actual base64-encoded image data or URLs.
2. Use the `:=` syntax in `httpie` for passing boolean or JSON data types.
3. Ensure the API server is running and accessible at the specified base URL.



## Acknowledgements

This project uses [DeepFace](https://github.com/serengil/deepface), a lightweight face recognition and facial attribute analysis framework, licensed under the MIT License.

DeepFace is developed by [Sefik Ilkin Serengil](https://github.com/serengil).