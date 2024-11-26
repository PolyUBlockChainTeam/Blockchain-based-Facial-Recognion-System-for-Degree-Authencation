// 定义异步函数：检查用户是否有 UUID
async function checkUserUUID(userId) {
    try {
        // 调用后端 API 查询 uuid
        const response = await fetch(`http://localhost:4000/users/${userId}/uuid`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 如果用户不存在（状态码 404），抛出异常
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found.');
            } else {
                throw new Error('Failed to fetch UUID.');
            }
        }

        // 如果状态码是 200，解析 JSON 数据
        const data = await response.json();
        return data.uuid; // 返回的是 UUID 值或 null
    } catch (error) {
        console.error('Error in checkUserUUID:', error);
        return null;
    }
}

// 定义异步函数：为用户生成并绑定 UUID
async function addUserUUID(userId, uuid = null) {
    try {
        // 构造请求体，包括可能传入的自定义 UUID
        const payload = {
            uuid: uuid, // 如果 uuid 为 null，则发送空值，后端处理自动生成逻辑
        };

        // 调用后端 API 为用户生成或绑定 UUID
        const response = await fetch(`http://localhost:4000/users/${userId}/uuid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload), // 将请求体序列化为 JSON 格式
        });

        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add UUID.');
        }

        // 如果生成或绑定成功，返回 UUID 值
        const data = await response.json();
        return data.uuid; // 返回的是 UUID
    } catch (error) {
        console.error('Error in addUserUUID:', error);
        return null; // 返回 null 表示失败
    }
}
