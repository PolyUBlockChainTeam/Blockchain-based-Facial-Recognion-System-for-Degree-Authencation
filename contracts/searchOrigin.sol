// SPDX-License-Identifier: UNLICENSED
import "hardhat/console.sol";

pragma solidity ^0.8.0;

contract DegreeSearch {
    struct Degree {
        string faceEmbeddingUUID; // Changed from "name" to "faceEmbeddingUUID" for clarity
        string degreeType; 
        string major; 
        string university; 
        uint256 graduationYear; 
    }

    struct ConsensusProposal {
        Degree proposedDegree;
        address proposer;
        uint256 approvalCount;
        mapping(address => bool) approvals;
        bool executed;
    }

    mapping(string => Degree) private degreeRecords;
    mapping(string => ConsensusProposal) private proposals;
    uint256 public requiredApprovals = 3;

    event DegreeProposed(string indexed studentID, address indexed proposer);
    event DegreeApproved(string indexed studentID, address indexed approver);
    event DegreeAdded(string indexed studentID);

    function proposeDegree(
        string memory studentID,
        string memory faceEmbeddingUUID, // Updated parameter name
        string memory degreeType,
        string memory major,
        string memory university,
        uint256 year
    ) public {
        require(proposals[studentID].proposer == address(0), "Proposal already exists");

        ConsensusProposal storage newProposal = proposals[studentID];
        newProposal.proposedDegree = Degree(faceEmbeddingUUID, degreeType, major, university, year);
        newProposal.proposer = msg.sender;
        newProposal.approvalCount = 0;
        newProposal.executed = false;

        emit DegreeProposed(studentID, msg.sender);
    }

    function getApprovalCount(string memory studentID) public view returns (uint256 approvalCount) {
        ConsensusProposal storage proposal = proposals[studentID];
        require(proposal.proposer != address(0), "Proposal does not exist");
        return proposal.approvalCount;
    }

    function approveProposal(string memory studentID) public {
        ConsensusProposal storage proposal = proposals[studentID];
        require(proposal.proposer != address(0), "Proposal does not exist");
        require(!proposal.approvals[msg.sender], "Already approved");
        require(!proposal.executed, "Proposal already executed");

        proposal.approvals[msg.sender] = true;
        console.log("before:", proposal.approvalCount);
        proposal.approvalCount++;
        console.log("after:", proposal.approvalCount);

        emit DegreeApproved(studentID, msg.sender);

        if (proposal.approvalCount >= requiredApprovals) {
            _addDegree(studentID, proposal.proposedDegree);
            proposal.executed = true;
        }
    }

    function _addDegree(string memory studentID, Degree memory degree) internal {
        degreeRecords[studentID] = degree;
        emit DegreeAdded(studentID);
        console.log("success!!");
    }

    function getDegree(string memory studentID)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        Degree memory degree = degreeRecords[studentID];
        return (
            degree.faceEmbeddingUUID,
            degree.degreeType,
            degree.major,
            degree.university,
            degree.graduationYear
        );
    }
}
