"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function BlogPage() {
	const [pages, setPages] = useState([]);
	const [error, setError] = useState(null);
	const { data: session } = useSession();

	useEffect(() => {
		// Fetch pages from the API
		fetch("/api/pages")
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				// Organize pages into a hierarchical structure
				const pageMap = new Map(
					data.map((page) => [page.id, { ...page, children: [] }])
				);
				const rootPages = [];
				pageMap.forEach((page) => {
					if (page.parentId) {
						const parent = pageMap.get(page.parentId);
						if (parent) parent.children.push(page);
					} else {
						rootPages.push(page);
					}
				});
				setPages(rootPages);
			})
			.catch((error) => {
				console.error("Failed to fetch pages:", error);
				setError("Failed to load pages. Please try again later.");
			});
	}, []);

	const handleDelete = async (pageId) => {
		if (window.confirm('Are you sure you want to delete this page?')) {
			try {
				const response = await fetch(`/api/pages/${pageId}`, {
					method: 'DELETE',
				});
				if (response.ok) {
					// Remove the deleted page from the state
					setPages(pages => pages.filter(p => p.id !== pageId));
				} else {
					console.error('Failed to delete page');
				}
			} catch (error) {
				console.error('Error deleting page:', error);
			}
		}
	};

	if (error) {
		return <div className="text-red-500 text-center mt-8">{error}</div>;
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8 text-center dark:text-slate-100">Blog Pages</h1>
			
			{session?.user?.role === "ADMIN" && (
				<Link href="/blog/new" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center mb-6 transition duration-300">
					<FaPlus className="mr-2" />
					Create New Page
				</Link>
			)}
			
			<div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
				{pages.length > 0 ? (
					<ul className="divide-y divide-gray-200 dark:divide-gray-700">
						{pages.map((page) => (
							<PageItem key={page.id} page={page} session={session} onDelete={handleDelete} />
						))}
					</ul>
				) : (
					<p className="text-center py-8 text-gray-500 dark:text-gray-400">No pages found.</p>
				)}
			</div>
		</div>
	);
}

function PageItem({ page, session, onDelete }) {
	return (
		<li className="hover:bg-gray-50 dark:hover:bg-slate-700 transition duration-150">
			<div className="flex items-center justify-between p-4">
				<Link href={`/blog/${page.id}`} className="flex-grow">
					<h2 className="text-xl font-semibold text-gray-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300">
						{page.title}
					</h2>
				</Link>
				{session?.user?.role === "ADMIN" && (
					<div className="flex items-center space-x-2">
						<Link href={`/blog/${page.id}/edit`} className="text-blue-500 hover:text-blue-600 transition duration-300">
							<FaEdit className="text-xl" />
						</Link>
						<button onClick={() => onDelete(page.id)} className="text-red-500 hover:text-red-600 transition duration-300">
							<FaTrash className="text-xl" />
						</button>
					</div>
				)}
			</div>
		</li>
	);
}
