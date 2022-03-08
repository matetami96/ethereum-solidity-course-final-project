import Web3 from "web3";

let web3;
// first we check if Metamask is installed for the user
// if it is installed because we can get access to the browser window
// and through it the ethereum instance then
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
	// we create a new web3 instance
	web3 = new Web3(window.ethereum);
	window.ethereum.request({
		method: "eth_requestAccounts",
	});
} else {
	// if the user does not have Metamask installed then
	// we use the imported Web3 library to create a new HTTP provider
	const provider = new Web3.providers.HttpProvider(process.env.PROVIDER_URL);
	// using that provider we create a new web3 instance
	web3 = new Web3(provider);
}
// finally we export our web3 instance, so we can use it in any file we wish/need to
export default web3;
