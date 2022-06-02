import { useState } from "react";
import { useRouter } from "next/router";

import { web3, factory } from "../../ethereum";
import CreateForm from "../UI/CreateForm";

const CampaignForm = () => {
	const [minimumContribution, setMinimumContribution] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const inputHandler = (value) => {
		setMinimumContribution(value);
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setIsLoading(true);

		try {
			if (parseInt(minimumContribution) <= 0) {
				throw new Error("The entered value must be over 0!");
			} else {
				const accounts = await web3.eth.getAccounts();
				await factory.methods
					.createCampaign(parseInt(minimumContribution))
					.send({
						from: accounts[0],
					});
				router.push("/");
				setMinimumContribution("");
			}
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
			headerTitle="Create a Campaign"
			label="Minimum Contribution"
			inputLabel="wei"
			inputHandler={inputHandler}
			minimumContribution={minimumContribution}
			submitHandler={submitHandler}
			isLoading={isLoading}
			errorMessage={errorMessage}
			submitButtonText="Create"
		/>
	);
};

export default CampaignForm;
