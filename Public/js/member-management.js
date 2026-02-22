document.addEventListener("DOMContentLoaded", function () {
    // === 1. ระบบ Sidebar & Dark Mode (ทำงานทุกหน้า) ===
    const darkModeBtn = document.getElementById("darkModeBtn");
    const darkModeIcon = document.getElementById("darkModeIcon");
    
    if (localStorage.getItem("safefund_theme") === "dark") {
        document.body.classList.add("dark-mode");
        if (darkModeIcon) darkModeIcon.textContent = "light_mode";
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            if (darkModeIcon) darkModeIcon.textContent = isDark ? "light_mode" : "dark_mode";
            localStorage.setItem("safefund_theme", isDark ? "dark" : "light");
        });
    }

    // === 2. ระบบจัดการตาราง (ทำงานทุกหน้าที่มี Table) ===
    const searchInput = document.getElementById("searchInput");
    const rowSelect = document.getElementById("rowSelect");
    const paginationInfo = document.getElementById("paginationInfo");
    const paginationControls = document.getElementById("paginationControls");
    const table = document.querySelector("table");

    if (table && table.querySelector("tbody")) {
        const tbody = table.querySelector("tbody");
        const allRows = Array.from(tbody.querySelectorAll("tr")).filter(row => !row.cells[0].classList.contains('no-data'));
        
        let filteredRows = [...allRows];
        let currentPage = 1;

        function updateTable() {
            const limitVal = rowSelect ? rowSelect.value : "10";
            
            // แก้ไขบั๊ก NaN: ตรวจสอบค่า 'all' และแปลงเป็นจำนวนตัวเลขที่ถูกต้อง
            let rowsPerPage;
            if (limitVal === "all") {
                rowsPerPage = filteredRows.length > 0 ? filteredRows.length : 1;
            } else {
                rowsPerPage = parseInt(limitVal) || 10;
            }
            
            const totalRows = filteredRows.length;
            const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;

            if (currentPage > totalPages) currentPage = totalPages;
            if (currentPage < 1) currentPage = 1;

            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            // ซ่อน/แสดงแถว
            allRows.forEach(row => row.style.display = "none");
            filteredRows.slice(start, end).forEach(row => row.style.display = "");

            // อัปเดตข้อมูลสถานะ (ป้องกันการเกิด NaN ในหน้าจอ)
            if (paginationInfo) {
                if (totalRows > 0) {
                    const displayStart = start + 1;
                    const displayEnd = Math.min(end, totalRows);
                    paginationInfo.textContent = `แสดงรายการที่ ${displayStart} ถึง ${displayEnd} จากทั้งหมด ${totalRows} รายการ`;
                } else {
                    paginationInfo.textContent = "ไม่พบข้อมูลที่ค้นหา";
                }
            }

            renderPagination(totalPages, limitVal);
        }

        function renderPagination(totalPages, limitVal) {
            if (!paginationControls) return;
            paginationControls.innerHTML = "";
            if (totalPages <= 1 || limitVal === "all") return;

            const createBtn = (content, targetPage, isActive = false, isDisabled = false) => {
                const btn = document.createElement("button");
                btn.className = `page-btn ${isActive ? "active" : ""}`;
                btn.innerHTML = content;
                btn.disabled = isDisabled;
                btn.onclick = (e) => { e.preventDefault(); currentPage = targetPage; updateTable(); };
                return btn;
            };

            paginationControls.appendChild(createBtn('<span class="material-symbols-outlined">chevron_left</span>', currentPage - 1, false, currentPage === 1));
            for (let i = 1; i <= totalPages; i++) {
                paginationControls.appendChild(createBtn(i, i, i === currentPage));
            }
            paginationControls.appendChild(createBtn('<span class="material-symbols-outlined">chevron_right</span>', currentPage + 1, false, currentPage === totalPages));
        }

        if (searchInput) {
            searchInput.addEventListener("input", function () {
                const query = this.value.toLowerCase();
                filteredRows = allRows.filter(row => row.textContent.toLowerCase().includes(query));
                currentPage = 1;
                updateTable();
            });
        }

        if (rowSelect) {
            rowSelect.addEventListener("change", function () {
                currentPage = 1;
                updateTable();
            });
        }

        updateTable();
    }
});
// --- ระบบตั้งวันที่ปัจจุบันอัตโนมัติ (เฉพาะ วัน/เดือน/ปี พ.ศ.) ---
const dateInput = document.getElementById("deposit_date");

if (dateInput && !dateInput.value) {
    const today = new Date();
    
    // จัดการวันที่
    const d = String(today.getDate()).padStart(2, '0');
    // จัดการเดือน (บวก 1 เพราะเดือนใน JS เริ่มที่ 0)
    const m = String(today.getMonth() + 1).padStart(2, '0');
    // แปลงเป็นปี พ.ศ. (+543)
    const y = today.getFullYear() + 543;
    
    // กำหนดค่าลงในช่อง Input
    dateInput.value = `${d}/${m}/${y}`;
}