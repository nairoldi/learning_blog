import ClientLayout from '../components/ClientLayout';
import NavBar from '../components/NavBar';
import ProfilePic from "../components/ProfilePic";
import "./globals.css";

export const metadata = {
	title: "Nico's Blog",
	description: "Created by Nico Airoldi",
};
/**
 * RootLayout is the main layout component that provides the SessionProvider to the application.
 * This allows the application to use the useSession hook to access the session state.
 * The SessionProvider is a client-side component that provides the session state to the application.
 * The session state is used to determine if the user is authenticated and to access the user's information.
 */
export default function RootLayout({ children }) {
	return (
		<html lang="en" className="dark">
			<body className="dark:bg-slate-800">
				<ClientLayout>
					<NavBar />
					<ProfilePic />
					{children}
				</ClientLayout>
			</body>
		</html>
	);
}
