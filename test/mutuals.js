'use strict';


contract('Mutuals', (accounts) => {
    const STATE_NOT_PAID = 1;

    it('should allow signups', async () => {
        let fund = accounts[0];
        let customer = accounts[1];
        let contract = await Mutuals.new({from: fund});

        await contract.signUp(customer);
        let insuredCustomer = await Insured.at(await contract.getInsured.call(customer));

        assert.equal(
            await insuredCustomer.state(),
            STATE_NOT_PAID);
    });
});



//      let tokenContract = Token.at(await contract.tokenContract());

//      assert.equal(
//          (await tokenContract.getBalance.call(customer)).toNumber(),
//          5);
