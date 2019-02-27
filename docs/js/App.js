App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 1000000,
    

  init: function() {
    console.log("App initialized....")
    return App.initWeb3();
  },

  initWeb3: function (){
   if (typeof web3 !=='undefined') {
      //if a web3 instance is already provided by meta mask
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);

    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost7545');
      web3 = new Web3(App.web3Provider)
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("BebarsTokenSale.json", function(bebarsTokenSale) {
      App.contracts.BebarsTokenSale = TruffleContract(bebarsTokenSale);
      App.contracts.BebarsTokenSale.setProvider(App.web3Provider);
      App.contracts.BebarsTokenSale.deployed().then(function(bebarsTokenSale){
        console.log("Bebars Token Sale Address", bebarsTokenSale.address);
      });
    }).done(function() {
      $.getJSON("BebarsToken.json", function(bebarsToken){
        App.contracts.BebarsToken = TruffleContract(bebarsToken);
        App.contracts.BebarsToken.setProvider(App.web3Provider);
        App.contracts.BebarsToken.deployed().then(function(bebarsToken){
         console.log("Bebars Token  Address", bebarsToken.address);
        });   
        App.listenForEvents();  
        return App.render();
      });
    })
  },
  listenForEvents: function() {
    App.contracts.BebarsTokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event){
        console.log("event triggered", event);
        App.render();
      })
    })
  },   
 render: function() {
  if (App.loading) {
    return;
  }
  App.loading = true;

  var loader = $('#loader');
  var content = $('#content');

  loader.show();
  content.hide();

  web3.eth.getCoinbase(function(err, account){
    if(err === null) {
      App.account = account;
      $('#accountaddress').html("Your Account:" + account);
    }
  })


   App.contracts.BebarsTokenSale.deployed().then(function(instance) {
      bebarsTokenSaleInstance = instance;
      return bebarsTokenSaleInstance.tokenPrice();
    }).then(function(tokenPrice){
     App.tokenPrice = tokenPrice;
      $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
      return bebarsTokenSaleInstance.tokensSold();
    }).then(function(tokensSold){
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html(App.tokensSold);
      $('.tokens-available').html(App.tokensAvailable);

      var progressPercent =(Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
      console.log(progressPercent);
      $('#progress').css('width' , progressPercent + '%');
    

      App.contracts.BebarsToken.deployed().then(function(instance) {
       bebarsTokenInstance = instance;
       return bebarsTokenInstance.balanceOf(App.account);
      }).then(function(balance) {
       $('.bbst-balance').html(balance.toNumber());
       App.loading = false;
       loader.hide();
       content.show()
      

      
      })   
    }); 
  }, 
  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.BebarsTokenSale.deployed().then(function(instance){
      return instance.buyTokens(numberOfTokens, {
       from: App.account,
       value: numberOfTokens * App.tokenPrice,
       gas: 50000,
      });
    }).then(function(result){
      console.log("Tokens bought.....")
      $('.from').trigger('reset') //reset number of tokens in form
         //wait for sell event
    });
  }
}

$(function(){
  $(window).load(function() {
    App.init(); 
  })
});

