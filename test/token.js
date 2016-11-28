'use strict';

contract('Token', (accounts) => {
    it('should start with 1k', async () => {
        let fund = accounts[0];
        let contract = await Token.new({from: fund});

        assert.equal(
            (await contract.getBalance.call(fund)).toNumber(),
            1000);
    });

    it('shouldnt be able to transfer to itself', async () => {
        let fund = accounts[0];
        let contract = await Token.new({from: fund});

        assert.equal(
            (await contract.getBalance.call(fund)).toNumber(),
            1000);

        try {
            await contract.transfer(fund, 10);
            assert.notOk(true);
        } catch (err) {
            assert.ok(err);
        }

        assert.equal(
            (await contract.getBalance.call(fund)).toNumber(),
            1000);
    });

    it('should be able to have tokens bought', async () => {
        let fund = accounts[0];
        let buyer = accounts[1];
        let contract = await Token.new({from: fund});

        assert.equal(
            (await contract.getBalance.call(buyer)).toNumber(),
            0);

        await contract.buy(buyer, {value: 2})

        assert.equal(
            (await contract.getBalance.call(buyer)).toNumber(),
            1);
    });

    it('should be able to have tokens sold', async () => {
        let fund = accounts[0];
        let seller = accounts[1];
        let contract = await Token.new({from: fund});

        assert.ok(
            await contract.transfer(seller, 100, {from: fund}));

        assert.equal(
           (await contract.getBalance.call(seller)).toNumber(),
           100);

        const initialEthBalance = (await web3.eth.getBalance(seller)).toNumber();

        await contract.sell(seller, 1, {from: fund, gas: 1000000});

        const finalEthBalance = (await web3.eth.getBalance(seller)).toNumber();

        assert.isAbove(initialEthBalance, finalEthBalance);
        assert.equal(
           (await contract.getBalance.call(seller)).toNumber(),
           99);
    });

    it('shouldnt be able to buy 0', async () => {
        let fund = accounts[0];
        let buyer = accounts[1];
        let contract = await Token.new({from: fund});

        assert.equal(
            (await contract.getBalance.call(buyer)).toNumber(),
            0);

        try {
            await contract.buy(buyer, {value: 0})
            assert.notOk(true);
        } catch (err) {
            assert.ok(err);
        }

        assert.equal(
            (await contract.getBalance.call(buyer)).toNumber(),
            0);
    });

    it('should transfer tokens when it has available', async () => {
        const amount = 10;
        let contract = Token.deployed();

        let a1 = accounts[0];
        let a2 = accounts[1];

        let a1_startBalance = await contract.getBalance.call(a1);
        let a2_startBalance = await contract.getBalance.call(a2);

        assert.ok(
            await contract.transfer(a2, amount, {from: a1}),
            'transfer should have succeeded');

        assert.equal(
            (await contract.getBalance.call(a1)).toNumber(),
            a1_startBalance - amount,
            'Sender should end up with a decrement of `amount`');

        assert.equal(
            (await contract.getBalance.call(a2)).toNumber(),
            a2_startBalance + amount,
            'Receiver should end up with an increment of `amount`');
    });
});
