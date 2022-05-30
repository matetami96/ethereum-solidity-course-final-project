import { useState } from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import { useRouter } from "next/router";

import { web3, factory } from "../../ethereum";

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

		const accounts = await web3.eth.getAccounts();

		try {
			if (parseInt(minimumContribution) <= 0) {
				throw new Error("The entered value must be over 0!");
			} else {
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
		<>
			<h3>Create a Campaign</h3>
			<Form onSubmit={submitHandler} error={!!errorMessage}>
				<Form.Field>
					<label>Minimum Contribution</label>
					<Input
						label="wei"
						labelPosition="right"
						value={minimumContribution}
						onChange={(event) => inputHandler(event.target.value)}
					/>
				</Form.Field>

				<Message error header="Oops!" content={errorMessage} />

				<Button primary type="submit" loading={isLoading} disabled={isLoading}>
					Create
				</Button>
			</Form>
		</>
	);
};

export default CampaignForm;
