import { useState } from "react";

import { web3 } from "../../ethereum";
import CreateForm from "../UI/CreateForm";

const CampaignContributeForm = () => {
	const [contributionValue, setContributionValue] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const inputHandler = (value) => {
		setContributionValue(value);
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setIsLoading(true);

		const accounts = await web3.eth.getAccounts();

		try {
			console.log("yo", contributionValue);
		} catch (error) {
			let message;
			if (error.code === 4001) {
				message = error.message.split(":")[1];
			} else {
				if (error.message.includes("invalid BigNumber string")) {
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
