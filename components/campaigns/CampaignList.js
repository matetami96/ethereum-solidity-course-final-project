import { Button, Card } from "semantic-ui-react";
import { useRouter } from "next/router";

const CampaignList = ({ campaigns }) => {
	const router = useRouter();

	const handleNavigateToCampaignForm = () => {
		router.push("/campaigns/new");
	};

	return (
		<>
			<h3>Open Campaigns</h3>
			<Button
				floated="right"
				content="Create Campaign"
				icon="add circle"
				primary
				onClick={handleNavigateToCampaignForm}
			/>
			{campaigns.length > 0 && <Card.Group items={campaigns} />}
			{campaigns.length === 0 && <div>No campaigns were found!</div>}
		</>
	);
};

export default CampaignList;
