let dataTest = {
    "RK_RESULT": [
        {
            "PLANT_CD": "V113",
            "MTRL_CD": "REB010045",
            "WOOD_AGE_DAY": 1358,
            "INPUT_TON": 2,
            "MTRL_CHTR_VAL": "ACA,Chip",
            "INPUT_RATIO": 7.834763365298754,
            "WOOD_MC": ""
        },
        {
            "PLANT_CD": "V113",
            "MTRL_CD": "REB010071",
            "WOOD_AGE_DAY": 13,
            "INPUT_TON": 4.9,
            "MTRL_CHTR_VAL": "CSW,C.Log",
            "INPUT_RATIO": 18.90359902162519,
            "WOOD_MC": ""
        },
        {
            "PLANT_CD": "V113",
            "MTRL_CD": "REB010037",
            "WOOD_AGE_DAY": 50,
            "INPUT_TON": 1.2,
            "MTRL_CHTR_VAL": "MHW,Chip",
            "INPUT_RATIO": 4.573513996195209,
            "WOOD_MC": ""
        },
        {
            "PLANT_CD": "V113",
            "MTRL_CD": "REB010021",
            "WOOD_AGE_DAY": 34,
            "INPUT_TON": 0,
            "MTRL_CHTR_VAL": "PNE,C.Log",
            "INPUT_RATIO": 0,
            "WOOD_MC": ""
        },
        {
            "PLANT_CD": "V113",
            "MTRL_CD": "REB010020",
            "WOOD_AGE_DAY": 37,
            "INPUT_TON": 0,
            "MTRL_CHTR_VAL": "PNE,Slab",
            "INPUT_RATIO": 0,
            "WOOD_MC": ""
        },
        {
            "PLANT_CD": "V113",
            "MTRL_CD": "REB010015",
            "WOOD_AGE_DAY": 8,
            "INPUT_TON": 5.4,
            "MTRL_CHTR_VAL": "RUB,C.Log",
            "INPUT_RATIO": 20.91082035951392,
            "WOOD_MC": ""
        },
        {
            "PLANT_CD": "V113",
            "MTRL_CD": "REB010074",
            "WOOD_AGE_DAY": 35,
            "INPUT_TON": 2,
            "MTRL_CHTR_VAL": "RUB,Chip,VENR",
            "INPUT_RATIO": 7.834763365298754,
            "WOOD_MC": ""
        },
        {
            "PLANT_CD": "V113",
            "MTRL_CD": "REB010010",
            "WOOD_AGE_DAY": 24,
            "INPUT_TON": 5.9,
            "MTRL_CHTR_VAL": "RUB,Root",
            "INPUT_RATIO": 22.952983654928758,
            "WOOD_MC": ""
        },
        {
            "PLANT_CD": "V113",
            "MTRL_CD": "REB010008",
            "WOOD_AGE_DAY": 98,
            "INPUT_TON": 1.2,
            "MTRL_CHTR_VAL": "RUB,S.Log",
            "INPUT_RATIO": 4.577396435920332,
            "WOOD_MC": ""
        },
        {
            "PLANT_CD": "V113",
            "MTRL_CD": "REB010005",
            "WOOD_AGE_DAY": 59,
            "INPUT_TON": 3.2,
            "MTRL_CHTR_VAL": "RUB,Slab",
            "INPUT_RATIO": 12.412159801219087,
            "WOOD_MC": ""
        }
    ],
    "is_success": true
}
let dataApi = {}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // fetch_data => 
console.log("onMessage: ",message.action)
  let send = []
  if(message.action == "ratio"){
    send = ["https://sf.dongwha.com/V113/S30/selectMaterialInputList2/jqxGridJSON.json?ServiceName=dwsf.v113.screen.s30rawmaterial-service&selectMaterialInputList2=1","PLANT_CD=V113&YMD_FORMAT_STR=DD-MM-YYYY&gwLoginId=2301049&gwServiceName=dwsf.v113.screen.s30rawmaterial-service&gwLanguageCd=EN&gwClientIp=LOCAL+PC&gwPgmId=V113S30H1001&gwPlantCd=V113&gwMenuNo=639&GRP_CD_ID=ORD_TREE_CD&REAL_TM=true&SEARCH_TYPE=3"]}
    if(message.action == "title"){
      send = ["https://sf.dongwha.com/V113/S30/selectOrderScheduleInfo/jqxGridJSON.json?ServiceName=dwsf.v113.screen.s30processCondition-service&selectOrderScheduleInfo=1","PLANT_CD=V113&TAG_LIST=%5B%22YIELD_GLUE1_TEMP_SF%22%2C%22YIELD_GLUE2_TEMP_SF%22%2C%22YIELD_WAX_TEMP_SF%22%2C%22YIELD_UREA_TEMP_SF%22%2C%22YIELD_DYE_RAW%22%5D&SEARCH_TYPE=LAST&gwLoginId=2301049&gwServiceName=dwsf.v113.screen.s30processCondition-service&gwLanguageCd=EN&gwClientIp=LOCAL+PC&gwPgmId=V113S30B1001&gwPlantCd=V113&gwMenuNo=388&WORKING_HOUR=8.65&PROC_CD=V1-MD2-212&TIME_ZONE=Asia%2FHo_Chi_Minh&GRP_CD_ID=WORK_PROC_CD&PRD_ORD_STUS_CD=N"]
    }
    if(message.action == "test"){
      sendResponse({ success: true, data: dataTest })
      //return true
    } else {
     // return true
    }
  
 // let title = 
  console.log(send)
  
  
//  if (message.action === "fetch_data") {
    fetch(send[0], {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      "body": send[1] ,
      "method": "POST"
    })
    .then(response => response.json())
    .then(data => {
      sendResponse({ success: true, data: data });
      if(message.action == "ratio"){
        dataApi.ratio = data
    }
    if(message.action == "title"){
      dataApi.title= data
      testSaveDataApi(dataApi)
      dataApi ={};
    }
    }).catch((error) => {
      sendResponse({ success: false, error: error.message })
      console.log(error)
    });

    return true; // Bắt buộc phải có để giữ cổng kết nối async
  
});
async function apiTest(){
  let send = ["https://sf.dongwha.com/V113/S30/selectMaterialInputList2/jqxGridJSON.json?ServiceName=dwsf.v113.screen.s30rawmaterial-service&selectMaterialInputList2=1","PLANT_CD=V113&YMD_FORMAT_STR=DD-MM-YYYY&gwLoginId=2301049&gwServiceName=dwsf.v113.screen.s30rawmaterial-service&gwLanguageCd=EN&gwClientIp=LOCAL+PC&gwPgmId=V113S30H1001&gwPlantCd=V113&gwMenuNo=639&GRP_CD_ID=ORD_TREE_CD&REAL_TM=true&SEARCH_TYPE=3"]
  fetch(send[0], {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      "body": send[1] ,
      "method": "POST"
    })
    .then(response => response.json())
    .then(data =>{ 
      console.log(data)
      //sendResponse({ success: true, data: data })
      
    })
    .catch(error => {
      //sendResponse({ success: false, error: error.message })
      });

    return true
  
  
}

console.log("backgroud is runing!")
let a = "ok"
function start(){
  
  function log(){console.log("ok")}
  log()
}
//https://dwtool.free.nf/Api/api.php
// Đường dẫn tới API PHP của bạn
const apiUrl = 'https://dwtool.free.nf/api/jsonApi.php';

// Dữ liệu mẫu muốn gửi lên API
const mockData = {
    name: "Trần Thị B",
    email: "thib@example.com",
    age: 22,
    skills: ["HTML", "CSS", "JavaScript"]
};

// Hàm gửi dữ liệu qua phương thức POST
async function testSaveDataApi(data) {
    try {
        console.log("Đang gửi dữ liệu...");
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Bắt buộc để PHP nhận diện đúng định dạng JSON
            },
            body: JSON.stringify(data) // Chuyển Object JavaScript thành chuỗi JSON
        });

        // Đọc phản hồi trả về từ API
        const result = await response.json();

        if (response.ok) {
            console.log(" Chúc mừng! API phản hồi thành công:");
            console.log(result);
        } else {
            console.error(" Có lỗi xảy ra từ phía API (Status:", response.status, "):");
            console.error(result);
        }

    } catch (error) {
        // Lỗi kết nối, sai URL hoặc lỗi CORS nếu có
        console.error(" Lỗi kết nối đến API:", error.message);
    }
}

// Chạy hàm test
//testSaveDataApi();
