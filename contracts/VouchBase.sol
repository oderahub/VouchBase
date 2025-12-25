// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VouchBase
 * @notice On-chain builder credentials and skill verification for Base ecosystem
 * @dev Builders register profiles, claim skills, and vouch for each other
 */
contract VouchBase {
    // ============ State Variables ============
    
    address public owner;
    
    uint256 public registerFee = 0.0001 ether;
    uint256 public addSkillFee = 0.00005 ether;
    uint256 public vouchFee = 0.00005 ether;
    uint256 public updateUsernameFee = 0.0001 ether;
    
    uint256 public totalBuilders;
    uint256 public totalVouches;
    uint256 public totalSkillsClaimed;
    
    // Skill IDs
    uint8 public constant SKILL_SOLIDITY = 1;
    uint8 public constant SKILL_VYPER = 2;
    uint8 public constant SKILL_RUST = 3;
    uint8 public constant SKILL_CAIRO = 4;
    uint8 public constant SKILL_REACT = 5;
    uint8 public constant SKILL_NEXTJS = 6;
    uint8 public constant SKILL_TYPESCRIPT = 7;
    uint8 public constant SKILL_VUE = 8;
    uint8 public constant SKILL_NODEJS = 9;
    uint8 public constant SKILL_PYTHON = 10;
    uint8 public constant SKILL_GO = 11;
    uint8 public constant SKILL_FOUNDRY = 12;
    uint8 public constant SKILL_HARDHAT = 13;
    uint8 public constant SKILL_WAGMI = 14;
    uint8 public constant SKILL_VIEM = 15;
    uint8 public constant SKILL_ETHERSJS = 16;
    uint8 public constant SKILL_UIUX = 17;
    uint8 public constant SKILL_FIGMA = 18;
    uint8 public constant SKILL_SECURITY = 19;
    uint8 public constant SKILL_DEVREL = 20;
    uint8 public constant SKILL_TECHNICAL_WRITING = 21;
    uint8 public constant SKILL_BASE = 22;
    uint8 public constant SKILL_ETHEREUM = 23;
    uint8 public constant SKILL_DEFI = 24;
    uint8 public constant SKILL_NFT = 25;
    
    uint8 public constant MAX_SKILL_ID = 25;
    
    // ============ Structs ============
    
    struct Builder {
        address wallet;
        string username;
        string github;
        string twitter;
        uint256 registeredAt;
        uint256 credibilityScore;
        uint256 vouchesReceived;
        uint256 vouchesGiven;
        bool exists;
    }
    
    // ============ Mappings ============
    
    // Address => Builder profile
    mapping(address => Builder) public builders;
    
    // Username => Address (for uniqueness check)
    mapping(string => address) public usernameToAddress;
    
    // Address => Skill ID => has skill
    mapping(address => mapping(uint8 => bool)) public builderSkills;
    
    // Address => array of skill IDs
    mapping(address => uint8[]) public builderSkillList;
    
    // Address => Skill ID => vouch count
    mapping(address => mapping(uint8 => uint256)) public skillVouches;
    
    // Voucher => Builder => Skill => has vouched
    mapping(address => mapping(address => mapping(uint8 => bool))) public hasVouched;
    
    // Track all builder addresses for enumeration
    address[] public allBuilders;
    
    // ============ Events ============
    
    event BuilderRegistered(
        address indexed wallet,
        string username,
        uint256 timestamp
    );
    
    event SkillAdded(
        address indexed wallet,
        uint8 indexed skillId,
        uint256 timestamp
    );
    
    event VouchGiven(
        address indexed voucher,
        address indexed builder,
        uint8 indexed skillId,
        uint256 timestamp
    );
    
    event UsernameUpdated(
        address indexed wallet,
        string oldUsername,
        string newUsername
    );
    
    event ProfileUpdated(
        address indexed wallet,
        string github,
        string twitter
    );
    
    event FeesWithdrawn(address indexed to, uint256 amount);
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyRegistered() {
        require(builders[msg.sender].exists, "Not registered");
        _;
    }
    
    modifier validSkill(uint8 skillId) {
        require(skillId >= 1 && skillId <= MAX_SKILL_ID, "Invalid skill ID");
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============ Registration Functions ============
    
    /**
     * @notice Register as a builder with username and initial skills
     * @param username Unique username (3-20 chars, alphanumeric + underscore)
     * @param github GitHub username (optional)
     * @param twitter Twitter handle (optional)
     * @param initialSkills Array of skill IDs to claim
     */
    function register(
        string calldata username,
        string calldata github,
        string calldata twitter,
        uint8[] calldata initialSkills
    ) external payable {
        require(!builders[msg.sender].exists, "Already registered");
        require(bytes(username).length >= 3 && bytes(username).length <= 20, "Username 3-20 chars");
        require(usernameToAddress[username] == address(0), "Username taken");
        require(_isValidUsername(username), "Invalid username format");
        
        uint256 totalFee = registerFee + (addSkillFee * initialSkills.length);
        require(msg.value >= totalFee, "Insufficient fee");
        
        // Create builder profile
        builders[msg.sender] = Builder({
            wallet: msg.sender,
            username: username,
            github: github,
            twitter: twitter,
            registeredAt: block.timestamp,
            credibilityScore: 0,
            vouchesReceived: 0,
            vouchesGiven: 0,
            exists: true
        });
        
        usernameToAddress[username] = msg.sender;
        allBuilders.push(msg.sender);
        totalBuilders++;
        
        // Add initial skills
        for (uint i = 0; i < initialSkills.length; i++) {
            _addSkill(msg.sender, initialSkills[i]);
        }
        
        _updateCredibilityScore(msg.sender);
        
        emit BuilderRegistered(msg.sender, username, block.timestamp);
        
        // Refund excess
        if (msg.value > totalFee) {
            payable(msg.sender).transfer(msg.value - totalFee);
        }
    }
    
    /**
     * @notice Add a new skill to your profile
     * @param skillId ID of the skill to add
     */
    function addSkill(uint8 skillId) external payable onlyRegistered validSkill(skillId) {
        require(!builderSkills[msg.sender][skillId], "Skill already claimed");
        require(msg.value >= addSkillFee, "Insufficient fee");
        
        _addSkill(msg.sender, skillId);
        _updateCredibilityScore(msg.sender);
        
        emit SkillAdded(msg.sender, skillId, block.timestamp);
        
        if (msg.value > addSkillFee) {
            payable(msg.sender).transfer(msg.value - addSkillFee);
        }
    }
    
    /**
     * @notice Add multiple skills at once
     * @param skillIds Array of skill IDs to add
     */
    function addSkills(uint8[] calldata skillIds) external payable onlyRegistered {
        uint256 totalFee = addSkillFee * skillIds.length;
        require(msg.value >= totalFee, "Insufficient fee");
        
        for (uint i = 0; i < skillIds.length; i++) {
            require(skillIds[i] >= 1 && skillIds[i] <= MAX_SKILL_ID, "Invalid skill ID");
            if (!builderSkills[msg.sender][skillIds[i]]) {
                _addSkill(msg.sender, skillIds[i]);
                emit SkillAdded(msg.sender, skillIds[i], block.timestamp);
            }
        }
        
        _updateCredibilityScore(msg.sender);
        
        if (msg.value > totalFee) {
            payable(msg.sender).transfer(msg.value - totalFee);
        }
    }
    
    // ============ Vouch Functions ============
    
    /**
     * @notice Vouch for another builder's skill
     * @param builder Address of the builder to vouch for
     * @param skillId Skill ID to vouch for
     */
    function vouch(address builder, uint8 skillId) external payable onlyRegistered validSkill(skillId) {
        require(builder != msg.sender, "Cannot vouch for yourself");
        require(builders[builder].exists, "Builder not registered");
        require(builderSkills[builder][skillId], "Builder doesn't have this skill");
        require(!hasVouched[msg.sender][builder][skillId], "Already vouched");
        require(msg.value >= vouchFee, "Insufficient fee");
        
        hasVouched[msg.sender][builder][skillId] = true;
        skillVouches[builder][skillId]++;
        builders[builder].vouchesReceived++;
        builders[msg.sender].vouchesGiven++;
        totalVouches++;
        
        _updateCredibilityScore(builder);
        _updateCredibilityScore(msg.sender);
        
        emit VouchGiven(msg.sender, builder, skillId, block.timestamp);
        
        if (msg.value > vouchFee) {
            payable(msg.sender).transfer(msg.value - vouchFee);
        }
    }
    
    /**
     * @notice Vouch for multiple skills of a builder
     * @param builder Address of the builder
     * @param skillIds Array of skill IDs to vouch for
     */
    function vouchMultiple(address builder, uint8[] calldata skillIds) external payable onlyRegistered {
        require(builder != msg.sender, "Cannot vouch for yourself");
        require(builders[builder].exists, "Builder not registered");
        
        uint256 validVouches = 0;
        
        for (uint i = 0; i < skillIds.length; i++) {
            uint8 skillId = skillIds[i];
            if (
                skillId >= 1 && 
                skillId <= MAX_SKILL_ID &&
                builderSkills[builder][skillId] &&
                !hasVouched[msg.sender][builder][skillId]
            ) {
                hasVouched[msg.sender][builder][skillId] = true;
                skillVouches[builder][skillId]++;
                builders[builder].vouchesReceived++;
                builders[msg.sender].vouchesGiven++;
                totalVouches++;
                validVouches++;
                
                emit VouchGiven(msg.sender, builder, skillId, block.timestamp);
            }
        }
        
        require(validVouches > 0, "No valid vouches");
        uint256 totalFee = vouchFee * validVouches;
        require(msg.value >= totalFee, "Insufficient fee");
        
        _updateCredibilityScore(builder);
        _updateCredibilityScore(msg.sender);
        
        if (msg.value > totalFee) {
            payable(msg.sender).transfer(msg.value - totalFee);
        }
    }
    
    // ============ Profile Update Functions ============
    
    /**
     * @notice Update your username
     * @param newUsername New username
     */
    function updateUsername(string calldata newUsername) external payable onlyRegistered {
        require(bytes(newUsername).length >= 3 && bytes(newUsername).length <= 20, "Username 3-20 chars");
        require(usernameToAddress[newUsername] == address(0), "Username taken");
        require(_isValidUsername(newUsername), "Invalid username format");
        require(msg.value >= updateUsernameFee, "Insufficient fee");
        
        string memory oldUsername = builders[msg.sender].username;
        delete usernameToAddress[oldUsername];
        
        builders[msg.sender].username = newUsername;
        usernameToAddress[newUsername] = msg.sender;
        
        emit UsernameUpdated(msg.sender, oldUsername, newUsername);
        
        if (msg.value > updateUsernameFee) {
            payable(msg.sender).transfer(msg.value - updateUsernameFee);
        }
    }
    
    /**
     * @notice Update social links (free)
     * @param github GitHub username
     * @param twitter Twitter handle
     */
    function updateSocials(string calldata github, string calldata twitter) external onlyRegistered {
        builders[msg.sender].github = github;
        builders[msg.sender].twitter = twitter;
        
        emit ProfileUpdated(msg.sender, github, twitter);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get full builder profile
     */
    function getBuilder(address wallet) external view returns (
        string memory username,
        string memory github,
        string memory twitter,
        uint256 registeredAt,
        uint256 credibilityScore,
        uint256 vouchesReceived,
        uint256 vouchesGiven,
        uint8[] memory skills
    ) {
        Builder storage b = builders[wallet];
        require(b.exists, "Builder not found");
        
        return (
            b.username,
            b.github,
            b.twitter,
            b.registeredAt,
            b.credibilityScore,
            b.vouchesReceived,
            b.vouchesGiven,
            builderSkillList[wallet]
        );
    }
    
    /**
     * @notice Get builder by username
     */
    function getBuilderByUsername(string calldata username) external view returns (address) {
        return usernameToAddress[username];
    }
    
    /**
     * @notice Get vouch count for a specific skill
     */
    function getSkillVouches(address builder, uint8 skillId) external view returns (uint256) {
        return skillVouches[builder][skillId];
    }
    
    /**
     * @notice Get all skills with their vouch counts
     */
    function getSkillsWithVouches(address builder) external view returns (
        uint8[] memory skills,
        uint256[] memory vouches
    ) {
        uint8[] storage skillList = builderSkillList[builder];
        uint256[] memory vouchCounts = new uint256[](skillList.length);
        
        for (uint i = 0; i < skillList.length; i++) {
            vouchCounts[i] = skillVouches[builder][skillList[i]];
        }
        
        return (skillList, vouchCounts);
    }
    
    /**
     * @notice Check if user has vouched for a skill
     */
    function checkVouch(address voucher, address builder, uint8 skillId) external view returns (bool) {
        return hasVouched[voucher][builder][skillId];
    }
    
    /**
     * @notice Get total builder count
     */
    function getBuilderCount() external view returns (uint256) {
        return totalBuilders;
    }
    
    /**
     * @notice Get builder address by index
     */
    function getBuilderAtIndex(uint256 index) external view returns (address) {
        require(index < allBuilders.length, "Index out of bounds");
        return allBuilders[index];
    }
    
    /**
     * @notice Get paginated list of builders
     */
    function getBuilders(uint256 offset, uint256 limit) external view returns (address[] memory) {
        if (offset >= allBuilders.length) {
            return new address[](0);
        }
        
        uint256 end = offset + limit;
        if (end > allBuilders.length) {
            end = allBuilders.length;
        }
        
        address[] memory result = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = allBuilders[i];
        }
        
        return result;
    }
    
    /**
     * @notice Get skill name by ID
     */
    function getSkillName(uint8 skillId) external pure returns (string memory) {
        if (skillId == 1) return "Solidity";
        if (skillId == 2) return "Vyper";
        if (skillId == 3) return "Rust";
        if (skillId == 4) return "Cairo";
        if (skillId == 5) return "React";
        if (skillId == 6) return "Next.js";
        if (skillId == 7) return "TypeScript";
        if (skillId == 8) return "Vue";
        if (skillId == 9) return "Node.js";
        if (skillId == 10) return "Python";
        if (skillId == 11) return "Go";
        if (skillId == 12) return "Foundry";
        if (skillId == 13) return "Hardhat";
        if (skillId == 14) return "Wagmi";
        if (skillId == 15) return "Viem";
        if (skillId == 16) return "Ethers.js";
        if (skillId == 17) return "UI/UX";
        if (skillId == 18) return "Figma";
        if (skillId == 19) return "Security";
        if (skillId == 20) return "DevRel";
        if (skillId == 21) return "Technical Writing";
        if (skillId == 22) return "Base";
        if (skillId == 23) return "Ethereum";
        if (skillId == 24) return "DeFi";
        if (skillId == 25) return "NFT";
        return "";
    }
    
    // ============ Internal Functions ============
    
    function _addSkill(address wallet, uint8 skillId) internal {
        if (!builderSkills[wallet][skillId]) {
            builderSkills[wallet][skillId] = true;
            builderSkillList[wallet].push(skillId);
            totalSkillsClaimed++;
        }
    }
    
    function _updateCredibilityScore(address wallet) internal {
        Builder storage b = builders[wallet];
        // Score = (vouches received × 10) + (skills × 5) + (vouches given × 2)
        b.credibilityScore = (b.vouchesReceived * 10) + 
                            (builderSkillList[wallet].length * 5) + 
                            (b.vouchesGiven * 2);
    }
    
    function _isValidUsername(string calldata username) internal pure returns (bool) {
        bytes memory b = bytes(username);
        for (uint i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            if (!(
                (char >= 0x30 && char <= 0x39) || // 0-9
                (char >= 0x41 && char <= 0x5A) || // A-Z
                (char >= 0x61 && char <= 0x7A) || // a-z
                char == 0x5F // _
            )) {
                return false;
            }
        }
        return true;
    }
    
    // ============ Admin Functions ============
    
    function updateFees(
        uint256 _registerFee,
        uint256 _addSkillFee,
        uint256 _vouchFee,
        uint256 _updateUsernameFee
    ) external onlyOwner {
        registerFee = _registerFee;
        addSkillFee = _addSkillFee;
        vouchFee = _vouchFee;
        updateUsernameFee = _updateUsernameFee;
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        payable(owner).transfer(balance);
        emit FeesWithdrawn(owner, balance);
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
    
    receive() external payable {}
}
