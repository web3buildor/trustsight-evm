// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TrustSightSBT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("TrustSight SBT", "TSBT") {}

    mapping(uint256 => string) public tokenIdToURI;

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        require(from == address(0), "Token not transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function mint(address to, string memory _tokenURI) public {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        tokenIdToURI[tokenId] = _tokenURI;
        _safeMint(to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function setTokenURI(
        uint256 _tokenId,
        string memory _tokenURI
    ) public onlyOwner {
        require(_exists(_tokenId), "Non-existent token");

        tokenIdToURI[_tokenId] = _tokenURI;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "Non-existent token");

        return tokenIdToURI[_tokenId];
    }
}
