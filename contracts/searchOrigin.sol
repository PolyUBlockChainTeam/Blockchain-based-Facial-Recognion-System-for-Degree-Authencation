// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract DegreeSearch {
    struct Degree {
        string name;           // 学生姓名
        string degreeType;     // 学位类型
        string major;          // 专业
        string university;      // 毕业院校
        uint256 graduationYear; // 毕业年份
    }

    mapping(string => Degree) private degreeRecords; // 学位信息存储映射

    // 添加学位信息
    function addDegree(string memory studentID, string memory name, string memory degreeType, string memory major, string memory university, uint256 year) public {
        degreeRecords[studentID] = Degree(name, degreeType, major, university, year);
    }

    // 根据学生ID查询学位信息
    function getDegree(string memory studentID) public view returns (string memory, string memory, string memory, string memory, uint256) {
        Degree memory degree = degreeRecords[studentID];
        return (degree.name, degree.degreeType, degree.major, degree.university, degree.graduationYear);
    }
}
