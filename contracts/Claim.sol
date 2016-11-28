pragma solidity ^0.4.2;

import "./Token.sol";


contract Claim {

    enum ClaimStates { UNKNOWN, IN_APPROVAL, ACCEPTED, REJECTED }

    ClaimStates public state;

    uint constant LOSS_VALUE = 10;
    uint constant REQUIRED_ACCEPTS = 3;

    address fundAccount;
    address claimerAccount;
    Token tokenContract;
    address[] acceptors;

    event ClaimAccepted();


    function Claim (address tokenContractAddr, address fundAccountAddr)
    {
        tokenContract = Token(tokenContractAddr);

        state = ClaimStates.IN_APPROVAL;
        claimerAccount = msg.sender;
        fundAccount = fundAccountAddr;
    }


    function executeClaim ()
    {
        if (state != ClaimStates.ACCEPTED)
            throw;

        tokenContract.transfer(fundAccount, claimerAccount, LOSS_VALUE);
    }


    function acceptClaim ()
    {
        address acceptor = msg.sender;

        if (acceptor == claimerAccount)
            throw;

        acceptors.push(acceptor);

        if (acceptors.length == REQUIRED_ACCEPTS) {
            state = ClaimStates.ACCEPTED;
            ClaimAccepted();
        }
    }


    function getAccepts ()
        constant returns (uint numberOfAccepts)
    {
        return acceptors.length;
    }


    function hasBeenConfirmed (address claim)
        constant returns (bool confirmed)
    {
        return acceptors.length == REQUIRED_ACCEPTS;
    }
}

