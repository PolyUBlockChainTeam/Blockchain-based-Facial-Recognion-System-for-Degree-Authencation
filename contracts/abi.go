[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "studentID",
				"type": "string"
			}
		],
		"name": "approveProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "studentID",
				"type": "string"
			}
		],
		"name": "DegreeAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "studentID",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "DegreeApproved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "studentID",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "proposer",
				"type": "address"
			}
		],
		"name": "DegreeProposed",
		"type": "event"
	},
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
		"name": "proposeDegree",
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
	},
	{
		"inputs": [],
		"name": "requiredApprovals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]