import { Table } from "semantic-ui-react";

import RequestItem from "./RequestItem";

const RequestList = (props) => {
	const { requests, campaignAddress, approversCount } = props;
	const { Header, Row, HeaderCell, Body } = Table;

	const renderRows = () => {
		return requests.map((request, index) => {
			return (
				<RequestItem
					key={index}
					id={index}
					request={request}
					campaignAddress={campaignAddress}
					approversCount={approversCount}
				/>
			);
		});
	};

	return (
		<Table>
			<Header>
				<Row>
					<HeaderCell>ID</HeaderCell>
					<HeaderCell>Description</HeaderCell>
					<HeaderCell>Amount</HeaderCell>
					<HeaderCell>Recipient</HeaderCell>
					<HeaderCell>Approval Count</HeaderCell>
					<HeaderCell>Approve</HeaderCell>
					<HeaderCell>Finalize</HeaderCell>
				</Row>
			</Header>
			<Body>{renderRows()}</Body>
		</Table>
	);
};

export default RequestList;
