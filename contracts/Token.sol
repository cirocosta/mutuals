pragma solidity ^0.4.2;

contract Token {

    uint public constant price = 2;
    mapping (address => uint) balances;

    event Transferred(
        address _from,
        address _to,
        uint256 _value
    );

    event Buy(
        address _buyer,
        uint256 _amount
    );

    event Sell(
        address _seller,
        uint256 _amount
    );

    address owner;


    function Token ()
    {
        owner = msg.sender;
        balances[owner] = 1000;
    }


    function transfer(address receiver, uint amount)
    {
        transfer(msg.sender, receiver, amount);
    }


    function transfer(address origin, address receiver, uint amount)
    {
        if (receiver == origin) {
            throw;
        }

        if (balances[origin] < amount) {
            throw;
        }

        balances[origin] -= amount;
        balances[receiver] += amount;

        Transferred(origin, receiver, amount);
    }


    function buy (address buyer)
        payable returns (uint amount)
    {
        amount = msg.value / price;

        if (amount == 0)
            throw;

        balances[buyer] += amount;
        Buy(buyer, amount);

        return amount;
    }


    function sell (address seller, uint amount)
        returns (bool succeeded)
    {
        if (balances[seller] < amount)
            throw;

        balances[seller] -= amount;

        if (!seller.send(amount))
            return false;

        Sell(seller, amount);

        return true;
    }


	function getBalance(address addr)
        constant returns(uint)
    {
		return balances[addr];
	}
}

