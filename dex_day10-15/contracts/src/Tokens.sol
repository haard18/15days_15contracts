// SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20{
    uint256  public constant  MAX_SUPPLY = 1_000_000 * 1e18;
    constructor() ERC20("TokenA","TKA"){
        _mint(msg.sender, MAX_SUPPLY);
    }

}
contract TokenB is ERC20{
    uint256  public constant  MAX_SUPPLY = 1_000_000 * 1e18;
    constructor() ERC20("TokenB","TKB"){
        _mint(msg.sender, MAX_SUPPLY);
    }
} 