async function uploadAndVerify() {
    const imageInput1 = document.getElementById("imageUpload1");
    const imageInput2 = document.getElementById("imageUpload2");

    const file1 = imageInput1.files[0];
    const file2 = imageInput2.files[0];

    if (!file1 || !file2) {
        alert("请上传两张图片！");
        return;
    }

    // 将文件转换为 Base64 格式
    const fileBase64_1 = await fileToBase64(file1);
    const fileBase64_2 = await fileToBase64(file2);

    // 构造 JSON 数据
    const payload = {
        img1: fileBase64_1,
        img2: fileBase64_2,
        model_name: "VGG-Face",
        detector_backend: "opencv",
        distance_metric: "cosine",
        enforce_detection: true,
        align: true,
    };

    try {
        const response = await fetch("http://localhost:5000/verify", {
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
        displayVerificationResult(data);
    } catch (error) {
        console.error(error);
        alert("验证人脸时出错，请检查控制台！");
    }
}

// 将图片转换为 Base64 格式
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // 不去掉 Base64 前缀
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 更新表格显示验证结果
function displayVerificationResult(data) {
    const face_verificationBody = document.getElementById("face_verificationBody");
    face_verificationBody.innerHTML = ""; // 清空表格内容

    const { verified, distance, time } = data;
    const result = verified ? "通过验证" : "验证失败";
    const similarity = (1 - distance).toFixed(2); // 将距离转换为相似度

    const row = document.createElement("tr");

    const resultCell = document.createElement("td");
    resultCell.textContent = result;

    const similarityCell = document.createElement("td");
    similarityCell.textContent = similarity;

    const timeCell = document.createElement("td");
    timeCell.textContent = `${time}秒`;

    row.appendChild(resultCell);
    row.appendChild(similarityCell);
    row.appendChild(timeCell);
    face_verificationBody.appendChild(row);
}
