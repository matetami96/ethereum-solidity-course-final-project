import { Button } from "semantic-ui-react";
import { useRouter } from "next/dist/client/router";

import { factory, campaign, web3 } from "../../../../ethereum";
import RequestList from "../../../../components/campaigns/requests/RequestList";

const RequestIndex = (props) => {
	const { campaignAddress, requestCount, approversCount, requests } = props;
	const router = useRouter();

	const addRequestHandler = () => {
		router.push(`/campaigns/${campaignAddress}/requests/new`);
	};

	return (
		<>
			<h3>Requests</h3>
			<Button onClick={addRequestHandler} primary>
				Add Request
			</Button>
			<RequestList
				requests={requests}
				campaignAddress={campaignAddress}
				approversCount={approversCount}
			/>
		</>
	);
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
	const campaignInstance = campaign(campaignAddress);
	const requestCount = await campaignInstance.methods.getRequestsCount().call();
	const approversCount = await campaignInstance.methods.approversCount().call();

	let requests = await Promise.all(
		Array(parseInt(requestCount))
			.fill()
			.map((_, index) => {
				return campaignInstance.methods.requests(index).call();
			})
	);

	requests = requests.map((request, index) => {
		const requestItem = {
			recipient: request["recipient"],
			description: request["description"],
			value: web3.utils.fromWei(request["value"], "ether"),
			approvalCount: request["approvalCount"],
			complete: request["complete"],
		};
		return requestItem;
	});

	return {
		props: {
			campaignAddress,
			requestCount,
			approversCount,
			requests,
		},
		revalidate: 10,
	};
}

export default RequestIndex;
