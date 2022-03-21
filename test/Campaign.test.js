const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
// new web3 instance
const web3 = new Web3(ganache.provider({ gasLimit: 10000000 }));
// our compiled contract codes
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");
// console config
const consoleConfig = {
	consoleColors: {
		green: "\x1b[36m%s\x1b[32m",
		yellow: "\x1b[36m%s\x1b[33m",
		red: "\x1b[36m%s\x1b[31m",
	},
	consoleUnicodes: {
		check: "✓",
		cross: "⨯",
		ether: "⧫",
	},
	consoleSpaces: (numberOfSpaces) => Array(numberOfSpaces + 1).join(" "),
};
// local variables for tesing
let accounts;
let factory;
let campaignAddress;
let campaign;
// what to do before each test
beforeEach(async () => {
	// get accounts from ganache provider
	accounts = await web3.eth.getAccounts();
	// create contract instance
	const contract = await new web3.eth.Contract(compiledFactory.abi);
	// describe how to deploy it
	const deploy = await contract.deploy({
		data: "0x" + compiledFactory.evm.bytecode.object,
	});
	// actually deploy the factory contract
	factory = await deploy.send({ from: accounts[0], gas: "10000000" });
	// using the factory contract's method createCampaign to create
	// a new campaign instance
	await factory.methods
		.createCampaign(web3.utils.toWei("10", "ether"))
		.send({ from: accounts[0], gas: "10000000" });
	// retrieve the deployed campaign's address
	[campaignAddress] = await factory.methods.getCampaigns().call();
	// create a local instance of the campaign contract
	campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});
// several tests
describe("Campaigns", () => {
	it("deploys a Factory contract first then deploys a Campaign contract", () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	it("checks if accounts[0] the person who deployed the Factory contract is the one who created the Campaign, if he is the manager", async () => {
		const manager = await campaign.methods.manager().call();
		assert.strictEqual(accounts[0], manager);
	});

	it("contributes money to the campaign and creates a contributor/approver", async () => {
		await campaign.methods
			.contribute()
			.send({ from: accounts[1], value: web3.utils.toWei("10", "ether") });
		const isContributor = await campaign.methods.approvers(accounts[1]).call();
		assert(isContributor);
	});

	it("does not allow a contributor/approver to contribute again, so everyone can call contribute only once", async () => {
		await assert.rejects(
			async () => {
				await campaign.methods
					.contribute()
					.send({ from: accounts[1], value: web3.utils.toWei("20", "ether") });
				await campaign.methods
					.contribute()
					.send({ from: accounts[1], value: web3.utils.toWei("30", "ether") });
				assert(false);
			},
			(error) => {
				console.log(
					consoleConfig.consoleColors.red,
					consoleConfig.consoleSpaces(3),
					consoleConfig.consoleUnicodes.cross,
					error.results[Object.keys(error.results)[0]]["reason"]
				);
				assert(error);
				return true;
			}
		);
	});

	it("requires a minimum contribution in order to become a contributor/approver", async () => {
		await assert.rejects(
			async () => {
				await campaign.methods
					.contribute()
					.send({ from: accounts[2], value: web3.utils.toWei("9", "ether") });
				assert(false);
			},
			(error) => {
				console.log(
					consoleConfig.consoleColors.red,
					consoleConfig.consoleSpaces(3),
					consoleConfig.consoleUnicodes.cross,
					error.results[Object.keys(error.results)[0]]["reason"]
				);
				assert(error);
				return true;
			}
		);
	});

	it("allows the manager to create a new request for the Campaign plus checks if the request was created successfully", async () => {
		let description = "Buy battery casings";
		let value = web3.utils.toWei("5", "ether");
		let recipient = accounts[1];

		let contractBalance = await web3.eth.getBalance(campaign.options.address);
		console.log(
			consoleConfig.consoleSpaces(4),
			"contractBalance after fresh deployment:",
			contractBalance
		);

		await campaign.methods
			.contribute()
			.send({ from: accounts[1], value: web3.utils.toWei("20", "ether") });

		contractBalance = await web3.eth.getBalance(campaign.options.address);
		console.log(
			consoleConfig.consoleSpaces(4),
			"contractBalance after contribution: ",
			contractBalance
		);

		await campaign.methods
			.createRequest(description, value, recipient)
			.send({ from: accounts[0], gas: "10000000" });

		const requestsCount = await campaign.methods.requestsCount().call();
		const request = await campaign.methods.requests(0).call();

		assert.strictEqual(1, parseInt(requestsCount));
		assert.strictEqual(description, request.description);
		assert.strictEqual(value, request.value);
		assert.strictEqual(recipient, request.recipient);
	});

	it("does not allow the manager to create a request with a value that exceeds the Campaign's balance", async () => {
		await assert.rejects(
			async () => {
				let description = "Buy battery casings";
				let value = web3.utils.toWei("15", "ether");
				let recipient = accounts[1];

				await campaign.methods
					.contribute()
					.send({ from: accounts[1], value: web3.utils.toWei("12", "ether") });

				await campaign.methods
					.createRequest(description, value, recipient)
					.send({ from: accounts[0], gas: "10000000" });

				assert(false);
			},
			(error) => {
				console.log(
					consoleConfig.consoleColors.red,
					consoleConfig.consoleSpaces(3),
					consoleConfig.consoleUnicodes.cross,
					error.results[Object.keys(error.results)[0]]["reason"]
				);
				assert(error);
				return true;
			}
		);
	});

	it("goes through the whole flow", async () => {
		// sending ether should happen in wei (calling a method that has payable keyword)
		// retrieving an account's/contract's balance happens in wei, should be ether
		// 1. checks if the Campaign contract was deployed successfully
		assert(campaign.options.address);
		// ========================================================================================================
		// 2. checks if the manager is set correctly to (accounts[0])
		const manager = await campaign.methods.manager().call();
		assert.strictEqual(accounts[0], manager);
		// ========================================================================================================
		// 3. contributes money as accounts[1] and becomes a contributor
		let contractBalance = await web3.eth.getBalance(campaign.options.address);

		console.log(
			consoleConfig.consoleSpaces(4),
			"contractBalance after fresh deployment:",
			web3.utils.fromWei(contractBalance, "ether")
		);

		await campaign.methods
			.contribute()
			.send({ from: accounts[1], value: web3.utils.toWei("20", "ether") });

		contractBalance = await web3.eth.getBalance(campaign.options.address);

		console.log(
			consoleConfig.consoleSpaces(4),
			"contractBalance after contribution:",
			web3.utils.fromWei(contractBalance, "ether")
		);
		// ========================================================================================================
		// 4. creates a new request as the manager (accounts[0])
		let description = "Buy battery casings";
		let value = web3.utils.toWei("15", "ether");
		let recipient = accounts[2];

		await campaign.methods
			.createRequest(description, value, recipient)
			.send({ from: accounts[0], gas: "10000000" });

		const requestsCount = await campaign.methods.requestsCount().call();

		let request = await campaign.methods.requests(0).call();

		assert.strictEqual(1, parseInt(requestsCount));
		assert.strictEqual(description, request.description);
		assert.strictEqual(value, request.value);
		assert.strictEqual(recipient, request.recipient);
		assert(!request.complete);
		assert.strictEqual(0, parseInt(request.approvalCount));
		// ========================================================================================================
		// 5. approves the request as a contributor (accounts[1])
		await campaign.methods
			.approveRequest(0)
			.send({ from: accounts[1], gas: "10000000" });

		request = await campaign.methods.requests(0).call();

		assert.strictEqual(1, parseInt(request.approvalCount));
		// ========================================================================================================
		// 6. returns details about the campaign
		let campaignDetails = await campaign.methods.getCampaignDetails().call();
		console.log("campaignDetails: ", campaignDetails);
		// ========================================================================================================
		// 7. finalizes the request as the manager (accounts[0])
		let accounts2Balance = await web3.eth.getBalance(accounts[2]);
		accounts2Balance = parseFloat(
			web3.utils.fromWei(accounts2Balance, "ether")
		);

		console.log(
			consoleConfig.consoleSpaces(4),
			"balance before the recipient received his/her money: ",
			accounts2Balance
		);

		await campaign.methods
			.finalizeRequest(0)
			.send({ from: accounts[0], gas: "10000000" });

		let newAccounts2Balance = await web3.eth.getBalance(accounts[2]);
		newAccounts2Balance = parseFloat(
			web3.utils.fromWei(newAccounts2Balance, "ether")
		);

		console.log(
			consoleConfig.consoleSpaces(4),
			"balance after the recipient received his/her money: ",
			newAccounts2Balance
		);
		// ========================================================================================================
		// 8. checks if the amount was transferred to the recipient accounts[2]

		request = await campaign.methods.requests(0).call();

		let finalContractBalance = await web3.eth.getBalance(
			campaign.options.address
		);
		finalContractBalance = parseFloat(
			web3.utils.fromWei(finalContractBalance, "ether")
		);
		contractBalance = parseFloat(web3.utils.fromWei(contractBalance, "ether"));

		console.log(
			consoleConfig.consoleSpaces(4),
			"finalContractBalance: ",
			finalContractBalance,
			"contractBalance: ",
			contractBalance
		);

		assert(request.complete);
		assert(newAccounts2Balance > accounts2Balance);
		assert(finalContractBalance < contractBalance);
		// ========================================================================================================
	});
});
