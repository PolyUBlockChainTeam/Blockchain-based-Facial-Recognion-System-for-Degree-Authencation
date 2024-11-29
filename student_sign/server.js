const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // 用于加密和生成哈希密码
const cors = require('cors');
const path = require('path');  // This line is added to require the path module

const app = express();
const { randomUUID } = require('crypto'); // 用 crypto 的随机 UUID 功能

// 设置静态文件目录
// 提供 /js 和 /css 文件夹中的静态文件
app.use(express.static(path.join(__dirname, 'public')));
console.log('Serving static files from:', path.join(__dirname, 'public'));
// app.use(express.static(path.join(__dirname, 'css')));
app.use(bodyParser.json());
app.use(cors({
    origin: '*', // 允许所有来源
}));

// 模拟数据库
const users = [];

// 工具函数：生成哈希密码
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// 工具函数：验证密码
function verifyPassword(storedPassword, inputPassword) {
    return storedPassword === hashPassword(inputPassword);
}

// 修改 addUser 函数，初始情况下 uuid 为空
function addUser(id, password, username) {
    if (!id || !password || !username) {
        return { error: 'ID, password, and username are required!' };
    }

    let role = '';
    if (id.endsWith('g')) {
        role = 'student';
    } else if (id.endsWith('t')) {
        role = 'teacher';
    } else {
        return { error: 'ID must end with "g" for student or "t" for teacher.' };
    }

    const existingUser = users.find(user => user.id === id);
    if (existingUser) {
        return { error: 'User with this ID already exists.' };
    }

    const newUser = {
        id,
        username,
        password: hashPassword(password),
        role,
        keys: [],
        uuid: null, // 初始无 uuid
    };

    users.push(newUser);
    return { message: 'User created successfully!', user: { id, role, username } };
}

// 新增函数：为用户生成并绑定 UUID
function addUuidToUser(id, uuid = null) {
    const user = users.find(user => user.id === id);
    
    // 如果用户不存在
    if (!user) {
        return { error: 'User not found.' };
    }

    // 如果用户不是学生
    if (user.role !== 'student') {
        return { error: 'Only students can have a UUID.' };
    }

    // 如果用户已经存在 UUID，则返回现有 UUID
    if (user.uuid) {
        return { message: 'UUID already exists for this user.', uuid: user.uuid };
    }

    // 如果传入了 UUID 则使用传入 UUID，否则生成新 UUID
    user.uuid = uuid || randomUUID(); // 自动生成 UUID（如果 uuid 参数为空）

    console.log("user:",user);

    return { message: 'UUID assigned successfully!', uuid: user.uuid };
}

// 新增函数：通过 ID 获取 UUID
function getUuidByUserId(id) {
    const user = users.find(user => user.id === id);
    if (!user) {
        return { error: 'User not found.' };
    }
    return user.uuid || null;
}


// 登录函数：验证用户ID和密码
function login(id, password) {
    const user = users.find(user => user.id === id);
    if (!user) {
        return { error: 'User not found.' };
    }

    // 验证密码是否正确
    if (!verifyPassword(user.password, password)) {
        return { error: 'Incorrect password.' };
    }

    // 登录成功，返回用户名和ID
    return {
        message: 'Login successful',
        data: {
            id: user.id,
            username: user.username
        }
    };
}

// 获取所有用户
function getAllUsers() {
    return users;
}

// 获取指定用户
function getUserById(id) {
    return users.find(user => user.id === id) || { error: 'User not found.' };
}

// 为用户添加密钥对
function addKeyPairToUser(id, publicKey, privateKey) {
    const user = users.find(user => user.id === id);
    if (!user) {
        return { error: 'User not found.' };
    }
    if (!publicKey || !privateKey) {
        return { error: 'Both publicKey and privateKey are required!' };
    }
    user.keys.push({ publicKey, privateKey });
    return { message: 'New key pair added successfully!', keys: user.keys };
}

function getKeysByUserId(id) {
    const user = users.find(user => user.id === id);
    console.log("user=",user)
    if (!user) {
        return { error: 'User not found.' };
    }
    
    return user.keys;
}

// Express 路由封装
app.post('/users', (req, res) => {
    const { id, password, username } = req.body;
    const result = addUser(id, password, username);
    if (result.error) {
        res.status(400).send(result);
    } else {
        res.status(201).send(result);
    }
});

// 路由，返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 登录路由
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const result = login(id, password);
    if (result.error) {
        res.status(400).send(result);
    } else {
        // 设置 HttpOnly cookie，通常是用来存储用户的会话ID或令牌
        res.cookie('sessionId', result.sessionId, {
            httpOnly: true,   // 防止 JavaScript 访问此 cookie
            secure: true,     // 只有通过 HTTPS 发送 cookie
            maxAge: 3600000,  // 设置 cookie 过期时间（1 小时）
            path: '/',        // 设置 cookie 的路径
        });
        // 返回成功响应
        res.status(200).send(result);
    }
});

app.get('/users', (req, res) => {
    res.status(200).send(getAllUsers());
});

app.get('/users/:id', (req, res) => {
    const result = getUserById(req.params.id);
    if (result.error) {
        res.status(404).send(result);
    } else {
        res.status(200).send(result);
    }
});

app.post('/users/:id/keys', (req, res) => {
    const { publicKey, privateKey } = req.body;
    const result = addKeyPairToUser(req.params.id, publicKey, privateKey);
    if (result.error) {
        res.status(400).send(result);
    } else {
        res.status(201).send(result);
    }
});

app.get('/users/:id/keys', (req, res) => {
    const result = getKeysByUserId(req.params.id);
    if (result.error) {
        res.status(404).send(result);
    } else {
        res.status(200).send({ keys: result });
    }
});

// 新增路由：为用户生成 UUID（只允许学生）
app.post('/users/:id/uuid', (req, res) => {
    const userId = req.params.id;
    const { uuid } = req.body; // 从请求体中提取 `uuid` 参数

    // 查找用户
    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).send({ error: 'User not found.' });
    }

    // 检查是否为学生角色
    if (user.role !== 'student') {
        return res.status(400).send({ error: 'Only students can have a UUID.' });
    }

    // 如果用户已有 UUID，直接返回
    if (user.uuid) {
        return res.status(200).send({
            message: 'UUID already exists for this user.',
            uuid: user.uuid,
        });
    }

    // 使用传入的 UUID（如果有），或者生成新的随机 UUID
    user.uuid = uuid || randomUUID();

    res.status(201).send({
        message: 'UUID assigned successfully!',
        uuid: user.uuid,
    });
});

// 新增路由：查询用户的 UUID
app.get('/users/:id/uuid', (req, res) => {
    const user = users.find(user => user.id === req.params.id);

    if (!user) {
        // 用户不存在，返回 404 状态码
        res.status(404).send({ error: 'User not found.' });
    } else {
        // 用户存在，无论 uuid 是否为空，都返回 200
        res.status(200).send({ uuid: user.uuid });
    }
});

// 启动服务器
const PORT = 4100;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});