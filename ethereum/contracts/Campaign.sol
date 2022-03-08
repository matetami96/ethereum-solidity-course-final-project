// SPDX-License-Identifier: MIT

// Solidity version to use
pragma solidity ^0.8.12;

// whoever deploys this contract becomes the manager
// a contract that the would be manager will call
// in order to either create a new campaign
// or to get a list of ongoing campaigns
contract CampaignFactory {
    Campaign[] public campaigns;
    // create a new campaign instance, only the manager can create a new campaign
    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        campaigns.push(newCampaign);
    }
    // get a list of already ongoing campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }
}

// the Campaign contract
contract Campaign {
    // Request type structure
    struct Request {
        // address of the person (vendor), the manager
        // will send a portion of the campaign's balance to
        address payable recipient;
        // what is the request created by the manager about
        string description;
        // the amount the manager wants to send to a person
        // for example (for battery casings)
        uint value;
        // how many approvers approved the current request
        // made by the manager
        uint approvalCount;
        // whether the request was completed or still pending
        bool complete;
        // the addresses of those people who are approvers
        // (meaning they contributed to the campaign ,not all of them)
        // and who approved the request
        mapping(address => bool) approvals;
    }
    // the person who deployed the factory contract and called the 
    // createCampaign method to create a new campaign instance
    // with a minimum contribution value
    address public manager;
    // this is set by the manager on creation of a new campaign
    // anyone who wants to become an approver
    // must contribute this value or more
    uint public minimumContribution;
    // how many approvers are for the current campaign
    // this is needed because mappings can't be looped
    // only accessed by one at a time
    uint public approversCount;
    // how many requests are for the current campaign
    // this is needed because mappings can't be looped
    // only accessed by one at a time
    uint public requestsCount;
    // this is needed to be able to create new Requests
    // starts from 0 then gets incemented in createRequest
    // Request storage r = requests[requestIndex];
    // requestIndex++;
    uint requestIndex = 0;
    // dynamic arrays are not suitable to hold the approver addresses
    // that is why we use mappings
    mapping(address => bool) public approvers;
    // dynamic arrays are not suitable to hold the requests created by the manager
    // that is why we use mappings
    mapping(uint => Request) public requests;
    // modifier to restrict access to some methods
    // so that only the manager may call them
    // not anyone interacting with the contract
    // via the front-end 
    modifier restricted {
        require(msg.sender == manager, "Only the manager may perform this action!");
        _;
    }
    // initializes a campaign instance with the received params
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }
    // a method that anybody can call in order to contribute
    // some ether to the campaign's balance thus
    // becoming an approver/contributor
    // payable means money in ether will be sent
    // when this method is called
    function contribute() public payable {
        // require statement that throws an error if
        // the minimum contribution value is not met
        require(msg.value > minimumContribution, "A minimum contribution of ether is required!");
        // check if address hasn't contributed before
        require(!approvers[msg.sender], "Contribution is only allowed once per address!");
        // if all is good add this address to the approvers mapping
        approvers[msg.sender] = true;
        // and increase the number of contributors/approvers
        approversCount++;
    }
    // a method that can only be called by the manager (restricted modifier)
    // gets a description, a value in ether(wei), and an address (that will receive the value/ether)
    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        // the value of the request must be lower or equal to the contract's balance
        require(value <= address(this).balance, "The given value must be lower or equal to the contract's balance!");
        // creation of a new request struct
        // that gets added to the requests mapping
        // starting from requests[0]
        Request storage r = requests[requestIndex];
        
        r.description = description;
        r.recipient = recipient;
        r.value = value;
        r.complete = false;
        r.approvalCount = 0;
        // must be incremented in order to be able to create new requests in the future
        // during the campaign
        requestIndex++;
        requestsCount++;
    }
    // this method may be called by any approver/contributor
    // if they agree with the request
    // by approving they will give the all clear
    // to the manager
    // gets the index of a request
    function approveRequest(uint index) public {
        Request storage r = requests[index];
        // the person calling this method
        // must be an approver/contributor
        require(approvers[msg.sender], "You must have contributed to the campaign in order to approve one of it's requests!");
        // and he/she must not have approved 
        // this request before
        require(!r.approvals[msg.sender], "The request can only be approved once per address!");
        // if the above conditions are met
        // a new approval will be assigned to the request
        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }
    // this can only be called again by the manager
    // gets the index of a request
    function finalizeRequest(uint index) public restricted {
        Request storage r = requests[index];
        // the number of approvals of the current request
        // must be greater than half of the contributors/approvers
        // in other words more than half of the contributors
        // of this campaign must approve a request
        // before the manager can finalize it and send their
        // money to a vendor
        require(r.approvalCount > (approversCount / 2), "The number of approvals must be greater then half of the approvers!");
        // also the request must not be in the completed state
        require(!r.complete, "Can not finalize a request that is already completed!");
        // if the above conditions are met
        // transfer the amount stored in the request.value
        // to the recipient's address
        r.recipient.transfer(r.value);
        // and mark the request as completed
        r.complete = true;
    }
    // get the details of a campaign
    // public means its accessible anywhere
    // view means it returns data but does not modify
    // any data inside the contract
    function getCampaignDetails() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requestsCount,
            approversCount,
            manager
        );
    }
    // get the number of requests and return it
    // public means its accessible anywhere
    // view means it returns data but does not modify
    // any data inside the contract
    function getRequestsCount() public view returns (uint) {
        return requestsCount;
    }
}