// SPDX-License-Identifier:MIT
pragma solidity ^0.8.25;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract SimpleLiquidityPool {
    
    error AmountsMustBeGreaterThanZero();

    IERC20 public tokenA;
    IERC20 public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalLiquidity;
    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }
    function provideLiquidity(uint256 amountA,uint256 amountB) external{
        if(amountA == 0 || amountB == 0) {
            revert AmountsMustBeGreaterThanZero();
        }
        tokenA.transferFrom(msg.sender,address(this),amountA);
        tokenB.transferFrom(msg.sender,address(this),amountB);
        reserveA += amountA;
        reserveB += amountB;
        totalLiquidity += amountA + amountB;
    }
    function swapAforB(uint256 amountA) external {
        uint256 amountB = (amountA * reserveB) / reserveA;
        tokenA.transferFrom(msg.sender,address(this),amountA);
        tokenB.transfer(msg.sender,amountB);
        reserveA += amountA;
        reserveB -= amountB;
    }
    function swapBforA(uint256 amountB) external{
        uint256 amountA = (amountB * reserveA) / reserveB;
        tokenB.transferFrom(msg.sender,address(this),amountB);
        tokenA.transfer(msg.sender,amountA);
        reserveB += amountB;
        reserveA -= amountA;

    }
    function getPriceofAinB() external view returns(uint256){
        uint256 price = (reserveB * 1e18) / reserveA;
        return price;

    }
    function getPriceofBinA()external view returns(uint256){
        uint256 price = (reserveA * 1e18) / reserveB;
        return price;
    }
}
