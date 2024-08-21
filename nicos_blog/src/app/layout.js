import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import ProfilePic from "./components/ProfilePic";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Nico's Blog",
	description: "Created by Nico Airoldi",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="dark">
			<body className={`${inter.className} dark:bg-slate-800 `}>
				<NavBar />
				<ProfilePic/>
				{children}
			</body>
		</html>
	);
}
