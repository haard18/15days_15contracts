// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract LPToken is ERC20 {
    address public pool;
    error NotPool();
    constructor(address _pool) ERC20("LPToken", "LPT") {
        pool = _pool;
    }
    function mint(uint256 amount, address to) external {
        if (msg.sender != pool) {
            revert NotPool();
        }
        _mint(to, amount);
    }
    function burn(uint256 amount, address to) external {
        if (msg.sender != pool) {
            revert NotPool();
        }
        _burn(to, amount);
    }
}
// 100 a then 3 of them are going to fees
contract LiquidityPool {
    IERC20 public tokenA;
    IERC20 public tokenB;
    LPToken public lpToken;
    uint256 private constant FEE = 997; // 0.3% fee (1000 - 3)

    uint256 public reserveA;
    uint256 public reserveB;

    error InsufficientLiquidity();
    error AmountCannotBeZero();
    event LiquidityAdded(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );
    event LiquidityRemoved(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );
    event SwappedAforB(
        address indexed trader,
        uint256 amountA,
        uint256 amountB
    );
    event SwappedBforA(
        address indexed trader,
        uint256 amountB,
        uint256 amountA
    );

    event ReservesUpdated(uint256 reserveA, uint256 reserveB);
    event LPTokenMinted(address indexed to, uint256 amount);
    event LPTokenBurned(address indexed from, uint256 amount);

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        lpToken = new LPToken(address(this));
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        if (amountA == 0 || amountB == 0) {
            revert AmountCannotBeZero();
        }
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        reserveA += amountA;
        reserveB += amountB;
        uint256 liquidity;
        if (lpToken.totalSupply() == 0) {
            liquidity = sqrt(amountA * amountB);
        } else {
            liquidity = min(
                (amountA * lpToken.totalSupply()) / reserveA,
                (amountB * lpToken.totalSupply()) / reserveB
            );
        }
        lpToken.mint(liquidity, msg.sender);
        emit LiquidityAdded(msg.sender, amountA, amountB);
        emit ReservesUpdated(reserveA, reserveB);
        emit LPTokenMinted(msg.sender, liquidity);
    }
    function removeLiquidity(uint256 liquidity) external {
        if (liquidity == 0) {
            revert InsufficientLiquidity();
        }
        uint256 amountA = (liquidity * reserveA) / lpToken.totalSupply();
        uint256 amountB = (liquidity * reserveB) / lpToken.totalSupply();
        reserveA -= amountA;
        reserveB -= amountB;
        lpToken.burn(liquidity, msg.sender);
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
        emit LiquidityRemoved(msg.sender, amountA, amountB);
        emit ReservesUpdated(reserveA, reserveB);
        emit LPTokenBurned(msg.sender, liquidity);
    }
    function swapAforB(uint256 amountA) external {
        if (amountA == 0) {
            revert AmountCannotBeZero();
        }

        uint256 amountAWithFee = (amountA * FEE) / 1000;
        uint256 amountB = (amountAWithFee * reserveB) / reserveA;

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transfer(msg.sender, amountB);
        reserveA += amountAWithFee;
        reserveB -= amountB;
        emit SwappedAforB(msg.sender, amountA, amountB);
        emit ReservesUpdated(reserveA, reserveB);
    }
    // Swap Token B for Token A (with fee)
    function swapBforA(uint256 amountB) external {
        if (amountB == 0) {
            revert AmountCannotBeZero();
        }

        uint256 amountBWithFee = (amountB * FEE) / 1000;
        uint256 amountA = (amountBWithFee * reserveA) / reserveB;

        tokenB.transferFrom(msg.sender, address(this), amountB);

        tokenA.transfer(msg.sender, amountA);
        reserveB += amountBWithFee;
        reserveA -= amountA;
        emit SwappedBforA(msg.sender, amountB, amountA);
        emit ReservesUpdated(reserveA, reserveB);
    }
    function getLPTokenBalance(address user) external view returns (uint256) {
        return lpToken.balanceOf(user);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    // Simulate Swap A for B
    function simulateSwapAforB(
        uint256 amountA
    ) external view returns (uint256) {
        uint256 amountAWithFee = (amountA * FEE) / 1000;
        return (amountAWithFee * reserveB) / reserveA;
    }

    // Simulate Swap B for A
    function simulateSwapBforA(
        uint256 amountB
    ) external view returns (uint256) {
        uint256 amountBWithFee = (amountB * FEE) / 1000;
        return (amountBWithFee * reserveA) / reserveB;
    }
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
    function min(uint256 x, uint256 y) internal pure returns (uint256) {
        return x < y ? x : y;
    }
}
