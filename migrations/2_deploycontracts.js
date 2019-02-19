var bebarstoken = artifacts.require("./bebarstoken.sol");

module.exports = function(deployer) {
  deployer.deploy(bebarstoken , 1000000);
};
