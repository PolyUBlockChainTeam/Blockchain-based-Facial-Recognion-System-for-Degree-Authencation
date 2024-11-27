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
        // Request user permission
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        senderAccount = accounts[0];

        // Instantiate the contract
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        console.error("Please install MetaMask or another Ethereum wallet");
    }
}

async function addDegree() {
    const studentIDInput = uuid.v4(); // Generate student ID as UUID
    const studentID = web3.utils.sha3(studentIDInput); // Calculate hash of student ID
    // Get other parameters
    const name = document.getElementById("attendance-name").value.trim();
    const degreeType = document.getElementById("attendance-degreeType").value.trim();
    const major = document.getElementById("attendance-major").value.trim();
    const university = document.getElementById("attendance-university").value.trim();
    const yearValue = document.getElementById("attendance-graduationYear").value.trim();
    const year = parseInt(yearValue, 10); // Convert year to integer

    // Validate inputs
    if (!studentIDInput || !name || !degreeType || !major || !university || isNaN(year)) {
        console.error("Please ensure all input fields are correctly filled out");
        alert("Please ensure all input fields are correctly filled out");
        return; // Stop execution
    }

    try {
        // Call the smart contract function
        await contract.methods.addDegree(studentID, name, degreeType, major, university, year).send({ from: senderAccount });
        console.log("Degree information added with student ID: " + studentID);
        alert("Your student ID (also printed in the console) is: " + studentID + ". Please remember it.");
    } catch (error) {
        console.error("Error adding degree information:", error);
    }
}

// Initialize contract interaction
init();