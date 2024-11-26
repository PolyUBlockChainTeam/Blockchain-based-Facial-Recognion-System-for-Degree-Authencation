async function uploadAndGenerateEmbedding() {
    const user = getUserFromCookies();  // 获取当前用户
    const userId = user ? user.userId : null;
    
    if (!userId) return;
    // 老师不能生成
    if (getUserRole(userId)=='teacher') {
        alert("You are not student!")
        return;
    }

    const studentID = userId
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
        if (result) {
            // console.log("result:",result);
            
            // !!!result.embedding 是一个固定长度为 4096 的数组 需要传入区块链!!!
            console.log("result.embedding:",result.embedding);
            // 示例：解析并调用 displayEmbedding 函数
            displayEmbedding(result?.face_confidence || 0, result?.embedding || []);

            // 当玩家 Embedding 成功生成后，自动添加 UUID 或绑定现有的 UUID
            // 调用 addUserUUID(userId, uuid) ：
            // 1. 如果传入的 uuid 为 null，自动为用户生成随机 UUID 并绑定。
            // 2. 如果传入的 uuid 不为空，则绑定该值到用户（作为用户的 UUID）。
            // 3. 如果用户已有 UUID，则不会重新生成，而是直接返回已有的 UUID。
            try {
                // !!!这里应该是把区块链生成的UUID传到这里!!!
                const newUUID = await addUserUUID(userId, '11111111111'); // !!!调用生成并绑定 UUID 的函数 这里默认是'11111111111'!!!
                if (newUUID) {
                    alert(`成功生成 Embedding，且为用户分配了 UUID：${newUUID}`);
                } else {
                    alert("生成 Embedding 成功，但未能为用户生成 UUID！");
                }
            } catch (error) {
                console.error("Error during UUID generation:", error);
                alert("生成 UUID 时出错，请稍后再试！");
            }
        } else {
            alert("未能生成有效的嵌入结果！");
        }
    } catch (error) {
        console.error(error);
        alert("生成嵌入时出错，请确保Python人脸识别服务器5000已经开启，请检查控制台！");
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