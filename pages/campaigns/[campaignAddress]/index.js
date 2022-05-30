import { factory } from "../../../ethereum";

const CampaignDetails = (props) => {
	return <h1>Campaign at address {props.campaignAddress}</h1>;
};

// this code will never end up on the client side so it is safe to store credentials
// need to tell NextJS for which dynamic path values to regenerate the page during the build process
export async function getStaticPaths() {
	const campaigns = await factory.methods.getCampaigns().call();

	// whether paths array contains all supported parameter values or just some of them
	// if set to false we tell it that paths contains all supported parameter values
	// if something not supported is entered we get 404 page
	// if set to true/blocking NextJS will try to dynamically generate a page for the incoming id on the server
	return {
		fallback: false,
		paths: campaigns.map((campaignAddress) => ({
			params: {
				campaignAddress,
			},
		})),
	};
}

export async function getStaticProps(context) {
	const campaignAddress = context.params.campaignAddress;

	return {
		props: {
			campaignAddress,
		},
	};
}

export default CampaignDetails;
