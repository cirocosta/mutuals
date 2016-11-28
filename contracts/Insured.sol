pragma solidity ^0.4.2;

import "./Token.sol";
import "./Claim.sol";


contract Insured {

    enum InsuredStates {
        UNKNOWN,
        NOT_PAID,
        PAID,
        PAID_AND_CLAIMED
    }

    InsuredStates public state;
    Claim public claimContract;

    uint constant PREMIUM_VALUE = 1;

    Token tokenContract;
    address fundAccount;
    address insuredAccount;

    event PayedPremium(address _insured, uint _amount);
    event MadeAClaim(address _insured);
    event FundsAcquired(address _insured, uint _amount);


    function Insured (address tokenContractAddr, address fundAccountAddr)
    {
        insuredAccount = msg.sender;
        fundAccount = fundAccountAddr;
        tokenContract = Token(tokenContractAddr);

        state = InsuredStates.NOT_PAID;
    }

    function withdrawFunds (uint amount)
    {
        if (!tokenContract.sell(insuredAccount, amount))
            throw
    }

    function acquireFunds ()
        payable
    {
        tokenContract.buy.value(msg.value)(insuredAccount);
        FundsAcquired(insuredAccount, msg.value/tokenContract.price());
    }


    function payPremium ()
    {
        state = InsuredStates.PAID;
        PayedPremium(insuredAccount, PREMIUM_VALUE);

        tokenContract.transfer(insuredAccount, fundAccount, PREMIUM_VALUE);
    }


    function makeClaim ()
    {
        if (state != InsuredStates.PAID)
            throw;

        state = InsuredStates.PAID_AND_CLAIMED;
        claimContract = new Claim(address(tokenContract), fundAccount);
        MadeAClaim(insuredAccount);
    }
}

