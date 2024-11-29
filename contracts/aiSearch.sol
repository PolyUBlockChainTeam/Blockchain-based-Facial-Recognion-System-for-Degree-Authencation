// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UUIDNameMapping {

    // 定义一个结构体来存储 UUID 和 name 的映射关系
    struct UUIDName {
        string name;
    }

    // 使用 mapping 来存储 UUID 到 name 的映射
    mapping(string => UUIDName) private uuidToName;

    // 事件，用于记录存储操作
    event UUIDNameStored(string uuid, string name);

    // 存储 UUID 和 name 的函数
    function storeUUIDName(string memory uuid, string memory name) public {
        uuidToName[uuid] = UUIDName(name);
        emit UUIDNameStored(uuid, name);
    }

    // 根据 UUID 查询 name 的函数
    function getNameByUUID(string memory uuid) public view returns (string memory) {
        require(bytes(uuidToName[uuid].name).length != 0, "UUID does not exist");
        return uuidToName[uuid].name;
    }
}
