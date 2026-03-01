document.addEventListener("DOMContentLoaded", function () {
    // === 1. ระบบ Sidebar & Dark Mode ===
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

    // === 2. ระบบ Sidebar Mobile ===
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector("aside");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener("click", () => {
            sidebar.classList.add("open");
            sidebarOverlay.classList.add("active");
        });
        sidebarOverlay.addEventListener("click", () => {
            sidebar.classList.remove("open");
            sidebarOverlay.classList.remove("active");
        });
    }

    // === 3. ระบบจัดการตาราง (Pagination, Search & Sorting) ===
    const searchInput = document.getElementById("searchInput");
    const rowSelect = document.getElementById("rowSelect");
    const paginationInfo = document.getElementById("paginationInfo");
    const paginationControls = document.getElementById("paginationControls");
    const tables = document.querySelectorAll("table");

    tables.forEach(table => {
        const tbody = table.querySelector("tbody");
        if (!tbody) return;

        let allRows = Array.from(tbody.querySelectorAll("tr")).filter(row => !row.cells[0].classList.contains('no-data'));
        let filteredRows = [...allRows];
        let currentPage = 1;
        let currentSortIndex = -1;
        let isAscending = true;

        function updateTable() {
            const limitVal = rowSelect ? rowSelect.value : "all"; 
            let rowsPerPage = (limitVal === "all") ? (filteredRows.length || 1) : parseInt(limitVal);
            const totalRows = filteredRows.length;
            const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;

            if (currentPage > totalPages) currentPage = totalPages;
            if (currentPage < 1) currentPage = 1;

            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            allRows.forEach(row => row.style.display = "none");
            filteredRows.slice(start, end).forEach(row => row.style.display = "");

            if (paginationInfo) {
                paginationInfo.textContent = totalRows > 0 
                    ? `แสดงรายการที่ ${start + 1} ถึง ${Math.min(end, totalRows)} จากทั้งหมด ${totalRows} รายการ`
                    : "ไม่พบข้อมูลที่ค้นหา";
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

        const headers = table.querySelectorAll("th.sortable");
        headers.forEach((header, index) => {
            header.addEventListener("click", () => {
                const type = header.getAttribute("data-type");
                if (currentSortIndex === index) {
                    isAscending = !isAscending;
                } else {
                    isAscending = true;
                    currentSortIndex = index;
                }

                allRows.sort((a, b) => {
                    let valA = a.cells[index].getAttribute("data-value") || a.cells[index].textContent.trim();
                    let valB = b.cells[index].getAttribute("data-value") || b.cells[index].textContent.trim();
                    let comparison = 0;
                    if (type === "number") {
                        comparison = parseFloat(valA.replace(/[^0-9.-]+/g, "")) - parseFloat(valB.replace(/[^0-9.-]+/g, ""));
                    } else {
                        comparison = valA.localeCompare(valB, 'th');
                    }
                    return isAscending ? comparison : -comparison;
                });

                allRows.forEach(row => tbody.appendChild(row));
                const query = searchInput ? searchInput.value.toLowerCase() : "";
                filteredRows = allRows.filter(row => row.textContent.toLowerCase().includes(query));

                headers.forEach(h => {
                    const icon = h.querySelector('.sort-icon');
                    if (icon) icon.textContent = 'expand_more';
                });
                const currentIcon = header.querySelector('.sort-icon');
                if (currentIcon) {
                    currentIcon.textContent = isAscending ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
                }
                updateTable();
            });
        });

        if (searchInput) {
            searchInput.addEventListener("input", function () {
                const query = this.value.toLowerCase();
                filteredRows = allRows.filter(row => row.textContent.toLowerCase().includes(query));
                currentPage = 1;
                updateTable();
            });
        }
        if (rowSelect) rowSelect.addEventListener("change", () => { currentPage = 1; updateTable(); });

        updateTable();
    });

    // === 4. ตั้งวันที่ปัจจุบันอัตโนมัติ ===
    const dateInput = document.getElementById("deposit_date");
    if (dateInput && !dateInput.value) {
        const today = new Date();
        const d = String(today.getDate()).padStart(2, '0');
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const y = today.getFullYear() + 543;
        dateInput.value = `${d}/${m}/${y}`;
    }

    // === 5. ระบบสลับมุมมอง รายงาน (View Selector) ===
    const loanSelector = document.getElementById('loanViewSelector');
    const loanSummary = document.getElementById('loanSummary');
    const loanTable = document.getElementById('loanTableContainer');

    const savingSelector = document.getElementById('savingViewSelector');
    const savingSummary = document.getElementById('savingSummary');
    const savingTable = document.getElementById('savingTableContainer');

    if (loanSelector && loanSummary && loanTable) {
        loanSelector.addEventListener('change', function() {
            if (this.value === 'summary') {
                loanSummary.classList.remove('hidden-section');
                loanTable.classList.add('hidden-section');
            } else {
                loanSummary.classList.add('hidden-section');
                loanTable.classList.remove('hidden-section');
            }
        });
    }

    if (savingSelector && savingSummary && savingTable) {
        savingSelector.addEventListener('change', function() {
            if (this.value === 'summary') {
                savingSummary.classList.remove('hidden-section');
                savingTable.classList.add('hidden-section');
            } else {
                savingSummary.classList.add('hidden-section');
                savingTable.classList.remove('hidden-section');
            }
        });
    }
});