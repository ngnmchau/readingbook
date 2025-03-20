document.addEventListener("DOMContentLoaded", () => {
    const likeBtn = document.getElementById("likeBtn");
    const likeCount = document.getElementById("likeCount");
    const commentForm = document.getElementById("commentForm");
    const commentText = document.getElementById("commentText");
  
    if (likeBtn) {
      likeBtn.addEventListener("click", async () => {
        const postId = window.location.pathname.split("/").pop();
        const res = await fetch(`/blog/${postId}/like`, { method: "POST" });
        const data = await res.json();
        likeCount.textContent = data.likes;
      });
    }
  
    if (commentForm) {
      commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const postId = window.location.pathname.split("/").pop();
        const text = commentText.value.trim();
  
        if (text) {
          const res = await fetch(`/blog/${postId}/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ author: "Người dùng", text })
          });
  
          const data = await res.json();
          const commentList = document.querySelector(".comments-list");
          const newComment = document.createElement("li");
          newComment.innerHTML = `<strong>Người dùng:</strong> <p>${text}</p>`;
          commentList.appendChild(newComment);
          commentText.value = "";
        }
      });
    }
  });
  