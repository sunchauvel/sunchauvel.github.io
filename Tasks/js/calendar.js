// ① DOM对象以o开头const声明 -> 末尾按钮用Btn 文本用Txt 列表按实际Ul|Ol|Dl 输入框用In => 按钮面板用Part （MK-表后期生成）
// ② 变量命名 tmp|tmp|tmmp|叠词开头的表过渡量，len|length，idx|index，
// ③ 函数命名 
// 动+名词->纯功能的|底层的加Fun， hide switch format choose jump  add 介词to for of 
// 名+动词->展示用Show  
// 注意：函数参数里带e表用到了点击的对象来判断-需区分好

// 项的添加（安全性-非标签非代码，格式化-准确格式非链接，禁止重复添加，展示-前后嵌入对数据结构的考虑）
// 项的删除（重点考虑结构，考虑显示的变化）
// 最好总报是点击之后才进行全新的渲染
const odateTxts = toGet('.dateTxt', true); // 年月文本
const ocalendarUl = toGet('.calendarUl'); // 具体内容ul
const ocalendarCountTxts = toGet('.calendarCountTxt', true); // 归纳文本
const ocalendarDetailUl = toGet('.calendarDetailUl'); // 具体内容ul
const ogetCalendarDateIn = toGet('.getCalendarDateIn'); // 年月输入框
const owriteCalendarIn = toGet('.writeCalendarIn'); // 日历签输入框

const ocalendarTypePart = toGet('.calendarTypePart'); // 【面板】类型选择按钮  =>选中值为 dcalendarType
const ochooseMonthBtns = toGet('.chooseMonthBtn', true); // 上个月、下个月按钮
const ocalendarSignPartMK = toGet('.calendarSignPartMK'); // 【变动面板】已用本月标签显示
const oyearTypePart = toGet('.yearTypePart'); // 【面板】总报类型选择按钮   =>选中值为 dyearType
const osortCalendarBtn = toGet('.sortCalendarBtn'); // 顺序按钮   =>选中值为  dsortType （'0'为逆序 '1'为顺序）
const odelCalendarBtn = toGet('.delCalendarBtn'); // 删除按钮
const omoreDelPart = toGet('.moreDelPart'); // 【面板】删除按钮


const vacation2023 = { // 每年要改
  'relax': ['01-02', '01-23', '01-24', '01-25', '01-26', '01-27', '04-05', '05-01', '05-02', '05-03', '06-22', '06-23', '09-29', '10-02', '10-03', '10-04', '10-05', '10-06'],
  'work': ['01-28', '01-29', '04-23', '05-06', '06-25', '10-07', '10-08'],
  '2023-01-01': '元旦',
  '2023-01-22': '春节',
  '2023-04-05': '清明',
  '2023-05-01': '劳动',
  '2023-06-22': '端午',
  '2023-09-29': '中秋',
  '2023-10-01': '国庆'
};

let nameforCA = {
  hobbit: [0, '习惯'], 
  count: [1, '收入'], 
  cost: [2, '支出'], 
  special: [3, '特殊']
};


let calendarData = localGet('calendar', 'object') || {};
let hobbitData = localGet('calendarHobbit', 'object') || {};
let specialTotalObj = {'期物': []};  // 总报中特殊区域的数据
txtData['willOverdueTxt'] = calendarData['special'] && calendarData['special'][nextYM] && calendarData['special'][nextYM]['sign'] && calendarData['special'][nextYM]['sign']['期物'] ? calendarData['special'][nextYM]['sign']['期物'] :'';
ocalendarTypePart.onclick = switchCalendarType;
oyearTypePart.onclick = switchCalendarType;
const toYearBtns = toGet('.yearBtn', true);
toYearBtns[0].onclick = switchCalendarType; // 总报按钮-进入总报
toYearBtns[1].onclick = switchCalendarType; // 总报按钮-进入总报
toGet('.backtoCalendarBtn').onclick = function() { // 回到日历签-退出总报
  toMainSquare(5);
}

function switchCalendarType(e) { // 切换习惯、收入、支出、特殊
  let event = e || window.event;
  let ele = event.target || event.srcElement;
  if (ele.tagName === 'EM' && !ele.classList.contains('active')) { // 类型发生变化
    let type = ele.getAttribute('data-type');
    if (ele.parentElement.className === 'yearTypePart') { // 总报里的切换
      dyearType = type;
      toActiveCalendar('year', dyearType);
      yearCalendarShow(year + '', dyearType);
    } else {
      dcalendarType = type;
      toActiveCalendar('calendar', type);
      nowCalendarShow();
    }
 
  } else if (ele.classList.contains('yearBtn')) { // 点击总报按钮进入
    toMainSquare(7);
    dyearType = dcalendarType;
    toActiveCalendar('year', dyearType);
    yearCalendarShow(year + '', dyearType);
  }
}

function toActiveCalendar(partType='calendar', type){ //界面辅助信息在切换时的跟进
  let o = partType === 'year'? oyearTypePart : ocalendarTypePart;
  let oems = o.querySelectorAll('.cbtn');
  
  for (let i = 0; i < oems.length; i++) {
    oems[i].classList.remove('active');
  }
  if(partType === 'calendar'){ 
    if (type === 'count') {
      owriteCalendarIn.setAttribute('placeholder', '标签+xxh&xx(xx为数值)');
    } else if (type === 'cost') {
      owriteCalendarIn.setAttribute('placeholder', '标签+内容(数值间用非空格隔开)');
    } else if (type === 'hobbit') {
      owriteCalendarIn.setAttribute('placeholder', '标签+触发场景 日期');
    } else {
      owriteCalendarIn.setAttribute('placeholder', '标签+内容 日期');
    }
    if (omoreDelPart.classList.contains('active')) {
      delCalendarPartShow(null, 'cancel');
    }
  }
  
  oems[nameforCA[type][0]].classList.add('active');
  toGet('.morepart-notebox').setAttribute('data-type', nameforCA[type][1]); // 右下角文本提醒
}

ochooseMonthBtns[0].onclick = function() { // 减1个月
  nowCalendarShow('subtract');
}
ochooseMonthBtns[1].onclick = function() { // 加1个月
  nowCalendarShow('add');
}
toGet('.dateChange').onclick = function() { // 点击年月激活日历输入
  ogetCalendarDateIn.value = odateTxts[0].innerText + '-' + odateTxts[1].innerText;
  ogetCalendarDateIn.classList.add('show');
  ogetCalendarDateIn.focus();
}
toGet('.backToTodayBtn').onclick = function() {// 回到今天
  nowCalendarShow('now');
  ogetCalendarDateIn.classList.remove('show');
}
ogetCalendarDateIn.onblur = function() { // 失去焦点后日历输入
  let val = ogetCalendarDateIn.value.trim();
  if (/^[1-9][\d]{3}-(0[1-9]|1[0-2])$/.test(val)) {
    let idx = val.indexOf('-');
    let y = val.slice(0, idx);
    let m = val.slice(idx + 1) * 1;
    chooseCalendarShow(dcalendarType, y, m);
    ogetCalendarDateIn.classList.remove('show');
  } else if (val === '') {
    nowCalendarShow('now');
    ogetCalendarDateIn.classList.remove('show');
  }
}
osortCalendarBtn.onclick = function() { // 具体数据排列转换为顺序
  if (osortCalendarBtn.innerText === '顺序') {
    nowCalendarShow('排序', '1');
  } else {
    nowCalendarShow('排序', '0');
  }
}
toGet('.helpCalendarBtn').onclick = function() { // 小贴士
  tellyouTip(tellO['calendarTip'], 'tip');
}

odelCalendarBtn.onclick = delCalendarPartShow;
function delCalendarPartShow(e, type = null) { // 删除面板显示
  // monthDel删除本月 termDel删除本月期物信息 typeDel删除本类型信息，经期用periodDelAll，植物用plantDel，
  if (omoreDelPart.classList.contains('active') || type === 'cancel') { // 执行关闭状态
    odelCalendarBtn.innerText = '删除 ▼';
    odelCalendarBtn.classList.remove('active');
    omoreDelPart.className = 'moreDelPart';
  } else {
    odelCalendarBtn.innerText = '删除 ▲';
    odelCalendarBtn.classList.add('active');
    omoreDelPart.className = 'moreDelPart active';
    if (dcalendarType === 'special') {
      if (calendarData['special']['月经']) {
        omoreDelPart.classList.add('checkpe');
      }
      if (calendarData['special']['植物']) {
        omoreDelPart.classList.add('checkpl');
      }
    }
  }
}
omoreDelPart.onclick = function(e) { // 点击具体的删除按钮
  let event = e || window.event;
  let ele = event.target || event.srcElement;
  if (ele.tagName === 'SPAN') {
    let date = ocalendarUl.lastChild.getAttribute('data-date').slice(0, 7);
    let str = ele.innerText.replace('该类型', '"'+nameforCA[dcalendarType][1]+'" ').replace('该月', ' '+date.slice(-2) * 1+'月 ');
    tellyouTip('【操作】确定' + str + '？', 'calendar', ele.getAttribute('data-name') + ' ' + date);
  }
}

toGet('.writeCalendarBtn').onclick = calendarSaveWrite;
owriteCalendarIn.onkeydown = function(event){
  if (event.keyCode === 13) {
    calendarSaveWrite();
  }
}
function calendarSaveWrite() { // 输入的保存
  getTime();
  let val = owriteCalendarIn.value.replace(/[\s]*/g, '');
  formatCalendarFun(val);
}

toGet('.calendarClearBtn').onclick = function() { // 输入的清空
  owriteCalendarIn.value = '';
}


function nowCalendarShow(type, num) { // 重新渲染当前月份（或上下月）的内容 
  let mstr = odateTxts[1].innerText * 1;
  let ystr = odateTxts[0].innerText * 1;
  if (type === 'add') {
    mstr = mstr !== 12 ? mstr + 1 : 1;
    ystr = mstr !== 1 ? ystr : ystr + 1;
  } else if (type === 'subtract') {
    mstr = mstr !== 1 ? mstr - 1 : 12;
    ystr = mstr !== 12 ? ystr : ystr - 1;
  } else if (type === 'now') {
    if(mstr === month && ystr === year){
      return false;  // 当前日期为最新不需要执行
    }
    mstr = month;
    ystr = year;
    // console.log(year, month);
  }
  if (type === '排序') {
    chooseCalendarShow(dcalendarType, ystr, mstr, num);
  } else {
    chooseCalendarShow(dcalendarType, ystr, mstr);
  }
}
function jumpBackCalendarM(y, m){ // 【MK在HTML】count与cost里月份跳转
  toMainSquare(5);
  dcalendarType = dyearType;
  toActiveCalendar('calendar', dcalendarType);
  chooseCalendarShow(dcalendarType, y, m);
}

function chooseCalendarShow(type, yearstr, monthstr, sortnum = null) { // 日历渲染
  // type分count 与 hobbit,sortnum什么顺序排列
  let sortType = sortnum ? sortnum : dsortType;
  var {
    year,
    month,
    date
  } = getTime();
  let y = yearstr || year;
  let m = monthstr || month;
  let ym = y + '-' + formatDate(m);
  let thisday = ym + '-01';

  let periodObj = (calendarData['special'] && calendarData['special']['月经']) ? calendarData['special']['月经'] : null;
  let periodArr = []; // 每月哪些日子是目的日
  let periodArrTarget = []; // 每月已存档的日子
  
  if (type === 'special' && periodObj) {  // 处理经期数据 -- 述求：记录不往前，只也预测到后三个月，处理平均经期天数
    let numtxtIndex = periodObj['daynum'].indexOf('&');
    let smnum = periodObj['daynum'].slice(0, numtxtIndex) * 1;
    let bignum = periodObj['daynum'].slice(numtxtIndex + 1) * 1;
    let datetxts = periodObj['days'].join('^');
    
    // 前月数据的补充
    let smym = countBetweenDay(thisday, -1, 'countYM'); // 返回前1个月的年月
    if (datetxts.indexOf(smym) !== -1) { // 前一个月存在数据
      let recordBefore = datetxts.substr(datetxts.indexOf(smym), 10);
      let dnum = monthStaticList[recordBefore.slice(-5, -3)] - recordBefore.slice(-2) * 1 - smnum;
      while(dnum < 0){
        periodArr.push(dnum * 1);
        periodArrTarget.push(dnum * 1);
        dnum++; 
      }
    }
    let idxxx = datetxts.lastIndexOf(ym);
    let ddd = ''; // 经期开始日 号数
    if (idxxx === -1) { // ① 无记录 -- 如果属于下三个月的，那么预测
      let tmpnum1 = countBetweenDay(thisday, todayAdd, 'betweenMonth');
      let endIndex = periodObj['days'].length - 1;
      let lastday = periodObj['days'][endIndex];
      let tmpnum2 = countBetweenDay(thisday, lastday, 'betweenMonth');
      if(tmpnum1 < 3 && tmpnum1 >= 0 && tmpnum2 <= 2){ 根据最后记录（限制为最迟2月前）未来3个月数据预测 dddd="countBetweenDay(thisday," lastday, 'betweennum', bignum); 预测下次开始的号数 for(let ii="0;" < smnum; ii++){ periodarr.push(dddd + ii); 展示期间日 } else { ② 有记录 ddd="datetxts.substr(idxxx" 8, 2) * 1; k="0;" k++){ if(monthstaticlist[m+'']>= ddd+k){
          periodArr.push(ddd+k);
          periodArrTarget.push(ddd+k);
        }
      }
      let beforeIdx = datetxts.slice(0, idxxx).lastIndexOf(ym);
      if(beforeIdx !== -1){  // 若本月最前面还有记录
        let dd = datetxts.substr(beforeIdx + 8, 2) * 1;
        for(let l = 0; l < smnum; l++){
          periodArr.push(dd+l);
          periodArrTarget.push(dd+l);
        }
      }
      // 如果当月最后存在预测结果
      let nextday = ddd + bignum;
      for(let ll = 0; ll < smnum; ll++){
        if(monthStaticList[m+''] >= nextday){
          periodArr.push(nextday);
          nextday++;
        }
      }
    }
  }
  
  let plantArr = [];
  let plantStr = (calendarData['special'] && calendarData['special']['植物']) ? calendarData['special']['植物'] : null;
  if (type === 'special' && plantStr) { // 每多少天标注一下 plantStr: 天数&最后日期
    let numIndex = plantStr.indexOf('&');
    let daysnum = plantStr.slice(0, numIndex) * 1;
    let begindate = plantStr.slice(numIndex + 1);
    let mmmm = ym.slice(-2) * 1 + 1;
    let nextMonthdate = mmmm < 13 ? ym.slice(0, 5) + formatDate(mmmm) + '-01' : ym.slice(0, 4) * 1 + 1 + '-01-01';
    // console.log(nextMonthdate)
    if (countBetweenDay(nextMonthdate, begindate, 'betweenNum') > 0) { // 符合指定日期后的才进行
      let ttdddd = begindate;
      while (ttdddd.indexOf(ym) !== 0) {
        ttdddd = countBetweenDay(ttdddd, daysnum, 'afterdays');
      }
      for (let jjj = 0; jjj < 31 / daysnum; jjj++) {
        let dddd = ttdddd.slice(-2) * 1;
        if (ttdddd.indexOf(ym) === 0) {
          plantArr.push(dddd);
        }
        ttdddd = countBetweenDay(ttdddd, daysnum, 'afterdays');
      }
    }

  }

  let html = ''; // 日历上展示
  let detailhtml = ''; // 列表上展示
  let hobbitless = false;
  let detailIndex = -1; // 第几个有效数据
  let dShow = null;
  let todayMoney = 0;
  odateTxts[0].innerText = y;
  odateTxts[1].innerText = formatDate(m);
  toGet('.calendarController').setAttribute('data-month', m);  // 用于展示当前月份背景水印
  let end = new Date(thisday).getDay();
  let space = end;
  // 0-0 1-1 2-2 5-5 6-6
  while (space > 0) {
    html += '<li class="nocursor"></li>';
    space--;
  }
  // {}日期对应打卡内容
  let dakadateobj = localGet('dakadateObj', 'object') ? localGet('dakadateObj', 'object') : {};
  let dCalendar = calendarData ? calendarData[type] : null; // 确定内存有无数据
  if (dCalendar && dCalendar[ym]) {
    dShow = dCalendar[ym]; // 当月有数据
  }

  let isOrNot = {
    period: type === 'special' && periodObj?true:false,
    plant: type === 'special' && plantStr?true:false,
    regular: type === 'special' && dakadateobj?true:false,
    signIt: type === 'special' && dCalendar?true:false
  };
  for (let d = 1; d <= 0 7="==" monthstaticlist[m]; d++) { 该月每日数据处理 let ok="false;" 判断是否为今天 ot="isOrNot['plant']" && plantarr.includes(d)?true:false; 判断是否属于植物日 op="false;" 判断是否属于月经日 theone="false;" 判断是否属于月经第一天 day="formatDate(d);" 小于10含0 ddate="ym" + '-' day; dtemp="[];" 取数据中某天的数据 temp ; detailtemp dddate="ddate.replace(/-/g," ' '); addtype if (d="=" date y="=" year m="=" month) } (isornot['period'] periodarr.includes(d)) (periodobj['days'].join('^').lastindexof(ym) !="=" -1) (periodarrtarget.includes(d)) (isornot['regular'] dakadateobj[dddate]) dtemp.push(dakadateobj[dddate]); 'q'; (isornot['signit'] dcalendar[ddate]) 'd'; (dshow dshow[day]) detailindex++; 'a'; [temp, detailtemp]="dayToCalendarFun(type," ddate, dtemp, ok); ok, addtype, op, ot, theone); addclass="null;" dayordate="d;" if(ddate.slice(0, 4)="==" '2023'){ vacation2023已记录2023年意料外的假期情况 vacadd="ddate.slice(5);" newnum="+day+end;" % || 1) !vacation2023['work'].includes(vacadd) ? 'relax' : (vacation2023['relax'].includes(vacadd) 'work'); if(vacation2023[ddate]){ htmltxt="ok" '<span class="' + (ok ? 'dayActive' : '') + (op ? ' dayPeriod' : '') + (theone ?
      ' active' : '') + (ot ? ' dayPlant' : '') + '">' + dayOrDate + '' : dayOrDate;
   
    html +=
      `<li ${addclass ? 'class=" + addclass : " '} data-date="${ddate}" data-index="${addType.indexOf('a') !== -1 ? detailIndex:-1}" onclick="jumpCalendarDetailM(this)">${temp?temp:htmltxt}</li>`;
    if (detailtemp && type !== 'hobbit') { // 具体数据
      if (sortType === '1') {
        detailhtml = detailhtml +
          `<li ${ok?'class="active" ': ''} title="${ddate}"><div class="day">${day}号</div>${detailtemp}</li>`;
      } else {
        detailhtml =
          `<li ${ok?'class="active" ': ''} title="${ddate}"><div class="day">${day}号</div>${detailtemp}</li>` +
          detailhtml;
      }
    }else if(detailtemp){
      hobbitless = true;
    }
  }
  ocalendarUl.innerHTML = html;
  if(hobbitless && dShow){
    let aaarr = Object.keys(dShow['sign']);
    detailhtml = aaarr.map(function(item){
      return `<li><div class="day">${item} -&gt; ${dShow['sign'][item][0]}次</div></li>`;
    }).join('');
  }
  ocalendarDetailUl.innerHTML = detailhtml;
  ocalendarDetailUl.setAttribute('data-totalnum', detailIndex);
  let hasdata = type === 'count' && dShow && dShow['total'] ? true : false;
  let hasdata2 = type === 'cost' && dShow && dShow['total'] ? true : false;
  let onehour = '';
  let oneday = '';
  let onestr = '';

  if (hasdata) {
    let countIndex = dShow['total'].indexOf('&');
    onehour = (dShow['total'].slice(countIndex + 1) * 1) / (dShow['total'].slice(0, countIndex - 1) * 1);
    oneday = (dShow['total'].slice(countIndex + 1) * 1) / (detailIndex + 1);
    onehour = Math.floor(onehour * 100) / 100;
    oneday = Math.floor(oneday * 100) / 100;
    onestr = dShow['total'] + ' | ' + onehour + '->' + oneday + '）';
    todayMoney = ocalendarDetailUl.getAttribute('data-moneyCount') || 0;
  } else if (hasdata2) {
    oneday = (dShow['total'] * 1) / (detailIndex + 1);
    onestr = dShow['total'] + '，' + oneday + '）';
    todayMoney = ocalendarDetailUl.getAttribute('data-moneyCost') || 0;
  }

  ocalendarCountTxts[2].innerHTML = `${m}月（${detailIndex + 1}天${hasdata ? '，' + onestr:'）'}`;
  ocalendarCountTxts[0].innerText =
    `${hasdata ? m + '月' + '（' + (detailIndex + 1) + '天，'+ dShow['total']+'），当日收入'+todayMoney:''}`;
  ocalendarCountTxts[1].innerText =
    `${hasdata2 ? m + '月' + '（' + (detailIndex + 1) + '天，月支出'+ dShow['total']+'），当日支出'+todayMoney:''}`;

  if (dShow && dShow['sign']) { // 渲染标签 -- 对应月份的
    let signList = Object.keys(dShow['sign']);
    let tempSigns = signList.map(x => '<span class="cbtn" onclick="forCalendarWriteM()">' + x + '</span>');
    ocalendarSignPartMK.innerHTML = tempSigns.join('');
  }

}

function jumpCalendarDetailM(ele) { // 【MK在HTML】某日详情及添加
  // 每项点击显示该天有效数据，修改该天数据
  let index = ele.getAttribute('data-index') * 1;
  let date = ele.getAttribute('data-date');
  // 0-2  1-1   2-0
  let str = date + '】特殊：用+号间隔';
  if (dcalendarType === 'hobbit') {
    str = date + '】习惯：标签+触发场景 ';
  } else if (dcalendarType === 'count') {
    str = date +
      '】收入：标签+工时&薪资 \n\n内容格式(h指小时，m指分钟，*表时薪)：\n xh&xx 或 xm&xx 或 xh&*xx 或 xm&*xx，(x为数值)\n 如 2h&200 或 120m&200 或 2h&*100 或 120m&*100';
  } else if (dcalendarType === 'cost') {
    str = date + '】支出：标签+花费 (需含数值)';
  }
  if(index !== -1){
    str = str + '\n\n' + calendarData[dcalendarType][date.slice(0, 7)][date.slice(-2)].join('\n');
    if(dcalendarType === 'count'){
      str = str + '\n\n' + ele.querySelector('.datehour').title;
    }
    if(dcalendarType === 'cost'){
      str = str + '\n\n' + ele.querySelector('.datecost').title;
    }
  }
  let betweenday = countBetweenDay(date);
  str = '【' + (betweenday < 0 ? -betweenday + '天前 · ' : (betweenday === 0 ? '今天 · ' : betweenday +
    '天后 · ')) + str;
  if (dcalendarType === 'hobbit') {
    tellyouTip(str, 'calendar', date + ' 标签+触发场景（每个标签仅一次）');
  } else {
    tellyouTip(str, 'calendar', date + ' 标签+内容（另：写del表删除当日内容）');
  }

}

/*  */
function dayToCalendarFun(type, ddate, list, istoday = false, addwith = 'none', op, ot, theone) { // 日历渲染之每日数据处理
  // type, ddate, list, istoday = false, addwith = 'none'(a为签到，d为定期), op-是经期, ot-植物, theone-active
  // ddate为日期2022-04-06  daynum为数字-如1， list为内容数组
  // 返回 tem日历内容, detailtem具体项内容
  let sign = '';
  let daynum = ddate.slice(-2) * 1;
  let p = '';
  let money = 0;
  let hour = 0;
  let day = '';
  let newlist = list ? [...list] : [];
  let regularArr = calendarData['special'] ? calendarData['special'][ddate] : [];
  // let hasRegular = && calendarData['special'][ddate];
  // var dakadateobj = localGet('dakadateObj', 'object'); // {}日期对应打卡内容
  // let dddate = ddate.replace(/-/g, '/');
  // let hasDaka = dakadateobj && dakadateobj[dddate];
  // console.log('33', ddate,calendarData)

  newlist.map(function(item) {
    // 每一条数据格式 “锻炼+今天下午4点跑步了”  “晚班+7h&200”
    // 注意点：数据不带空格，工时转换为小时

    let index = item.indexOf('+');
    if (index !== -1 && addwith.indexOf('a') !== -1) { // 日历签项
      let nowsign = item.slice(0, 1);
      let isOverdue = type === 'special' && item.slice(0, 2) === '期物';
      if (sign.indexOf(nowsign) === -1) {
        sign += `<mark class="${isOverdue?'markitBrown':'markit'}">${nowsign}</mark>`;
      }
      p += `<p ${isoverdue?'class="pointcolor" ':''}>${item.replace('+', '  ')}</p>`;
      if (type === 'count') {
        let con = item.slice(index + 1);
        let numlist = con.match(/[\d\.]+/g);
        let a = numlist[0] * 1;
        let b = numlist[1] * 1;
        if (!isNaN(a) && !isNaN(b)) { // 判断为数值
          hour = calcCalendarFun(a, hour, 'add', 'cost');
          money = calcCalendarFun(b, money, 'add', 'cost');
          // 之所以用cost模式相加，因为此处只处理简单数相加，而不是时间金钱同时算
        }
      } else if (type === 'cost') {
        let pretmp = item.slice(index + 1);
        let numarr = pretmp.match(/[\d\.]+/g); // []
        numarr.map(function(x) {
          let num = x * 1;
          if (!isNaN(num)) {
            money = calcCalendarFun(num, money, 'add', 'cost');
          }
        });
      }
    } else if (addwith.indexOf('d') !== -1 && regularArr.includes(item)) { // 定期任务
      let itemsStr = regularArr.join('&');
      if (sign.indexOf('定') === -1) { // 没有才标记，但不代表当天没有第二项了
        let noBirthday = itemsStr.indexOf('生日') === -1 && itemsStr.indexOf('纪念日') === -1;
        sign += `<mark class="markitBlue${noBirthday ? '' : ' date'}">定</mark>`;
      }
      p += '<p class="regularFont">【定期】 ' + item + '</p>';

    } else if (addwith.indexOf('q') !== -1) { // 签到
      if (sign.indexOf('签') === -1) {
        sign += '<mark class="markitBlue">签</mark>';
      }
      p += '<p>【签到】 ' + item + '</p>';
    }
  });

  if(vacation2023[ddate]){
    daynum = vacation2023[ddate];
  }
  if (istoday) {
    day = '<span class="dayActive' + (op ? ' dayPeriod' : '') + (theone ? ' active' : '') + (ot ? ' dayPlant' : '') +
      `">${daynum}</span>`;
    if (type === 'count') {
      ocalendarDetailUl.setAttribute('data-moneyCount', money);
    }
    if (type === 'cost') {
      ocalendarDetailUl.setAttribute('data-moneyCost', money);
    }
  } else {
    day = op || ot ? '<span class="' + (op ? 'dayPeriod' : '') + (theone ? ' active' : '') + (ot ? ' dayPlant' : '') +
      '">' + daynum + '</span>' : daynum;
  }
  let tem = '<div class="datesign">' + sign + '</div>' + day;
  let detailtem = p;
  if (type === 'count' && money) { // 如果是计算工时，那么需要加上工作时间
    tem += '<div class="datehour" title="工作' + hour + 'h，共收入' + money + '">' + hour + 'h</div>';
    detailtem += '<div class="sumTxt">工作' + hour + 'h，收入' + money + '</div>';
  } else if (type === 'cost' && money) {
    tem += '<div class="datecost" title="日常支出：' + money + '">￥' + money + '</div>';
    detailtem += '<div class="sumTxt">日常支出：' + money + '</div>';
  }
  return [tem, detailtem];
}


function hobbitDataFun() { // 习惯项-日期组合--打开习惯总报时
  let obj = calendarData['hobbit'];
  let signList = [];
  let situationList = [];
  hobbitData['period'] = {};
  for (let ym in obj) {
    let signO = obj[ym]['sign'];
    if (signO) {
      for (let sign in signO) {
        signList.push(sign);
        situationList = situationList.concat(signO[sign][1]);
        let dayarr = [...signO[sign][2]].sort(); // 某标签某月的号数数组
        dayarr.map(function(item) { // 每月日期阶段合并
          let nowdate = ym + '-' + item;
          solvedOnePeriod(nowdate, dayarr, sign);
        })
      }
    }
  }
  hobbitData['sign'] = Array.from(new Set(signList));
  hobbitData['situation'] = Array.from(new Set(situationList));
  localSave('calendarHobbit', hobbitData, 'object');
}

function solvedOnePeriod(nowdate, dayarr, sign) { // 把某个日期放入阶段中
  // add单项时，给到日期，该月的号数组合，标签
  // loadding时，给出遍历中最旧的日期，该月的号数组合，标签
  let obj = calendarData['hobbit'];
  let noKeep = true; // 与之前存在的日期并不相邻，不能合并
  let datebefore = countBetweenDay(nowdate, -1, 'afterdays'); // 前一天的完整日期
  let lastDay = datebefore.slice(-2); // 前一天的号数
  let nowDay = nowdate.slice(-2);
  if (nowDay * 1 === 1) { // 判断前一个月有没有继续
    let yymm = datebefore.slice(0, 7);
    if (obj[yymm] && obj[yymm]['sign'] && obj[yymm]['sign'][sign]) {
      let dddayarr = obj[yymm]['sign'][sign][2];
      if (dddayarr.includes(lastDay)) { // 上个月存在
        noKeep = addPeriod(datebefore, nowdate, sign);
      }
    }
  } else if (dayarr.includes(lastDay)) {
    // console.log(`本月存在：把${nowdate}放入${sign}的数组阶段${dayarr}中`)
    noKeep = addPeriod(datebefore, nowdate, sign);
  }
  if (noKeep) {
    if (!hobbitData['period'][sign]) {
      hobbitData['period'][sign] = [];
    }
    hobbitData['period'][sign].push(nowdate.slice(5) + ':1');
  }
}


function addPeriod(datebefore, nowdate, sign) { // 合并日期
  let noKeep = true;
  let sstr = hobbitData['period'][sign].join('^') + '^';
  let findT = datebefore.slice(5) + ':';
  let regexp = new RegExp(findT + '(\\d+)\\^');
  let rrrr = regexp.exec(sstr);
  // console.log(regexp, rrrr);
  if (rrrr && rrrr[1]) {
    let newone = nowdate.slice(5) + ':' + (rrrr[1] * 1 + 1);
    if (hobbitData['period'][sign].length === 1) {
      hobbitData['period'][sign] = [newone];
    } else {
      sstr = sstr.replace(regexp, newone + '^').slice(0, -1);
      hobbitData['period'][sign] = sstr.split('^');
    }
    // console.log(sstr, hobbitData['period'][sign])
    noKeep = false;
  } else {
    // console.log('找不到', regexp, sstr, rrrr);
    // throw Error('数据本存在但因月份排列问题导致现在hobbitData里找不到');
  }
  return noKeep;
}

function forCalendarWriteM(e) { // 【MK在HTML】点击标签后帮助快速填写内容
  let event = e || window.event;
  let ele = event.target || event.srcElement;
  owriteCalendarIn.value = todayAdd + ' ' + ele.innerText + '+';
  owriteCalendarIn.focus();
}

const hideshowSignA = ['▼', '▲'];
function hideHobbitUlM(ele, num, isChild, sign) { // 【MK在HTML】习惯具体触发场景的显隐
  // 点击项的父级加 data-hidename="收缩列表的类名-如某个ul" 
  // ele为this点击项，num为收缩部分的排列序号；
  // isChild表是否是子项类名为btn-show修改符号，以及sign决定 hideshowSignA数组中第几个起作为原始符号
  let name = '.' + ele.parentElement.getAttribute('data-hidename');
  const oparts = toGet(name, true);
  let element = ele;
  if(isChild){
    element = ele.querySelector('.btn-show');
  }
  if (oparts[num].classList.contains('hide')) {
    oparts[num].classList.remove('hide');
    element.innerText = hideshowSignA[sign];
  } else {
    oparts[num].classList.add('hide');
    element.innerText = hideshowSignA[sign + 1];
  }

}

function yearCalendarShow(year, type) { // 总报的各卡片的渲染
  const osummaryTxts = toGet('.summaryTxt', true);
  const oyearConditions = toGet('.yearCondition', true);
  const oyearSummary = toGet('.yearSummary');
  let str = ''; // 最后的HYML
  let nowIndex = 0;
  osummaryTxts[0].innerText = '';
  osummaryTxts[1].innerText = '';
  osummaryTxts[2].innerText = '';
  if(calendarData[type]){
    oyearSummary.classList.remove('hidden');
    if (type === 'count') { // 1. 赚到
      nowIndex = 1;
      let keyArr = Object.keys(calendarData['count']).sort();
      let signArr = []; // 收入构成
      let tmpdays = 0;
      let tmpYear = {
        y: 0,
        m: 0,
        t1: 0,
        t2: 0
      };
      let tmpMax = {
        m: 0,
        h: 0,
        hm: 0,
        d: 0,
        dm: 0,
        month: [0,0,0,0,0]
      };
      for(let i = 0; i <= 1 keyarr.length; i++){ 遍历增多的最后一次用来写小结的 if(keyarr[i] !="=" 'total' || i="==" keyarr.length){ let tyear="keyArr[i]" ? keyarr[i].slice(0, 4) * : tmpyear['y']; if(tmpyear['y'] && (tmpyear['y'] tyear) 开启年小结 str="str" + `<li class="yeardata"><em>${tmpYear['y']}年(总)</em><em class="data">${tmpYear['m']}</em><em class="data">${tmpYear['t1']}小时</em><i> × </i><em class="data">${Math.round(tmpYear['m'] / tmpYear['t1'] * 100) / 100}</em><i> | </i><em class="data">${tmpYear['t2']}天</em><i> × </i><em class="data">${Math.round(tmpYear['m'] / tmpYear['t2'] * 100) / 100}</em>`;
            tmpYear['m'] = 0;
            tmpYear['t1'] = 0;
            tmpYear['t2'] = 0;
            tmpYear['y'] = tyear;
            if(i < keyArr.length){
              str =  str + `<li class="year">${tmpYear['y']}年</li>`;
            }
          }else if(tmpYear['y'] !== tyear){
            tmpYear['y'] = tyear; // 首次添加
            str =  `<ul class="countUl gatherUl"><li class="year">${tmpYear['y']}年</li>`;
          }
          if(keyArr[i]){
            let obj = calendarData['count'][keyArr[i]];
            if(obj && obj['sign']){
              signArr = signArr.concat(Object.keys(obj['sign']));
            }
            let idx = obj['total'].indexOf('&');
            let money = obj['total'].slice(idx + 1) * 1;
            let time1 = obj['total'].slice(0, idx - 1) * 1;
            let time2 = Object.keys(obj).length - 2;  // 注意！！
            let hmoney = Math.round(money / time1 * 100) / 100;
            let dmoney = Math.round(money / time2 * 100) / 100;
            
            str = str + `<li><em class="month" onclick="jumpBackCalendarM(${tmpYear['y']}, ${keyArr[i].slice(-2) * 1})">${keyArr[i].slice(-2) * 1}月</em><em class="data">${money}</em><em class="data">${time1}小时</em><i> × </i><em class="data">${hmoney}</em><i> | </i><em class="data">${time2}天</em><i> × </i><em class="data">${dmoney}</em></li>`;
            tmpYear['m'] = tmpYear['m'] + money;
            tmpYear['t1'] = tmpYear['t1'] + time1;
            tmpYear['t2'] = tmpYear['t2'] + time2;
            tmpdays = tmpdays + time2;
            if(money > tmpMax['m']){
              tmpMax['m'] = money;
              tmpMax['month'][0] = keyArr[i].slice(-2) * 1;
            }
            if(time1 > tmpMax['h']){
              tmpMax['h'] = time1;
              tmpMax['month'][1] = keyArr[i].slice(-2) * 1;
            }
            if(hmoney > tmpMax['hm']){
              tmpMax['hm'] = hmoney;
              tmpMax['month'][2] = keyArr[i].slice(-2) * 1;
            }
            if(time2 > tmpMax['d']){
              tmpMax['d'] = time2;
              tmpMax['month'][3] = keyArr[i].slice(-2) * 1;
            }
            if(dmoney > tmpMax['dm']){
              tmpMax['dm'] = dmoney;
              tmpMax['month'][4] = keyArr[i].slice(-2) * 1;
            }
          }
          
        } else if(keyArr[i] === 'total'){ // 确保total在最后出现
          let obj = calendarData['count'][keyArr[i]];
          let idx = obj.indexOf('&');
          let money = obj.slice(idx + 1) * 1;
          let time1 = obj.slice(0, idx - 1) * 1;
           osummaryTxts[0].innerText = `【收入总额 ${money}】： ${time1}小时->${tmpdays}天=>${keyArr.length -1}个月————月均${Math.round(money / (keyArr.length -1) * 100) / 100}，日均${Math.round(money / tmpdays * 100) / 100}，时均${Math.round(money / time1 * 100) / 100}`;
           osummaryTxts[1].innerText = `【月之最 ${tmpMax['m']}(${tmpMax['month'][0]}月)】： ${tmpMax['h']}小时(${tmpMax['month'][1]}月) ，时均${tmpMax['hm']}(${tmpMax['month'][2]}月)  |  ${tmpMax['d']}天(${tmpMax['month'][3]}月)，日均${tmpMax['dm']}(${tmpMax['month'][4]}月)`; 
           osummaryTxts[2].innerText = '【收入构成】' + [...new Set(signArr)].join('，');
        }
      }
      str += '</ul>';
     
     
    } else if (type === 'cost') { // 2. 花费
      nowIndex = 2;
      let keyArr = Object.keys(calendarData['cost']).sort();
      let tmpYear = {
        year: 0,
        money: 0
      };
      let tmpMax = {
        money: 0,
        month: 0
      };
      let tmpTypeA = []; // 该年的类型
      const costAllO = {};  // 每类的花费汇总
      const monthLeftMoneyA = [];
      for(let i = 0; i <= 1 keyarr.length; i++){ 遍历增多的最后一次用来写小结的 if(keyarr[i] !="=" 'total'|| i="==" keyarr.length){ let ttyear="keyArr[i]" ? keyarr[i].slice(0, 4) * : tmpyear['year']; log(i, tmpyear['year'], ttyear) if(tmpyear['year'] && (tmpyear['year'] || 开启年小结 tmptypea="Object.keys(tmpYear);" tmptypea); str="str" + `<li class="yeardata"><em>${tmpYear['year']}年(总)</em><em class="data">${tmpYear['money']}</em>`;
            for(let k = 0; k < tmpTypeA.length; k++){
              if(tmpTypeA[k] !== 'year' && tmpTypeA[k] !== 'money'){
                str += `<em class="data">${tmpTypeA[k]}-${tmpYear[tmpTypeA[k]]}</em>`;
              }
            }
            str += '';
            tmpYear = {};
            tmpYear['money'] = 0;
            tmpYear['year'] = ttyear;
            if(i < keyArr.length){
              str =  str + `<li class="year">${tmpYear['year']}年</li>`;
            }
          }else if(tmpYear['year'] !== ttyear){
            tmpYear['year'] = ttyear; // 首次添加
            str =  `<ul class="costUl gatherUl"><li class="year">${tmpYear['year']}年</li>`;
          }
          
          if(keyArr[i]){
            let obj = calendarData['cost'][keyArr[i]]; // keyArr[i]年月
            // log(obj, keyArr[i]);
            let costTypeA = obj['sign'] ? Object.keys(obj['sign']) : [];  // 该月的类型
            costTypeA.sort(function(a, b){
              return a.localeCompare(b); // 按拼音排序
            });
            let money = obj['total'] ? obj['total'] * 1 : 0; // 每月总花费
            let earnMoney = 0;
            if(calendarData['count'] && calendarData['count'][keyArr[i]] && calendarData['count'][keyArr[i]]['total']){
              earnMoney = calcCalendarFun(calendarData['count'][keyArr[i]]['total'], '0', 'money', 'count');
            }
            let lockCost = obj['固定支出'] ? calcCalendarFun(obj['固定支出'], '0', 'add', 'cost') : 0;
            let m = keyArr[i].slice(-2) * 1;
            str = str + `<li><em class="month" onclick="jumpBackCalendarM(${tmpYear['year']}, ${m})">${m}月</em><em class="data" ${obj['固定支出']?'title="固定支出：'+obj['固定支出']:''}">${earnMoney}-${money}${lockCost?'-固定'+lockCost:''}</em><i>| </i>`; 
            monthLeftMoneyA.push(earnMoney - money - lockCost + '('+ m +'月)');
            for(let j = 0; j < costTypeA.length; j++){
              let kind = costTypeA[j];
              let tmpMoney = obj['sign'][kind][1];
              let percent = Math.floor(tmpMoney * 1000 / money) / 10;  // 该项在该月的占比
              str += `<em class="data">${kind}${percent}%-${tmpMoney}<i style="width:${percent}%"></i></em>`;
              costAllO[kind] = costAllO[kind] ? costAllO[kind] + tmpMoney : tmpMoney;
              tmpYear[kind] = tmpYear[kind] ? tmpYear[kind] + tmpMoney : tmpMoney;
              tmpMax[kind] = tmpMax[kind] && tmpMax[kind] > tmpMoney ? tmpMax[kind] : tmpMoney;
            }
            str += `</li>`;
            tmpYear['money'] = tmpYear['money'] + money;
            if(money > tmpMax['money']){
              tmpMax['money'] = money;
              tmpMax['month'] = m;
            }
          }
          
        } else if(keyArr[i] === 'total'){ // 确保total在最后出现
          let moneyAll = calendarData['cost']['total'] * 1; // 全部总花费
          let str1 = '';
          let str2 = '';
          for(let item in costAllO){
            str1 = str1 + item + costAllO[item] + ' ';
            str2 = str2 + item + tmpMax[item] + ' ';
          }
           osummaryTxts[0].innerText = '【日常支出总额 ' + moneyAll + '】 - 每类花费：' + str1;
           osummaryTxts[1].innerText = '【月之最 '+ tmpMax['money'] +'('+tmpMax['month']+'月)】 - 每类每月最多花费：' + str2;
           osummaryTxts[2].innerText = '【净剩=收入-日常支出-固定支出】：' + monthLeftMoneyA.join('，');
        }
      }
      str += '</ul>';
      
    } else if (type === 'hobbit') { // 3. 习惯
      let mostThing = {}; // 次数：标签+内容
      let totalTimes = 0; // 总报里所有的次数 => calendarData['hobbit']['total'] || 0
      hobbitDataFun(); // 日期计算
      hobbitSituation(); // 场景计算
      let arr = hobbitData['sign'];
      let obj1 = hobbitData['period'];
      let obj2 = hobbitData['specific'];
      let achieve = []; // 连续21天
    
      for (let i = 0; i < arr.length; i++) {
        let partTimes = 0; // 每项习惯的总次数
        let itemname = arr[i];
        let headstr = '<div class="hobbit-line"><b class="item">' + itemname + '</b>';
        str = str + '<div class="hobbit-wrapper" data-hidename="hobbit-ul" data-index="' + i +
          '"><div class="hobbit-btn" onclick="hideHobbitUlM(this, ' + i + ', true, 0'+
          ')"><span class="btn-show">▼</span><span class="total-times">';
        let itemArr = obj1[itemname];
        for (let j = 0; j < itemArr.length; j++) {
          let date = itemArr[j].slice(0, 5);
          let times = itemArr[j].slice(6) * 1;
          headstr = headstr + '<span class="' + (times > 21 ? 'onecatch' : 'uncatch') + '" data-date="' + date +
            '">' + times + '</span>';
          partTimes += times;
          if(times > 21){
            achieve.push(itemname);
          }
        }
    
        str = str + partTimes + headstr + '</span></div><ul class="hobbit-ul">';
        let sceneArr = obj2[itemname];
        for (let k = 0; k < sceneArr.length; k++) {
          let onetxt = sceneArr[k];
          let oneIndex = onetxt.indexOf('^');
          let ttimes = onetxt.slice(oneIndex + 1);
          let vval = onetxt.slice(0, oneIndex) + '->' + itemname;
          str = str + '<li><span class="times">' + ttimes + '次</span>' + onetxt.slice(0, oneIndex) + '</li>';
          mostThing[ttimes] = mostThing[ttimes] ? mostThing[ttimes] + '，' + vval : vval;
          mostThing['most'] = mostThing['most'] ? Math.max(mostThing['most'], ttimes) : ttimes;
        }
    
        str = str + '</ul></div>';
        totalTimes += partTimes;
      }
      // 渲染到页面
      osummaryTxts[0].innerHTML = '【统计】：（'+arr.join('-')+'）<b>'+ arr.length +'项</b>习惯，共执行<b>' + totalTimes + '</b>次'+
      (achieve.length > 0 ? '，连续坚持21天<b>' + achieve.join('，') + '</b>。' : '。');
      if (totalTimes) {
        osummaryTxts[1].innerHTML = '【分析】：'+ (mostThing['most'] > 3 ? '触发效果最好的是 <b>' +
          mostThing[mostThing['most'] + ''] + '</b>（' + mostThing['most'] + '次）': '还需加把劲，跟寻内心，当下就行动起来吧！');
      }
      osummaryTxts[2].innerHTML = '【提示】：习惯按连续与否记录，日期为连续记录的最后一天，其上或下对应着连续天数。';
    } else if (type === 'special') { // 4. 特殊  经期+期物+其他
      nowIndex = 3;
      // 经期数据 -- 述求：记录不往前，只也预测到后两个月，处理平均经期天数
      let periodA = calendarData['special']['月经'] ? [...calendarData['special']['月经']['days']] : null;
      if (periodA) {
        let tmtxt = calendarData['special']['月经']['daynum'];
        let daystxt = '';
        let avardays = 0;
        let sum = 0;
        let peALen = periodA.length - 1;
        if (peALen > 0) { // 目前至少两个数据
          for (let pp = 0; pp < peALen; pp++) {
            let bee = countBetweenDay(periodA[pp + 1], periodA[pp], 'betweenNum');
            daystxt += ',' + (bee >= 35 || bee <= 21 ? '【' + bee '】' : bee); sum } let monthlen="countBetweenDay(periodA[peALen]," perioda[0], 'betweenmonth'); 平均经期天数需要考虑不连续的部分 avardays="monthlen" < pealen math.floor(sum pealen) monthlen); else { osummarytxts[1].innertext="`【经期】：已有实际数据${peALen" 1}条，平均经期天数为${avardays}(已定${tmtxt})${daystxt '\n (' daystxt.slice(1) ')' ''}`; 签到天数 定期数据 dakadate="localGet('dakadate'," 'object') || []; osummarytxts[0].innertext="`【引用】：签到${dakadate.length}天，定期任务共${txtData['regularNum']}条。`;" 期物+等其他标签 if(tmplistentime['specialchange']> tmpListenTime['specialFresh']){
        tmpListenTime['specialFresh'] = Date.now();
        tmpListenTime['specialChange'] = 0;
        // console.count('特殊总报总数据执行');
        let keyArr1 = Object.keys(calendarData['special']).sort();
        specialTotalObj = {'期物': []};
        for(let k = 0; k < keyArr1.length; k++){ // allArr获取全部数据
          let key = keyArr1[k];
          if(key.length === 7){
            let oobj = calendarData['special'][key];
            for(let day in oobj){
              if(day !== 'sign'){ // oobj[day]为数据数组
                let tempArr = oobj[day];
                for(let l = 0; l < tempArr.length; l++){
                  let idx = tempArr[l].indexOf('+');
                  let sign = tempArr[l].slice(0, idx);
                  let item = tempArr[l].slice(idx + 1);
                  if(sign === '期物'){
                    let ddate = key + '-' + day;
                    if(new Date(todayAdd) > new Date(ddate)){
                      item = '<li class="pass">' + ddate + ' ' + item+ '</li>';
                    }else{
                      item = '<li>' + ddate + ' ' + item+ '</li>';
                    }
                  }else{
                    item = '<li>' + item + '</li>';
                  }
                  if(specialTotalObj[sign]){
                    specialTotalObj[sign].push(item);
                  }else{
                    specialTotalObj[sign] = [item];
                  }
                }
              }
              
            }
          }
        }
        let tmpArr = Object.keys(specialTotalObj).map(function(item, index){
          return '<span class="sign" data-index="'+index+'">' + item + '</span>';
        });
        let signstr = tmpArr.slice(1).join('');
        str = '<div class="totalSignList" data-index="0" onclick="getSpecialData(event)">【标签集合】：<span class="sign active" data-index="0">期物</span>'+signstr+'</div><ul class="special-ul">';
        str += specialTotalObj['期物'].length > 0 ? specialTotalObj['期物'].join('') : ''; 
        str += '</ul>';
        txtData['specialTotalStr'] = str;
      }
      str = txtData['specialTotalStr'];
      osummaryTxts[2].innerText = calendarData['special']['植物'] ? '【植物】：上次浇水时间为 '+calendarData['special']['植物'].slice(-10) : '';
    }
  }else{
    oyearSummary.classList.add('hidden');
  }
  
  
  let oldIndex = toGet('.yearsection-wrapper').getAttribute('data-index') * 1;
  if (nowIndex !== oldIndex) {
    oyearConditions[oldIndex].classList.remove('active');
    toGet('.yearsection-wrapper').setAttribute('data-index', nowIndex);
  }
  oyearConditions[nowIndex].innerHTML = str;
  oyearConditions[nowIndex].classList.add('active');
}

function getSpecialData(e){ 
  let ele = e.target;
  if(ele.nodeName === 'SPAN'){
    let key = ele.innerText;
    ele.classList.add('active');
    let parent = ele.parentElement;
    let old = parent.getAttribute('data-index') * 1;
    parent.querySelectorAll('.sign')[old].classList.remove('active');
    parent.setAttribute('data-index', ele.getAttribute('data-index'));
    let str = specialTotalObj[key].join('');
    toGet('.special-ul').innerHTML = str;
  }
}

function hobbitSituation() { // 计算触发场景次数 --打开习惯总报时
  // 外引函数 countMany localSave
  let arr = hobbitData['sign'];
  let obj = calendarData['hobbit'];
  let obj2 = {}; // 获得某习惯的所有的触发场景 以hobbitData['situation']作参考
  // console.log(obj, hobbitData['situation']);
  let content = {}; // 作为所有场景前带^的组合
  for (let ym in obj) { // 每个月
    if (obj[ym] && obj[ym]['sign']) { // 有值
      let signObj = obj[ym]['sign'];
      for (let signItem in signObj) { // 每月的习惯项
        // 当signObj为 空或undefined 时下面不执行
        if (!obj2[signItem]) {
          obj2[signItem] = [];
        }
        content[signItem] = (content[signItem]?content[signItem]:'')+ ' ^' + signObj[signItem][1].join(' ^');
      }
    }
  }
  for(let i = 0; i < arr.length; i++){
    obj2[arr[i]] = countManyFun(content[arr[i]], hobbitData['situation']);
  }
  hobbitData['specific'] = obj2;
  localSave('calendarHobbit', hobbitData, 'object');
}

function countManyFun(longstr, refer){ // 字符串中每项重复次数
  // 把longstr中相同的部分组合在一起---每项格式以AAA为例"^AAA "，refer为组合参考项，最后返回数组
  let arr = [];
  let count = 0;
  let str = longstr + ' ';
  for(let i = 0; i < refer.length; i++){
    let regex = new RegExp('\\^' + refer[i] + '\\s', 'g');
    let list = str.match(regex);
    if(list){
      count += list.length;
      arr[arr.length] = refer[i] + '^' + list.length;
    }
    if(count >= longstr.replace(/[^\^]/g, '').length){
      break;
    }
  }
  return arr;
}

function formatCalendarFun(val, tmdate = null, end=null) { // 输入的格式判断
  // 删空格，划分标签、内容、日期(判断正确性)，工时格式h&
  let ok = isSaveItem(val, null);
  let date = tmdate ? tmdate : '';
  if (!tmdate) {
    if (regexDate.test(val) || regexDateFront.test(val)) { // 1.写了日期
      let ddate = regexDate.exec(val) || regexDateFront.exec(val);
      if (isDate(ddate[1], ddate[2], ddate[3])) {
        date = ddate[0];
        val = val.replace(date, '');
      } else {
        ok = false;
      }
    } else if (!/[\d]{4}-[\d]{2}-[\d]{2}/.test(val)) { // 没写日期-默认今天
      date = todayAdd;
    } else {
      ok = false;
    }
  }

  let idx = val.indexOf('+');
  let ym = date.slice(0, 7);
  let day = date.slice(-2);
  if (idx !== -1 && ok) {
    let sign = val.slice(0, idx).trim();
    let finalTxt = val.slice(idx + 1).trim();
    if (dcalendarType === 'hobbit' && calendarData['hobbit'][ym]) {
      let oosign = calendarData['hobbit'][ym]['sign'];
      if (oosign && oosign[sign] && oosign[sign][2].includes(day)) {
        ok = false;
        if(tellyoubox.classList.contains('active')){
          tellyoubox.querySelector('input').value = '(每天不可添加重复标签)';
        }else{
          tellyouTip(tellO['helpHobbit'], 'tip');
        }
      }
    }
    if (dcalendarType === 'count' && !/^[\d]+[\.]?[\d]*(h|m)&[*]?[\d]+[\.]?[\d]*$/.test(finalTxt)) {
      ok = false;
    }
    if (dcalendarType === 'cost' && !/[\d]+/.test(finalTxt)) {
      ok = false;
    }
    if (dcalendarType === 'special' && sign === '月经') {
      // tellyouTip(tellO['notUpdate'], 'tip');
      // return false;
      let index = finalTxt.indexOf('&');
      if (index !== -1) {
        let vala = finalTxt.slice(0, index);
        let valb = finalTxt.slice(index + 1);
        if (!/^[\d]{1}&[\d]{2}$/.test(finalTxt)) { // 错误格式
          ok = false;
          tellyouTip(tellO['wrongPeriod'], 'tip');
        }else if(vala < 3 || vala > 8 || valb < 21 || valb > 35 ){ // 再次确认是否数据错误
          if(end !== 'okPeriodVal'){
            ok = false;
            tellyouTip(tellO['wrongPeriod'], 'okPeriodVal', date+'月经+'+finalTxt);
          }
        }
      } else if (!(calendarData['special']['月经'] && calendarData['special']['月经']['daynum'])) {
        ok = false;
        tellyouTip(tellO['wrongPeriod'], 'tip');
      }
    } else if (dcalendarType === 'special' && sign === '植物'){
      if(isNaN(finalTxt * 1)){
        ok = false;
      }
    }
    if (ok) {
      addCalendarDataFun(sign, finalTxt, date);
    }else{
      if (dcalendarType === 'count') { // 工时格式错误提醒
        tellyouTip(tellO['wrongCount'], 'tip');
      } else if (dcalendarType === 'cost') { // 记账格式错误提醒
        tellyouTip(tellO['wrongCost'], 'tip');
      }
    }
    return ok;
  } else if (idx === -1 && ok) {
    tellyouTip(tellO['wrongForm'], 'tip');
  } else if (!day && ok) {
    tellyouTip(tellO['wrongDate'], 'tip');
  } else if (!ok){
    tellyouTip(tellO['wrongContent'], 'tip');
  }

}

function calcCalendarFun(a, b, type = 'add', who) { // 工时相加 、支出运算
  let alist = (a+'').match(/[\d]+[\.]?[\d]*/g);
  let blist = (b+'').match(/[\d]+[\.]?[\d]*/g);
  // log(alist, blist, who)
  if(who === 'count'){
    let time = 0;
    let money = 0;
    let a0 = alist[0] * 100;
    let a1 = alist[1] * 100;
    let b0 = blist[0] * 100;
    let b1 = blist[1] * 100;
    if (type === 'subtract') {
      time =  Math.round(a0 - b0);
      money = Math.round(a1 - b1);
      return (time / 100) + 'h&' + (money / 100);
    } else if(type === 'add'){
      time =  Math.round(a0 + b0);
      money = Math.round(a1 + b1);
      return (time / 100) + 'h&' + (money / 100);
    } else if(type === 'money'){
      return a1 / 100;
    }
  }else if(who === 'cost'){ // 花费
    // 数组用reduce方法，当里面只有一项的时候，结果为此项
    let sum1 = alist && alist.length > 1 ? alist.reduce((a,b) => a * 100 + b * 100) : alist[0] * 100;
    let sum2 = blist && blist.length > 1 ? blist.reduce((a,b) => a * 100 + b * 100) : blist[0] * 100;
    // log('ddd', alist, blist, sum1, sum2)
    if (type === 'subtract') {
      return Math.round(sum1*1 - sum2*1) / 100;
    } else if(type === 'add'){
      return Math.round(sum1*1 + sum2*1) / 100;
    }
  }
  
}

function middleCompute(type, txt){
  let money = 0;
  if(type === 'cost'){
    // 此处取txt字符串中的数值部分组成数组numarr
    let numarr = txt.match(/[\d]+[\.]?[\d]*/g); // match 不到为 null
    if (numarr) {
      numarr.map(function(x) {
        let num = Math.round(x * 100);
        if (!isNaN(num)) {
          money += num;
        }
      });
      log(numarr, money)
      money = money / 100;
    }
  }
  return money;
}

function addCalendarDataFun(sign, txt, date) { // 【单项保存】 输入前删空格，验证格式：工时格式h&
  // 标签 内容 日期xxxx-xx-xx  整理return
  let endOK = false; // 确定添加
  let ym = date.slice(0, 7); // 年月
  let day = date.slice(-2); // 日
  if (!calendarData[dcalendarType]) {
    calendarData[dcalendarType] = {};
  }
  let obj = calendarData[dcalendarType][ym] || {}; // 某月数据
  let objTotal = calendarData[dcalendarType]['total'];
  let osign = obj && obj['sign'] ? obj['sign'] : {};
  if(dcalendarType === 'cost' && txt){
    if (sign === '固定支出') { // 特殊项保存 == 供总报与预算使用
      obj[sign] = txt;
      calendarData['cost'][ym] = obj;
      endOK = 'lockCost';
    }else{
      // 处理支出的钱
      let tmpmoney = middleCompute('cost', txt);
      // 处理 total
      obj['total'] = obj['total'] ? calcCalendarFun(obj['total'], tmpmoney, 'add', 'cost') : tmpmoney;
      objTotal = objTotal ? calcCalendarFun(objTotal, tmpmoney, 'add', 'cost') : tmpmoney;
      // 处理 sign
      if(osign[sign]){
        let list = [];
        list[0] = osign[sign][0] + 1;
        list[1] = osign[sign][1] + tmpmoney;
        osign[sign] = list;
      }else{
        osign[sign] = [1, tmpmoney];
        drawSign(sign);
      }
      obj['sign'] = osign;
      endOK = true;
    }
  }
  
  if(dcalendarType === 'count' && txt){
    // 处理金钱工资计算
    let idx = txt.indexOf('&');
    let money = txt.slice(idx + 1);
    let tmpmoney = 0; // 每项花费的钱
    let time = '';
    if (/m/.test(txt)) { // 工时转换为小时  一位小数
      let min = txt.slice(0, txt.indexOf('m'));
      time = Math.round(min * 1 / 6) / 10;
    } else if (/h/.test(txt)) {
      time = Math.round(txt.slice(0, idx - 1) * 10) / 10;
    }
    
    if (/^\*/.test(money)) { // 支持算出总收入 两位小数
      money = Math.round(money.slice(1) * 100 * time) / 100;
    } else {
      money = Math.round(money * 100) / 100;
    }
    tmpmoney = money;  
    
    if (!isNaN(time) && !isNaN(money)) { // 判断为数值
      txt = time + 'h&' + money;
    } else {
      txt = null;
      tellyouTip(tellO['wrongCount'], 'tip');
    }
    
    // 处理total
    obj['total'] = obj['total'] ? calcCalendarFun(obj['total'], txt, 'add', 'count') : txt;
    if (objTotal) {
      objTotal = calcCalendarFun(objTotal, txt, 'add', 'count');
    } else {
      objTotal = txt;
    }
    // 处理 sign
    if(osign[sign]){
      let list = [];
      list[0] = osign[sign][0] + 1;
      list[1] = osign[sign][1] + tmpmoney;
      osign[sign] = list;
    }else{
      osign[sign] = [1, tmpmoney];
      drawSign(sign);
    }
    endOK = true;
    obj['sign'] = osign;
  }
  
  if(dcalendarType === 'hobbit' && txt){
    if (osign[sign]) {
      let num = osign[sign][0] + 1;
      let arr = osign[sign][1].concat(txt);
      let arr1 = osign[sign][2].concat(day);
      osign[sign] = [num, arr, arr1];
    } else { // 第一次
      osign[sign] = [1, [txt], [day]];
      drawSign(sign);
    }
    endOK = true;
    objTotal = objTotal ? objTotal * 1 + 1 : 1;
    obj['sign'] = osign;
  }
  
  if(dcalendarType === 'special'){
    if(sign === '月经'){ // 格式 月经+ 或 月经+4&29
      let ooobj = calendarData[dcalendarType]['月经'] || {};
      ooobj['daynum'] = txt ? txt : ooobj['daynum'];
      ooobj['days'] = ooobj['days'] ? [...new Set(ooobj['days'].concat(date))].sort() : [date];
      calendarData[dcalendarType]['月经'] = ooobj;
      endOK = 'only';
      // console.log('addCalendarDataFun', ooobj, calendarData);
    }else if(txt){
      if(sign === '植物' && !isNaN(txt * 1)) { // 格式 植物+12
        calendarData[dcalendarType]['植物'] = txt * 1 + '&' + date;
        endOK = 'only';
      }else if(sign !== '植物'){
        if(!osign[sign]){
          drawSign(sign);
        }
        if(sign === '期物'){ // 格式 期物+物品？？？
          osign[sign] = osign[sign] ? osign[sign] + '，' + txt : txt;
          if(nextYM === ym){
            toGet('.willOverdueTxt').innerText =`下个月会过期的有：${osign[sign]}`;
            txtData['willOverdueTxt'] = osign[sign];
          }
        }else{ // 其他项
          osign[sign] = osign[sign] ? osign[sign] + 1 : 1;
        }
        endOK = true;
        obj['sign'] = osign;
      } 
    }
    
  }
  
  // 保存数据
  if(endOK){
    if(endOK !== 'only'){ // 一般项
      if(endOK !== 'lockCost'){
        let list = obj[day] ? obj[day] : [];
        list.push(sign + '+' + txt);
        obj[day] = list;
      }
     
      calendarData[dcalendarType][ym] = obj;
      calendarData[dcalendarType]['total'] = objTotal;
      if(dcalendarType === 'special'){
        tmpListenTime['specialChange'] = Date.now();
      }
    }
    localSave('calendar', calendarData, 'object');
    
    owriteCalendarIn.value = '';
    nowCalendarShow();
  }
  
  function drawSign(sign){
    let ospan = document.createElement('span');
    ospan.classList.add('cbtn');
    ospan.innerText = sign;
    ospan.onclick = forCalendarWriteM;
    ocalendarSignPartMK.appendChild(ospan);
  }
}</=></div></=></=></=></=>