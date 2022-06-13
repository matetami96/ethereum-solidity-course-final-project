import { useState } from "react";
import { Table, Button } from "semantic-ui-react";

import { campaign, web3 } from "../../../ethereum";

const RequestItem = (props) => {
	const { id, request, campaignAddress, approversCount, onReload } = props;
	const { Row, Cell } = Table;
	const { recipient, description, value, approvalCount, complete } = request;

	const [isApproving, setIsApproving] = useState(false);
	const [isFinalizing, setIsFinalizing] = useState(false);

	const readyToFinalize = approvalCount > approversCount / 2;

	const approveHandler = async () => {
		setIsApproving(true);
		const campaignInstance = campaign(campaignAddress);

		try {
			const accounts = await web3.eth.getAccounts();

			await campaignInstance.methods.approveRequest(id).send({
				from: accounts[0],
			});

			onReload();
		} catch (error) {
			let message;
			if (error.code === 4001) {
				message = error.message.split(":")[1];
			} else {
				message = error.message;
			}
			console.log(message);
			alert(message);
		}
		setIsApproving(false);
	};

	const finalizeHandler = async () => {
		setIsFinalizing(true);
		const campaignInstance = campaign(campaignAddress);

		try {
			const accounts = await web3.eth.getAccounts();

			await campaignInstance.methods.finalizeRequest(id).send({
				from: accounts[0],
			});

			onReload();
		} catch (error) {
			let message;
			if (error.code === 4001) {
				message = error.message.split(":")[1];
			} else {
				message = error.message;
			}
			console.log(message);
			alert(message);
		}
		setIsFinalizing(false);
	};

	return (
		<Row disabled={complete} positive={readyToFinalize && !complete}>
			<Cell>{id}</Cell>
			<Cell>{description}</Cell>
			<Cell>{value}</Cell>
			<Cell>{recipient}</Cell>
			<Cell>
				{approvalCount}/{approversCount}
			</Cell>
			<Cell>
				{!complete && (
					<Button
						color="green"
						basic
						onClick={approveHandler}
						loading={isApproving}
						disabled={isApproving || isFinalizing}
					>
						Approve
					</Button>
				)}
			</Cell>
			<Cell>
				{!complete && (
					<Button
						color="teal"
						basic
						onClick={finalizeHandler}
						loading={isFinalizing}
						disabled={isFinalizing || isApproving}
					>
						Finalize
					</Button>
				)}
			</Cell>
		</Row>
	);
};

export default RequestItem;
