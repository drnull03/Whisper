// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// This version doesn't include logic for the SHUSH token 


contract Whisper{
//define email address structure

//notice we did seperate mandatory email header from the actual email

//we will need some client side processing to remove the headers after decryption

struct Email {
address sender;
address recipient;
string ipfsCID; // pointer to email
uint256 timestamp;

}









modifier nonZeroAddress(address _addr) {
    require(_addr != address(0), "nonZeroAddress: zero address");
    _;
}









//very important mapping every user address has an array of Emails
mapping(address => Email[]) private Inbox;

//just a trick to track send emails very every wallet account easily
mapping(address => Email[]) private Sent;


//used to track if an address has an inbox
//tracking existance versus non-empty
mapping(address => bool)    private hasInbox;







//this is another trick the indexed keyword is used to make this parameter searchable using inbox[_to].push(email);
//the trick here is this events are public is this plays as a feature of proof of sending (Non-repudiation)
//since it’s an immutable, timestamped record on the blockchain.
event EmailSent(address indexed from,address indexed to);




//this function is safe because msg.sender is safe in the first place because 
// it needs blockchain digital signature with the sender private key 
//this is supposedly plays access control role for reading email (the only person who can read his inbox is the receiver )

function getInbox() public view returns (Email[] memory) {
        return Inbox[msg.sender];
        
}

//same as the above but for getting the sent email of the user
// for the sent inbox feature with email
function getSent() public view returns (Email[] memory){
    return Sent[msg.sender];
}



//this function create and email in memory of each etheruim node
//then adds the message to recipient inbox this function is safe because msg.sender is safe we can't send emails in someone's name

function sendEmail(address _to , string memory _ipfsCID) public nonZeroAddress(_to) {

Email memory email = Email({
sender: msg.sender,
recipient: _to,
ipfsCID: _ipfsCID,
timestamp:block.timestamp
});

Inbox[_to].push(email);
Sent[msg.sender].push(email);
emit EmailSent(msg.sender, _to);

}



    
}