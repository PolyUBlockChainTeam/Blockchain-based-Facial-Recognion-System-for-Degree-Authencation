// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract InsertDegree {
    struct Degree {
        string name; // 学生姓名
        string degreeType; // 学位类型
        string major; // 专业
        string university; // 毕业院校
        uint256 graduationYear; // 毕业年份
    }

    mapping(bytes32 => Degree) private degreeRecords; // 学位信息存储映射

    // 添加学位信息
    function addDegree(
        bytes32 studentID,
        string memory name,
        string memory degreeType,
        string memory major,
        string memory university,
        uint256 year
    ) public {
        // 确保该学生ID之前没有记录
        require(bytes(degreeRecords[studentID].name).length == 0, "\u8BE5\u5B66\u751FID\u5DF2\u7ECF\u5B58\u5728\uFF1F");
        
        // 插入学位信息
        degreeRecords[studentID] = Degree(name, degreeType, major, university, year);
    }
}
