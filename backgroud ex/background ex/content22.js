
 
 // Gửi một tin nhắn đơn giản
chrome.runtime.sendMessage({ 
    action: "test", 
    data: "Xin chào từ Popup!" 
}, (response) => {
    // Đây là hàm callback nhận kết quả trả về từ background (nếu có)
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
    } else {
        console.log("Background trả lời:", response);
    }
});
