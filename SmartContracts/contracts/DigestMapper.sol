// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DigestMapper is Ownable {
    mapping(string => string) private data;

    constructor() Ownable(msg.sender) {}

    function get(string memory key) public view returns (string memory) {
        return data[key];
    }

    function set(string memory key, string memory value) public onlyOwner {
        data[key] = value;
    }
}
