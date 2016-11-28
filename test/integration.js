'use strict';

contract('Integration', (accounts) => {
    const CLAIM_IN_APPROVAL_STATE = 1;

    it('claim paying', async () => {
        let fund = accounts[0];
        let claimer = accounts[1];
        let customer2 = accounts[2];
        let customer3 = accounts[3];
        let customer4 = accounts[4];

        let contract = await Mutuals.new({from: fund});

        await contract.signUp(claimer);
        await contract.signUp(customer2);
        await contract.signUp(customer3);
        await contract.signUp(customer4);

        let insuredClaimer = await Insured.at(await contract.getInsured.call(claimer));
        await insuredClaimer.acquireFunds({from: claimer, value: 10});
        await insuredClaimer.payPremium();
        await insuredClaimer.makeClaim();

        let claimerClaimContract = Claim.at(await insuredClaimer.claimContract.call());
        assert.equal(
            await claimerClaimContract.state(),
            CLAIM_IN_APPROVAL_STATE);
    });
});

