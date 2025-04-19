// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract VestingToken is Ownable{
    IERC20 public vestingtoken;
    struct VestingSchedule{
        uint256 totalAmount;
        uint256 claimedAmount;
        uint256 cliffDuration;
        uint256 duration;
        uint256 startTime;
    }
    mapping(address=>VestingSchedule) public vestingSchedules;
    error VestingScheduleAlreadyExists(address beneficiary);
    error AmountCannotBezero();
    error AmountExceedsTotalAmount(uint256 amount, uint256 totalAmount);
    error CliffDurationCannotBeZero();
    error DurationCannotBeZero();
    error StartTimeCannotBeZero();
    error StartTimeCannotBeInThePast(uint256 startTime);
    error CliffDurationCannotBeGreaterThanDuration(uint256 cliffDuration, uint256 duration);
    error CliffDurationCannotBeLessThanZero(uint256 cliffDuration);
    error DurationCannotBeLessThanZero(uint256 duration);
    error CannotSetVestingSchedule(address beneficiary);
    error VestingScheduleNotExists(address beneficiary);
    error CliffNotReached(uint256 cliffDuration);
    error NothingToClaim(uint256 claimable);
    constructor(address _token) Ownable(msg.sender){
        vestingtoken = IERC20(_token);
    }
    function setVestingSchedule(
        address _beneficiary,
        uint256 _totalAmount,
        uint256 _cliffDuration,
        uint256 _duration,
        uint256 _startTime
    )external onlyOwner(){
        if(vestingSchedules[_beneficiary].totalAmount != 0){
            revert VestingScheduleAlreadyExists(_beneficiary);
        }
        if(_totalAmount == 0){
            revert AmountCannotBezero();
        }
        if(_cliffDuration == 0){
            revert CliffDurationCannotBeZero();
        }
        if(_duration == 0){
            revert DurationCannotBeZero();
        }
        if(_startTime == 0){
            revert StartTimeCannotBeZero();
        }
        if(_startTime < block.timestamp){
            revert StartTimeCannotBeInThePast(_startTime);
        }
        if(_cliffDuration > _duration){
            revert CliffDurationCannotBeGreaterThanDuration(_cliffDuration, _duration);
        }
        if(_cliffDuration < 0){
            revert CliffDurationCannotBeLessThanZero(_cliffDuration);
        }
        if(_duration < 0){
            revert DurationCannotBeLessThanZero(_duration);
        }
        vestingSchedules[_beneficiary]=VestingSchedule(
            _totalAmount,
            0,
            _cliffDuration,
            _duration,
            _startTime
        );
        // vestingtoken.transferFrom(msg.sender, address(this), _totalAmount);
        bool success=vestingtoken.transferFrom(msg.sender, address(this), _totalAmount);
        require(success, "Transfer failed");

    }
    function claimVesting() external{
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        if(schedule.totalAmount == 0){
            revert VestingScheduleNotExists(msg.sender);
        }
        if(block.timestamp < schedule.startTime + schedule.cliffDuration){
            revert CliffNotReached(schedule.cliffDuration);
        }
        uint256 elapsed=block.timestamp-schedule.startTime;
        uint releasable=(elapsed * schedule.totalAmount) / schedule.duration;
        if(releasable>schedule.totalAmount){
            releasable=schedule.totalAmount;
        }
        uint256 claimable=releasable-schedule.claimedAmount;
        if(claimable == 0){
            revert NothingToClaim(claimable);
        }
        schedule.claimedAmount+=claimable;
        bool success=vestingtoken.transfer(msg.sender, claimable);
        require(success, "Transfer failed");
    }
    function getAmountVested(address user) external view returns(uint256){
        VestingSchedule storage schedule = vestingSchedules[user];
        if(schedule.totalAmount == 0){
            revert VestingScheduleNotExists(user);
        }
        if(block.timestamp < schedule.startTime + schedule.cliffDuration){
            revert CliffNotReached(schedule.cliffDuration);
        }
        uint256 elapsed=block.timestamp-schedule.startTime;
        uint releasable=(elapsed * schedule.totalAmount) / schedule.duration;
        if(releasable>schedule.totalAmount){
            releasable=schedule.totalAmount;
        }
        return releasable-schedule.claimedAmount;
    }
    function getClaimable(address user) external view returns(uint256){
        VestingSchedule storage schedule = vestingSchedules[user];
        if(schedule.totalAmount == 0){
            revert VestingScheduleNotExists(user);
        }
        if(block.timestamp < schedule.startTime + schedule.cliffDuration){
            revert CliffNotReached(schedule.cliffDuration);
        }
        uint256 elapsed=block.timestamp-schedule.startTime;
        uint releasable=(elapsed * schedule.totalAmount) / schedule.duration;
        if(releasable>schedule.totalAmount){
            releasable=schedule.totalAmount;
        }
        return releasable-schedule.claimedAmount;
    }




}