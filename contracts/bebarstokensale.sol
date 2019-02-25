pragma solidity >=0.4.2;

import "./bebarstoken.sol";

contract Bebarstokensale {
    address admin;
    Bebarstoken public tokencontract;
    uint256 public tokenprice;
    uint256 public tokensold;

    event Sell(address _buyer,uint256 _amount );

      function bebarstokensale(bebarstoken _tokencontract, uint256 _tokenprice) public {
        admin = msg.sender;
        tokencontract = _tokencontract;
        tokenprice = _tokenprice;

    }
    function multiply(uint x,uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);

    }

    function buytokens(uint256 _numberoftokens) public payable {
        require(msg.value == multiply(_numberoftokens, tokenprice));
        require(tokencontract.balanceof(this) >= numberoftokens);
        require(tokencontract.transfer(msg.sender, _numberoftokens));
        tokensold += _numberoftokens;

        sell(msg.sender, _numberoftokens);
    
    
    }
    function endsale() public {
        require(msg.sender == admin);
        require(tokencontract.transfer(admin, tokencontract.balanceof(this)));
       
        selfdestruct(admin);
   

    }
}