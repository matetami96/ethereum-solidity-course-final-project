import "semantic-ui-css/semantic.min.css";
import "../styles/globals.css";

import Layout from "../components/Layout/Layout";
// we use this file to wrap every page with the Layout component
// this way we only use it in one place
function MyApp({ Component, pageProps }) {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
}

export default MyApp;
