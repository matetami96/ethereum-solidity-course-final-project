import Link from "next/link";

import { factory } from "../ethereum";
import CampaignList from "../components/Campaigns/CampaignList";

const CampaignIndex = (props) => {
	// render a list of campaigns using the fetched campaigns as props

	const renderCampaings = () => {
		const campaigns = props.campaigns.map((campaignAddress) => {
			return {
				header: campaignAddress,
				description: (
					<Link href={`/campaigns/${campaignAddress}`}>View Campaign</Link>
				),
				fluid: true,
			};
		});
		return campaigns;
	};

	return <CampaignList campaigns={renderCampaings()} />;
};
// NextJS function that executes during the buildtime of the app
// you can have server side code in here it won't be executed/used/exposed to the client side
// NextJS will take care of this
// so it fetches data on the server and returns it as props
// which the already rendered React code can use
// once the browser receives the rendered page everyhting will be visible for SEO
// loads data !!BEFORE!! the component function runs
export async function getStaticProps() {
	// fetch deployed campaigns list using the deployed factory contract
	const campaigns = await factory.methods.getCampaigns().call();
	// return an object that has a 'props' property
	return {
		props: {
			campaigns,
		},
		revalidate: 10,
	};
}

export default CampaignIndex;
