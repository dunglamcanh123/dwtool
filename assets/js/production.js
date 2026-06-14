window.pro = {}
async function getdataJson(){
 

    try {
        // 1. Gửi yêu cầu fetch tới file JSON
        const response = await fetch('https://dwtool.free.nf/api/proData3.json'); // Thay 'data.json' bằng đường dẫn file của bạn
        
        // 2. Kiểm tra nếu phản hồi không thành công (ví dụ: lỗi 404, 500)
        if (!response.ok) {
            throw new Error(`Lỗi kết nối: ${response.status}`);
        }
        
        // 3. Chuyển đổi phản hồi thành dữ liệu JSON
        const data = await response.json();
        
        // 4. Sử dụng dữ liệu
        console.log("pro:", data);
       
        //pro = data[data.length-1].pro
        //renderData(data); // Hàm phụ trách hiển thị dữ liệu lên giao diện (nếu có)
        return data
    } catch (error) {
        // Bắt các lỗi mạng hoặc lỗi cú pháp JSON
        console.error("Đã xảy ra lỗi khi fetch dữ liệu:", error);
    }
}


function renderTablePro(arr){
    let tbody = document.getElementById("pro")
    //arr = []
    let htm = ``
    if(arr.length>0){
        arr.forEach((item,i)=>{
         htm +=`   <tr class="unread ${item.PRD_ORD_STUS_NM}">
                       <td>
                          <input type="checkbox" id="chek_${i}"  value="Car" checked>
                        </td>
                        <td>
                          <p class="m-0"id="PROD_DTL_${i}">${item.PROD_DTL}</p>
                        </td>
                        <td>
                           <p class="m-0"id="PRD_ORD_STUS_NM_${i}">${item.PRD_ORD_STUS_NM}</p>
                        </td>
                        <td>
                          <p class="mb-1" id="STR_PRD_ST_DTTM_${i}">${item.STR_PRD_ST_DTTM}</p>
                          <p class="m-0" id="STR_PRD_END_DTTM_${i}">${item.STR_PRD_END_DTTM}</p>
                        </td>
                        <td id="PRD_PLN_TM_${i}">${item.PRD_PLN_TM}</td>
                        <td id="LAST_CHG_DTTM_${i}">${item.LAST_CHG_DTTM}</td>
                        <td id="CHEM_RESN_NM_${i}">${item.CHEM_RESN_NM}</td>
                        <td id="PROD_REGION_NM_${i}">${item.PROD_REGION_NM}</td>
                        <td id="PRD_PLN_CBM_${i}">${item.PRD_PLN_CBM}</td>
                      </tr>`
        })
    }

    tbody.innerHTML = htm
}

async function initPro(){
   
      pro = await getdataJson()
      renderTablePro(pro[pro.length-1].pro.RK_PSM)
    
}
initPro()
