import { Grid, Card, Button } from "semantic-ui-react";
import { useRouter } from "next/router";

import CampaignContributeForm from "../../../components/Campaigns/CampaignContributeForm";
import { factory, campaign, web3 } from "../../../ethereum";

const CampaignDetails = (props) => {
	const {
		campaignAddress,
		minimumContribution,
		balance,
		requestsCount,
		approversCount,
		manager,
	} = props;
	const router = useRouter();

	const renderCards = () => {
		const items = [
			{
				header: manager,
				meta: "Address of Manager",
				description:
					"The manager created this campaign and can create requests to withdraw money.",
				style: {
					overflowWrap: "break-word",
				},
			},
			{
				header: minimumContribution,
				meta: "Minimum Contribution (wei)",
				description:
					"You must contribute at least this much wei to become an approver.",
				style: {
					overflowWrap: "break-word",
				},
			},
			{
				header: requestsCount,
				meta: "Number of Requests",
				description:
					"A request tries to withdraw money from the contract. Requests must be approved by approvers!",
				style: {
					overflowWrap: "break-word",
				},
			},
			{
				header: approversCount,
				meta: "Number of Approvers",
				description:
					"Number of people who have already donated to this campaign.",
				style: {
					overflowWrap: "break-word",
				},
			},
			{
				header: web3.utils.fromWei(balance, "ether"),
				meta: "Campaign Balance (ether)",
				description:
					"The balance is how much money this campaign has left to spend.",
				style: {
					overflowWrap: "break-word",
				},
			},
		];

		return <Card.Group items={items} />;
	};

	const viewRequestsHandler = () => {
		router.push(`/campaigns/${campaignAddress}/requests`);
	};

	return (
		<>
			<h3>Campaign Details</h3>
			<Grid>
				<Grid.Row>
					<Grid.Column width={10}>{renderCards()}</Grid.Column>
					<Grid.Column width={6}>
						<CampaignContributeForm campaignAddress={campaignAddress} />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Button onClick={viewRequestsHandler} primary>
							View Requests
						</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</>
	);
};

// this code will never end up on the client side so it is safe to store credentials
// need to tell NextJS for which dynamic path values to regenerate the page during the build process
export async function getStaticPaths() {
	// get campaing list
	const campaigns = await factory.methods.getCampaigns().call();

	// whether paths array contains all supported parameter values or just some of them
	// if set to false we tell it that paths contains all supported parameter values
	// if something not supported is entered we get 404 page
	// if set to true/blocking NextJS will try to dynamically generate a page for the incoming id on the server
	// map campaign list to tell NextJS for which dynamic addresses should it render a details page
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
	// get the details of a campaign
	const campaignDetails = await campaign(campaignAddress)
		.methods.getCampaignDetails()
		.call();
	// and return them as props
	return {
		props: {
			campaignAddress,
			minimumContribution: campaignDetails[0],
			balance: campaignDetails[1],
			requestsCount: campaignDetails[2],
			approversCount: campaignDetails[3],
			manager: campaignDetails[4],
		},
	};
}

export default CampaignDetails;
