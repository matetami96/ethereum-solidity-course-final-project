/**
 * Imports & Defines
 */
const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");
// __dirname is the relative location of the folder the current file is located in
// get the build folder's path
const buildPath = path.resolve(__dirname, "build");
// get the Solidity file's location from the contracts folder
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
// read the contenta of the file using the file system package
const source = fs.readFileSync(campaignPath, "utf-8");
// some extra tweaks for the console logs
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
// this is the configuration format for the Solidity compiler
const input = {
	language: "Solidity",
	sources: {
		"Campaign.sol": {
			content: source,
		},
	},
	settings: {
		outputSelection: {
			"*": {
				"*": ["*"],
			},
		},
	},
};
// first, we convert the input object into a JSON string
// second, we use the Solidity compiler to compile the Solidity source code
// into a format that we can use with JavaScript and Web3
// third, we convert our JSON string back to an object
// and access the "contracts" property with the "Campaign.sol" key on it
// finally we save this data to the "ouput" constant
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
	"Campaign.sol"
];
/**
 * Compile function
 */
(function () {
	try {
		// first we remove the existing build folder and it's content
		fs.removeSync(buildPath);
		console.log(
			consoleConfig.consoleColors.green,
			consoleConfig.consoleUnicodes.check,
			buildPath,
			"Existing build folder removed successfully!"
		);
		// then we create a brand new build folder
		fs.ensureDirSync(buildPath);
		console.log(
			consoleConfig.consoleColors.green,
			consoleConfig.consoleUnicodes.check,
			buildPath,
			"New build folder created successfully!"
		);
		// we go through our contracts from the output constant
		for (let contract in output) {
			// and create a separate json file for each contract with it's content (abi)
			// in the build folder we have created above
			fs.outputJSONSync(
				path.resolve(buildPath, contract + ".json"),
				output[contract]
			);
			console.log(
				consoleConfig.consoleColors.green,
				consoleConfig.consoleUnicodes.check,
				contract,
				`Contract data was added to ${contract} + .json successfully!`
			);
		}
	} catch (error) {
		console.error(
			consoleConfig.consoleColors.red,
			consoleConfig.consoleUnicodes.cross,
			error
		);
	}
	// Exit the process
	process.exit;
})();
