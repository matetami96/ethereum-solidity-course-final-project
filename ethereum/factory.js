import web3 from "./web3";
import factory from "./build/CampaignFactory.json";
const factoryAddress = require("../deployed-contract-address.json");
// using the web3 instance we make a local instance/copy of our deployed Factory contract accessible
// (we provide the abi and the address to where we have deployed our Factory contract)
const factoryContract = new web3.eth.Contract(
	factory.abi,
	factoryAddress["deployment-address"]
);
// by exporting it's instance
export default factoryContract;
