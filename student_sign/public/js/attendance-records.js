// Hide label link
const faceVerificationLink = document.getElementById("face_verificationLink");
hideLinks([faceVerificationLink]);

// Your contract address and ABI
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
    // Check user's Ethereum provider
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        // Request user authorization
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        senderAccount = accounts[0];

        // Instantiate the contract
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        console.error("Please install MetaMask or another Ethereum wallet");
    }
}

async function queryDegree() {
    const studentID = document.getElementById("attendance-id").value; // Get student ID from input field
    const degreeInfoBody = document.getElementById("attendance-registerBody");
    degreeInfoBody.innerHTML = ""; // Clear previous query results

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
        console.error("Error querying degree information:", error);
        degreeInfoBody.innerHTML = "<tr><td colspan='5'>Query failed, please check the student ID or contract status.</td></tr>";
    }
}

// Initialize contract interaction
init();
