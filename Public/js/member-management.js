// Public/js/member-management.js

// 1. ระบบ Sidebar (Mobile Menu)
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('aside');
    const overlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
        if (sidebar) sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);
});

// 2. ระบบ Dark Mode
const darkModeBtn = document.getElementById('darkModeBtn');
const darkModeIcon = document.getElementById('darkModeIcon');

if (localStorage.getItem('safefund_theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (darkModeIcon) darkModeIcon.textContent = 'light_mode';
}

if (darkModeBtn) {
    darkModeBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        if (darkModeIcon) darkModeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
        localStorage.setItem('safefund_theme', isDark ? 'dark' : 'light');
    });
}

// 3. ระบบค้นหา, จำกัดจำนวนแถว & แบ่งหน้า (Pagination)
const searchInput = document.getElementById('searchInput');
const rowSelect = document.getElementById('rowSelect');
const tableBody = document.getElementById('memberTableBody');
const paginationControls = document.getElementById('paginationControls');
const paginationInfo = document.getElementById('paginationInfo');

let currentPage = 1;

if (tableBody) {
    function updateTableDisplay() {
        const filterTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const limitValue = rowSelect ? rowSelect.value : '10';
        const limit = limitValue.includes('10') ? 10 : 
                     limitValue.includes('25') ? 25 : 
                     limitValue.includes('50') ? 50 : Infinity;

        const rows = Array.from(tableBody.getElementsByTagName('tr'));
        
        const matchedRows = rows.filter(row => {
            if (row.cells.length === 1) return false; 
            return row.textContent.toLowerCase().includes(filterTerm);
        });

        rows.forEach(row => row.style.display = 'none');

        const totalItems = matchedRows.length;
        
        if (totalItems === 0) {
            if (paginationControls) paginationControls.innerHTML = '';
            if (paginationInfo) paginationInfo.textContent = 'ไม่พบข้อมูลที่ค้นหา';
            return;
        }

        const totalPages = limit === Infinity ? 1 : Math.ceil(totalItems / limit);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * limit;
        const endIndex = limit === Infinity ? totalItems : Math.min(startIndex + limit, totalItems);

        for (let i = startIndex; i < endIndex; i++) {
            if (matchedRows[i]) matchedRows[i].style.display = '';
        }

        if (paginationInfo) {
            paginationInfo.textContent = `แสดงผล ${startIndex + 1} ถึง ${endIndex} จากทั้งหมด ${totalItems} รายการ`;
        }

        renderPaginationButtons(totalPages);
    }

    function renderPaginationButtons(totalPages) {
        if (!paginationControls) return;
        paginationControls.innerHTML = '';
        if (totalPages <= 1) return;

        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">chevron_left</span>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => { currentPage--; updateTableDisplay(); };
        paginationControls.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => { currentPage = i; updateTableDisplay(); };
            paginationControls.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">chevron_right</span>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => { currentPage++; updateTableDisplay(); };
        paginationControls.appendChild(nextBtn);
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            currentPage = 1;
            updateTableDisplay();
        });
    }

    if (rowSelect) {
        rowSelect.addEventListener('change', () => {
            currentPage = 1;
            updateTableDisplay();
        });
    }

    updateTableDisplay();
}