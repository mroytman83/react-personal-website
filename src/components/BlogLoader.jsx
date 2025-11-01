import { useEffect } from "react";

export default function BlogLoader() {
  useEffect(() => {
    const container = document.getElementById("blog-container");
    if (!container) return;

    const context = require.context("../posts", false, /\.md$/);

    const loadPosts = async () => {
      const posts = await Promise.all(
        context.keys().map(async (key) => {
          const file = await fetch(context(key));
          const text = await file.text();


          const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)/m.exec(text);
          let meta = {};
          let content = text;

          if (match) {
            const yaml = match[1];
            content = match[2];
            yaml.split("\n").forEach((line) => {
              const [k, ...v] = line.split(":");
              meta[k.trim()] = v.join(":").trim().replace(/^"|"$/g, "");
            });
          }

          return { ...meta, content };
        })
      );

      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      container.innerHTML = posts
        .map(
          (p) => `
          <div class="blog-card">
            <h3>${p.title || "Untitled Post"}</h3>
            <p class="blog-date">${p.date ? new Date(p.date).toDateString() : ""}</p>
            <div class="blog-content">${p.content}</div>
          </div>`
        )
        .join("");
    };

    loadPosts();
  }, []);

  return null;
}
