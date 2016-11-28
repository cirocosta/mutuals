'use strict';

const States = {
    UNKNOWN: 0,
    NOT_PAID: 1,
    PAID: 2,
    PAID_AND_CLAIMED: 3
};

contract('Insured', (accounts) => {
    it('should start in NOT_PAID state', async () => {
        let fund = accounts[0];
        let tokenContract = await Token.new({from: fund});
        let contract = await Insured.new(tokenContract.address, fund, {from: fund});

        assert.equal(
            await contract.state(),
            States.NOT_PAID);
    });

    it('should be in PAID state after paying premium', async () => {
        let fund = accounts[0];
        let insured = accounts[1];
        let tokenContract = await Token.new({from: fund});
        let contract = await Insured.new(tokenContract.address, fund, {from: insured});

        await tokenContract.transfer(insured, 100);
        await contract.payPremium();

        assert.equal(
            await contract.state(),
            States.PAID);
    });

    it('should be in PAID_AND_CLAIMED after making claim', async () => {
        let fund = accounts[0];
        let insured = accounts[1];
        let tokenContract = await Token.new({from: fund});
        let contract = await Insured.new(tokenContract.address, fund, {from: insured});

        await tokenContract.transfer(insured, 100);
        await contract.payPremium();
        await contract.makeClaim();

        assert.equal(
            await contract.state(),
            States.PAID_AND_CLAIMED);
    });

    it('should have a claim contract after making a claim', async () => {
        const IN_APPROVAL_STATE = 1;

        let fund = accounts[0];
        let insured = accounts[1];
        let tokenContract = await Token.new({from: fund});
        let contract = await Insured.new(tokenContract.address, fund, {from: insured});

        await tokenContract.transfer(insured, 100);
        await contract.payPremium();
        await contract.makeClaim();

        let claimContract = Claim.at(await contract.claimContract());

        assert.equal(
            await claimContract.state(),
            IN_APPROVAL_STATE);

    });

    it('should receive tokens in balance after accepted claim', async () => {
        //TODO
    });

    it('should have balance reduced after paying premium', async () => {
        let fund = accounts[0];
        let insured = accounts[1];
        let tokenContract = await Token.new({from: fund});
        let contract = await Insured.new(tokenContract.address, fund, {from: insured});

        await tokenContract.transfer(insured, 100);

        assert.equal(
            (await tokenContract.getBalance.call(insured)).toNumber(),
            100);

        await contract.payPremium();

        assert.equal(
            (await tokenContract.getBalance.call(insured)).toNumber(),
            99);
    });

    it('should increase the fund\'s balance after paying premium', async () => {
        let fund = accounts[0];
        let insured = accounts[1];
        let tokenContract = await Token.new({from: fund});
        let contract = await Insured.new(tokenContract.address, fund, {from: insured});

        await tokenContract.transfer(insured, 100);

        assert.equal(
            (await tokenContract.getBalance.call(fund)).toNumber(),
            900);

        await contract.payPremium();

        assert.equal(
            (await tokenContract.getBalance.call(fund)).toNumber(),
            901);
    });


    it('shouldnt be able to pay premium without funds', async () => {
        let fund = accounts[0];
        let insured = accounts[1];
        let tokenContract = await Token.new({from: fund});
        let contract = await Insured.new(tokenContract.address, fund, {from: insured});

        try {
            await contract.payPremium({from: fund});
            assert.notOk(true);
        } catch (err) {
            assert.ok(err);
        }

        assert.equal(
            await contract.state(),
            States.NOT_PAID);
    });

    it('should not be able to make claim if not paid', async () => {
        let fund = accounts[0];
        let tokenContract = await Token.new({from: fund});
        let contract = await Insured.new(tokenContract.address, fund, {from: fund});

        try {
            await contract.makeClaim({from: fund});
            assert.notOk(true);
        } catch (err) {
            assert.ok(err);
        }

        assert.equal(
            await contract.state(),
            States.NOT_PAID);
    });

    it('should not be able to acquire funds without sending value', async () => {
        let fund = accounts[0];
        let insured = accounts[1];
        let tokenContract = await Token.new({from: fund});
        let contract = await Insured.new(tokenContract.address, fund, {from: insured});

        try {
            await contract.acquireFunds({from: fund, value: 0});
            assert.notOk(true);
        } catch (err) {
            assert.ok(err);
        }

        assert.equal(
            await contract.state(),
            States.NOT_PAID);
    });

    it('should able to acquire funds by sending ether', async () => {
        let fund = accounts[0];
        let insured = accounts[1];
        let tokenContract = await Token.new({from: fund});
        let contract = await Insured.new(tokenContract.address, fund, {from: insured});

        await contract.acquireFunds({from: insured, value: 10});

        assert.equal(
            (await tokenContract.getBalance.call(insured)).toNumber(),
            5);
    });
});


