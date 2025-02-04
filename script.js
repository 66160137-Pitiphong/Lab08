// คลาสสำหรับจัดการข้อมูลบล็อก
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

    getFormattedDate() {
        return this.updatedDate.toLocaleString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
}

// คลาสสำหรับจัดการรายการบล็อก
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
        this.blogs = this.blogs.filter((blog) => blog.id !== id);
        this.saveBlogs();
    }

    getBlog(id) {
        return this.blogs.find((blog) => blog.id === id);
    }

    filterBlogsByTag(tag) {
        return this.blogs.filter(blog => blog.tags.includes(tag));
    }

    saveBlogs() {
        localStorage.setItem("blogs", JSON.stringify(this.blogs));
    }
}

// คลาสสำหรับจัดการ UI
class BlogUI {
    constructor(blogManager) {
        this.blogManager = blogManager;
        this.initElements();
        this.initEventListeners();
        this.render();
        this.populateTagFilter();
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
        this.tagFilter = document.getElementById("tag-filter");
    }

    initEventListeners() {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        this.cancelBtn.addEventListener("click", () => {
            this.resetForm();
        });

        this.tagFilter.addEventListener("change", () => {
            const selectedTag = this.tagFilter.value;
            this.render(selectedTag);
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
            this.populateTagFilter();
            this.render();
        }
    }

    resetForm() {
        this.form.reset();
        this.editIdInput.value = "";
        this.formTitle.textContent = "เขียนบล็อกใหม่";
        this.cancelBtn.classList.add("hidden");
    }

    populateTagFilter() {
        const allTags = [...new Set(this.blogManager.blogs.flatMap(blog => blog.tags))];
        this.tagFilter.innerHTML = `<option value="">-- เลือกแท็ก --</option>`;
        allTags.forEach(tag => {
            this.tagFilter.innerHTML += `<option value="${tag}">${tag}</option>`;
        });
    }

    render(filterTag = "") {
        const blogsToRender = filterTag
            ? this.blogManager.filterBlogsByTag(filterTag)
            : this.blogManager.blogs;

        this.blogList.innerHTML = blogsToRender.map(blog => `
            <div class="blog-post">
                <h2 class="blog-title">${blog.title}</h2>
                <div class="blog-date">อัปเดตเมื่อ: ${blog.getFormattedDate()}</div>
                <div class="blog-content">${blog.content.replace(/\n/g, "<br>")}</div>
                <div class="blog-authors">โดย: ${blog.author1}${blog.author2 ? ` และ ${blog.author2}` : ""}</div>
                <div class="blog-tags">แท็ก: ${blog.tags.join(", ")}</div>
                <div class="blog-actions">
                    <button class="btn-edit" onclick="blogUI.editBlog(${blog.id})">แก้ไข</button>
                    <button class="btn-delete" onclick="blogUI.deleteBlog(${blog.id})">ลบ</button>
                </div>
            </div>
        `).join("");
    }

    editBlog(id) {
        const blog = this.blogManager.getBlog(id);
        if (blog) {
            this.titleInput.value = blog.title;
            this.contentInput.value = blog.content;
            this.author1Input.value = blog.author1;
            this.author2Input.value = blog.author2 || "";
            this.tagsInput.value = blog.tags.join(", ");
            this.editIdInput.value = blog.id;
            this.formTitle.textContent = "แก้ไขบล็อก";
            this.cancelBtn.classList.remove("hidden");
            window.scrollTo(0, 0);
        }
    }

    deleteBlog(id) {
        if (confirm("ต้องการลบบล็อกนี้หรือไม่?")) {
            this.blogManager.deleteBlog(id);
            this.populateTagFilter();
            this.render();
        }
    }
}

// เริ่มต้นใช้งาน
const blogManager = new BlogManager();
const blogUI = new BlogUI(blogManager);
