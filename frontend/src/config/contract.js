// Contract configuration
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'YOUR_CONTRACT_ADDRESS';
export const CHAIN_ID = 8453; // Base Mainnet

// Contract ABI
export const CONTRACT_ABI = [
  "function register(string calldata username, string calldata github, string calldata twitter, uint8[] calldata initialSkills) external payable",
  "function addSkill(uint8 skillId) external payable",
  "function vouch(address builder, uint8 skillId) external payable",
  "function getBuilder(address wallet) external view returns (string memory, string memory, string memory, uint256, uint256, uint256, uint256, uint8[] memory)",
  "function getBuilderByUsername(string calldata username) external view returns (address)",
  "function getSkillsWithVouches(address builder) external view returns (uint8[] memory, uint256[] memory)",
  "function checkVouch(address voucher, address builder, uint8 skillId) external view returns (bool)",
  "function getBuilderCount() external view returns (uint256)",
  "function getBuilders(uint256 offset, uint256 limit) external view returns (address[] memory)",
  "function totalVouches() external view returns (uint256)",
  "function totalSkillsClaimed() external view returns (uint256)",
  "function builders(address) external view returns (address, string memory, string memory, string memory, uint256, uint256, uint256, uint256, bool)",
  "function registerFee() external view returns (uint256)",
  "function addSkillFee() external view returns (uint256)",
  "function vouchFee() external view returns (uint256)"
];
