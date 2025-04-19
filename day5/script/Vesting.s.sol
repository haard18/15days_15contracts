// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "forge-std/Script.sol";

import {VestingToken} from "../src/VestToken.sol";
import {VestToken} from "../src/Token.sol";

contract VestingScript is Script {
    function run() external {
        vm.startBroadcast();
        VestToken vestToken = new VestToken();
        VestingToken vestingToken = new VestingToken(address(vestToken));
        address vestingTokenAddress = address(vestingToken);
        address vestTokenAddress = address(vestToken);
        console.log("VestingToken deployed at: %s", vestingTokenAddress);
        console.log("VestToken deployed at: %s", vestTokenAddress);
        // console.log("VestingToken address: %s", vestingTokenAddress);
        // console.log("VestToken address: %s", vestTokenAddress);
        vm.stopBroadcast();
    }
}
