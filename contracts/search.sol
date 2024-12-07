// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract DegreeConsensusWithWeights {
    struct Degree {
        string faceEmbeddingUUID; // Associated face embedding
        string degreeType; // 学位类型
        string major; // 专业
        string university; // 毕业院校
        uint256 graduationYear; // 毕业年份
    }

    struct Proposal {
        bytes32 studentID; // 学生ID
        Degree degree; // 学位信息
        address proposer; // 提案者
        uint256 votesFor; // 赞成票
        uint256 votesAgainst; // 反对票
        bool finalized; // 是否已达成共识
    }

    address public admin; // 管理员地址
    mapping(address => uint256) public votingWeights; // 投票权重映射
    mapping(bytes32 => Degree) private degreeRecords; // 学位信息存储映射
    Proposal[] private proposals; // 所有提案
    mapping(uint256 => mapping(address => bool)) private hasVoted; // 防止重复投票

    event ProposalCreated(uint256 proposalID, bytes32 studentID, address proposer);
    event VoteCast(uint256 proposalID, address voter, bool inFavor, uint256 weight);
    event ProposalFinalized(uint256 proposalID, bool accepted);
    event VotingWeightUpdated(address voter, uint256 weight);

    constructor() {
        admin = msg.sender; // 部署合约的人为管理员
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // 设置投票权重
    function setVotingWeight(address voter, uint256 weight) public onlyAdmin {
        votingWeights[voter] = weight;
        emit VotingWeightUpdated(voter, weight);
    }

    // 提交一个学位信息提案
    function proposeDegree(
        bytes32 studentID,
        string memory faceEmbeddingUUID,
        string memory degreeType,
        string memory major,
        string memory university,
        uint256 year
    ) public {
        Proposal memory newProposal = Proposal({
            studentID: studentID,
            degree: Degree(faceEmbeddingUUID, degreeType, major, university, year),
            proposer: msg.sender,
            votesFor: 0,
            votesAgainst: 0,
            finalized: false
        });
        proposals.push(newProposal);

        emit ProposalCreated(proposals.length - 1, studentID, msg.sender);
    }

    // 投票支持或反对一个提案
    function voteOnProposal(uint256 proposalID, bool inFavor) public {
        require(proposalID < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalID];
        require(!proposal.finalized, "Proposal already finalized");
        require(!hasVoted[proposalID][msg.sender], "You have already voted on this proposal");

        // 获取投票者的权重，默认为 1
        uint256 weight = votingWeights[msg.sender];
        if (weight == 0) {
            weight = 1;
        }

        // 记录投票
        hasVoted[proposalID][msg.sender] = true;
        if (inFavor) {
            proposal.votesFor += weight; // 根据权重增加赞成票
        } else {
            proposal.votesAgainst += weight; // 根据权重增加反对票
        }

        emit VoteCast(proposalID, msg.sender, inFavor, weight);

        // 检查是否达到共识
        finalizeProposal(proposalID);
    }

    // 确定提案是否达成共识
    function finalizeProposal(uint256 proposalID) internal {
        Proposal storage proposal = proposals[proposalID];
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 quorum = 3; // 例如：需要至少3票参与
        uint256 majority = (totalVotes * 50) / 100; // 50% 的赞成票

        if (totalVotes >= quorum && proposal.votesFor > majority) {
            // 达成共识，存储学位信息
            degreeRecords[proposal.studentID] = proposal.degree;
            proposal.finalized = true;
            emit ProposalFinalized(proposalID, true);
        } else if (totalVotes >= quorum && proposal.votesAgainst >= majority) {
            // 否决提案
            proposal.finalized = true;
            emit ProposalFinalized(proposalID, false);
        }
    }

    // 查询学位信息
    function getDegree(bytes32 studentID) public view returns (string memory, string memory, string memory, string memory, uint256) {
        Degree memory degree = degreeRecords[studentID];
        require(bytes(degree.faceEmbeddingUUID).length > 0, "Degree not found");
        return (degree.faceEmbeddingUUID, degree.degreeType, degree.major, degree.university, degree.graduationYear);
    }

    // 查看提案状态
    function getProposal(uint256 proposalID) public view returns (
        bytes32 studentID,
        string memory faceEmbeddingUUID,
        string memory degreeType,
        string memory major,
        string memory university,
        uint256 year,
        address proposer,
        uint256 votesFor,
        uint256 votesAgainst,
        bool finalized
    ) {
        require(proposalID < proposals.length, "Invalid proposal ID");
        Proposal memory proposal = proposals[proposalID];
        return (
            proposal.studentID,
            proposal.degree.faceEmbeddingUUID,
            proposal.degree.degreeType,
            proposal.degree.major,
            proposal.degree.university,
            proposal.degree.graduationYear,
            proposal.proposer,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.finalized
        );
    }
}
