import { Menu, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";

const Header = () => {
	const router = useRouter();

	const handleNavigateToCampaignIndex = () => {
		router.push("/");
	};

	const handleNavigateToCampaignForm = () => {
		router.push("/campaigns/new");
	};

	return (
		<Menu
			style={{
				marginTop: "1rem",
			}}
		>
			<Menu.Item link onClick={handleNavigateToCampaignIndex}>
				<b>CrowdCoin</b>
			</Menu.Item>
			<Menu.Menu position="right">
				<Menu.Item link onClick={handleNavigateToCampaignIndex}>
					<b>Campaigns</b>
				</Menu.Item>
				<Menu.Item link onClick={handleNavigateToCampaignForm}>
					<Icon name="plus" />
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	);
};

export default Header;
