import { Button, Form, Input, Message } from "semantic-ui-react";

const CreateForm = (props) => {
	return (
		<>
			<h3>{props.headerTitle}</h3>
			<Form onSubmit={props.submitHandler} error={!!props.errorMessage}>
				<Form.Field>
					<label>{props.label}</label>
					<Input
						label={props.inputLabel}
						labelPosition="right"
						value={props.minimumContribution}
						onChange={(event) => props.inputHandler(event.target.value)}
					/>
				</Form.Field>

				<Message error header="Oops!" content={props.errorMessage} />

				<Button
					primary
					type="submit"
					loading={props.isLoading}
					disabled={props.isLoading}
				>
					{props.submitButtonText}
				</Button>
			</Form>
		</>
	);
};

export default CreateForm;
