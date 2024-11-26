// 隐藏标签链接
const faceVerificationLink = document.getElementById("face_verificationLink");
hideLinks([faceVerificationLink]);

// 你的合约地址和 ABI
const contractAddress = '0xB581C9264f59BF0289fA76D61B2D0746dCE3C30D';
const contractABI = [
    {
        "inputs": [
            {"internalType": "bytes32", "name": "studentID", "type": "bytes32"},
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "string", "name": "degreeType", "type": "string"},
            {"internalType": "string", "name": "major", "type": "string"},
            {"internalType": "string", "name": "university", "type": "string"},
            {"internalType": "uint256", "name": "year", "type": "uint256"}
        ],
        "name": "addDegree",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "studentID", "type": "bytes32"}
        ],
        "name": "getDegree",
        "outputs": [
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;
let senderAccount;

async function init() {
    // 检查用户的 Ethereum 提供者
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        // 请求用户授权
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        senderAccount = accounts[0];

        // 实例化合约
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        console.error("请安装 MetaMask 或其他以太坊钱包");
    }
}

async function addDegree() {
    const studentIDInput = uuid.v4(); // 学生ID为UUID
    const studentID = web3.utils.sha3(studentIDInput); // 计算学生ID的哈希
    // 获取其他参数
    const name = document.getElementById("attendance-name").value.trim();
    const degreeType = document.getElementById("attendance-degreeType").value.trim();
    const major = document.getElementById("attendance-major").value.trim();
    const university = document.getElementById("attendance-university").value.trim();
    const yearValue = document.getElementById("attendance-graduationYear").value.trim();
    const year = parseInt(yearValue, 10); // 将年份转换为整数

    // 检查输入的有效性
    if (!studentIDInput || !name || !degreeType || !major || !university || isNaN(year)) {
        console.error("请确保所有输入框都填写正确");
        alert("请确保所有输入框都填写正确");
        return; // 停止执行
    }

    try {
        // 调用智能合约的函数
        await contract.methods.addDegree(studentID, name, degreeType, major, university, year).send({ from: senderAccount });
        console.log("学位信息已添加，学号为："+studentID);
        alert("以下是您的学号(同时已打印到控制台),请牢记:"+studentID);
    } catch (error) {
        console.error("添加学位信息时出错:", error);
    }
}

// 初始化合约交互
init();