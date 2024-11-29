
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract DegreeSearch {
    struct Degree {
        string name;           // 学生姓名
        string degreeType;     // 学位类型
        string major;          // 专业
        string university;     // 毕业院校
        uint256 graduationYear; // 毕业年份
    }

    struct ConsensusProposal {
        Degree proposedDegree;
        address proposer;
        uint256 approvalCount;
        mapping(address => bool) approvals;
        bool executed;
    }

    mapping(string => Degree) private degreeRecords; // 学位信息存储映射
    mapping(string => ConsensusProposal) private proposals; // 学位信息提案存储
    uint256 public requiredApprovals = 3; // 所需的最小批准数

    event DegreeProposed(string indexed studentID, address indexed proposer);
    event DegreeApproved(string indexed studentID, address indexed approver);
    event DegreeAdded(string indexed studentID);

    // 提议添加学位信息
    function proposeDegree(
        string memory studentID,
        string memory name,
        string memory degreeType,
        string memory major,
        string memory university,
        uint256 year
    ) public {
        require(proposals[studentID].proposer == address(0), "Proposal already exists");

        ConsensusProposal storage newProposal = proposals[studentID];
        newProposal.proposedDegree = Degree(name, degreeType, major, university, year);
        newProposal.proposer = msg.sender;
        newProposal.approvalCount = 0;
        newProposal.executed = false;

        emit DegreeProposed(studentID, msg.sender);
    }

    // 批准提案
    function approveProposal(string memory studentID) public {
        ConsensusProposal storage proposal = proposals[studentID];
        require(proposal.proposer != address(0), "Proposal does not exist");
        require(!proposal.approvals[msg.sender], "Already approved");
        require(!proposal.executed, "Proposal already executed");

        proposal.approvals[msg.sender] = true;
        proposal.approvalCount++;

        emit DegreeApproved(studentID, msg.sender);

        if (proposal.approvalCount >= requiredApprovals) {
            _addDegree(studentID, proposal.proposedDegree);
            proposal.executed = true;
        }
    }

    // 内部函数，添加学位信息
    function _addDegree(string memory studentID, Degree memory degree) internal {
        degreeRecords[studentID] = degree;
        emit DegreeAdded(studentID);
    }

    // 根据学生ID查询学位信息
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
            degree.name,
            degree.degreeType,
            degree.major,
            degree.university,
            degree.graduationYear
        );
    }
}
