// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// This version doesn't include logic for the SHUSH token
error ZeroAddressNotAllowed();
error UserDoesNotExist(address user);
error NameTaken();
error NotOwnerOfSendingDomain();


contract Whisper is Pausable,AccessControl{


    //define user role
    //bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
    

    //define email address structure

    //notice we did seperate mandatory email header from the actual email

    //we will need some client side processing to remove the headers after decryption

    struct Email {
        string sender;
        string recipient;
        string ipfsCID; // pointer to email
        uint256 timestamp;
    }

    // this is for Name lookup kind of min ENS
    struct Identity{
        address addr;
        string encryptionPublicKey;
    }

    //the deployer is the owner
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }




    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        unpause();
    }
    //old modifiers this cost more in gas bad !!!!
    /*
    modifier nonZeroAddress(address _addr) {
        require(_addr != address(0), "zero address not allowed");
        _;
    }
    
    modifier userExist(address _addr){
        require(hasInbox[_addr]  == true ,"User do nit exist!!");
        _;

    }
    */


    

    modifier nonZeroAddress(address _addr) {
    if (_addr == address(0)) revert ZeroAddressNotAllowed();
    _;
    }

    modifier userExist(address _addr) {
    if (!hasInbox[_addr]) {  // Checks if `hasInbox[_addr]` is false
        revert UserDoesNotExist(_addr); // Reverts with custom error
    }
    _;
    }

    modifier nameOwner(string memory _name){
        if(ENS[_name].addr != msg.sender){
            revert NotOwnerOfSendingDomain();
        } 
    _;
    }

    modifier nameNotTaken(string memory _name){
        if(ENS[_name].addr != address(0)){
            revert NameTaken();
        }
    _;
    }

    
    //very important mapping every user address has an array of Emails
    mapping(address => Email[]) private Inbox;

    //just a trick to track send emails very every wallet account easily
    mapping(address => Email[]) private Sent;

    //used to track if an address has an inbox
    //tracking existance versus non-empty
    mapping(address => bool) private hasInbox;

    //email name lookup 
    mapping(string => Identity) public ENS;
    
    function registerUser(string memory _name, string memory _encryptionPubKey) public nameNotTaken(_name) whenNotPaused { //might add payment for registary later
        hasInbox[msg.sender] = true;
        Identity memory identity = Identity({
            addr: msg.sender,
            encryptionPublicKey:_encryptionPubKey
        });
        ENS[_name]=identity;
        
    }



    

   

    //this function is safe because msg.sender is safe in the first place because
    // it needs blockchain digital signature with the sender private key
    //this is supposedly plays access control role for reading email (the only person who can read his inbox is the receiver )

    function getInbox() public userExist(msg.sender) whenNotPaused  view returns (Email[] memory) {
        return Inbox[msg.sender];
    }

    //same as the above but for getting the sent email of the user
    // for the sent inbox feature with email
    function getSent() public userExist(msg.sender) whenNotPaused view returns (Email[] memory) {
        return Sent[msg.sender];
    }






     //this is another trick the indexed keyword is used to make this parameter searchable using inbox[_to].push(email);
    //the trick here is this events are public is this plays as a feature of proof of sending (Non-repudiation)
    //since it’s an immutable, timestamped record on the blockchain.
    event EmailSent(address indexed from, string indexed to);
    //this function create and email in memory of each etheruim node
    //then adds the message to recipient inbox this function is safe because msg.sender is safe we can't send emails in someone's name

    function sendEmail(
        string memory _from,
        string memory _to,
        string memory _ipfsCID
    ) public nameOwner(_from)   whenNotPaused  {  // nameOwner replaced userExist() it check for existance + make sure he owns the name// userExist(msg.sender) is very important we make sure the user exist + he owns the account because msg.sender is safe
        
               
        address recipientAddr = ENS[_to].addr; // we resolve the name address
        //make sure it exist as user in the system
        if(recipientAddr == address(0)){
            revert UserDoesNotExist(recipientAddr);
        }
        
        Email memory email = Email({
            sender: _from,
            recipient: _to ,
            ipfsCID: _ipfsCID,
            timestamp: block.timestamp //block.timestamp gets the timestamp of when the block that contains the TX got minned no super accurate
        });

        Inbox[recipientAddr].push(email);
        Sent[msg.sender].push(email);
        emit EmailSent(msg.sender, _to); // used for proof of sending
    }
}





// register user we register our self this is safe because of msg.sender it doesnt need to be the zero address (well it can't be because of the signing) 
// we provide name and public key we make a modifier for checking name existance
// here we can't use the ENS for existance checking so we will hasInbox mapping too
//if all good we update hasInbox and update the ENS



