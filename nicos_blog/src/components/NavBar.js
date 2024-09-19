import Link from "next/link";
import { FaGithub, faGitHUb, FaLaptop, FaLinkedin } from 'react-icons/fa';

export default function NavBar() {
	return (
		<nav className="bg-slate-600 p-4 sticky drop-shadow-xl z-10">
			<div className="prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
				<h1 className="text 3xl font-bold text-white grid place-content-center mb-2 md:mb-0">
					<Link
						href="/"
						className="text-white/90 no-underline hover:text-white"
					>
						Nico Airoldi
					</Link>
        </h1>
        <div className="flex flex-row justify-center sm:justify-evenly align-middle gap-4 text-white text-4xl lg:text-5xl">
          <Link className="text-white/90 hover:text-white" href="https://www.linkedin.com/in/nico-airoldi-23431a17a/"> <FaLinkedin /> </Link>
					<Link className="text-white/90 hover:text-white" href="https://github.com/nairoldi"> <FaGithub /> </Link>
					<Link href="/auth/signup" className="text-white/90 hover:text-white text-xl"> Signup </Link>
					<Link href="/auth/login" className="text-white/90 hover:text-white text-xl"> Login </Link>
        </div>
			</div>
		</nav>
	);
}
