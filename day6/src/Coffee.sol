// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BuyMeCoffee {
    error NotArtist();
    error CannotBuyCoffee();

    address public artist; //ARtist is the owner of the contract
    string public artistName;
    uint256 public numberOfCoffees;

    // mapping(address=>string) public messages;
    // mapping(address=>string) public names;
    struct Coffeesbought {
        string name;
        string message;
    }
    Coffeesbought[] public allCoffees;
    event NewCoffe(address indexed from, string name, string message);
    event Withdraw(address indexed to, uint amount);
    modifier onlyArtist() {
        // require(msg.sender==);
        if (msg.sender != artist) {
            revert NotArtist();
        }
        _;
    }
    // modifier
    constructor(string memory name, address artistAddress) {
        artist = artistAddress;
        artistName = name;
    }
    function buyCoffee(
        string memory name,
        string memory message
    ) external payable {
        if (msg.value <= 0.001 ether) {
            revert CannotBuyCoffee();
        }

        Coffeesbought memory newCoffee = Coffeesbought(name, message);
        allCoffees.push(newCoffee);
        numberOfCoffees++;  
        emit NewCoffe(msg.sender, name, message);
    }
    function withdraw() external onlyArtist {
        uint amount = address(this).balance;
        (bool success, ) = artist.call{value: amount}("");
        require(success, "Transfer failed.");
        emit Withdraw(artist, amount);
    }
    function getBalance() external view onlyArtist returns (uint) {
        return address(this).balance;
    }
    function getAllCoffess() external view returns(Coffeesbought[] memory ){ 
        return allCoffees;
    }

}
