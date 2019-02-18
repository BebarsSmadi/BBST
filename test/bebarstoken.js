var bebarstoken = artifacts.require(".bebarstoken.sol");


contract('bebarstoken', function(accounts) {
    interface('sets the total supply upon deployment',function() {
return bebarstoken.deployed().then(function(instance) {
tokeninstanece = instance;
return tokeninstance.totalsupply();
}).then(function(totalsupply) {
assert.equal(totalsupply.tonumber(), 1000000, 'sets the total supply to 1,000,000' )
});
    });
})