pragma solidity ^0.5.0;


contract MyFirstContract {
  uint public balance;

  constructor() public {
    balance = 100;
  }

  function getBalance() returns(uint) {
    return balance;
  }
}
