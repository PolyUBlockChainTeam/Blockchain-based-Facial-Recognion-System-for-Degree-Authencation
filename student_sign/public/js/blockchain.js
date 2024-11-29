// 你的合约地址和 ABI
const contractAddress = '0xB9dfCb4d6A8ff7be25C082380DE931A1f7F9c01c';
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "studentID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "degreeType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "major",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "university",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "year",
				"type": "uint256"
			}
		],
		"name": "addDegree",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "studentID",
				"type": "string"
			}
		],
		"name": "getDegree",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
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

//上传学位
async function addDegree() {
    const studentID = getCookie('studentId'); // 获取当前cookie的studentID,使其满足byte32
    // Get other parameters
    const name = document.getElementById("attendance-name").value.trim();
    const degreeType = document.getElementById("attendance-degreeType").value.trim();
    const major = document.getElementById("attendance-major").value.trim();
    const university = document.getElementById("attendance-university").value.trim();
    const yearValue = document.getElementById("attendance-graduationYear").value.trim();
    const year = parseInt(yearValue, 10); // Convert year to integer

    // Validate inputs
    if (!studentID || !name || !degreeType || !major || !university || isNaN(year)) {
        console.error("Please ensure all input fields are correctly filled out");
        alert("Please ensure all input fields are correctly filled out");
        return; // Stop execution
    }


    try {
        await contract.methods.addDegree(studentID, name, degreeType, major, university, year).send({ from: senderAccount });
        alert("Degree information has been added, your student ID is:"+studentID);
        console.log("Degree information has been added, student ID is:"+studentID);
    } catch (error) {
        console.error("Error adding degree information:", error);
    }
}

//查询学位
async function queryDegree() {
    const studentID = document.getElementById("attendance-id").value; // 从输入框获取学生ID
    const degreeInfoBody = document.getElementById("attendance-recordsBody");
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

//上传图片

// 初始化合约交互
init();