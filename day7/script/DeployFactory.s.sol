// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Script} from "forge-std/Script.sol";
import {CoffeeFactory} from "../src/CoffeeFactory.sol";
import {console} from "forge-std/console.sol";

contract DeployFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        CoffeeFactory coffeeFactory = new CoffeeFactory();
        console.log("CoffeeFactory deployed to:", address(coffeeFactory));

        vm.stopBroadcast();
    }
}
