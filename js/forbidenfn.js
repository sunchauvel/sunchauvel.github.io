//禁用F12
document.onkeydown = function(){
  if(window.event && window.event.keyCode == 123) {
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      alert("怎么能随随便便想扒人家的底裤呢？坏！");
      event.keyCode=0;
      event.returnValue=false;
  }
  if(window.event && window.event.keyCode == 13) {
      window.event.keyCode = 505;
  }
  if(window.event && window.event.keyCode == 8) {
      alert(str+"\n请使用Del键进行字符的删除操作！");
      window.event.returnValue=false;
  }
}

//禁用右键
document.oncontextmenu = function (event){
if(window.event){
event = window.event;
}try{
var the = event.srcElement;
if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")){
return false;
}
return true;
}catch (e){
return false;
}
}

//禁用粘贴
document.onpaste = function (event){
if(window.event){
event = window.event;
}try{
var the = event.srcElement;
if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")){
return false;
}
return true;
}catch (e){
return false;
}
}

//禁用复制
document.oncopy = function (event){
if(window.event){
event = window.event;
}try{
var the = event.srcElement;
if(!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")){
return false;
}
return true;
}catch (e){
return false;
}
}

//禁用剪切
document.oncut = function (event){
if(window.event){
event = window.event;
}try{
var the = event.srcElement;
if(!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")){
return false;
}
return true;
}catch (e){
return false;
}
}

//禁用选中
document.onselectstart = function (event){
    if(window.event){
    event = window.event;
    }try{
    var the = event.srcElement;
    if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")){
    return false;
    }
    return true;
    } catch (e) {
    return false;
    }
    }