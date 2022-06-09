import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Message } from "semantic-ui-react";

import { campaign, web3 } from "../../../ethereum";

const CampaignRequestForm = (props) => {
	const { campaignAddress } = props;
	const [description, setDescription] = useState("");
	const [value, setValue] = useState("");
	const [recipient, setRecipient] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const descriptionChangedHandler = (value) => {
		setDescription(value);
	};

	const valueChangedHandler = (value) => {
		setValue(value);
	};

	const recipientChangedHandler = (value) => {
		setRecipient(value);
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setIsLoading(true);

		const campaignInstance = campaign(campaignAddress);

		try {
			if (description === "" && value === "" && recipient === "") {
				throw new Error("Some inputs are empty please fill out all of them!");
			} else if (parseInt(value) < 0) {
				throw new Error("The entered value must be greater than 0!");
			} else {
				const accounts = await web3.eth.getAccounts();

				await campaignInstance.methods
					.createRequest(
						description,
						web3.utils.toWei(value, "ether"),
						recipient
					)
					.send({
						from: accounts[0],
					});

				setDescription("");
				setValue("");
				setRecipient("");
				router.replace(`/campaigns/${campaignAddress}/requests`);
			}
		} catch (error) {
			let message;
			if (error.code === 4001) {
				message = error.message.split(":")[1];
			} else {
				if (
					error.message.includes(
						"while converting number to string, invalid number value '', should be a number matching (^-?[0-9.]+)."
					) ||
					error.message.includes("invalid address")
				) {
					message = "One of the entered values is invalid!";
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
			<h3>Create a Request</h3>
			<Form onSubmit={submitHandler} error={!!errorMessage}>
				<Form.Field>
					<label>Description</label>
					<Input
						value={description}
						onChange={(event) => descriptionChangedHandler(event.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label>Value in Ether</label>
					<Input
						value={value}
						onChange={(event) => valueChangedHandler(event.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label>Recipient</label>
					<Input
						value={recipient}
						onChange={(event) => recipientChangedHandler(event.target.value)}
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

export default CampaignRequestForm;
