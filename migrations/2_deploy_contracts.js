var bebarstoken = artifacts.require("./bebarstoken.sol");
var bebarstokensale = artifacts.require("./bebarstokensale.sol")

module.exports = function(deployer) {
  deployer.deploy(bebarstoken , 1000000).then(function() {
    //token price is 0.001 eth
    var tokenprice = 1000000000000000000; 
    return deployer.deploy(bebarstokensale ,bebarstoken.address, tokenprice );

  });

};