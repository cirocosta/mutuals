'use strict';


const arraysToPeople = (arr) => {
    let people = [];

    arr[0].forEach((_, index) => {
        people.push({
            name: arr[0][index],
            id: arr[1][index]
        });
    });

    return people;
}


contract('People', (accounts) => {
    it('should start with no person added', async () => {
        let contract = People.deployed();
        let people = arraysToPeople(await contract.getPeople());

        assert.equal(people.length, 0, 'Should have no ony registered');
    });

    it('should be capable of adding people', async () => {
        let contract = People.deployed();
        await contract.addPerson('ciro', 123, {from: accounts[0]});

        let people = arraysToPeople(await contract.getPeople.call());
        assert.equal(people.length, 1, 'Should have someone registered');
    });

    it('should error if person not found', async () => {
        const unkownId = 20;
        let contract = People.deployed();
        let [position, err] = await contract.getPersonPosition.call(unkownId);

        assert.ok(err, 'should have errored');
    });

});


contract('People', (accounts) => {
    it('should return correct position if person found', async () => {
        const secondId = 222;
        let contract = People.deployed();

        await contract.addPerson('ciro1', 111, {from: accounts[0]});
        await contract.addPerson('ciro2', secondId, {from: accounts[0]});
        await contract.addPerson('ciro3', 333, {from: accounts[0]});

        let [position, err] = await contract.getPersonPosition(secondId);

        assert.equal(position.toNumber(), 1, 'should have returned 1');
    });

    it('should swap people', async () => {
        let contract = People.deployed();
        let [positionPerson1, err] = await contract.getPersonPosition(111);

        assert.equal(positionPerson1.toNumber(), 0, 'should be at first position');
        assert.ok(await contract.swapPeople(0, 2), 'swap should not fail');

        [positionPerson1, err] = await contract.getPersonPosition(111);
        assert.equal(positionPerson1.toNumber(), 2, 'after swap, now at the end');
    });

    it('should error swapping out of bound', async () => {
        let contract = People.deployed();

        try {
            await contract.swapPeople(0, 99)
            assert.notOk(true);
        } catch (err) {
            assert.ok(err);
        }
    });
});
