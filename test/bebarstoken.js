var bebarstoken = artifacts.require(".bebarstoken.sol");


contract('bebarstoken', function(accounts) {
    var tokeninstance;
    it('initializes the contract with the correct value ', function() {
        return bebarstoken.deployed().then(function(instance){
tokeninstance = instance
return tokeninstance.name();
        }).then(function(name){
            assert.equal(name, 'BebarsToken', 'has the correct name');
            return tokeninstance.sympol();
        }).then(function(sympol) {
            assert.equal(sympol, 'BBST' , 'has the correct sympol');
            return tokeninstance.standard();

        }).then(function(standard){
            assert.equal(standard, 'BBST token v1.0', 'has the correct standard');

        });
        
    })
    it('allocates the total supply upon deployment',function() {
return bebarstoken.deployed().then(function(instance) {
tokeninstance = instance;
return tokeninstance.totalsupply();
}).then(function(totalsupply) {
assert.equal(totalsupply.tonumber(), 1000000, 'sets the total supply to 1,000,000' )
return tokeninstance.balanceof(accounts[0]);
}).then (function(adminbalance) {
assert.equal(adminbalance.tonumber(), 1000000, 'it allocates the initial supply to the admin account');
});
    });

it('transfers token ownership', function() {
    return bebarstoken.deployed().then(function(instance) {
        tokeninstance = instance ;
        return tokeninstance.transfer.call(accounts[1], 99999999999999999);
    }).then(assert.fail).catch(function(error) {
    assert(error.message.indexof('revert') >= 0, 'error message most contain revert' );
    return tokeninstance.transfer(accounts[1], 250000 , {from: accounts[0]});
    }).then(function(success) {
       assert.equal(success , true, 'it returns true' );
    
    return tokeninstance.transfer(accounts[1], 2500000,  {from: accounts [0] });
}).then (function(recipt) {
    assert.equal(recipt.logs.length, 1, 'triggers one event');
    assert.equal(recipt.logs[0].event, 'transfer' , 'should be the "transfer" event');
    assert.equal(recipt.logs[0].args._from,accounts[0],'logs the account the token are transferred from');
    assert.equal(recipt.logs[0].args._to,accounts[1],'logs the account the token are transferred to');
    assert.equal(recipt.logs[0].args._value, 250000,'logs the transfer amount');
   
return tokeninstance.balanceof(accounts[1]);

}).then(function(balance) {
    assert.equal(balance.tonumber(), 2500000 , ' adds the amount of reciving account ');
    return tokeninstance.balanceof(accounts[0]);
}).then(function(balance) {
assert.equal(balance.tonumber(), 750000, 'deducts the amount from the sending account');

});
});
})