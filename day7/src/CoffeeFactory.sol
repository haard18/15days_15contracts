// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BuyMeCoffee} from "./BuyCoffee.sol";
contract CoffeeFactory {
    mapping(address => address) public deployedContracts;
    address[] public allDeployedContracts;
    error ContractAlreadyDeployed();
    event CoffeeContractDeployed(
        address indexed artist,
        address indexed contractAddress
    );
    function createCoffeeContract(string memory name) external {
        if (deployedContracts[msg.sender] != address(0)) {
            revert ContractAlreadyDeployed();
        }
        BuyMeCoffee coffeeContract = new BuyMeCoffee(name, msg.sender);
        allDeployedContracts.push(address(coffeeContract));
        deployedContracts[msg.sender] = address(coffeeContract);
        emit CoffeeContractDeployed(msg.sender, address(coffeeContract));
    }
    function getAllDeployedContracts()
        external
        view
        returns (address[] memory)
    {
        return allDeployedContracts;
    }
}
