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

async function queryDegree() {
    const studentID = document.getElementById("attendance-id").value; // 从输入框获取学生ID
    const degreeInfoBody = document.getElementById("attendance-registerBody");
    degreeInfoBody.innerHTML = ""; // 清空之前的查询结果

    try {
        const degreeInfo = await contract.methods.getDegree(studentID).call();
        degreeInfoBody.innerHTML = `
            <tr>
                <td>${degreeInfo[0]}</td>
                <td>${degreeInfo[1]}</td>
                <td>${degreeInfo[2]}</td>
                <td>${degreeInfo[3]}</td>
                <td>${degreeInfo[4].toString()}</td>
            </tr>
        `;
    } catch (error) {
        console.error("查询学位信息时出错:", error);
        degreeInfoBody.innerHTML = "<tr><td colspan='5'>查询失败,请检查学生ID或合约状态。</td></tr>";
    }
}

// 初始化合约交互
init();