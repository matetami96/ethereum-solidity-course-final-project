/**
 * Imports & Defines
 */
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs-extra");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
// our compiled Contract's data
const { abi, evm } = require("./build/CampaignFactory.json");
// configuring the .env file
dotenv.config({
	path: path.resolve(__dirname, "../", ".env"),
});
// 12 word phrase + Infura Rinkeby url
const mnemonicPhrase = process.env.MNEMONIC_PHRASE;
const providerUrl = process.env.PROVIDER_URL;
// the bridge between the blockchain and web3
const provider = new HDWalletProvider({
	mnemonic: mnemonicPhrase,
	providerOrUrl: providerUrl,
});
// web3 instance using the HDWalletProvider
const web3 = new Web3(provider);
// console configurations
const consoleColors = {
	green: "\x1b[36m%s\x1b[32m",
	yellow: "\x1b[36m%s\x1b[33m",
	red: "\x1b[36m%s\x1b[31m",
};
/**
 * Deploy function
 */
// IIFE immediately invoked function expression
(async () => {
	try {
		// get the available accounts
		const accounts = await new web3.eth.getAccounts();

		console.log(
			consoleColors.yellow,
			"Attempting to deploy contract from account: ",
			accounts[0]
		);
		// create a local contract instance using the abi
		const contract = await new web3.eth.Contract(abi);
		// tell the contract how it will be deployed and provide the skeleton via evm.bytecode.object
		const deploy = await contract.deploy({ data: "0x" + evm.bytecode.object });
		// finally deploy the contract to Rinkeby
		const campaignFactory = await deploy.send({
			from: accounts[0],
		});

		console.log(
			consoleColors.green,
			"Contract deployed at address: ",
			campaignFactory.options.address
		);

		// write the abi content to a json file
		fs.writeFileSync("campaign-factory-abi.json", JSON.stringify(abi));
		// write the deployment address to a file
		fs.writeFileSync(
			"deployed-contract-address.json",
			JSON.stringify({
				"deployment-address": campaignFactory.options.address,
			})
		);
	} catch (error) {
		console.log(consoleColors.red, "Contract deploy error: ", error);
		// Ending Script Process
		process.exit();
	}
	// Ending Script Process
	process.exit();
})();
