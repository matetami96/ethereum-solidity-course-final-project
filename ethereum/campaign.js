import web3 from "./web3";
import { abi } from "./build/Campaign.json";
// we call this method to create a local instance of a deployed Campaign
// using the deployed Campaign's address and abi (through the Factory contract, campaigns array)
// and make it accessible throughout the project
const campaignContract = (address) => {
	return new web3.eth.Contract(abi, address);
};
// by export it
export default campaignContract;
