import { Table } from "semantic-ui-react";

const RequestItem = (props) => {
	const { id, request, campaignAddress, approversCount } = props;
	const { Row, Cell } = Table;
	const { recipient, description, value, approvalCount, complete } = request;

	return (
		<Row>
			<Cell>{id}</Cell>
			<Cell>{description}</Cell>
			<Cell>{value}</Cell>
			<Cell>{recipient}</Cell>
			<Cell>
				{approvalCount}/{approversCount}
			</Cell>
			<Cell>{}</Cell>
			<Cell>{}</Cell>
		</Row>
	);
};

export default RequestItem;
