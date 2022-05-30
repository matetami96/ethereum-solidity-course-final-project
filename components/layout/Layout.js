import Head from "next/head";
import { Container } from "semantic-ui-react";

import Header from "./Header";

const Layout = (props) => {
	return (
		<Container>
			<Head>
				<title>CrowdCoin</title>
				<meta
					name="description"
					content="Kickstarter clone with Etherium Smart Contracts!"
				/>
			</Head>
			<Header />
			{props.children}
		</Container>
	);
};

export default Layout;
