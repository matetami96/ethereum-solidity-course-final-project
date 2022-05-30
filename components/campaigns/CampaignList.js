import { Button, Card } from "semantic-ui-react";
import { useRouter } from "next/router";

// import classes from "./CampaignList.module.css";

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
			<Card.Group items={campaigns} />
		</>
	);
};

export default CampaignList;
