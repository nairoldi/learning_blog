"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditPage({ params }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [parentId, setParentId] = useState("");
  const [pages, setPages] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/blog");
    } else {
      // Fetch the page data
      fetch(`/api/pages/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setParentId(data.parentId || "");
        });

      // Fetch all pages for the parent selection
      fetch("/api/pages")
        .then((res) => res.json())
        .then(setPages);
    }
  }, [session, router, params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/pages/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, parentId: parentId || null }),
    });

    if (response.ok) {
      router.push("/blog");
    } else {
      console.error("Failed to update page");
    }
  };

  if (session?.user?.role !== "ADMIN") {
    return null; // or a loading spinner
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Page</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Content:</label>
          <ReactQuill value={content} onChange={setContent} />
        </div>
        <div>
          <label className="block mb-2">Parent Page:</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">No Parent</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Page
        </button>
      </form>
    </div>
  );
}