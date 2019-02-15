var MyFirstContract = artifacts.require("./MyFirstContract.sol");

module.exports = function(deployer) {
  deployer.deploy(MyFirstContract);
};