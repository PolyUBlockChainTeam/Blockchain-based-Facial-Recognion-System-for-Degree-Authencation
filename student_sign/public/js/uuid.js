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