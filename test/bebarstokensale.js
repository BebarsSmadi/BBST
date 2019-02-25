var bebarstokensale = artifacts.require('./bebarstokensale.sol')
var bebarstoken = artifacts.require('./bebarstoken.sol');
contract('bebarstokensale' , function(accounts){
    var tokeninstance;
    var tokensaleinstance;
    var admin = accounts [0];
    var buyer = account[1];
    var tokenprice = 1000000000000000000; //in wei
    var tokensavaliable = 75000;
    var numberoftokens;
    it('initialize the contract with the correct values',function() {
        return bebarstokensale.deployed().then(function(instance){
            tokensaleinstance = instance;
            return tokensaleinstance.address
        }).then(function(address) {
            assert.notequal(address, 0x0 , ' has contract address');
            return tokensaleinstance.tokencontract();
            

        }).then(function(address) {
            assert.notequal(address, 0x0 , ' has token contract address');
            return tokensaleinstance.tokenprice();
           
        }).then(function(price) {
            assert.equal(price, tokenprice, 'token price is correct')

        });

    });
    it('facilitates token buying', function() {
        return bebarstoken.deployed().then(function(instance){
            tokeninstance = instance;
            return bebarstokensale.deployed();
        }).then(function(instance) {
            tokensaleinstance = instance;
            return tokeninstance.transfer(tokensaleinstance.address , tokensavaliable, { from: admin })
        }).then(function(recipt) {
            numberoftokens = 10;
            return tokensaleinstance.buytokens(numberoftokens, { from: buyer, value: numberoftokens * totalsupply })
        })
        }).then(function(recipt) {
            assert.equal(recipt.logs.length, 1, 'triggers one event');
            assert.equal(recipt.logs[0].event, 'sell' , 'should be the "sell" event');
            assert.equal(recipt.logs[0].args._buyer,buyer[0],'logs the account that purchased the tokens ');
            assert.equal(recipt.logs[0].args._amount,numberoftokens[1],'logs the number of tokens purchased');
        
            return tokensaleinstance.tokensold();
            
        }).then(function(amount) {
            assert.equal(amount.tonumber(),numberoftokens, 'increments the number of token sold');
            return tokeninstance.balanceof(buyer);
        }).then(function(balance) {
            assert.equal(balance.tonumber(), numberoftokens);
            return tokeninstance.balanceof(tokensaleinstance.address);
        }).then(function(balance ) {
            assert.equal(balance.tonumber(),tokensavaliable - numberoftokens );
        
            return tokensaleinstance.buytokens(numberoftokens, { froms: buyer, value: 1 });

        }).then(assert.fail).catch(function(error){
            assert(error.message.indexof('revert') >= 0,'msg.value must equal number of tokens in wei');
            return tokensaleinstance.buytokens(800000, { from: buyer, value : numberoftokens * tokenprice})
             
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexof('revert') >= 0,'cannot purchase more tokens than avaliable ');

        })

        it('ends token sale ', function () {
            return bebarstokensale.deployed().then(function(instance) {
                tokensaleinstance = instance;
                return bebarstokensale.deployed();
            }).then(function(instance) {
                tokensaleinstance = instance;
                return tokensaleinstance.endsale({from : buyer});


            }).then(assert.fail).catch(function(error) {
                assert(error.message.indexof('revert' >= 0, 'must be admin to end sale'));
                return tokensaleinstance.endsale({ from: admin});
            }).then(function(recipt) {
                return tokeninstance.endsale({ from: admin});

            }).then(function(recipt) {
                return tokeninstance.balanceof(admin);
            }).then(function(balance) {
                assert.equal(balance.tonumber(), 999990, 'return all unsold tokens to admin' )
                return tokensaleinstance.tokenprice();
            }).then(function(price) {
                assert.equal(price, 0, 'token price was reset');
            });

            });

        });




