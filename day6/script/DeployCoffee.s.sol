// SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import { BuyMeCoffee } from "../src/Coffee.sol";
import { console } from "forge-std/console.sol";
contract DeployCoffee is Script{
    function run() external{
        // uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // address deployer = vm.addr(deployerPrivateKey);
        address artist= 0x2B51E79C9CaE4772c7462aCa10090d8d0FC86D23;
        // console.log("Deployer address: ", deployer);
        vm.startBroadcast();
        BuyMeCoffee coffee = new BuyMeCoffee("Haard", artist);
        console.log("Contract deployed at: ", address(coffee));
        vm.stopBroadcast();
    }
}