const attendanceLink = document.getElementById("attendanceLink");
hideLinks([attendanceLink]);

async function uploadAndVerify() {
    // 根据userFaceEmbeddingUUID取出相应的数组
    const userFaceEmbeddingUUID = document.getElementById("userFaceEmbeddingUUID").value; // 更新ID
    setUserUUID(userFaceEmbeddingUUID); // 设置userFaceEmbeddingUUID为StudentId
    const arrayJson = sessionStorage.getItem(userFaceEmbeddingUUID);
    const storedArray = JSON.parse(arrayJson);

    const imageInput = document.getElementById("imageUpload");

    const file = imageInput.files[0];

    if (!file) {
        alert("Please upload an image!");
        return;
    }
    // 将文件转换为 Base64 格式
    const fileBase64 = await fileToBase64(file);

    // 构造 JSON 数据
    const payload = {
        img1: storedArray, // !!!这里改为了区块链的storedArray
        img2: fileBase64,
        model_name: "VGG-Face",
        detector_backend: "opencv",
        distance_metric: "cosine",
        enforce_detection: true,
        align: true,
    };

    try {
        const response = await fetch("http://192.168.191.233:5000/verify", {
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
        displayVerificationResult(data);
    } catch (error) {
        console.error(error);
        alert("An error occurred during face verification, please check the console!");
    }
}

// Convert image to Base64 format
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // Do not remove Base64 prefix
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Update table to display verification result
async function displayVerificationResult(data) {
    const face_verificationBody = document.getElementById("face_verificationBody");
    face_verificationBody.innerHTML = ""; // Clear table content

    const { verified, distance, time } = data;
    const result = verified ? "Verification Passed" : "Verification Failed";
    const similarity = (1 - distance).toFixed(2); // Convert distance to similarity

    const row = document.createElement("tr");

    const resultCell = document.createElement("td");
    resultCell.textContent = result;

    const similarityCell = document.createElement("td");
    similarityCell.textContent = similarity;

    const timeCell = document.createElement("td");
    timeCell.textContent = `${time} seconds`;

    row.appendChild(resultCell);
    row.appendChild(similarityCell);
    row.appendChild(timeCell);
    face_verificationBody.appendChild(row);

    // If verification passed, get the user's UUID and display it
    if (verified) {
        const user = getUserFromCookies(); // Assuming there's a function to get user information from cookies
        const userId = user ? user.userId : null;

        if (userId) {
            //const userUUID = await checkUserUUID(userId);
            const userUUID = document.getElementById("UUID").value;
            if (userUUID) {
                alert(`Verification passed! Your UUID is: ${userUUID}`);
                showLinks([attendanceLink]);
                setFaceVerificationStatus(userId, verified);
            } else {
                alert("Verification passed, but we could not find your UUID.");
                /* alert("Verification passed."); */
            }
        } else {
            alert("Unable to retrieve current user information, please log in again.");
        }
    }
}

// Display file name
function updateFileName() {
    const fileInput = document.getElementById("imageUpload");
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "No file selected";
    document.getElementById("fileName").textContent = fileName;
}
