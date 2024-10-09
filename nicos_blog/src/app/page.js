import HomeAuthButtons from "../components/HomeAuthButtons";
import Link from "next/link";

export default function Home() {
	return (
		<main className="px-6 mx-auto">
			<p className="mt-12 mb-12 text-3xl text-center dark:text-slate-100">
				Hello and Welcome 👋&nbsp;
				<span className="whitespace-nowrap">
					I&apos;m <span className="font-bold">Nico</span>.
				</span>
			</p>
			<div className="text-center">
				<h2 className="text-2xl font-semibold mb-4 dark:text-slate-200">
					Welcome to My Blog
				</h2>
				<Link
					href="/blog/"
					className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
				>
					Checkout my Blog
				</Link>
				<p className="mb-6 dark:text-slate-300">
					Explore my thoughts, experiences, and insights.
				</p>
				<HomeAuthButtons />
			</div>
		</main>
	);
}
