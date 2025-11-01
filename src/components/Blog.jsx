import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";
import "../index.css";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  // load all markdown files in /posts
  useEffect(() => {
    const importPosts = async () => {
      const context = require.context("../posts", false, /\.md$/);
      const postsData = await Promise.all(
        context.keys().map(async (key) => {
          const file = await fetch(context(key));
          const text = await file.text();
          const { data, content } = matter(text);
          return { ...data, content };
        })
      );

      // sort newest first
      setPosts(postsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
    };

    importPosts();
  }, []);

  return (
    <section className="card fade-in visible" id="blog">
      <h2>Blog</h2>
      {posts.length === 0 && <p>Loading posts...</p>}

      {posts.map((post, i) => (
        <article key={i} style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            {post.title}
          </h3>
          <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "1rem" }}>
            {new Date(post.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <ReactMarkdown className="blog-markdown">{post.content}</ReactMarkdown>
        </article>
      ))}
    </section>
  );
}
