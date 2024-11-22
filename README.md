# COMP5567 Blockchain-Based Facial Recognition System for Degree Authentication


**项目描述**:<br>

在传统的学位认证体系中，验证通常依赖于集中式机构，这可能会面临效率低下、信息泄露和文凭造假等问题。为了提高学位认证的安全性和透明度，该项目提出了一种基于区块链的面部识别系统。通过将学位信息与区块链技术相结合，该系统确保了学历证书是不可变的，并且可以实时验证。此外，通过使用面部识别，该系统可以对用户进行身份验证，确保学位认证过程的真实性，并防止身份欺诈。

## 1. 基于 Ethereum 的区块链服务器

**描述**：  <br>
利用 Ethereum 区块链来存储学位信息以及人脸信息编码，确保数据的不可篡改性和透明性。

**实现方式**：<br>
### 1. 智能合约
使用 Solidity 编写智能合约，存储以下数据并提供验证接口：

**学位数据**：<br>
包括学生学号、学位信息、发放日期、授予机构等。<br>
**人脸信息编码**：<br>
使用哈希算法（如 SHA256）对人脸特征向量进行加密后存储，避免敏感数据泄露。<br>
**功能包括**：<br>
**写入数据**：<br>
只能由授权机构（如大学或教育部）调用智能合约方法，写入学位数据和人脸信息编码。<br>
**验证学位信息**：<br>
提供公开接口，供任何用户通过学生 ID 验证学位和身份信息。<br>
**记录验证历史**：<br>
每次验证请求都会记录操作时间及发起者的地址（作为交易的一部分，保存在区块链中）。<br>
### 2. 部署智能合约
使用 Remix IDE 或 Hardhat 部署智能合约到以太坊测试网络（如 Goerli 或 Sepolia）。<br>
部署完成后记录智能合约地址供系统调用。<br>
### 3. 后端接口
使用 Web3.js 或 Ethers.js 开发后端服务，通过智能合约与以太坊交互，为前端和用户提供接口：<br>
写入学位数据和人脸编码。<br>
验证学位信息和身份。<br>
获取验证历史记录。<br>

**数据存储设计**<br>
学位信息与人脸编码通过智能合约存储在区块链上，结构如下：<br>
```solidity
struct Degree {
    string studentId;           // 学生学号
    string degree;              // 学位信息
    string university;          // 授予机构
    string issuedDate;          // 颁发日期
    bytes32 faceHash;           // 人脸信息的哈希值
}
mapping(string => Degree) private degrees;
```

**使用方式**：<br>
#### 1. 部署智能合约

配置 Hardhat 或 Remix IDE。<br>
连接测试网络（如 Goerli 或 Sepolia）。<br>
编译并部署智能合约，记录生成的合约地址。<br>
#### 2. 后端与智能合约交互<br>

**系统流程**：<br>
**学位与人脸数据写入**：<br>

授权机构使用后端接口调用智能合约方法，将学生的学位数据及人脸信息编码存储到区块链。<br>
**身份验证与学位核查**：<br>

用户提供学生 ID，系统从区块链中提取对应的学位信息及人脸信息编码。<br>
前端通过人脸识别（对比实时摄像头图像和区块链存储的编码）验证用户身份。<br>
**验证历史记录**：<br>

每次验证请求自动记录在区块链中，确保全程透明。<br>


## 2. student_sign
**描述**：  
此部分包含基于 Node.js 的前端和后端代码，用于用户登录、注册以及考勤操作。

**使用方式**：

```bash
node student_sign/server.js
```

**访问地址**：
http://localhost:4000

**功能**：

1. 提供用户界面
2. 管理用户账号的后端逻辑
3. 与区块链服务器交互

## 3. 代码管理与协作

**操作说明**<br>
**克隆仓库**：<br>
首次使用时，将远程仓库克隆到本地：
```bash
git clone https://github.com/PolyUBlockChainTeam/Blockchain-based-Facial-Recognion-System-for-Degree-Authencation.git
```

**多人协作开发**<br>
**1. 获取最新代码**：<br>
在开始任何修改前，确保本地代码是最新的：


```bash
git fetch origin
git pull origin main
```

**2. 提交本地更改**：
```bash
git add .
git commit -m "Your commit message"
```


**3. 推送更改到远程仓库**：
```bash
git push origin main
```

**4. 处理冲突**：<br>
如果远程仓库有其他人的修改，而你未同步就进行了提交，可能会出现冲突。解决冲突步骤如下：<br>
<br>
拉取远程更新并尝试自动合并：
```bash
git pull origin main
```

如果有冲突，Git 会提示冲突文件，打开冲突文件，你会看到类似以下标记：
```diff
<<<<<<< HEAD
你的代码
=======
对方的代码
>>>>>>> 对方提交的commit-id
```

手动修改冲突部分，保留需要的代码。<br>
**标记冲突已解决**：
```bash
git add <conflict_file>
```

**再次提交**：
```bash
git commit -m "Resolve merge conflict"
推送解决后的代码：
```bash
git push origin main
```
**5. 分支管理（推荐）**：<br>
为了降低冲突风险，建议每个开发者在自己的分支开发：

```bash
git checkout -b feature/your-feature
```
开发完成后，先将主分支的更新合并到自己的分支：

```bash
git checkout feature/your-feature
git merge main
```
解决冲突后推送分支代码：

```bash
git push origin feature/your-feature
```
通过 Pull Request 提交分支合并到主分支，确保审核后再合并。

**忽略 data 文件夹**<br>
如果不希望 data 文件夹被推送到 GitHub，请按照以下步骤操作：<br>

**创建或编辑 .gitignore 文件，添加以下内容**：

```bash
data/
```
**移除已被 Git 跟踪的 data 文件夹**：

```bash
git rm -r --cached data
```
**提交更改并推送**：

```bash
git add .gitignore
git commit -m "Ignore data folder and remove from Git tracking"
git push origin main
```
从此，data 文件夹将不再被 Git 跟踪，并不会推送到 GitHub。<br>

**忽略 data.json 文件**<br>
如果不希望 data.json 文件被推送到 GitHub，请按照以下步骤操作：<br>

**创建或编辑 .gitignore 文件，添加以下内容**：

```bash
data.json
```
**移除已被 Git 跟踪的 data.json 文件**：

```bash
git rm -r --cached data.json
```
**提交更改并推送**：

```bash
git add .gitignore
git commit -m "Ignore data.json and remove from Git tracking"
git push origin main
```
从此，data.json 文件将不再被 Git 跟踪，并不会推送到 GitHub。<br>
<br>
小贴士<br>
随时同步远程仓库：避免提交较大修改后才同步，这样会增加冲突概率。<br>
小步提交：更频繁地提交修改，减少冲突范围。<br>
定期代码审查：通过 Pull Request 进行代码合并时，便于团队发现潜在问题。<br>
