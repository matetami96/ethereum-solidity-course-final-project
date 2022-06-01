import factory from "./factory";
import campaign from "./campaign";
import web3 from "./web3";

// we import these 3 files here and then group export them
// this way if we import from the ethereum folder we have
// access to these files instantly thanks to how index.js works
// with the configured module bundler
export { factory, campaign, web3 };
