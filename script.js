class TagManager {
    constructor() {
        // โหลดแท็กจาก LocalStorage หรือสร้างอาร์เรย์ว่างถ้าไม่มี
        this.tags = JSON.parse(localStorage.getItem("tags")) || [];
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag); // เพิ่มแท็กใหม่ถ้าไม่ซ้ำ
            this.saveTags(); // บันทึกแท็กลง LocalStorage
        }
    }

    saveTags() {
        localStorage.setItem("tags", JSON.stringify(this.tags));
    }

    getTags() {
        return this.tags; // ดึงรายการแท็กทั้งหมด
    }
}

// ตัวจัดการแท็ก
const tagManager = new TagManager();

// ดึง Input ฟิลด์แท็ก
const tagsInput = document.getElementById("tags");
const datalist = document.createElement("datalist");
datalist.id = "tags-list";
tagsInput.setAttribute("list", "tags-list");
document.body.appendChild(datalist);

// อัปเดตรายการแท็กใน datalist
function updateTagList() {
    const tags = tagManager.getTags();
    datalist.innerHTML = tags.map(tag => `<option value="${tag}">`).join("");
}

// เรียกใช้อัปเดต datalist เมื่อโหลดหน้าเว็บ
updateTagList();

// จัดการการเพิ่มแท็กใหม่เมื่อผู้ใช้เพิ่มบล็อก
function handleAddTags(tagsString) {
    const tags = tagsString.split(",").map(tag => tag.trim());
    tags.forEach(tag => tagManager.addTag(tag));
    updateTagList(); // อัปเดตรายการแท็กใน datalist
}

// ส่วนที่เกี่ยวข้องกับการบันทึกบล็อก
function handleSubmit() {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const tags = document.getElementById("tags").value.trim();

    if (title && content) {
        handleAddTags(tags); // เพิ่มแท็กใหม่เข้า TagManager
        console.log("บันทึกบล็อกสำเร็จ!");
    }
}

// ตัวอย่าง Event Listener สำหรับการ Submit
document.getElementById("blog-form").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit();
});
