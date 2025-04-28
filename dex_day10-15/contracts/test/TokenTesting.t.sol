// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {TokenA, TokenB} from "../src/Tokens.sol";
import {Faucet} from "../src/Faucet.sol";
import {LiquidityPool} from "../src/LiquidityPool.sol";
import {LPToken} from "../src/LiquidityPool.sol";

contract TokenTesting is Test {
    address public lpProvider = vm.addr(1);
    address public user = vm.addr(2);
    TokenA public tokenA;
    TokenB public tokenB;
    Faucet public faucet;
    LPToken public lpToken;
    LiquidityPool public liquidityPool;

    function setUp() external {
        vm.startPrank(lpProvider);
        tokenA = new TokenA();
        tokenB = new TokenB();
        faucet = new Faucet(address(tokenA), address(tokenB));
        liquidityPool = new LiquidityPool(address(tokenA), address(tokenB));

        // Ensure LPToken instance is stored properly
        lpToken = liquidityPool.lpToken();

        tokenA.approve(address(faucet), type(uint256).max);
        tokenB.approve(address(faucet), type(uint256).max);
        tokenA.transfer(address(faucet), tokenA.MAX_SUPPLY() / 2);
        tokenB.transfer(address(faucet), tokenB.MAX_SUPPLY() / 2);

        vm.stopPrank();
    }

    function testLiquidityFlow() external {
        vm.startPrank(lpProvider);
        uint256 amountA = 100 * 1e18;
        uint256 amountB = 100 * 1e18;

        // Approve the liquidity pool to spend tokens
        tokenA.approve(address(liquidityPool), type(uint256).max);
        tokenB.approve(address(liquidityPool), type(uint256).max);

        // Add liquidity to the pool
        liquidityPool.addLiquidity(amountA, amountB);

        // Assert the balances of the liquidity pool
        assertEq(tokenA.balanceOf(address(liquidityPool)), amountA);
        assertEq(tokenB.balanceOf(address(liquidityPool)), amountB);
        // lpToken.balanceOf(lpProvider);
        console.log("LP Token Balance: ", lpToken.balanceOf(lpProvider));
        // You may want to check the LPToken balances or totalSupply
        console.log("LP Token Total Supply: ", lpToken.totalSupply());
        vm.stopPrank();
        vm.startPrank(lpProvider);
        // Remove liquidity from the pool
        uint256 lpTokenAmount = lpToken.balanceOf(lpProvider);
        lpToken.approve(address(liquidityPool), lpTokenAmount);
        console.log('Pool balance before remove: ', tokenA.balanceOf(address(liquidityPool)), tokenB.balanceOf(address(liquidityPool)));

        liquidityPool.removeLiquidity(lpTokenAmount);
        // Assert the balances of the liquidity pool
        assertEq(tokenA.balanceOf(address(liquidityPool)), 0);
        assertEq(tokenB.balanceOf(address(liquidityPool)), 0);

        // // Assert the balances of the user
        // assertEq(tokenA.balanceOf(lpProvider), amountA);
        // assertEq(tokenB.balanceOf(lpProvider), amountB);
        // assert that lptokensupply has decreased
        assertEq(lpToken.totalSupply(), 0);
        // assert that user has received the tokens
        
    }
}
