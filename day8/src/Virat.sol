// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract ViratNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter = 0;

    constructor() ERC721("Virat", "VKT") Ownable(msg.sender) {
        // Constructor logic if needed
    }
    function mintNft(address to, string memory tokenURI) external onlyOwner {
        _safeMint(to, tokenCounter);
        _setTokenURI(tokenCounter, tokenURI);
        tokenCounter++;
    }
    function getTokenCounter() external view returns (uint256) {
        return tokenCounter;
    }
}
