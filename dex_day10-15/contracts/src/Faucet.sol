// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Faucet {
    event TokensReceived(address indexed user, uint256 amount);
    IERC20 public tokenA;
    IERC20 public tokenB;
    error CannotRequestMoreThanMaxTokens();
    uint256 public constant MAX_TOKENS = 10 * 1e18;
    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }
    function requestTokenA() external {
        if (tokenA.balanceOf(address(this)) < MAX_TOKENS) {
            revert CannotRequestMoreThanMaxTokens();
        }
        tokenA.transfer(msg.sender, MAX_TOKENS);
        emit TokensReceived(msg.sender, MAX_TOKENS);
    }
    function requestTokenB() external {
        if (tokenB.balanceOf(address(this)) < MAX_TOKENS) {
            revert CannotRequestMoreThanMaxTokens();
        }
        tokenB.transfer(msg.sender, MAX_TOKENS);
        emit TokensReceived(msg.sender, MAX_TOKENS);
    }
    function getFaucetBalance() external view returns (uint256, uint256) {
        return (
            tokenA.balanceOf(address(this)),
            tokenB.balanceOf(address(this))
        );
    }
    
}
