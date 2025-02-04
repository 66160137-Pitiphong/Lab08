class Blog {
    constructor(id, title, content, author1, author2, tags) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author1 = author1;
        this.author2 = author2 || null;
        this.tags = tags.split(',').map(tag => tag.trim());
        this.createdDate = new Date();
        this.updatedDate = new Date();
    }

    update(title, content, author1, author2, tags) {
        this.title = title;
        this.content = content;
        this.author1 = author1;
        this.author2 = author2 || null;
        this.tags = tags.split(',').map(tag => tag.trim());
        this.updatedDate = new Date();
    }
}

class BlogManager {
    constructor() {
        this.blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    }

    addBlog(title, content, author1, author2, tags) {
        const blog = new Blog(Date.now(), title, content, author1, author2, tags);
        this.blogs.push(blog);
        this.saveBlogs();
        return blog;
    }

    updateBlog(id, title, content, author1, author2, tags) {
        const blog = this.getBlog(id);
        if (blog) {
            blog.update(title, content, author1, author2, tags);
            this.saveBlogs();
        }
        return blog;
    }

    deleteBlog(id) {
        this.blogs = this.blogs.filter(blog => blog.id !== id);
        this.saveBlogs();
    }

    getBlog(id) {
        return this.blogs.find(blog => blog.id === id);
    }

    saveBlogs() {
        localStorage.setItem("blogs", JSON.stringify(this.blogs));
    }
}

class BlogUI {
    constructor(blogManager) {
        this.blogManager = blogManager;
        this.initElements();
        this.initEventListeners();
        this.render();
    }

    initElements() {
        this.form = document.getElementById("blog-form");
        this.titleInput = document.getElementById("title");
        this.contentInput = document.getElementById("content");
        this.author1Input = document.getElementById("author1");
        this.author2Input = document.getElementById("author2");
        this.tagsInput = document.getElementById("tags");
        this.editIdInput = document.getElementById("edit-id");
        this.formTitle = document.getElementById("form-title");
        this.cancelBtn = document.getElementById("cancel-btn");
        this.blogList = document.getElementById("blog-list");
    }

    initEventListeners() {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        this.cancelBtn.addEventListener("click", () => {
            this.resetForm();
        });
    }

    handleSubmit() {
        const title = this.titleInput.value.trim();
        const content = this.contentInput.value.trim();
        const author1 = this.author1Input.value.trim();
        const author2 = this.author2Input.value.trim();
        const tags = this.tagsInput.value.trim();
        const editId = parseInt(this.editIdInput.value);

        if (title && content && author1) {
            if (editId) {
                this.blogManager.updateBlog(editId, title, content, author1, author2, tags);
            } else {
                this.blogManager.addBlog(title, content, author1, author2, tags);
            }
            this.resetForm();
            this.render();
        }
    }

    resetForm() {
        this.form.reset();
        this.editIdInput.value = "";
        this.formTitle.textContent = "เขียนบล็อกใหม่";
        this.cancelBtn.classList.add("hidden");
    }

    render() {
        this.blogList.innerHTML = this.blogManager.blogs.map(blog => `
            <div class="blog-post">
                <h2>${blog.title}</h2>
                <div>เนื้อหา: ${blog.content}</div>
                <div>เขียนโดย: ${blog.author1}${blog.author2 ? ` และ ${blog.author2}` : ""}</div>
                <div>แท็ก: ${blog.tags.join(", ")}</div>
                <button onclick="blogUI.deleteBlog(${blog.id})">ลบ</button>
            </div>
        `).join("");
    }

    deleteBlog(id) {
        if (confirm("ต้องการลบบล็อกนี้หรือไม่?")) {
            this.blogManager.deleteBlog(id);
            this.render();
        }
    }
}

// เริ่มต้นการทำงาน
const blogManager = new BlogManager();
const blogUI = new BlogUI(blogManager);
