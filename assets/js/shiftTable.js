const sif = {
  "Date": [],
  "A": [],
  "B": [],
  "C": [],
  "D": [],
  "today": 0
};

function addSif(startDateInput, numberOfDays) {
  // Mảng chu kỳ ca (12 ngày)
  const t = ["M", "M", "M", "O", "N", "N", "N", "O", "A", "A", "A", "O"];
  
  // Ngày neo gốc (Base Date) để xác định index ban đầu
  const baseDate = new Date(2026, 5, 13); // 13/06/2026
  const baseIndex = { A: 0, B: 9, C: 6, D: 3 };

  // Chuyển đổi ngày nhập vào (Dynamic Start Date) thành Object Date
  const startDate = new Date(startDateInput);
  
  // Kiểm tra nếu ngày nhập vào không hợp lệ
  if (isNaN(startDate.getTime())) {
    console.error("Ngày nhập vào không đúng định dạng! Hãy dùng định dạng YYYY-MM-DD");
    return;
  }

  // Tính số ngày chênh lệch giữa ngày bắt đầu mới và ngày neo gốc
  const msPerDay = 24 * 60 * 60 * 1000;
  const difftoday = startDate - new Date()
sif.today = Math.floor(difftoday / msPerDay)+1;
  // Số mili-giây trong 1 ngày
  const diffTime = startDate - baseDate;
  const diffDays = Math.floor(diffTime / msPerDay);

  // Vòng lặp để tính lịch từ ngày bắt đầu mới trở đi
  for (let i = 0; i < numberOfDays; i++) {
    // 1. Tính toán ngày hiện tại
    let currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + i);
    
    let dateString = currentDay.toISOString().split('T')[0];
    sif.Date.push(dateString);

    // 2. Tính index dựa trên độ lệch tổng thể (diffDays + i)
    // Dùng hàm chuẩn hóa số dư để xử lý cả trường hợp diffDays bị âm (ngày nhập vào trước ngày 13/7)
    let totalOffset = diffDays + i;
    
    let idxA = ((baseIndex.A + totalOffset) % 12 + 12) % 12;
    let idxB = ((baseIndex.B + totalOffset) % 12 + 12) % 12;
    let idxC = ((baseIndex.C + totalOffset) % 12 + 12) % 12;
    let idxD = ((baseIndex.D + totalOffset) % 12 + 12) % 12;

    // 3. Đẩy kết quả vào object
    sif.A.push(t[idxA]);
    sif.B.push(t[idxB]);
    sif.C.push(t[idxC]);
    sif.D.push(t[idxD]);
  }

  console.log(sif);
}

function renderSifTable() {
    const headerElement = document.getElementById("shiftTableHeader");
    const bodyElement = document.getElementById("shiftTable");

    // 1. Tạo Tiêu đề cột (Header)
    headerElement.innerHTML = `
        <tr>
            <th>Ngày</th>
            <th>A</th>
            <th>B</th>
            <th>C</th>
            <th>D</th>
        </tr>
    `;

    // 2. Tạo Nội dung bảng (Body)
    let bodyHtml = "";
    const totalRows = sif.Date.length; // Số lượng ngày đã được tính toán

    for (let i = 0; i < totalRows; i++) {
        // Định dạng lại ngày hiển thị cho dễ nhìn (DD/MM/YYYY) thay vì YYYY-MM-DD
        const dateParts = sif.Date[i].split("-");
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        bodyHtml += `
            <tr>
                <td><strong>${formattedDate}</strong></td>
                <td>${getShiftBadge(sif.A[i])}</td>
                <td>${getShiftBadge(sif.B[i])}</td>
                <td>${getShiftBadge(sif.C[i])}</td>
                <td>${getShiftBadge(sif.D[i])}</td>
            </tr>
        `;
    }
    
    bodyElement.innerHTML = bodyHtml;
}

// Hàm phụ trợ để biến các ký tự M, N, A, O thành các thẻ màu (Badge) cho đẹp mắt
function renderSifTable(today) {
    const headerElement = document.getElementById("shiftTableHeader");
    const bodyElement = document.getElementById("shiftTable");

    const totalDays = sif.Date.length;

    // --- 1. TẠO TIÊU ĐỀ CỘT (Dòng đầu tiên: Tiêu đề "Kíp / Ngày" và danh sách các ngày) ---
    
    let headerHtml = `<tr><th>Kíp / Ngày</th>`;
    
    for (let i = 0; i < totalDays; i++) {
        // Định dạng ngày thành DD/MM
        const dateParts = sif.Date[i].split("-");
        const formattedDate = `${dateParts[2]}/${dateParts[1]}`;
        headerHtml += `<th>${formattedDate}</th>`;
    }
    headerHtml += `</tr>`;
    headerElement.innerHTML = headerHtml;


    // --- 2. TẠO NỘI DUNG BẢNG (4 dòng tương ứng cho 4 Kíp A, B, C, D) ---
    const kips = ["A", "B", "C", "D"];
    let bodyHtml = "";

    kips.forEach(kip => {
        // Bắt đầu một dòng mới cho mỗi Kíp
        bodyHtml += `<tr><td><strong>${kip}</strong></td>`;
        
        // Duyệt qua từng ngày để lấy ca làm việc của Kíp đó đổ vào các cột ngang
        for (let i = 0; i < totalDays; i++) {
            const shiftValue = sif[kip][i]; // Lấy dữ liệu từ sif.A[i], sif.B[i],...
            bodyHtml += `<td>${getShiftBadge(shiftValue)}</td>`;
        }
        
        bodyHtml += `</tr>`;
    });

    bodyElement.innerHTML = bodyHtml;
}

// Hàm phụ trợ giữ nguyên để tạo badge màu cho gọn gàng
function getShiftBadge(shift) {
    switch(shift) {
        case "M": return `<span class="badge" style="padding: 4px 8px; color: white; background-color: #0d6efd; border-radius: 4px; font-size: 12px;">M</span>`;
        case "N": return `<span class="badge" style="padding: 4px 8px; color: white; background-color: #6c757d; border-radius: 4px; font-size: 12px;">N</span>`;
        case "A": return `<span class="badge" style="padding: 4px 8px; color: #000; background-color: #ffc107; border-radius: 4px; font-size: 12px;">A</span>`;
        case "O": return `<span class="badge" style="padding: 4px 8px; color: white; background-color: #dc3545 ; border-radius: 4px; font-size: 12px;">O</span>`;
        default: return shift;
    }
}

// --- CÁCH SỬ DỤNG ---
// Ví dụ 1: Tính 5 ngày kể từ ngày 15/07/2026

// Ví dụ 2: Bạn cũng có thể tính lùi về quá khứ (ví dụ từ ngày 11/07/2026)
// console.log("--- Lịch từ ngày 2026-07-11 ---");
// addSif("2026-07-11", 4);
// 1. Đảm bảo DOM đã load xong
function stringDay(date){
  let today = new Date(date)
    let day =today.getDate() // ngay
    let month = today.getMonth() + 1 //thang +1
    let year = today.getFullYear() // nam
    // 2. Chạy hàm tính toán lịch ca (Ví dụ: tính 15 ngày kể từ hôm nay)
  console.log(`${year}-${month}-${day}`)  
  return `${year}-${month}-${day}`
}
document.addEventListener("DOMContentLoaded", () => {
    // 2. Chạy hàm tính toán lịch ca (Ví dụ: tính 15 ngày kể từ hôm nay)
    let day = stringDay(new Date())
    addSif(day, 30); 
    
    // 3. Gọi hàm hiển thị dữ liệu lên bảng HTML
    renderSifTable();
    
});
