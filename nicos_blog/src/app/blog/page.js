"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaEdit, FaTrash } from 'react-icons/fa';

function PageItem({ page, level = 0, session, onDelete }) {
	return (
		<div className={`ml-${level * 4} mb-2`}>
			<div className="flex items-center">
				<Link
					href={`/blog/${page.id}`}
					className="text-xl font-semibold hover:underline mr-2"
				>
					{page.title}
				</Link>
				{session?.user?.role === "ADMIN" && (
					<>
						<Link href={`/blog/edit/${page.id}`} className="text-blue-500 hover:text-blue-700 mr-2">
							<FaEdit />
						</Link>
						<button onClick={() => onDelete(page.id)} className="text-red-500 hover:text-red-700">
							<FaTrash />
						</button>
					</>
				)}
			</div>
			{page.children &&
				page.children.map((childPage) => (
					<PageItem key={childPage.id} page={childPage} level={level + 1} session={session} onDelete={onDelete} />
				))}
		</div>
	);
}

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
		return <div className="text-red-500">{error}</div>;
	}

	return (
		<div className="flex flex-col justify-center items-center h-40 dark:text-slate-100">
			<h1 className="text-3xl font-bold mb-6">Blog</h1>
			{session?.user?.role === "ADMIN" && (
				<Link
					href="/blog/new"
					className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
				>
					Create New Page
				</Link>
			)}
			<div className="space-y-4">
				{pages.map((page) => (
					<PageItem key={page.id} page={page} session={session} onDelete={handleDelete} />
				))}
			</div>
		</div>
	);
}
