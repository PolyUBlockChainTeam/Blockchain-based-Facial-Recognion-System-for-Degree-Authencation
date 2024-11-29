// 你的合约地址和 ABI
const contractAddress = '0x42AD3aE0B79Fa253ab732eba8FCF38864Ad4abf0';
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "storeUUIDName",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "UUIDNameStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			}
		],
		"name": "getNameByUUID",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
    try {
        // 检查是否有 Ethereum 提供者
        if (typeof window.ethereum !== 'undefined') {
            console.log("MetaMask detected!");

            // 创建 Web3 实例
            web3 = new Web3(window.ethereum);

            // 请求用户授权并获取账户
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            senderAccount = accounts[0];

            console.log("Connected account:", senderAccount);

            // 实例化智能合约
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract initialized:", contract);

            alert("MetaMask connected successfully!");
        } else {
            console.error("请安装 MetaMask 或其他以太坊钱包");
            alert("MetaMask is not installed! Please install it to proceed.");
        }
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        alert("Failed to connect to MetaMask. Please try again.");
    }
}


async function getNameByUUID() {
    const uuid = document.getElementById("UUID").value; // 从输入框获取 UUID
    const nameInfoBody = document.getElementById("face_verificationBody0");
    nameInfoBody.innerHTML = ""; // 清空之前的内容

    console.log("Fetching name for UUID:", uuid); // 调试输出

    try {
        // 调用合约函数获取名称
        //const name = await contract.methods.getNameByUUID(uuid).call();  

		const name = await contract.methods.getNameByUUID(uuid).call();  
        
        console.log("Returned name:", name); // 调试输出

        if (name && typeof name === 'string' && name.length > 0) {
            // 确保返回的名称为有效的字符串
            nameInfoBody.innerHTML = `
                <tr>
                    <td>${name}</td>
                </tr>
            `;
        } else {
            nameInfoBody.innerHTML = "<tr><td>No name found.</td></tr>";
        }
    } catch (error) {
        // 捕获并输出错误信息
        console.error("Error querying name information:", error);
        nameInfoBody.innerHTML = "<tr><td colspan='5'>Query failed, please check the UUID or contract status.</td></tr>";
    }
}



// 初始化合约交互
init();