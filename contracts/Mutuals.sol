pragma solidity ^0.4.2;

import "./Token.sol";
import "./Claim.sol";
import "./Insured.sol";


contract Mutuals {

    Token public tokenContract;
    address public fundAccount;

    mapping (address => Claim) claims;
    mapping (address => Insured) insureds;

    event RegistrationMade(
        address _registree
    );


    function Mutuals ()
    {
        tokenContract = new Token();
        fundAccount = msg.sender;
    }


    function signUp (address registree)
    {
        insureds[registree] = new Insured(
            address(tokenContract), fundAccount);
        RegistrationMade(registree);
    }


    function getInsured (address customer)
        constant returns (Insured insured)
    {
        return insureds[customer];
    }

}
