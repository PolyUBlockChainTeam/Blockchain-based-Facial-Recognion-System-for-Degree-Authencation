// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract InsertDegree {
    struct Degree {
        string faceEmbeddingUUID; // Changed from "name" to "faceEmbeddingUUID" for clarity
        string degreeType; 
        string major; 
        string university; 
        uint256 graduationYear; 
    }

    mapping(bytes32 => Degree) private degreeRecords; // Degree information mapping

    // Add degree information
    function addDegree(
        bytes32 studentID,
        string memory faceEmbeddingUUID, // Updated parameter name
        string memory degreeType,
        string memory major,
        string memory university,
        uint256 year
    ) public {
        require(bytes(degreeRecords[studentID].faceEmbeddingUUID).length == 0, "Student ID already exists");
        degreeRecords[studentID] = Degree(faceEmbeddingUUID, degreeType, major, university, year);
    }
}
