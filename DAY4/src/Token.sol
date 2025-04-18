// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract Token is ERC20{


    constructor(string memory name,string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }
    function getInfo() public view returns (string memory, string memory, uint256) {
        return (name(), symbol(), totalSupply());
    }
}
// 0x70A2cd08Ddfaf4F5881d7718Abd8Ec51B429B1Fb