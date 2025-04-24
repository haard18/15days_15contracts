// SPDX-License-Identifier:MIT
pragma solidity ^0.8.25;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20{
    constructor(uint256 initialSuply) ERC20("TokenA","TKA"){
        _mint(msg.sender, initialSuply);
    }
}

contract TokenB is ERC20{
    constructor(uint256 initialSuply) ERC20("TokenB","TKB"){
        _mint(msg.sender, initialSuply);
    }
}