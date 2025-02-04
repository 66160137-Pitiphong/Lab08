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

// ดึงส่วนแสดงแท็ก
const tagDisplay = document.getElementById("tag-display");

// ฟังก์ชันอัปเดตรายการแท็ก
function updateTagList() {
    const tags = tagManager.getTags();
    tagDisplay.innerHTML = tags.length
        ? tags.map(tag => `<span class="tag">${tag}</span>`).join("")
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

    const tags = prompt("กรุณาใส่แท็ก (คั่นด้วยเครื่องหมายจุลภาค):"); // ใช้ Prompt เพื่อรับแท็กแทน Input

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
