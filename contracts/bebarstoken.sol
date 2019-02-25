pragma solidity >=0.4.2;

contract BebarsToken {
string public name = "BebarsToken";
string public sympol = "BBST";
string public standard = "BBST token v1.0";
uint256 public totalsupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
         );
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _valuue
         );



    mapping(address => uint256 ) public  balanceof;
    mapping(address => mapping (address => uint256)) public  allowance;
    function(bebarstoken , uint256 _initialsupply)  public {
    balanceof[msg.sender] = _initialsupply;
    totalsupply = _initialsupply;
    
    }

    function Transfer(address _to, uint256 _value) public returns (bool success) {
         require(balanceof[msg.sender] >= _value);
         balanceof[msg.sender] -= _value;
         balanceof[_to] += _value;
         Transfer(msg.sender, _to, _value);        
         return true;
         }

        
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
        }
    
  
    function transferfrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceof[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceof[_from] -= _value;
        balanceof[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
        }
}