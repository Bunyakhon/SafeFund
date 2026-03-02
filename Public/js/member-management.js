//รอให้โครงสร้าง HTML ถูกโหลดจนเสร็จสมบูรณ์ก่อนเริ่มรันสคริปต์
document.addEventListener("DOMContentLoaded", function () {// === 0. ตรวจสอบการโหลดสคริปต์ ===
    // === 1. ระบบ Sidebar & Dark Mode ===
    //สร้างตัวแปร darkModeBtn สำหรับเก็บปุ่ม DarkMode และไอคอน
    const darkModeBtn = document.getElementById("darkModeBtn");
    //สร้างตัวแปร darkModeIcon สำหรับเก็บไอคอนที่จะแสดงสถานะของ Dark Mode
    const darkModeIcon = document.getElementById("darkModeIcon");
    //ตรวจสอบว่าผู้ใช้เคยเลือก Dark Mode ไว้หรือไม่ ถ้าเคยให้เพิ่มคลาส "dark-mode" ให้กับ body และเปลี่ยนไอคอนเป็น "light_mode"
    if (localStorage.getItem("safefund_theme") === "dark") {
        document.body.classList.add("dark-mode");//เพิ่มคลาส "dark-mode" ให้กับ body
        if (darkModeIcon) darkModeIcon.textContent = "light_mode";//เปลี่ยนไอคอนเป็น "light_mode"
    }

    if (darkModeBtn) {//ตรวจสอบว่าปุ่ม Dark Mode มีอยู่ในหน้าเว็บหรือไม่
        //เมื่อคลิกที่ปุ่ม Dark Mode ให้สลับคลาส "dark-mode" บน body และอัปเดตไอคอนและสถานะใน localStorage
        darkModeBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");//สลับคลาส "dark-mode" บน body
            const isDark = document.body.classList.contains("dark-mode");//สร้างตัวแปร isDark เพื่อเก็บสถานะว่า Dark Mode ถูกเปิดอยู่หรือไม่
            //ถ้าไอคอนมีอยู่ให้เปลี่ยนข้อความของไอคอนตามสถานะของ Dark Mode
            if (darkModeIcon) darkModeIcon.textContent = isDark ? "light_mode" : "dark_mode";
            //บันทึกสถานะของ Dark Mode ใน localStorage เพื่อให้จำการตั้งค่าได้เมื่อผู้ใช้กลับมาในครั้งถัดไป
            localStorage.setItem("safefund_theme", isDark ? "dark" : "light");
        });
    }

    // === 2. ระบบ Sidebar Mobile ===
    //สร้างตัวแปร mobileMenuBtn สำหรับเก็บปุ่มเมนูบนมือถือ, sidebar สำหรับเก็บองค์ประกอบ sidebar 
    // และ sidebarOverlay สำหรับเก็บองค์ประกอบ overlay ที่ใช้ในการปิด sidebar เมื่อคลิกที่พื้นที่นอก sidebar
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    //สร้างตัวแปร sidebar สำหรับเก็บองค์ประกอบ sidebar และ sidebarOverlay 
    // สำหรับเก็บองค์ประกอบ overlay ที่ใช้ในการปิด sidebar เมื่อคลิกที่พื้นที่นอก sidebar
    const sidebar = document.querySelector("aside");
    //สร้างตัวแปร sidebarOverlay สำหรับเก็บองค์ประกอบ overlay ที่ใช้ในการปิด 
    // sidebar เมื่อคลิกที่พื้นที่นอก sidebar
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    //ตรวจสอบว่าปุ่มเมนูบนมือถือ, sidebar และ sidebarOverlay มีอยู่ในหน้าเว็บหรือไม่ 
    // ถ้ามีให้เพิ่ม event listener เพื่อเปิดและปิด sidebar
    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        //เมื่อคลิกที่ปุ่มเมนูบนมือถือ ให้เพิ่มคลาส "open" ให้กับ sidebar
        //  และคลาส "active" ให้กับ sidebarOverlay เพื่อแสดง sidebar และ overlay
        mobileMenuBtn.addEventListener("click", () => {
            //เมื่อคลิกที่ปุ่มเมนูบนมือถือ ให้เพิ่มคลาส "open" ให้กับ sidebar 
            // และคลาส "active" ให้กับ sidebarOverlay เพื่อแสดง sidebar และ overlay
            sidebar.classList.add("open");
            //เมื่อคลิกที่ปุ่มเมนูบนมือถือ ให้เพิ่มคลาส "open" ให้กับ sidebar 
            // และคลาส "active" ให้กับ sidebarOverlay เพื่อแสดง sidebar และ overlay
            sidebarOverlay.classList.add("active");
        });
        //เมื่อคลิกที่ sidebarOverlay ให้ลบคลาส "open" จาก sidebar 
        // และคลาส "active" จาก sidebarOverlay เพื่อปิด sidebar และ overlay
        sidebarOverlay.addEventListener("click", () => {
            //เมื่อคลิกที่ sidebarOverlay ให้ลบคลาส "open" จาก sidebar 
            // และคลาส "active" จาก sidebarOverlay เพื่อปิด sidebar และ overlay
            sidebar.classList.remove("open");
            //เมื่อคลิกที่ sidebarOverlay ให้ลบคลาส "open" จาก sidebar
            sidebarOverlay.classList.remove("active");
        });
    }

    // === 3. ระบบจัดการตาราง (Pagination, Search & Sorting) ===
    const searchInput = document.getElementById("searchInput");//สร้างตัวแปร searchInput สำหรับเก็บองค์ประกอบ input ที่ใช้ในการค้นหาข้อมูลในตาราง
    const rowSelect = document.getElementById("rowSelect");//สร้างตัวแปร rowSelect สำหรับเก็บองค์ประกอบ select ที่ใช้ในการเลือกจำนวนแถวที่จะแสดงในตาราง
    const paginationInfo = document.getElementById("paginationInfo");//สร้างตัวแปร paginationInfo สำหรับเก็บองค์ประกอบที่ใช้ในการแสดงข้อมูลเกี่ยวกับการแบ่งหน้า เช่น จำนวนรายการทั้งหมดและหน้าปัจจุบัน
    const paginationControls = document.getElementById("paginationControls");//สร้างตัวแปร paginationControls สำหรับเก็บองค์ประกอบที่ใช้ในการแสดงปุ่มควบคุมการแบ่งหน้า เช่น ปุ่มถัดไปและปุ่มก่อนหน้า
    const tables = document.querySelectorAll("table");//สร้างตัวแปร tables สำหรับเก็บองค์ประกอบตารางทั้งหมดในหน้าเว็บ

    //วนลูปผ่านตารางทั้งหมดที่พบในหน้าเว็บ
    tables.forEach(table => {
        //ค้นหาองค์ประกอบ tbody ภายในตาราง ถ้าไม่พบให้หยุดการทำงานของฟังก์ชันนี้
        const tbody = table.querySelector("tbody");
        if (!tbody) return;//ถ้าไม่พบ tbody ให้หยุดการทำงานของฟังก์ชันนี้

        //สร้างตัวแปร allRows สำหรับเก็บแถวทั้งหมดใน tbody ที่ไม่ใช่แถวที่มีคลาส "no-data" ซึ่งใช้สำหรับแสดงข้อความเมื่อไม่มีข้อมูล
        let allRows = Array.from(tbody.querySelectorAll("tr")).filter(row => !row.cells[0].classList.contains('no-data'));
        let filteredRows = [...allRows];//สร้างตัวแปร filteredRows สำหรับเก็บแถวที่ผ่านการกรองตามคำค้นหา ซึ่งเริ่มต้นจะมีค่าเท่ากับ allRows
        let currentPage = 1;//สร้างตัวแปร currentPage สำหรับเก็บหมายเลขหน้าปัจจุบันในการแบ่งหน้า ซึ่งเริ่มต้นจะเป็นหน้าแรก (1)
        let currentSortIndex = -1;//สร้างตัวแปร currentSortIndex สำหรับเก็บดัชนีของคอลัมน์ที่ใช้ในการเรียงลำดับ ซึ่งเริ่มต้นจะเป็น -1 หมายความว่ายังไม่มีการเรียงลำดับ
        let isAscending = true;//สร้างตัวแปร isAscending สำหรับเก็บสถานะการเรียงลำดับว่าเป็นการเรียงจากน้อยไปมาก (true) หรือจากมากไปน้อย (false) ซึ่งเริ่มต้นจะเป็น true

        function updateTable() {//สร้างฟังก์ชัน updateTable สำหรับอัปเดตการแสดงผลของตารางตามการค้นหา การแบ่งหน้า และการเรียงลำดับ
            const limitVal = rowSelect ? rowSelect.value : "all"; //สร้างตัวแปร limitVal สำหรับเก็บค่าที่เลือกจาก rowSelect ซึ่งใช้ในการกำหนดจำนวนแถวที่จะแสดงในแต่ละหน้า 
            // ถ้า rowSelect ไม่มีอยู่ให้ตั้งค่าเป็น "all" ซึ่งหมายความว่าจะไม่แบ่งหน้าและแสดงทุกแถว
            let rowsPerPage = (limitVal === "all") ? (filteredRows.length || 1) : parseInt(limitVal);//สร้างตัวแปร rowsPerPage สำหรับเก็บจำนวนแถวที่จะแสดงในแต่ละหน้า ซึ่งจะถูกกำหนดตามค่าของ limitVal 
            // ถ้า limitVal เป็น "all" จะตั้งค่า rowsPerPage ให้เท่ากับจำนวนแถวที่ผ่านการกรอง (filteredRows.length) หรือ 1 ถ้าไม่มีแถวใดเลย เพื่อป้องกันการหารด้วยศูนย์
            const totalRows = filteredRows.length;//สร้างตัวแปร totalRows สำหรับเก็บจำนวนแถวทั้งหมดที่ผ่านการกรอง ซึ่งจะใช้ในการคำนวณจำนวนหน้าทั้งหมดและแสดงข้อมูลใน paginationInfo
            const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;//สร้างตัวแปร totalPages สำหรับเก็บจำนวนหน้าทั้งหมดที่ต้องใช้ในการแสดงข้อมูลทั้งหมดที่ผ่านการกรอง 
            // โดยการหารจำนวนแถวทั้งหมด (totalRows) ด้วยจำนวนแถวต่อหน้า (rowsPerPage) และปัดขึ้นด้วย Math.ceil เพื่อให้ได้จำนวนเต็มที่มากที่สุด

            if (currentPage > totalPages) currentPage = totalPages;//ตรวจสอบว่าหมายเลขหน้าปัจจุบัน (currentPage) เกินจำนวนหน้าทั้งหมด (totalPages) หรือไม่ ถ้าเกินให้ตั้งค่า currentPage 
            // ให้เท่ากับ totalPages เพื่อป้องกันการแสดงหน้าที่ไม่มีข้อมูล
            if (currentPage < 1) currentPage = 1;//ตรวจสอบว่าหมายเลขหน้าปัจจุบัน (currentPage) น้อยกว่า 1 หรือไม่ ถ้าน้อยกว่าให้ตั้งค่า currentPage ให้เท่ากับ 1 เพื่อป้องกันการแสดงหน้าที่ไม่มีข้อมูล

            const start = (currentPage - 1) * rowsPerPage;//สร้างตัวแปร start สำหรับเก็บตำแหน่งเริ่มต้นของแถวที่จะถูกแสดงในหน้าปัจจุบัน โดยการคำนวณจากหมายเลขหน้าปัจจุบัน (currentPage) 
            // ลบด้วย 1 แล้วคูณด้วยจำนวนแถวต่อหน้า (rowsPerPage)
            const end = start + rowsPerPage;//สร้างตัวแปร end สำหรับเก็บตำแหน่งสิ้นสุดของแถวที่จะถูกแสดงในหน้าปัจจุบัน โดยการบวกตำแหน่งเริ่มต้น (start) กับจำนวนแถวต่อหน้า (rowsPerPage)

            allRows.forEach(row => row.style.display = "none");//ซ่อนแถวทั้งหมดก่อนที่จะทำการแสดงเฉพาะแถวที่อยู่ในช่วง start ถึง end ของ filteredRows
            filteredRows.slice(start, end).forEach(row => row.style.display = "");//แสดงแถวที่อยู่ในช่วง start ถึง end ของ filteredRows โดยการตั้งค่า style.display เป็น "" ซึ่งจะทำให้แถวกลับมาแสดงตามปกติ

            if (paginationInfo) {//ตรวจสอบว่ามีองค์ประกอบ paginationInfo อยู่ในหน้าเว็บหรือไม่ ถ้ามีให้แสดงข้อมูลเกี่ยวกับการแบ่งหน้า
                paginationInfo.textContent = totalRows > 0 //  ตรวจสอบว่ามีแถวที่ผ่านการกรองมากกว่า 0 หรือไม่ ถ้ามีให้แสดงข้อความที่บอกว่ากำลังแสดงรายการที่ start ถึง end จากทั้งหมด totalRows รายการ
                    ? `แสดงรายการที่ ${start + 1} ถึง ${Math.min(end, totalRows)} จากทั้งหมด ${totalRows} รายการ`
                    : "ไม่พบข้อมูลที่ค้นหา";
            }
            renderPagination(totalPages, limitVal);//เรียกใช้ฟังก์ชัน renderPagination เพื่ออัปเดตปุ่มควบคุมการแบ่งหน้าตามจำนวนหน้าทั้งหมดและค่าที่เลือกจาก rowSelect
        }

        function renderPagination(totalPages, limitVal) {//สร้างฟังก์ชัน renderPagination สำหรับอัปเดตปุ่มควบคุมการแบ่งหน้าตามจำนวนหน้าทั้งหมดและค่าที่เลือกจาก rowSelect
            if (!paginationControls) return;//ตรวจสอบว่ามีองค์ประกอบ paginationControls อยู่ในหน้าเว็บหรือไม่ ถ้าไม่มีให้หยุดการทำงานของฟังก์ชันนี้
            paginationControls.innerHTML = "";//ล้างปุ่มควบคุมการแบ่งหน้าทั้งหมดก่อนที่จะสร้างใหม่
            if (totalPages <= 1 || limitVal === "all") return;//ถ้าจำนวนหน้าทั้งหมดไม่เกิน 1 หรือค่าที่เลือกจาก rowSelect เป็น "all" ซึ่งหมายความว่าไม่ต้องแบ่งหน้า ให้หยุดการทำงานของฟังก์ชันนี้

            const createBtn = (content, targetPage, isActive = false, isDisabled = false) => {//สร้างฟังก์ชัน createBtn สำหรับสร้างปุ่มควบคุมการแบ่งหน้าที่มีเนื้อหาเป็น content, เ
            // มื่อคลิกจะเปลี่ยนไปยังหน้าที่ targetPage, และสามารถกำหนดสถานะ active และ disabled ได้
                const btn = document.createElement("button");//สร้างองค์ประกอบปุ่มใหม่
                btn.className = `page-btn ${isActive ? "active" : ""}`;//ตั้งคลาสของปุ่มเป็น "page-btn" และเพิ่มคลาส "active" ถ้าสถานะ isActive เป็น true
                btn.innerHTML = content;//ตั้งเนื้อหาของปุ่มเป็น content ซึ่งสามารถเป็นข้อความหรือไอคอน HTML
                btn.disabled = isDisabled;//ตั้งสถานะ disabled ของปุ่มตามค่า isDisabled
                btn.onclick = (e) => { e.preventDefault(); currentPage = targetPage; updateTable(); };//เมื่อคลิกที่ปุ่ม ให้ป้องกันการทำงานเริ่มต้นของปุ่ม (เช่น การส่งฟอร์ม) 
                // และตั้งค่า currentPage เป็น targetPage จากนั้นเรียกใช้ฟังก์ชัน updateTable เพื่ออัปเดตการแสดงผลของตารางตามหน้าที่เลือก
                return btn;//คืนค่าองค์ประกอบปุ่มที่สร้างขึ้น
            };
            //สร้างปุ่ม "ก่อนหน้า" ด้วยไอคอนลูกศรซ้าย และกำหนดให้เปลี่ยนไปยังหน้าก่อนหน้า (currentPage - 1)
            paginationControls.appendChild(createBtn('<span class="material-symbols-outlined">chevron_left</span>', currentPage - 1, false, currentPage === 1));
            for (let i = 1; i <= totalPages; i++) {//วนลูปสร้างปุ่มสำหรับแต่ละหน้าตั้งแต่ 1 ถึง totalPages และกำหนดให้เปลี่ยนไปยังหน้าที่ i เมื่อคลิก และเพิ่มคลาส "active" ให้กับปุ่มที่ตรงกับ currentPage
                paginationControls.appendChild(createBtn(i, i, i === currentPage));//สร้างปุ่มสำหรับแต่ละหน้าตั้งแต่ 1 ถึง totalPages และกำหนดให้เปลี่ยนไปยังหน้าที่ i เมื่อคลิก และเพิ่มคลาส "active" ให้กับปุ่มที่ตรงกับ currentPage
            }
            //สร้างปุ่ม "ถัดไป" ด้วยไอคอนลูกศรขวา และกำหนดให้เปลี่ยนไปยังหน้าถัดไป (currentPage + 1)
            paginationControls.appendChild(createBtn('<span class="material-symbols-outlined">chevron_right</span>', currentPage + 1, false, currentPage === totalPages));
        }
        //ค้นหาองค์ประกอบ th ที่มีคลาส "sortable" ภายในตาราง และเพิ่ม event listener ให้กับแต่ละ header เพื่อให้สามารถเรียงลำดับข้อมูลได้เมื่อคลิกที่ header นั้น
        const headers = table.querySelectorAll("th.sortable");//ค้นหาองค์ประกอบ th ที่มีคลาส "sortable" ภายในตาราง และเพิ่ม event listener ให้กับแต่ละ header เพื่อให้สามารถเรียงลำดับข้อมูลได้เมื่อคลิกที่ header นั้น
        headers.forEach((header, index) => {//วนลูปผ่าน header ที่พบและเพิ่ม event listener ให้กับแต่ละ header เพื่อให้สามารถเรียงลำดับข้อมูลได้เมื่อคลิกที่ header นั้น
            header.addEventListener("click", () => {//เมื่อคลิกที่ header ให้ทำการเรียงลำดับข้อมูลในตารางตามคอลัมน์ที่ถูกคลิก
                const type = header.getAttribute("data-type");//สร้างตัวแปร type สำหรับเก็บประเภทของข้อมูลในคอลัมน์ที่ถูกคลิก ซึ่งจะใช้ในการกำหนดวิธีการเปรียบเทียบค่าของแถวในการเรียงลำดับ
                if (currentSortIndex === index) {//ตรวจสอบว่าคอลัมน์ที่ถูกคลิกเป็นคอลัมน์เดียวกับที่ใช้ในการเรียงลำดับครั้งล่าสุดหรือไม่ ถ้าใช่ให้สลับสถานะการเรียงลำดับ (isAscending) 
                // เพื่อให้สามารถสลับระหว่างการเรียงจากน้อยไปมากและจากมากไปน้อยได้
                    isAscending = !isAscending;//ถ้าคอลัมน์ที่ถูกคลิกเป็นคอลัมน์เดียวกับที่ใช้ในการเรียงลำดับครั้งล่าสุด ให้สลับสถานะการเรียงลำดับ (isAscending) 
                    // เพื่อให้สามารถสลับระหว่างการเรียงจากน้อยไปมากและจากมากไปน้อยได้
                } else {
                    isAscending = true;//ถ้าคอลัมน์ที่ถูกคลิกไม่ใช่คอลัมน์เดียวกับที่ใช้ในการเรียงลำดับครั้งล่าสุด ให้ตั้งสถานะ
                    // การเรียงลำดับเป็น true ซึ่งหมายความว่าจะเริ่มต้นด้วยการเรียงจากน้อยไปมาก
                    currentSortIndex = index;//ตั้งค่า currentSortIndex เป็น index ของคอลัมน์ที่ถูกคลิก เพื่อให้รู้ว่าใช้คอลัมน์นี้ในการเรียงลำดับครั้งต่อไป
                }

                allRows.sort((a, b) => {//เรียงลำดับแถวทั้งหมด (allRows) โดยใช้ฟังก์ชันเปรียบเทียบที่กำหนดเอง ซึ่งจะเปรียบเทียบค่าของเซลล์ในคอลัมน์ที่ถูกคลิกตามประเภทของข้อมูล (type)

                    //สร้างตัวแปร valA สำหรับเก็บค่าของเซลล์ในคอลัมน์ที่ถูกคลิกของแถว a โดยจะตรวจสอบว่ามี attribute "data-value" หรือไม่ ถ้ามีให้ใช้ค่านั้น ถ้าไม่มีให้ใช้ข้อความที่แสดงในเซลล์นั้นแทน
                    let valA = a.cells[index].getAttribute("data-value") || a.cells[index].textContent.trim();
                    //สร้างตัวแปร valB สำหรับเก็บค่าของเซลล์ในคอลัมน์ที่ถูกคลิกของแถว b โดยจะตรวจสอบว่ามี attribute "data-value" หรือไม่ ถ้ามีให้ใช้ค่านั้น ถ้าไม่มีให้ใช้ข้อความที่แสดงในเซลล์นั้นแทน
                    let valB = b.cells[index].getAttribute("data-value") || b.cells[index].textContent.trim();
                    let comparison = 0;//สร้างตัวแปร comparison สำหรับเก็บผลลัพธ์ของการเปรียบเทียบระหว่าง valA และ valB ซึ่งจะใช้ในการกำหนดลำดับของแถวในการเรียงลำดับ
                    if (type === "number") {//ถ้าประเภทของข้อมูลเป็น "number" ให้ทำการเปรียบเทียบค่าของ valA และ valB 
                    // โดยการแปลงค่าที่เป็นสตริงให้เป็นตัวเลขโดยการลบอักขระที่ไม่ใช่ตัวเลขออกก่อน แล้วนำค่าที่ได้มาลบกันเพื่อหาความแตกต่าง

                    // ถ้าค่าของ valA มากกว่า valB ผลลัพธ์จะเป็นบวก ถ้าค่าของ valA น้อยกว่า valB ผลลัพธ์จะเป็นลบ และถ้าค่าของ valA เท่ากับ valB ผลลัพธ์จะเป็นศูนย์
                        comparison = parseFloat(valA.replace(/[^0-9.-]+/g, "")) - parseFloat(valB.replace(/[^0-9.-]+/g, ""));
                    } else {
                        //ถ้าประเภทของข้อมูลไม่ใช่ "number" ให้ทำการเปรียบเทียบค่าของ valA และ valB โดยใช้เมธอด localeCompare ซึ่งจะเปรียบเทียบสตริงตามลำดับตัวอักษรและรองรับภาษาไทย
                        comparison = valA.localeCompare(valB, 'th');
                    }
                    //คืนค่าของ comparison ตามสถานะการเรียงลำดับ (isAscending) ถ้า isAscending เป็น true ให้คืนค่า comparison ตามปกติ 
                    // ถ้า isAscending เป็น false ให้คืนค่าตรงกันข้ามของ comparison เพื่อให้เรียงจากมากไปน้อย
                    return isAscending ? comparison : -comparison;
                });
                //หลังจากเรียงลำดับแถวทั้งหมดแล้ว ให้ล้างเนื้อหาใน tbody และเพิ่มแถวที่เรียงลำดับแล้วกลับเข้าไปใหม่ 
                // จากนั้นทำการกรองแถวตามคำค้นหาและอัปเดตไอคอนการเรียงลำดับใน header
                allRows.forEach(row => tbody.appendChild(row));
                //กรองแถวตามคำค้นหาโดยการตรวจสอบว่าข้อความในแถวมีคำค้นหาที่ตรงกับค่าที่ผู้ใช้ป้อนใน searchInput หรือไม่ 
                // โดยการเปรียบเทียบข้อความทั้งหมดในแถวกับคำค้นหาแบบไม่สนใจตัวพิมพ์
                const query = searchInput ? searchInput.value.toLowerCase() : "";
                //กรองแถวตามคำค้นหาโดยการตรวจสอบว่าข้อความในแถวมีคำค้นหาที่ตรงกับค่าที่ผู้ใช้ป้อนใน searchInput หรือไม่ โดยการเปรียบเทียบข้อความทั้งหมดในแถวกับคำค้นหาแบบไม่สนใจตัวพิมพ์
                filteredRows = allRows.filter(row => row.textContent.toLowerCase().includes(query));

                headers.forEach(h => {//ลูปผ่าน header ทั้งหมดเพื่อรีเซ็ตไอคอนการเรียงลำดับให้เป็นค่าเริ่มต้น (expand_more) ยกเว้น header ที่ถูกคลิกในครั้งนี้
                    const icon = h.querySelector('.sort-icon');
                    if (icon) icon.textContent = 'expand_more';//รีเซ็ตไอคอนการเรียงลำดับให้เป็นค่าเริ่มต้น (expand_more) ยกเว้น header ที่ถูกคลิกในครั้งนี้
                });
                const currentIcon = header.querySelector('.sort-icon');//ค้นหาองค์ประกอบที่ใช้แสดงไอคอนการเรียงลำดับภายใน header ที่ถูกคลิก
                if (currentIcon) {//ถ้าองค์ประกอบที่ใช้แสดงไอคอนการเรียงลำดับมีอยู่ ให้เปลี่ยนข้อความของไอคอนตามสถานะการเรียงลำดับปัจจุบัน (isAscending) 
                // โดยใช้ไอคอน "keyboard_arrow_up" สำหรับการเรียงจาก
                    currentIcon.textContent = isAscending ? 'keyboard_arrow_up' : 'keyboard_arrow_down';//เปลี่ยนข้อความของไอคอนตามสถานะการเรียงลำดับปัจจุบัน (isAscending
                }
                updateTable();//หลังจากเรียงลำดับและกรองแถวแล้ว ให้เรียกใช้ฟังก์ชัน updateTable เพื่ออัปเดตการแสดงผลของตารางตามการเรียงลำดับและการค้นหา
            });
        });

        if (searchInput) {//ตรวจสอบว่ามีองค์ประกอบ searchInput อยู่ในหน้าเว็บหรือไม่ ถ้ามีให้เพิ่ม event listener เพื่อกรองแถวในตารางตามคำค้นหาที่ผู้ใช้ป้อน
            searchInput.addEventListener("input", function () {//เมื่อมีการป้อนข้อมูลใน searchInput ให้ทำการกรองแถวในตารางตามคำค้นหาที่ผู้ใช้ป้อน
                const query = this.value.toLowerCase();//สร้างตัวแปร query สำหรับเก็บค่าที่ผู้ใช้ป้อนใน searchInput โดยแปลงเป็นตัวพิมพ์เล็กเพื่อให้การค้นหาไม่สนใจตัวพิมพ์
                filteredRows = allRows.filter(row => row.textContent.toLowerCase().includes(query));//กรองแถวในตารางโดยการตรวจสอบว่าข้อความในแต่ละแถวมีคำค้นหาที่ตรงกับ
                //  query หรือไม่ โดยการเปรียบเทียบข้อความทั้งหมดในแถวกับ query แบบไม่สนใจตัวพิมพ์
                currentPage = 1;//ตั้งค่า currentPage เป็น 1 เพื่อให้แสดงหน้าผลลัพธ์การค้นหาเริ่มต้นจากหน้าแรก
                updateTable();//เรียกใช้ฟังก์ชัน updateTable เพื่ออัปเดตการแสดงผลของตารางตามคำค้นหาที่ผู้ใช้ป้อน
            });
        }
        //ตรวจสอบว่ามีองค์ประกอบ rowSelect อยู่ในหน้าเว็บหรือไม่ ถ้ามีให้เพิ่ม event listener เพื่ออัปเดตการแสดงผลของตารางเมื่อผู้ใช้เปลี่ยนจำนวนแถวที่จะแสดงต่อหน้า
        if (rowSelect) rowSelect.addEventListener("change", () => { currentPage = 1; updateTable(); });

        updateTable();//เรียกใช้ฟังก์ชัน updateTable เพื่อแสดงผลของตารางในครั้งแรกเมื่อโหลดหน้าเว็บเสร็จสมบูรณ์
    });

    // === 4. ตั้งวันที่ปัจจุบันอัตโนมัติ ===
    const dateInput = document.getElementById("deposit_date");//สร้างตัวแปร dateInput สำหรับเก็บองค์ประกอบ input ที่ใช้สำหรับป้อนวันที่ฝากเงิน
    if (dateInput && !dateInput.value) {//ตรวจสอบว่ามีองค์ประกอบ dateInput อยู่ในหน้าเว็บหรือไม่ และตรวจสอบว่า input นั้นยังไม่มีค่า (value) อยู่หรือไม่ 
    // ถ้าเงื่อนไขทั้งสองเป็นจริงให้ตั้งค่าวันที่ปัจจุบันในรูปแบบ "dd/mm/yyyy" ให้กับ input นั้น
        const today = new Date();//สร้างตัวแปร today สำหรับเก็บวันที่ปัจจุบันโดยใช้ฟังก์ชัน Date() ซึ่งจะให้วันที่และเวลาปัจจุบันของระบบ
        const d = String(today.getDate()).padStart(2, '0');//สร้างตัวแปร d สำหรับเก็บวันที่ (day) ของ today โดยใช้เมธอด getDate() และแปลงเป็นสตริง 
        // จากนั้นใช้ padStart(2, '0') เพื่อเติมเลขศูนย์ด้านหน้าถ้าค่าของวันที่น้อยกว่า 10
        const m = String(today.getMonth() + 1).padStart(2, '0');//สร้างตัวแปร m สำหรับเก็บเดือน (month) ของ today โดยใช้เมธอด getMonth() 
        // ซึ่งจะให้ค่าเดือนในรูปแบบ 0-11 ดังนั้นจึงต้องบวก 1 เพื่อให้ได้ค่าเดือนที่ถูกต้อง จากนั้นแปลงเป็นสตริงและใช้ padStart(2, '0') เพื่อเติมเลขศูนย์ด้านหน้าถ้าค่าของเดือนน้อยกว่า 10
        const y = today.getFullYear() + 543;//สร้างตัวแปร y สำหรับเก็บปี (year) ของ today โดยใช้เมธอด getFullYear() 
        // ซึ่งจะให้ค่าปีในรูปแบบ 4 หลัก เช่น 2024 จากนั้นบวก 543 เพื่อแปลงเป็นปีพุทธศักราช
        dateInput.value = `${d}/${m}/${y}`;//ตั้งค่าวันที่ปัจจุบันในรูปแบบ "dd/mm/yyyy" ให้กับ input dateInput โดยการใช้ template literal 
        // เพื่อรวมค่าของ d, m และ y เข้าด้วยกันในรูปแบบที่ต้องการ
    }


    // === 5. ระบบสลับมุมมอง รายงาน (View Selector) ===
    const loanSelector = document.getElementById('loanViewSelector');//สร้างตัวแปร loanSelector สำหรับเก็บองค์ประกอบ select ที่ใช้ในการเลือกมุมมองของรายงานสินเชื่อ
    const loanSummary = document.getElementById('loanSummary');//สร้างตัวแปร loanSummary สำหรับเก็บองค์ประกอบที่ใช้ในการแสดงสรุปข้อมูลของรายงานสินเชื่อ
    const loanTable = document.getElementById('loanTableContainer');//สร้างตัวแปร loanTable สำหรับเก็บองค์ประกอบที่ใช้ในการแสดงตารางข้อมูลของรายงานสินเชื่อ

    const savingSelector = document.getElementById('savingViewSelector');//สร้างตัวแปร savingSelector สำหรับเก็บองค์ประกอบ select ที่ใช้ในการเลือกมุมมองของรายงานการออมทรัพย์
    const savingSummary = document.getElementById('savingSummary');//สร้างตัวแปร savingSummary สำหรับเก็บองค์ประกอบที่ใช้ในการแสดงสรุปข้อมูลของรายงานการออมทรัพย์
    const savingTable = document.getElementById('savingTableContainer');//สร้างตัวแปร savingTable สำหรับเก็บองค์ประกอบที่ใช้ในการแสดงตารางข้อมูลของรายงานการออมทรัพย์

    if (loanSelector && loanSummary && loanTable) {//ตรวจสอบว่ามีองค์ประกอบ loanSelector, loanSummary และ loanTable อยู่ในหน้าเว็บหรือไม่ 
    // ถ้ามีให้เพิ่ม event listener เพื่อสลับมุมมองของรายงานสินเชื่อเมื่อผู้ใช้เลือกมุมมองจาก loanSelector
        loanSelector.addEventListener('change', function() {//เมื่อมีการเปลี่ยนแปลงค่าใน loanSelector ให้ทำการสลับมุมมองของรายงานสินเชื่อตามค่าที่เลือก
            if (this.value === 'summary') {//ถ้าค่าที่เลือกเป็น "summary" ให้แสดงสรุปข้อมูลของรายงานสินเชื่อและซ่อนตารางข้อมูล
                loanSummary.classList.remove('hidden-section');//แสดงสรุปข้อมูลของรายงานสินเชื่อโดยการลบคลาส "hidden-section" ออกจาก loanSummary
                loanTable.classList.add('hidden-section');//ซ่อนตารางข้อมูลของรายงานสินเชื่อโดยการเพิ่มคลาส "hidden-section" ให้กับ loanTable
            } else {
                loanSummary.classList.add('hidden-section');//ซ่อนสรุปข้อมูลของรายงานสินเชื่อโดยการเพิ่มคลาส "hidden-section" ให้กับ loanSummary
                loanTable.classList.remove('hidden-section');//แสดงตารางข้อมูลของรายงานสินเชื่อโดยการลบคลาส "hidden-section" ออกจาก loanTable
            }
        });
    }

    if (savingSelector && savingSummary && savingTable) {//ตรวจสอบว่ามีองค์ประกอบ savingSelector, savingSummary และ savingTable อยู่ในหน้าเว็บหรือไม่ 
    // ถ้ามีให้เพิ่ม event listener เพื่อสลับมุมมองของรายงานการออมทรัพย์เมื่อผู้ใช้เลือกมุมมองจาก savingSelector
        savingSelector.addEventListener('change', function() {//เมื่อมีการเปลี่ยนแปลงค่าใน savingSelector ให้ทำการสลับมุมมองของรายงานการออมทรัพย์ตามค่าที่เลือก
            if (this.value === 'summary') {//ถ้าค่าที่เลือกเป็น "summary" ให้แสดงสรุปข้อมูลของรายงานการออมทรัพย์และซ่อนตารางข้อมูล
                savingSummary.classList.remove('hidden-section');//แสดงสรุปข้อมูลของรายงานการออมทรัพย์โดยการลบคลาส "hidden-section" ออกจาก savingSummary
                savingTable.classList.add('hidden-section');//ซ่อนตารางข้อมูลของรายงานการออมทรัพย์โดยการเพิ่มคลาส "hidden-section" ให้กับ savingTable
            } else {
                savingSummary.classList.add('hidden-section');//ซ่อนสรุปข้อมูลของรายงานการออมทรัพย์โดยการเพิ่มคลาส "hidden-section" ให้กับ savingSummary
                savingTable.classList.remove('hidden-section');//แสดงตารางข้อมูลของรายงานการออมทรัพย์โดยการลบคลาส "hidden-section" ออกจาก savingTable
            }
        });
    }
});