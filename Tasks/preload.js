const { readFileSync, writeFileSync} = require('fs');
const { ipcRenderer } = require('electron');

let path = utools.getPath('userData') + '\\database\\Doit.json';

window.readConfig = function (type) {  // 读
  // utools.shellBeep(); // 不响
  if(type === '同步'){
    let dbdata = utools.db.get("doit")?utools.db.get("doit"):null;
    if(dbdata){
      return [dbdata['data'], path];
    }else{
      return [false, path];
    }
  }else{
    try{
      const data = readFileSync(path);
      return [data, path];
    }catch(err){
      console.error(err);
      return [false, path];
    }
  }
}

window.writeConfig = function (content) {  // 写
  try {
    // ① 存本地
    const data = writeFileSync(path, content); 
    // ② 存用户处
    let rev = utools.db.get("doit")?utools.db.get("doit")['_rev']:null;
    if(rev){
      utools.db.put({
        _id: "doit",
        data: content,
        _rev: rev
      });
    }else{
      utools.db.put({
        _id: "doit",
        data: content
      });
    }
    
  } catch (err) {
    console.error(err);
  }
}

window.showtimer = function(obj){
  // 开启渲染进程使用node  nodeIntegration: true,
  // 开启渲染进程使用remote  enableRemoteModule: true,
  // 背景透明注意三个值 backgroundColor transparent frame
  const tipWindow = utools.createBrowserWindow('/timer/timer.html', {
    show: false,
    title: '计时提示窗口',
    width: 260,
    minHeight: 120,
    useContentSize: true,
    backgroundColor: '#00000000',
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences:{
      preload: '/timer/timer.js',
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false, 
      devTools: true
    }
    
  },() => {
    utools.simulateKeyboardTap('d', 'ctrl'); // 插件分离 ctrl+d
    tipWindow.show(); // 显示
    utools.hideMainWindow();
    // tipWindow.webContents.send('ping', obj);
    ipcRenderer.sendTo(tipWindow.webContents.id, 'ping', obj); // 发送
    
    ipcRenderer.on('close', (event, message) => { // 接收
      if(tipWindow.webContents.id === event.senderId){
        tipWindow.close();  // 强制关闭 tipWindow.destroy();
      }
    })
    
    tipWindow.executeJavaScript('fetch("https://jsonplaceholder.typicode.com/users/1").then(resp => resp.json())')
    .then((result) => {
      console.log(result) // Will be the JSON object from the fetch call
      
    })
    // tipWindow.setAlwaysOnTop(true); // 置顶
    // tipWindow.setFullScreen(true); // 窗口全屏
    utools.outPlugin();
    
  });
  
  // 打开调试模式（注意开启了之后，背景透明和圆角都不会生效）
  // tipWindow.webContents.openDevTools();
  
};

window.openUtools = function(){
  utools.simulateKeyboardTap('down', 'meta'); // 最小化  win+↓
  // setTimeout(function(){
  //   utools.showMainWindow();  // 没效果？
  //   utools.simulateKeyboardTap('enter', 'alt'); // 不可以
  // }, 600);
}
window.separateWin = function(){
  // 无效 --  插件分离 ctrl+d  ？ 目前只提醒等用户手动
  utools.showMainWindow(); // 无用。。。
  utools.simulateKeyboardTap('d', 'ctrl'); 
  // console.log('ddd')
}