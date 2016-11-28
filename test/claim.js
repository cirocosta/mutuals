'use strict';

const States = {
    UNKNOWN: 0,
    IN_APPROVAL: 1,
    ACCEPTED: 2,
    REJECTED: 3
};

contract('Claim', (accounts) => {
    it('should start in IN_APPROVAL state', async () => {
        let fund = accounts[0];
        let tokenContract = await Token.new({from: fund});
        let claimContract = await Claim.new(tokenContract.address, fund, {from: fund});

        assert.equal(
            await claimContract.state(),
            States.IN_APPROVAL);
    });

    it('should start with 0 accepts', async () => {
        let fund = accounts[0];
        let tokenContract = await Token.new({from: fund});
        let contract = await Claim.new(tokenContract.address, fund, {from: fund});

        assert.equal(
            (await contract.getAccepts.call()).toNumber(),
            0);
    });

    it('should increase `accepts` when accepted', async () => {
        let fund = accounts[0];
        let acceptor = accounts[1];
        let tokenContract = await Token.new({from: fund});
        let contract = await Claim.new(tokenContract.address, fund, {from: fund});

        assert.equal(
            (await contract.getAccepts.call()).toNumber(),
            0);

        await contract.acceptClaim({from: acceptor});

        assert.equal(
            (await contract.getAccepts.call()).toNumber(),
            1);
    });

    it('shouldnt be able to accept its own claim', async () => {
        let fund = accounts[0];
        let tokenContract = await Token.new({from: fund});
        let contract = await Claim.new(tokenContract.address, fund, {from: fund});

        assert.equal(
            (await contract.getAccepts.call()).toNumber(),
            0);

        try {
            await contract.acceptClaim({from: fund});
            assert.notOk(true);
        } catch (err) {
            assert.ok(err);
        }

        assert.equal(
            (await contract.getAccepts.call()).toNumber(),
            0);
    });

    it('should perform the token transfer when executing claim', async () => {
        let fund = accounts[0];
        let receiver = accounts[1];

        let tokenContract = await Token.new({from: fund});
        let claimContract = await Claim.new(tokenContract.address, fund, {from: receiver});

        assert.equal(
            (await tokenContract.getBalance.call(fund)).toNumber(),
            1000);

        await claimContract.acceptClaim({from: fund});
        await claimContract.acceptClaim({from: fund});
        await claimContract.acceptClaim({from: fund});

        await claimContract.executeClaim(receiver, {from: fund});

        assert.equal(
            (await tokenContract.getBalance.call(receiver)).toNumber(),
            10);

        assert.equal(
            (await tokenContract.getBalance.call(fund)).toNumber(),
            990);
    });
});

