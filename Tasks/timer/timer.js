const { ipcRenderer } = require('electron');

let timedata = null;
let win = null;
let winId = null;

// 接收传递过来的数据
ipcRenderer.on('ping', (event, message) => {
  win = event;
  winId = event.senderId;
  timedata = window.getTimerData(message);
})

window.getTimerData = function(data=''){
  var val = timedata || data;
  return val;
}

window.sendMainMessage = function(messageSign, data = {}) {
  ipcRenderer.sendTo(winId, messageSign, JSON.stringify(data));
}
