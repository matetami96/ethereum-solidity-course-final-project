import web3 from "./web3";
import { abi } from "./build/CampaignFactory.json";
// using the web3 instance we make a local instance/copy of our deployed Factory contract accessible
// (we provide the abi and the address to where we have deployed our Factory contract)
const factoryContract = new web3.eth.Contract(
	abi,
	"0xB8bA62d129B351B5897410fBf07ED12a4EcF7757"
);
// by exporting it's instance
export default factoryContract;
