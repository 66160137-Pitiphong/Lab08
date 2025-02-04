class Blog {
    constructor(id, title, content, tags) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.tags = tags;
      this.updatedDate = new Date();
    }
  
    update(title, content, tags) {
      this.title = title;
      this.content = content;
      this.tags = tags;
      this.updatedDate = new Date();
    }
  }
  
  class BlogManager {
    constructor() {
      this.blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    }
  
    addBlog(title, content, tags) {
      const blog = new Blog(Date.now(), title, content, tags);
      this.blogs.push(blog);
      this.saveToLocalStorage();
      return blog;
    }
  
    updateBlog(id, title, content, tags) {
      const blog = this.getBlog(id);
      if (blog) {
        blog.update(title, content, tags);
        this.saveToLocalStorage();
      }
      return blog;
    }
  
    deleteBlog(id) {
      this.blogs = this.blogs.filter(blog => blog.id !== id);
      this.saveToLocalStorage();
    }
  
    getBlog(id) {
      return this.blogs.find(blog => blog.id === id);
    }
  
    filterBlogsByTag(tag) {
      return this.blogs.filter(blog => blog.tags.includes(tag));
    }
  
    saveToLocalStorage() {
      localStorage.setItem('blogs', JSON.stringify(this.blogs));
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
      this.form = document.getElementById('blog-form');
      this.titleInput = document.getElementById('title');
      this.contentInput = document.getElementById('content');
      this.tagsInput = document.getElementById('tags');
      this.editIdInput = document.getElementById('edit-id');
      this.formTitle = document.getElementById('form-title');
      this.cancelBtn = document.getElementById('cancel-btn');
      this.blogList = document.getElementById('blog-list');
      this.filterInput = document.getElementById('filter');
      this.filterBtn = document.getElementById('filter-btn');
    }
  
    initEventListeners() {
      this.form.addEventListener('submit', e => {
        e.preventDefault();
        this.handleSubmit();
      });
  
      this.cancelBtn.addEventListener('click', () => {
        this.resetForm();
      });
  
      this.filterBtn.addEventListener('click', () => {
        this.renderFiltered();
      });
    }
  
    handleSubmit() {
      const title = this.titleInput.value.trim();
      const content = this.contentInput.value.trim();
      const tags = this.tagsInput.value.split(',').map(tag => tag.trim());
      const editId = parseInt(this.editIdInput.value);
  
      if (title && content && tags.length) {
        if (editId) {
          this.blogManager.updateBlog(editId, title, content, tags);
        } else {
          this.blogManager.addBlog(title, content, tags);
        }
        this.resetForm();
        this.render();
      }
    }
  
    editBlog(id) {
      const blog = this.blogManager.getBlog(id);
      if (blog) {
        this.titleInput.value = blog.title;
        this.contentInput.value = blog.content;
        this.tagsInput.value = blog.tags.join(', ');
        this.editIdInput.value = blog.id;
        this.formTitle.textContent = 'แก้ไขบล็อก';
        this.cancelBtn.classList.remove('hidden');
        window.scrollTo(0, 0);
      }
    }
  
    deleteBlog(id) {
      if (confirm('ต้องการลบบล็อกนี้ใช่หรือไม่?')) {
        this.blogManager.deleteBlog(id);
        this.render();
      }
    }
  
    resetForm() {
      this.form.reset();
      this.editIdInput.value = '';
      this.formTitle.textContent = 'เขียนบล็อกใหม่';
      this.cancelBtn.classList.add('hidden');
    }
  
    render() {
      this.blogList.innerHTML = this.blogManager.blogs
        .map(blog => `
          <div class="blog-post">
            <h2>${blog.title}</h2>
            <p>${blog.content.replace(/\n/g, '<br>')}</p>
            <p>แท็ก: ${blog.tags.join(', ')}</p>
            <button onclick="blogUI.editBlog(${blog.id})">แก้ไข</button>
            <button onclick="blogUI.deleteBlog(${blog.id})">ลบ</button>
          </div>
        `)
        .join('');
    }
  
    renderFiltered() {
      const tag = this.filterInput.value.trim();
      const filteredBlogs = this.blogManager.filterBlogsByTag(tag);
      this.blogList.innerHTML = filteredBlogs
        .map(blog => `
          <div class="blog-post">
            <h2>${blog.title}</h2>
            <p>${blog.content.replace(/\n/g, '<br>')}</p>
            <p>แท็ก: ${blog.tags.join(', ')}</p>
            <button onclick="blogUI.editBlog(${blog.id})">แก้ไข</button>
            <button onclick="blogUI.deleteBlog(${blog.id})">ลบ</button>
          </div>
        `)
        .join('');
    }
  }
  
  const blogManager = new BlogManager();
  const blogUI = new BlogUI(blogManager);
  