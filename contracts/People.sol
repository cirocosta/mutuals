pragma solidity ^0.4.2;

contract People {

    struct Person {
        bytes32 name;
        uint id;
    }

    event PersonAdd(
        uint indexed _id
    );


    event PersonRemove(
        uint indexed _id
    );


    Person[] public people;


    function addPerson (bytes32 _name, uint _id)
        returns (bool added)
    {
        Person memory newPerson;

        newPerson.name = _name;
        newPerson.id  = _id;

        people.push(newPerson);
        PersonAdd(newPerson.id);

        return true;
    }


    function swapPeople(uint positionFirst, uint positionSecond)
        returns (bool swapped)
    {
        Person memory tmpPerson;

        if (!(people[positionSecond].id != 0 &&
              people[positionFirst].id != 0)) {
            return false;
        }

        tmpPerson = people[positionSecond];
        people[positionSecond] = people[positionFirst];
        people[positionFirst] = tmpPerson;

        return true;
    }


    function removePerson (uint _id)
        returns (bool removed)
    {
        uint length = people.length;
        var (position, err) = getPersonPosition(_id);

        if (err) {
            return false;
        }

        PersonRemove(_id);

        swapPeople(length-1, position);
        delete people[length-1];

        return true;
    }


    function getPersonPosition(uint _id)
        constant returns (uint position, bool err)
    {
        uint length = people.length;
        uint[] memory ids = new uint[](length);

        for (uint i = 0; i < people.length; i++) {
            if  (people[i].id == _id) {
                return (i, false);
            }
        }

        return (0, true);
    }


    function getPeople()
        constant returns (bytes32[], uint[])
    {
        uint length = people.length;
        Person memory person;

        bytes32[] memory names = new bytes32[](length);
        uint[] memory ids = new uint[](length);

        for (uint i = 0; i < people.length; i++) {
            names[i] = people[i].name;
            ids[i] = people[i].id;
        }

        return (names, ids);
    }

}

