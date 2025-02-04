class TagManager {
    constructor() {
        // โหลดแท็กจาก LocalStorage หรือสร้างอาร์เรย์ว่างถ้าไม่มี
        this.tags = JSON.parse(localStorage.getItem("tags")) || [];
    }

    addTag(tag) {
        if (!this.tags.includes(tag) && tag.trim() !== "") {
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
const tagDisplay = document.createElement("div"); // ใช้แสดงแท็กทั้งหมด
tagDisplay.id = "tag-display";
tagDisplay.style.marginTop = "10px";
tagDisplay.style.padding = "10px";
tagDisplay.style.border = "1px solid #ccc";
tagDisplay.style.borderRadius = "5px";
document.querySelector(".blog-form").appendChild(tagDisplay); // แสดงด้านล่างฟอร์ม

// อัปเดตรายการแท็กใน div
function updateTagList() {
    const tags = tagManager.getTags();
    tagDisplay.innerHTML = tags.length
        ? `แท็กทั้งหมด: ${tags.map(tag => `<span style="margin-right: 5px;">${tag}</span>`).join("")}`
        : "ยังไม่มีแท็ก";
}

// จัดการการเพิ่มแท็กใหม่เมื่อผู้ใช้เพิ่มบล็อก
function handleAddTags(tagsString) {
    const tags = tagsString.split(",").map(tag => tag.trim());
    tags.forEach(tag => tagManager.addTag(tag));
    updateTagList(); // อัปเดตรายการแท็กใน div
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

// เรียกใช้อัปเดตแท็กเมื่อโหลดหน้าเว็บ
updateTagList();

// ตัวอย่าง Event Listener สำหรับการ Submit
document.getElementById("blog-form").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit();
});
