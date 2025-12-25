// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/VouchBase.sol";

contract DeployVouchBase is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        VouchBase vouchBase = new VouchBase();

        console.log("VouchBase deployed to:", address(vouchBase));

        vm.stopBroadcast();
    }
}
