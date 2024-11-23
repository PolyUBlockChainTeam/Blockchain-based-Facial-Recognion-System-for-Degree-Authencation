async function uploadAndGenerateEmbedding() {
    const imageInput = document.getElementById("imageUpload");
    const file = imageInput.files[0];

    if (!file) {
        alert("请先选择一张图片！");
        return;
    }

    // 将文件转换为 Base64 或其他可序列化的格式
    const fileBase64 = await fileToBase64(file);

    // 构造 JSON 数据
    const payload = {
        img: fileBase64,
        model_name: "VGG-Face",
        detector_backend: "opencv",
        enforce_detection: true,
        align: true,
    };

    try {
        const response = await fetch("http://localhost:5000/represent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // 设置 JSON 请求头
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("API 调用失败！");
        }

        const data = await response.json();
        const result = data.results[0];
        displayEmbedding(result?.face_confidence || 0, result?.embedding || []);
    } catch (error) {
        console.error(error);
        alert("生成嵌入时出错，请检查控制台！");
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // reader.onload = () => resolve(reader.result.split(",")[1]); // 去掉 Base64 前缀
        reader.onload = () => resolve(reader.result); // 不去掉 Base64 前缀
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


function displayEmbedding(faceConfidence, embedding) {
    const face_embeddingBody = document.getElementById("face_embeddingBody");
    face_embeddingBody.innerHTML = ""; // 清空表格内容

    embedding.forEach((value) => {
        const row = document.createElement("tr");

        const confidenceCell = document.createElement("td");
        confidenceCell.textContent = faceConfidence.toFixed(2); // 显示置信度保留两位小数

        const valueCell = document.createElement("td");
        valueCell.textContent = value;

        row.appendChild(confidenceCell);
        row.appendChild(valueCell);
        face_embeddingBody.appendChild(row);
    });
}