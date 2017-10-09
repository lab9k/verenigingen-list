pragma solidity ^0.4.16;


contract Owned {

    mapping(address => bool) admins;

    function Owned() {
        admins[msg.sender] = true;
    }

    modifier isAdmin(){
        require(admins[msg.sender]);
        _;
    }

    function addAdmin(address _newAdmin) isAdmin {
        admins[_newAdmin] = true;
    }

    function removeAdmin(address _admin) isAdmin {
        admins[_admin] = false;
    }

    function checkIfAdmin(address _addr) constant returns(bool admin) {
        admin = admins[_addr];
    }

}


contract VerenigingenContract is Owned {

    enum Status {NULL, ACCEPTED, PENDING, DENIED }

    event addVerenigingEvent(uint id, string _naam, string _ondernemingsnummer, string _beschrijving, uint datetime);
    event editVerenigingEvent(uint id, string _naam, string _ondernemingsnummer, string _beschrijving, uint datetime);
    event statuschangedEvent(uint id, Status status, uint datetime);

    struct Vereniging {
        string naam;
        string ondernemingsnummer;
        string beschrijving;
        Status status;
        uint lastChange;
    }
    uint public numVerenigingen = 0;
    mapping(uint => Vereniging) verenigingen;

    function VerenigingenContract() {

    }

    function acceptRequest(uint id) isAdmin {
        if (verenigingen[id].status != Status.PENDING) {
            revert();
        }
        verenigingen[id].status = Status.ACCEPTED;
        verenigingen[id].lastChange = now;
        statuschangedEvent(id, Status.ACCEPTED, now);
    }

    function denyRequest(uint id) isAdmin {
        if (verenigingen[id].status == Status.DENIED) {
            revert();
        }
        verenigingen[id].status = Status.DENIED;
        verenigingen[id].lastChange = now;
        statuschangedEvent(id, Status.DENIED, now);
    }

    function addVereniging(string _naam, string _ondernemingsnummer, string _beschrijving) isAdmin {
        verenigingen[numVerenigingen] = Vereniging({
            naam:_naam,
            ondernemingsnummer:_ondernemingsnummer,
            beschrijving:_beschrijving,
            status:Status.PENDING,
            lastChange:now
        });
        addVerenigingEvent(numVerenigingen, _naam, _ondernemingsnummer, _beschrijving, now);
        numVerenigingen++;
    }

    function editVereniging(
        uint id,
        string _naam,
        string _ondernemingsnummer,
        string _beschrijving) isAdmin
        {
        if(bytes(_naam).length != 0) {
          verenigingen[id].naam = _naam;
        }
        if(bytes(_ondernemingsnummer).length != 0) {
          verenigingen[id].ondernemingsnummer = _ondernemingsnummer;
        }
        if(bytes(_beschrijving).length != 0) {
          verenigingen[id].beschrijving = _beschrijving;
        }
        verenigingen[id].status = Status.PENDING;
        verenigingen[id].lastChange = now;
        editVerenigingEvent(id, verenigingen[id].naam,verenigingen[id].ondernemingsnummer, verenigingen[id].beschrijving, now);
    }

    function getVereniging(uint id) constant returns(string, string, string, Status, uint, uint) {
        return (verenigingen[id].naam,verenigingen[id].ondernemingsnummer,verenigingen[id].beschrijving,verenigingen[id].status,verenigingen[id].lastChange, id);
    }
}
