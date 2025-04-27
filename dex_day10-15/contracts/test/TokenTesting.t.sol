// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {
    TokenA,
    TokenB
} from "../src/Tokens.sol";
import {
    Faucet
} from "../src/Faucet.sol";
contract TokenTesting is Test{

    address public lpProvider=vm.addr(1);
    address public user=vm.addr(2);
    TokenA public tokenA;
    TokenB public tokenB;
    Faucet public faucet;
    function setUp() public {
        vm.startPrank(lpProvider);
        vm.deal(lpProvider, 100 ether);
        tokenA = new TokenA();
        tokenB = new TokenB();
        console.log("TokenA Address: ", address(tokenA));
        console.log("TokenB Address: ", address(tokenB));
        assertEq(tokenA.balanceOf(lpProvider), tokenA.MAX_SUPPLY());
        assertEq(tokenB.balanceOf(lpProvider), tokenB.MAX_SUPPLY());
        vm.stopPrank();
    }
    
    function testBalanceofLP() external{
        vm.startPrank(lpProvider);

        assertEq(tokenA.balanceOf(lpProvider), tokenA.MAX_SUPPLY());
        console.log("TokenA Balance: ", tokenA.balanceOf(lpProvider));
        assertEq(tokenB.balanceOf(lpProvider), tokenB.MAX_SUPPLY());
        console.log("TokenB Balance: ", tokenB.balanceOf(lpProvider));
        vm.stopPrank();
    }
    function FaucetCreation() public{
        vm.startPrank(lpProvider);
        faucet = new Faucet(address(tokenA), address(tokenB));
        console.log("Faucet Address: ", address(faucet));
        tokenA.approve(address(faucet), tokenA.MAX_SUPPLY());
        tokenB.approve(address(faucet), tokenB.MAX_SUPPLY());
        tokenA.transfer(address(faucet), tokenA.MAX_SUPPLY()/2);
        tokenB.transfer(address(faucet), tokenB.MAX_SUPPLY()/2);
        vm.stopPrank();
    }
    function testFaucetCreation() external{
        FaucetCreation();  
        vm.startPrank(lpProvider); 
        assertEq(tokenA.balanceOf(address(faucet)), tokenA.MAX_SUPPLY()/2);
        assertEq(tokenB.balanceOf(address(faucet)), tokenB.MAX_SUPPLY()/2);
        console.log("Faucet TokenA Balance: ", tokenA.balanceOf(address(faucet)));
        console.log("Faucet TokenB Balance: ", tokenB.balanceOf(address(faucet)));
        vm.stopPrank();
    }
    function testRequestTokenA() external {
        FaucetCreation();
        vm.startPrank(user);
        uint256 faucetBalance = tokenA.balanceOf(address(faucet));
        console.log("Faucet TokenA Balance before request: ", faucetBalance);
        uint256 initialBalance = tokenA.balanceOf(user);
        console.log("TokenA Balance before request: ", initialBalance);
        faucet.requestTokenA();
        uint256 finalBalance = tokenA.balanceOf(user);
        assertEq(finalBalance, initialBalance+1e18*10);
        console.log("TokenA Balance after request: ", finalBalance);
        vm.stopPrank();
    }
    function testRequestTokenB() external {
        FaucetCreation();
        vm.startPrank(user);
        uint256 faucetBalance = tokenB.balanceOf(address(faucet));
        console.log("Faucet TokenB Balance before request: ", faucetBalance);
        uint256 initialBalance = tokenB.balanceOf(user);
        console.log("Initial TokenB Balance: ", initialBalance);
        faucet.requestTokenB();
        uint256 finalBalance = tokenB.balanceOf(user);
        assertEq(finalBalance, initialBalance+1e18*10);
        console.log("TokenB Balance after request: ", finalBalance);
        vm.stopPrank();
    }
    function testGetFaucetBalance() external {
        FaucetCreation();
        vm.startPrank(lpProvider);
        (uint256 tokenABalance, uint256 tokenBBalance) = faucet.getFaucetBalance();
        assertEq(tokenABalance, tokenA.MAX_SUPPLY()/2);
        assertEq(tokenBBalance, tokenB.MAX_SUPPLY()/2);
        console.log("Faucet TokenA Balance: ", tokenABalance);
        console.log("Faucet TokenB Balance: ", tokenBBalance);
        vm.stopPrank();
    }


}