async function uploadAndGenerateEmbedding() {
    const user = getUserFromCookies();  // Get current user
    const userId = user ? user.userId : null;
    
    if (!userId) return;
    // Teachers cannot generate embeddings
    if (getUserRole(userId) === 'teacher') {
        alert("You are not a student!");
        return;
    }

    const studentID = userId;
    const imageInput = document.getElementById("imageUpload");
    const file = imageInput.files[0];

    if (!file) {
        alert("Please select an image first!");
        return;
    }

    // Convert the file to Base64 or another serializable format
    const fileBase64 = await fileToBase64(file);

    // Construct the JSON data
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
                "Content-Type": "application/json", // Set JSON request header
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("API call failed!");
        }

        const data = await response.json();
        const result = data.results[0];
        if (result) {
            // console.log("result:",result);
            
            // !!!result.embedding 是一个固定长度为 4096 的数组 需要传入区块链!!!
            // 数组过长不能传入区块链，将数组json化，存入sessionStorage，它的faceEmbeddingUUID为随机生成的uuid，将uuid存入区块链
            console.log("result.embedding:",result.embedding);
            const arrayJson = JSON.stringify(result.embedding);//json化的结果数据
            console.log("识别结果json:"+arrayJson);
            const faceEmbeddingUUID = uuid.v4();
            console.log("测试faceEmbeddingUUID:"+faceEmbeddingUUID);
            sessionStorage.setItem(faceEmbeddingUUID,arrayJson);
            console.log("测试根据faceEmbeddingUUID拿出识别数组:"+JSON.parse(sessionStorage.getItem(faceEmbeddingUUID)));
            // 示例：解析并调用 displayEmbedding 函数
            displayEmbedding(result?.face_confidence || 0, result?.embedding || []);

            // 当玩家 Embedding 成功生成后，自动添加 UUID 或绑定现有的 UUID
            // 调用 addUserUUID(userId, uuid) ：
            // 1. 如果传入的 uuid 为 null，自动为用户生成随机 UUID 并绑定。
            // 2. 如果传入的 uuid 不为空，则绑定该值到用户（作为用户的 UUID）。
            // 3. 如果用户已有 UUID，则不会重新生成，而是直接返回已有的 UUID。
            try {
                // !!!这里应该是把区块链生成的UUID传到这里!!!
                // 这里对faceEmbeddingUUID进行一次双重嵌套
                const newUUID = uuid.v4(); // 再新生成一个UUID和faceEmbeddingUUID对应
                try {
                    await contract.methods.storeUUIDName(newUUID,faceEmbeddingUUID).send({ from: senderAccount });//这里向区块链内部存入数据
                    console.log("Picture information added with UUID: " + newUUID);
                } catch (error) {
                    console.error("Error store information:", error);
                }
                
                if (newUUID) {
                    alert(`Successfully generated the embedding, and allocated UUID to the user: ${newUUID}`);
                    const faceEmbeddingLink = document.getElementById("face_embeddingLink");
                    const faceVerificationLink = document.getElementById("face_verificationLink");
                    showLinks([faceVerificationLink]);
                    hideLinks([faceEmbeddingLink]);
                } else {
                    alert("Successfully generated the embedding, but failed to generate UUID for the user!");
                }
            } catch (error) {
                console.error("Error during UUID generation:", error);
                alert("An error occurred while generating the UUID, please try again later!");
            }
        } else {
            alert("Failed to generate a valid embedding result!");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while generating the embedding. Please make sure the Python face recognition server on port 5000 is running, and check the console!");
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // reader.onload = () => resolve(reader.result.split(",")[1]); // Remove Base64 prefix
        reader.onload = () => resolve(reader.result); // Do not remove Base64 prefix
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function displayEmbedding(faceConfidence, embedding) {
    const face_embeddingBody = document.getElementById("face_embeddingBody");
    face_embeddingBody.innerHTML = ""; // Clear the table contents

    embedding.forEach((value) => {
        const row = document.createElement("tr");

        const confidenceCell = document.createElement("td");
        confidenceCell.textContent = faceConfidence.toFixed(2); // Display confidence with two decimal places

        const valueCell = document.createElement("td");
        valueCell.textContent = value;

        row.appendChild(confidenceCell);
        row.appendChild(valueCell);
        face_embeddingBody.appendChild(row);
    });
}

// Display uploaded file name
function updateFileName() {
    const fileInput = document.getElementById("imageUpload");
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "No file selected";
    document.getElementById("fileName").textContent = fileName;
}
