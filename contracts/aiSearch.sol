// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UUIDNameMapping {
    
    struct UUIDName {
        string faceEmbeddingUUID; // Updated from name
    }

    mapping(string => UUIDName) private uuidToName;

    event UUIDNameStored(string uuid, string faceEmbeddingUUID); // Updated from name

    function storeUUIDName(string memory uuid, string memory faceEmbeddingUUID) public {
        uuidToName[uuid] = UUIDName(faceEmbeddingUUID); // Updated from name
        emit UUIDNameStored(uuid, faceEmbeddingUUID); // Updated from name
    }

    function getNameByUUID(string memory uuid) public view returns (string memory) {
        require(bytes(uuidToName[uuid].faceEmbeddingUUID).length != 0, "UUID does not exist");
        return uuidToName[uuid].faceEmbeddingUUID; // Updated from name
    }
}
