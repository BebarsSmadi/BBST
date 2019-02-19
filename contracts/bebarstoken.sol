pragma solidity >=0.4.2;

contract bebarsToken {
    string public name = "BebarsToken";
    string public sympol = "BBST";
    string public standard = "BBST token v1.0";
    uint256 public totalsupply;
    event transfer(
address indexed _from,
address indexed _to,
uint256 _value
    );
    mapping(address => uint256 ) public balanceof;
    constructor (uint256 _initialsupply) public {
        balanceof[msg.sender] = _initialsupply;
        totalsupply = _initialsupply;
        //allocate the initial supply 
    }
function transfer (address _to , uint256 _value) public returns (bool success) {
require(balanceof[msg.sender] >= _value);
balanceof[msg.sender] -= _value;
balanceof[_to] += _value;
transfer(msg.sender, _to, _value);
return true;
};
        
    
}