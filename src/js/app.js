app = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenprice: 1000000000000000000,
    tokensold: 0,
    tokensavailable: 1000000,

    init: function() {
        console.log("App initialized....")
        return App.initweb3();
    },

    initweb3: function (){
        if (typeof web3 !=='undefieed') {

        App.web3provider = web3.currentprovider;
        web3 = new web3(web3.currentprovider);

    } else {
        App.web3provider = new web3.providers.HttpProvider('http://localhost7545');
        web3 = new web3(App.web3Provider)
     }
     app.listenforevents();

     return App.initcontracts();
  },
  initcontracts: function(){
      $.getjson("bebarstokensale.json", function(bebarstokensale){
          App,contracts.bebarstokensale = trufflecontract(bebarstokensale);
          App.contracts.bebarstokensale.setprovider(App.web3provider);
          App.contracts.bebarstokensale.deployed().then(function(bebarstokensale){
             console.log("bebars token sale address", bebarstokensale.address);
          });
        }).done(function(){
          $.getjson("bebarstoken.json", function(bebarstoken){
              App,contracts.bebarstoken = trufflecontract(bebarstoken);
              App.contracts.bebarstoken.setprovider(App.web3provider);
              App.contracts.bebarstoken.deployed().then(function(bebarstoken){
                console.log("bebars token  address", bebarstoken.address);
                }).done(function(){       

          });
          return App.render();

      });
  })
},
listenforevents: function(){
    app.contract.bebarstokensale.deployed().then(function(instance){
        instance.sel({} , {
            fromblock: 0,
            toblock: 'latest',

        }).watch(function(error, event){
            console.log("event triggered", event);
            app.render();
        })
    })

},
render: function() {
    if(app.loading) {
        return;
    }
    app.loading = true;
    var loader = $('#loader');
    var content = $('#content');
    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account){
        if(err === null) {
            console.log("account", account);
        App.account = account;
        $('#accountaddress').html("your Account:" + account);
        }
    })
    app.contracts.bebarstokensale.deployed().then(function(instance){
        bebarstokensaleinstance = instance;
        return bebarstokensaleinstance.tokenprice();

    }).then(function(tokenprice){
        app.tokenprice = tokenprice;
        $('.token-price').html(web3.fromWei(app.tokenprice, "ether").tonumber());
        returnbebarstokensaleinstance.tokensold();
    }).then(function(tokensold){
        app.tokensold = tokensold.tonumber();
        $('.tokens-sold').html(app.tokensold);
        $('.tokens-available').html(app.tokensavailable);
        var progresspercent =(math.ceil(app.tokensold) / app.tokensavailable) * 100;
        console.log(progresspercent);
        $('#progress').css('width' , progresspercent + '%');

        app.contract.bebarstoken.deployed().then(function(instance){
            bebarstokeninstance = instance;
            return bebarstokeninstance.balanceof(app.account);

        }).then(function(balance){
            $('.BBST-balance').html(balance.tonumber());
            app.loading = false;
            loader.hide();
            content.show();
        })

    });
    


    

},

buytokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberoftokens = $('#numberoftokens').val();
    app.contracts.bebarstokensale.deployed().then(function(instance){
        return instance.buytokens(numberoftokens, {
            from: app.account,
            value: numberoftokens * app.tokenprice,
            gas: 50000,
        });
    }).then(function(result){
        console.log("tokens bought.....")
        $('.from').trigger('reset') //reset number of tokens in form
        //wait for sell event

    });
}
}



$(function(){
    $window.load(function(){
       App.init(); 
    })
});

