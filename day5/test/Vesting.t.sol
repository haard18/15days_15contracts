// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {VestingToken} from "../src/VestToken.sol";
import {VestToken} from "../src/Token.sol"; // Your ERC20 token contract

contract VestTest is Test {
    VestingToken vestingToken;
    VestToken vestToken;

    address owner = vm.addr(1);
    address beneficiary = vm.addr(2);
    uint256 constant DECIMALS = 1e18;
    function setUp() external {
        vm.startPrank(owner);
        vestToken = new VestToken();
        vestingToken = new VestingToken(address(vestToken));
        vestToken.approve(address(vestingToken), type(uint256).max);
        // vestToken.transfer(address(vestingToken), 100 * DECIMALS); // fund vesting contract
        console.log(
            "ERC20 Balance of Vesting Contract: %s",
            vestToken.balanceOf(address(vestingToken))
        );
        vm.stopPrank();
    }

    function testCreatingVestingWorks() external {
        vm.startPrank(owner);
        vestingToken.setVestingSchedule(
            beneficiary,
            100 * DECIMALS,
            1 days,
            30 days,
            block.timestamp + 1 days
        );
        
        (
            uint256 totalAmount,
            uint256 claimedAmount,
            uint256 cliffDuration,
            uint256 duration,
            uint256 startTime
        ) = vestingToken.vestingSchedules(beneficiary);
        assertEq(totalAmount, 100 * DECIMALS);
        assertEq(claimedAmount, 0);
        assertEq(cliffDuration, 1 days);
        assertEq(duration, 30 days);
        assertEq(startTime, block.timestamp + 1 days);
        vm.stopPrank();
        
    }
    function testCanClaimFullAfterVestingEnds() external{
        vm.startPrank(owner);
        vestingToken.setVestingSchedule(
            beneficiary,
            100 * DECIMALS,
            1 days,
            30 days,
            block.timestamp + 1 days
        );
        vm.warp(block.timestamp + 31 days);
        // uint256 claimable = vestingToken.claimableAmount(beneficiary);
        uint256 claimable= vestingToken.getClaimable(beneficiary);
        assertEq(claimable, 100 * DECIMALS);
        vm.stopPrank();
        vm.startPrank(beneficiary);
        uint256 balanceBefore = vestToken.balanceOf(beneficiary);
        vestingToken.claimVesting();
        uint256 balanceAfter = vestToken.balanceOf(beneficiary);
        assertEq(balanceAfter - balanceBefore, 100 * DECIMALS);
        // assertEq(vestingToken.vestingSchedules(beneficiary).claimedAmount, 100 * DECIMALS);
        vm.stopPrank();
    }
    
}
