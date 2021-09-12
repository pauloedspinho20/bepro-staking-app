// SPDX-License-Identifier: MIT

pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SpadeRadioERC20Token is ERC20 {
    address public admin;

    constructor() ERC20("Spade Radio", "SPADA") {
        _mint(msg.sender, 69420 * 10**18);
        admin = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == admin, "Only Spada can mint $SPADE");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
