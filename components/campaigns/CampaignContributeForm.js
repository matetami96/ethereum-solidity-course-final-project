import { useState } from "react";
import { useRouter } from "next/router";

import { campaign, web3 } from "../../ethereum";
import CreateForm from "../UI/CreateForm";

const CampaignContributeForm = (props) => {
	const [contributionValue, setContributionValue] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const inputHandler = (value) => {
		setContributionValue(value);
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setIsLoading(true);

		const campaignInstance = campaign(props.campaignAddress);

		try {
			if (parseInt(contributionValue) < 0 || contributionValue === "") {
				throw new Error("The entered value must be over 0!");
			} else {
				const accounts = await web3.eth.getAccounts();
				await campaignInstance.methods.contribute().send({
					from: accounts[0],
					value: web3.utils.toWei(parseInt(contributionValue), "ether"),
				});
				setContributionValue("");
				router.replace(`/campaigns/${props.campaignAddress}`);
			}
		} catch (error) {
			let message;
			if (error.code === 4001) {
				message = error.message.split(":")[1];
			} else {
				if (
					error.message.includes("invalid BigNumber string") ||
					error.message.includes(
						"Please pass numbers as strings or BN objects to avoid precision errors."
					)
				) {
					message = "The entered value is invalid!";
				} else {
					message = error.message;
				}
			}
			setErrorMessage(message);
		}

		setIsLoading(false);
	};

	return (
		<CreateForm
			headerTitle="Contribute to a Campaign"
			label="Amount to Contribute"
			inputLabel="ether"
			inputHandler={inputHandler}
			minimumContribution={contributionValue}
			submitHandler={submitHandler}
			isLoading={isLoading}
			errorMessage={errorMessage}
			submitButtonText="Contribute"
		/>
	);
};

export default CampaignContributeForm;
