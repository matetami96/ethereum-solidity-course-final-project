import CampaignRequestForm from "../../../../components/Campaigns/Requests/CampaignRequestForm";
import { factory } from "../../../../ethereum";

const RequestNew = (props) => {
	const { campaignAddress } = props;

	return <CampaignRequestForm campaignAddress={campaignAddress} />;
};

export async function getStaticPaths() {
	const campaigns = await factory.methods.getCampaigns().call();

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

export default RequestNew;
