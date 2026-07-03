window.dataInfo = {}
window.thiknessInfo = {}     
window.jsonData = {}
 // 1. Định nghĩa mapping giữa code và ID hiển thị (hoặc tên hiển thị)
async function getdata(){
 

    try {
        // 1. Gửi yêu cầu fetch tới file JSON
        const response = await fetch('https://dwtool.free.nf/api/data.json'); // Thay 'data.json' bằng đường dẫn file của bạn
        
        // 2. Kiểm tra nếu phản hồi không thành công (ví dụ: lỗi 404, 500)
        if (!response.ok) {
            throw new Error(`Lỗi kết nối: ${response.status}`);
        }
        
        // 3. Chuyển đổi phản hồi thành dữ liệu JSON
        const data = await response.json();
        
        // 4. Sử dụng dữ liệu
        console.log("Dữ liệu JSON nhận được:", data);
        dataInfo = data
        thiknessInfo = data[data.length-1].title
        jsonData = data[data.length-1].ratio
        //renderData(data); // Hàm phụ trách hiển thị dữ liệu lên giao diện (nếu có)

    } catch (error) {
        // Bắt các lỗi mạng hoặc lỗi cú pháp JSON
        console.error("Đã xảy ra lỗi khi fetch dữ liệu:", error);
    }
}








// Sửa 'Async' thành 'async' viết thường
async function infoB() {
  try {
// Thêm await ở đây để bắt JavaScript đứng đợi cho đến khi sendMes chạy xong
    // const data = await sendMes("title");
    
    // console.log("send: 'title'");
    // console.log("Dữ liệu nhận được:", data);
    
    // // Giờ bạn có thể gán biến global hoặc return trực tiếp một cách chính xác
    //  jsonData = data; 
    // return data; 
 }

    // QUAN TRỌNG: Phải await response.json() để lấy dữ liệu thực tế
 //   let data = await response.json(); 
  //  return data;

   catch (error) {
    console.error("Lỗi khi fetch dữ liệu:", error);
  }
}
function extractProductInfo(data) {
  // 1. Lấy chuỗi raw từ object dữ liệu
  const rawString = data?.RK_RESULT?.PROD_DTL;
  if (!rawString) return "Không tìm thấy dữ liệu";

  // 2. Dùng Regex để tìm số đứng trước dấu * trong ngoặc đơn (Ví dụ: lấy số 12 từ (12*2465*4650))
 // const numberMatch = rawString.match(/\((\d+)\*/);
 const numberMatch = rawString.match(/\((\d+\.?\d*)\*/);

  // const number = numberMatch ? numberMatch[1] : "";
 //thiknessInfo.RK_RESULT.PROD_NM
 const str = thiknessInfo.RK_RESULT.PROD_NM;

// Tách chuỗi bằng dấu phẩy, sau đó xóa khoảng trắng thừa ở 2 đầu
const result = str.split(',').map(item => item.trim());
 
  // 3. Định nghĩa các từ khóa cần tìm kiếm trong chuỗi
 // const keywords = ["LBR","LMR","MMR","MBR", "MPN", "F4S", "S", "C2","E2"];
  let foundKeywords = result;

  // 4. Kiểm tra xem chuỗi có chứa các từ khóa đó không
  // keywords.forEach(word => {
  //   if (rawString.includes(word)) {
  //     foundKeywords.push(word);
  //   }
  // });

  // 5. Ghép số và các từ khóa lại với nhau bằng dấu cách
  // Kết quả mong muốn: "12 MBR S C2"
  return `${foundKeywords.join(" ")}`.trim(); //${number}
}



window.mapping = [
        { key: "RUB,C.Log", label: "Rubber log", group: "RUB" },
        { key: "RUB,S.Log", label: "S.Log", group: "RUB" },
        { key: "RUB,Root", label: "Root", group: "RUB" },
        { key: "VENR", label: "Verneer", otherKey: "RUB,Chip,VENR", group: "RUB" },
        { key: "RUB,Slab", label: "Slab", group: "RUB" },
        { key: "MEL", label: "Mel", group: "NON" },
        { key: "CSW", label: "Cashew", group: "NON" },
        { key: "MHW", label: "MTH/MHW",otherKey: "MHW,Chip",
        group: "NON" },
        { key: "ACA", label: "ACA", group: "NON" }
     //   { key: "PINE", label: "PINE", group: "other" }
    ];
async function updateMapping() {
    // Giả sử dữ liệu được gán vào window.jsonData từ hàm getdata()
   // jsonData = //await getdata(); 
  //  console.log("jsonData", window.jsonData);
    
    const results = window.jsonData.RK_RESULT;

    results.forEach(item => {
        const val = item.MTRL_CHTR_VAL;
        if (!val) return; // Bỏ qua nếu dữ liệu rỗng

        // Kiểm tra xem ký tự 'val' này đã tồn tại trong mapping chưa (check cả key và otherKey)
        const isExisted = window.mapping.some(m => {
            // Kiểm tra trùng key chính
            if (m.key === val) return true;
            
            // Kiểm tra trùng trong otherKey (tách chuỗi bằng dấu phẩy thành mảng để check)
            if (m.otherKey) {
                const altKeys = m.otherKey.split('.').map(k => k.trim());
                return altKeys.includes(val);
            }
            
            return false;
        });

        // Nếu CHƯA tồn tại ở bất kỳ đâu, lúc này mới thêm mới vào cấu trúc với group "NON"
        if (!isExisted) {
            window.mapping.push({
                key: val,
                label: val,
                group: "NON"
            });
            console.log(`Đã thêm key mới chưa có trong hệ thống: ${val}`);
        }
    });
    console.log("maping added",mapping)
}

 
window.summary = {}
async  function updateMapping() {
 // jsonData= await getdata()
//  console.log("jsonData",jsonData)
    const existingKeys = new Set(window.mapping.map(m => m.key));
    const results = window.jsonData.RK_RESULT;

    results.forEach(item => {
        const val = item.MTRL_CHTR_VAL;
        
        // Kiểm tra xem key đã tồn tại trong mapping chưa
        // Nếu chưa tồn tại, thêm mới với group "NON"
        if (!existingKeys.has(val)) {
            window.mapping.push({
                key: val,
                label: val, // Tạm thời để label giống key
                group: "NON"
            });
            
            // Cập nhật Set để tránh trùng lặp nếu jsonData có key giống nhau
            existingKeys.add(val);
        }
    });
}

// Chạy hàm


    
    window.summary = {}
function summaryUpdate(){
    summary = jsonData.RK_RESULT.reduce((acc, item) => {
    // Tìm group tương ứng trong mapping
    // Logic: Kiểm tra xem key trong mapping có xuất hiện trong MTRL_CHTR_VAL không
    const mapEntry = mapping.find(m => item.MTRL_CHTR_VAL.includes(m.key));
    
    const groupName = mapEntry ? mapEntry.group : "NON";

    if (!acc[groupName] ) {
        acc[groupName] = { count: 0, totalRatio: 0 };
    }

    acc[groupName].count += 1;
    acc[groupName].totalRatio += item.INPUT_RATIO;

    return acc;
}, {});
}

//console.log("Kết quả thống kê:", summary);

// Nếu bạn chỉ muốn lấy giá trị cụ thể:
//console.log(`Số lượng nhóm RUB: ${summary.RUB?.count || 0}`);
//console.log(`Số lượng nhóm NON: ${summary.NON?.count || 0}`);
/// reder tb
async function renderTable(data) {
    const tbody = document.getElementById('myTbody');
    tbody.innerHTML = ""; // Xóa sạch dữ liệu cũ trước khi render lại

    let sumRubber = 0;
    let sumNonRubber = 0;

    // 1. Phân loại và nhóm dữ liệu từ RK_RESULT dựa trên window.mapping
    const rubberItems = [];
    const nonRubberItems = [];

    data.RK_RESULT.forEach(item => {
        // Bỏ qua nếu tỉ lệ bằng 0 hoặc không có dữ liệu
        if (!item.INPUT_RATIO || item.INPUT_RATIO === 0) return;

        // Tìm mapping tương ứng (ưu tiên match chuẩn key hoặc chứa kí tự)
        const mapItem = window.mapping.find(m => 
            item.MTRL_CHTR_VAL === m.key || 
            item.MTRL_CHTR_VAL.includes(m.key) ||
            (m.otherKey && m.otherKey.split(';').map(k => k.trim()).includes(item.MTRL_CHTR_VAL))
        );

        const targetItem = {
            key: item.MTRL_CHTR_VAL,
            label: mapItem ? mapItem.label : item.MTRL_CHTR_VAL, // Nếu không tìm thấy mapping thì lấy luôn key làm label
            ratio: item.INPUT_RATIO
        };

        // Chia nhóm dựa trên thuộc tính group trong mapping
        if (mapItem && mapItem.group === "RUB") {
            rubberItems.push(targetItem);
            sumRubber += item.INPUT_RATIO;
        } else {
            nonRubberItems.push(targetItem);
            sumNonRubber += item.INPUT_RATIO;
        }
    });

    // 2. Hàm bổ trợ để render từng nhóm cụ thể vào bảng
    function renderGroup(groupLabel, groupGroupId, items, totalRatio) {
        if (items.length === 0) return; // Nếu nhóm không có dữ liệu thì không render gì cả
    //    items.length -=1
        items.forEach((item, index) => {
            const row = tbody.insertRow();
            row.id = `row-${item.key.replace(/,/g, '-')}`;

            // Ô 1: Tên Nhóm (Chỉ insert ở dòng đầu tiên của nhóm và set rowspan)
            if (index === 0) {
                const cellGroup = row.insertCell();
                cellGroup.className = groupGroupId === "RUB" ? "rowRub" : "rowNon";
                cellGroup.rowSpan = items.length;
                cellGroup.textContent = groupLabel;
            }

            // Ô 2: Tên Label của nguyên liệu
            const cellLabel = row.insertCell();
            cellLabel.id = `label-${item.label.replace(/,/g, '-')}`;
            cellLabel.textContent = item.label;

            // Ô 3: Giá trị Ratio của dòng đó
            const cellVal = row.insertCell();
            cellVal.id = `val-${item.key.replace(/,/g, '-')}`;
            cellVal.textContent = item.ratio.toFixed(1) + "%";

            // Ô 4: Tổng của cả nhóm (Chỉ insert ở dòng đầu tiên và set rowspan)
            if (index === 0) {
                const cellTotal = row.insertCell();
                cellTotal.id = groupGroupId === "RUB" ? "total-rubber" : "total-non-rubber";
                cellTotal.className = groupGroupId === "RUB" ? "rowRub" : "rowNon";
                cellTotal.rowSpan = items.length;
                cellTotal.textContent = totalRatio.toFixed(1) + "%";
            }
        });
    
    }

    // 3. Tiến hành render nhóm Rubber và Non-Rubber vào bảng HTML
    renderGroup("Rubber", "RUB", rubberItems, sumRubber);
   renderGroup("None Rubber", "NON", nonRubberItems, sumNonRubber);
//console.log(rubberItems)
//console.log(nonRubberItems)
    // 4. Cập nhật các ô Grand Total bên ngoài bảng (nếu có)
    const grandTotal1 = document.getElementById("grand-total-1");
    const grandTotal2 = document.getElementById("grand-total-2");
    
    if (grandTotal1) grandTotal1.innerText = (sumRubber + sumNonRubber).toFixed(0) + "%";
    if (grandTotal2) grandTotal2.innerText = (sumRubber + sumNonRubber).toFixed(0) + "%";

}
async function updateTitle(){
      /// title table
    //thiknessInfo = await infoB()
    let name = extractProductInfo(thiknessInfo)
    let title = document.getElementById("thikness")
    title.innerText = name
    console.log(name); 
    let inf = document.getElementById("PROD_NM")
    let star = document.getElementById("START_DATE")
    let updateTime = document.getElementById("created_at")
    let pcs = document.getElementById("RSLT_PCS")
    let pcs_percent = document.getElementById("dif_pcs")
    let pcs_percent_v = document.getElementById("dif_pcs2")
    inf.innerText = thiknessInfo.RK_RESULT.PROD_NM
    star.innerText = thiknessInfo.RK_RESULT.START_DATE
    updateTime.innerText = upDay(dataInfo[dataInfo.length-1].created_at)
    pcs.innerText = thiknessInfo.RK_RESULT.PRD_PLN_PCS - thiknessInfo.RK_RESULT.RSLT_PCS
    let persen = (thiknessInfo.RK_RESULT.PRD_PLN_PCS - thiknessInfo.RK_RESULT.RSLT_PCS)*100/thiknessInfo.RK_RESULT.PRD_PLN_PCS
    pcs_percent.innerText = persen+ "%"
    pcs_percent_v.style.width = persen+"%"
}
/// render tb
function upDay(date){
    let currentDate = new Date(date);
let hoursToAdd = 11;

// Cộng trực tiếp số mili-giây của 'x' giờ vào thời gian hiện tại
let futureDate = new Date(currentDate.getTime() + (hoursToAdd * 60 * 60 * 1000));
let day = String(futureDate.getDate()).padStart(2, '0');
    let month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Tháng trong JS chạy từ 0 đến 11
    let year = futureDate.getFullYear();

    // Lấy giờ, phút
    let hours = String(futureDate.getHours()).padStart(2, '0');
    let minutes = String(futureDate.getMinutes()).padStart(2, '0');

return `${day}/${month}/${year} ${hours}:${minutes}`;
}

async function update(){
    let tb = document.getElementById("myTbody");
    tb.innerHTML = ``;
   // jsonData={}
    await getdata();
    updateMapping();
    //summaryUpdate();
    
    renderTable(jsonData);
    await updateTitle()
    
    
}

function renderDomTB(){
    let newElement = document.createElement("div")
  //  let a = document.getElementsByTagName("body")
    let a = document.getElementById("ratioTable")
    newElement.innerHTML = `
    <div class="btn-group">
     <button class="btn-download" id="save">Save</button>
    <button class="btn-download" id="copy">Copy</button>
     <button class="btn-download" id="update">Refresh</button>
    </div>
   

<table class="mtrl-table" id="mtrl-table" style=" color: black;">
    <thead>
        <tr>
            <th id="thikness"colspan="4" class="table-title">2.5 mm MBR C2</th>
        </tr>
        <tr>
            <th colspan="2">Material</th>
            <th colspan="2">Percentage</th>
           
        </tr>
    </thead>
    <tbody id="myTbody">
      
    </tbody>
    <tfoot>
        <tr>
            <td colspan="2" style="text-align: center; font-weight: bold;">Total</td>
            <td id="grand-total-1" style="font-weight: bold;">0%</td>
            <td id="grand-total-2" style="font-weight: bold;">0%</td>
        </tr>
    </tfoot>
</table>
    `
    console.log(a)
    a.append(newElement)
    let sv = document.getElementById("save")
    let cop = document.getElementById("copy")
    cop.addEventListener("click",()=>copyCanvasToClipboard())
    sv.addEventListener("click",()=>{
      downloadSnapshot()
    })
 }



//import * as htmlToImage from 'html-to-image';

function downloadSnapshot() {
  // 1. Chọn phần tử HTML bạn muốn chụp lại
//  const node = document.getElementById('mtrl-table');

            const container = document.getElementById("mtrl-table");
            
            html2canvas(container).then(canvas => {
                // Chuyển canvas thành URL hình ảnh
                const image = canvas.toDataURL("image/png");
                
                // Tạo một thẻ <a> tạm thời để tải xuống
                const link = document.createElement('a');
                link.href = image;
                link.download = 'Table.png'; // Tên file khi tải về
                link.click();
            });}

  
    


window.addEventListener('DOMContentLoaded',()=>{
    let a = document.getElementById("submain_tite2")
    console.log(a)
})


// chrome.runtime.sendMessage hoặc window.postMessage 
// để trao đổi dữ liệu giữa trang chính và iframe.

// chrome.scripting.executeScript({
//   target: { 
//     tabId: tab.id, 
//     allFrames: true // Chạy trên tất cả các frame của tab hiện tại
//   },
//   files: ["content.js"]
// });

async function sendMes(mes) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: mes }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (response && response.success) {
        resolve(response.data);
      } else {
        reject(response ? response.error : "Unknown error");
      }
    });
  });
}
async function sendApi(mes,qr) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "api", url: mes[0], body: mes[1]  }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (response && response.success) {
        resolve(response.data);
      } else {
        reject(response ? response.error : "Unknown error");
      }
    });
  });
}

function copyCanvasToClipboard() {
   // const canvas = document.getElementById('mtrl-table'); // Thay bằng ID canvas của bạn

    html2canvas(document.querySelector("#mtrl-table")).then(canvas => {
    // 1. Chuyển canvas thành một file Blob (định dạng image/png)
    canvas.toBlob(blob => {
        if (!blob) {
            console.error("Không thể tạo Blob từ canvas");
            return;
        }

        // 2. Sử dụng Clipboard API để copy Blob vào bộ nhớ tạm
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item])
            .then(() => {
                alert("Đã copy hình ảnh vào Clipboard thành công!");
            })
            .catch(err => {
                console.error("Lỗi khi copy:", err);
                alert("Không thể copy. Hãy chắc chắn bạn đã cấp quyền hoặc dùng trình duyệt hỗ trợ.");
            });
    }, "image/png");
});
}
// Cách gọi hàm:
// getdata(mes).then(data => console.log("Dữ liệu nhận được:", data));
//if(message.action = "ratio"){} else {}
function ratioInit(){
    let b = document.getElementById("ratioTable")
    renderDomTB()
    //renderTable(a);  
    //updateRowSpan()
    update()
    //
    
    let updt = document.getElementById("update")
    updt.addEventListener("click",()=>{
    update()})
}

// Gọi hàm
ratioInit()


