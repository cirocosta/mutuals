# Mutuals

The mutuals contract comprehends of three base contracts: `Token.sol`, `People` and `Mutuals.sol`. 

- `Token`: Base token used for representing value;
- `Claim`: representation of a claim which demands a minimum number of acceptors to consider the claim accepted and have the agreed value transfered from the fund to the account
- `Insured`: a person that is insured. It has an account in `Token`'s balance where its funds are kept. 
- `Mutuals`: Aggregation of people that agree on a given set of rules that entails the contract. Essentially this is a list of `Insured` and `Claim`s that are made.


## How it Works

### Parties

There are essentially two parties:

- fund (single fund): simply a balance of funds
- insured (multiple insured people): an address associated with a given amount of funds
- claim (multiple claims might exist; each person might eventually make a claim once or more than once): representation of a coverage of loss claim


### States

The customer (insured) has 2 states:

1. `PAID`: the insured paid its premium and it is now elegible for making new claims
2. `PAID_AND_CLAIMED`: it paid its premium and made a claim. Now it's elebigle for receiving the refund
3. `PAID_BUT_EXPIRED`: the period that the premium covered has expired. A new payment must be performed.

The claim has 3 states:

1.  `IN_APROVAL`: the claim was submitted but it has not been approved yet.
2.  `ACCEPTED`: it was accepted and now the refund ought to be made
3.  `REJECTED`: the claim was rejected - final state.

Note.: in the sample implementation there can only exist one claim per insured person at a time.


### Storage

- `balance`: mapping between addresses and funds. Each customer has an entry here, as well as the fund.

### Contracts

There are mainly 3 contracts

- `Claim`
- `Insured`
- `Token`

There's a single `Token` contract that holds the balance for all of the parties involved (insured people and the fund). Whenever a payment is made the fund's balance is increased (and the premium payer's balance decreased). Whenever a claim is executed (after confirmation from a certain amount of insured people), the fund's balance is decreased (and the premium payer's fund increased).

Claims are only accepted (and then executed) after a certain amount of confirmations from other participants.



## Testing

Fist make sure you have everything you need in place:

- [testrpc](https://github.com/ethereumjs/testrpc)
- [truffle](https://github.com/ConsenSys/truffle)

Once you start `testrpc` (which provides some simulation of an Ethereum network all in memory), you just need to run `truffle test`: this will run the tests defined in `./contrats/test`, then using the available Ether to perform such transactions in the local `testrpc` network.

