"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from 'next/link';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function BlogPage({ params }) {
  const [page, setPage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [parentId, setParentId] = useState("");
  const [pages, setPages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (params.id !== "new") {
      fetch(`/api/pages/${params.id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch page');
          return res.json();
        })
        .then((data) => {
          setPage(data);
          setTitle(data.title);
          setContent(data.content);
          setParentId(data.parentId || "");
        })
        .catch((error) => {
          console.error("Error fetching page:", error);
          setError("Failed to load page");
        });
    } else {
      setIsEditing(true);
    }

    fetch("/api/pages")
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch pages');
        return res.json();
      })
      .then((data) => {
        setPages(data);
      })
      .catch((error) => {
        console.error("Error fetching pages:", error);
        setError("Failed to load pages");
      });
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = params.id === "new" ? "POST" : "PUT";
    const url = params.id === "new" ? "/api/pages" : `/api/pages/${params.id}`;
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, parentId }),
      });

      if (!response.ok) throw new Error('Failed to save page');

      const data = await response.json();
      router.push(`/blog/${data.id}`);
    } catch (error) {
      console.error("Failed to save page:", error);
      setError("Failed to save page");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this page?")) {
      try {
        const response = await fetch(`/api/pages/${params.id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error('Failed to delete page');
        router.push('/blog');
      } catch (error) {
        console.error("Failed to delete page:", error);
        setError("Failed to delete page");
      }
    }
  }

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!isEditing && page) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-3xl bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} className="prose max-w-none" />
        
        {page.children && page.children.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sub-pages:</h2>
            <ul className="list-disc pl-5">
              {page.children.map(child => (
                <li key={child.id}>
                  <Link href={`/blog/${child.id}`} className="text-blue-600 hover:underline">
                    {child.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {session?.user?.role === 'ADMIN' && (
          <div className="mt-8 space-x-4">
            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl bg-white shadow-md rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">{params.id === 'new' ? 'Create New Page' : 'Edit Page'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page Title"
          className="w-full p-2 border rounded"
        />
        <ReactQuill value={content} onChange={setContent} />
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">No Parent</option>
          {pages.map(page => (
            <option key={page.id} value={page.id}>{page.title}</option>
          ))}
        </select>
        <div className="flex justify-between">
          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300">
            Save Page
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-gray-600 focus:ring-4 focus:ring-gray-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}