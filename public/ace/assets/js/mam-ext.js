
jQuery(function($){$(document).tooltip({show:{effect:"slideDown",delay:1000}});});function confirmMsg(content,title,button,callBack){if(title){if($.type(title)==="function"){callBack=title;}else{$("#mainModelTitle").text(title);}}
if(content){if($.type(content)==="function"){callBack=content;}else{$("#mainModelContent").text(content);}}
if(button){if($.type(button)==="function"){callBack=button;}else{$("#mainModelButton1").html(button);}}
$("#showModal").modal("show");$("#mainModelButton1").off('click').bind('click',function(){callBack();});$("#mainModelButton2").off('click').click(function(){$("#mainModelTitle").text("提示");$("#mainModelContent").text("？");$("#mainModelButton1").html("确定");});}
function loadNoticeAlert(){$.ajax(__webroot__+'other/loadNoticeAlert.htm',{}).done(function(data){if(data.showable&&!!data.rows){var w_width=($(window).width()-90)+"";var w_height=($(window).height()-370)+"";var noticeMsg,copyrightMsg=[];for(var row in data.rows){switch(parseInt(data.rows[row].type)){case 0:!isNoEmpty(noticeMsg)?(noticeMsg=data.rows[row]):'';break;case 1:copyrightMsg.push(data.rows[row]);break;}}
var copyrightContent;if(copyrightMsg.length>0){copyrightContent=createNoticeTableAlert(copyrightMsg,{ignore:noticeTableAlertIgnoreBtnCallback,close:noticeTableAlertCloseBtnCallback,tabbtn:noticeTableAlertTabBtnCallback},w_width,w_height);}
var $modal;if(isNoEmpty(noticeMsg)){var noticeContent=createNoticeAlert(noticeMsg,noticeAlertBtnCallback,w_width,w_height);$modal=promptModal({body:noticeContent},null,null,true);$modal.one('hide.bs.modal',function(){if(isNoEmpty(copyrightContent)){var $copyrightModal=promptModal({body:copyrightContent},null,null,true);}});}else{if(isNoEmpty(copyrightContent)){var $copyrightModal=promptModal({body:copyrightContent},null,null,true);}}}});}
function noticeTableAlertIgnoreBtnCallback(event){event.stopPropagation();var $noticeTable=$(event.target).closest('div.modal').find('table');var noticeIds=[];$.each($noticeTable.find('tr[data-noticeid]'),function(k,v){var nis=$(v).attr('data-noticeid');if(/^[0-9]+$/.test(nis)){noticeIds.push(parseInt(nis));}});if(noticeIds.length>0){readNoticeCallback(noticeIds);}
$(event.target).closest('div.modal').modal('hide');}
function noticeTableAlertTabBtnCallback(event){event.stopPropagation();var tr=$(event.target).closest('tr');var noticeId=tr.attr('data-noticeid');if(isNoEmpty(noticeId)){readNoticeCallback(noticeId,function(data){if(isNoEmpty(data.msg)){tr.remove();}});}}
function noticeTableAlertCloseBtnCallback(event){event.stopPropagation();$(event.target).closest('div.modal').modal('hide');}
function noticeAlertBtnCallback(event){event.stopPropagation();var noticeId=$(event.target).closest('.widget-box').attr('data-noticeid');if(isNoEmpty(noticeId)){readNoticeCallback(noticeId);}
$(event.target).closest('div.modal').modal('hide');}
function initNoticeAlertColorbox(htmlContent,w,h){var noticeColorParam={html:htmlContent,maxHeight:h,rel:'nc-pre',overlayClose:false,scrolling:false,closeButton:false,close:'&times;',onOpen:function(){},onClosed:function(){},onComplete:function(){},};$.colorbox(noticeColorParam);}
function loadNoticeMsg(){$.ajax({type:'POST',url:__webroot__+'other/loadNoticeMsgForMainPage.htm',data:{types:[1,2,3]}}).done(function(data){if(data.msg[0]==='true'){if(isNoEmpty(data.rows)){for(var row=0;row<data.rows.length;row++){(function(){var noticeId=data.rows[row].id,_row=row;var $li=createUnreadMsgLi(data.rows[_row]);$li.on('click',function(e){e.stopPropagation();openPage(__webroot__+'other/loadNoticePageForView.htm?notice.type=99');setTimeout(readNoticeCallback(noticeId,function(data){var c=parseInt($('#topMsgCount span').text());$(e.target).remove();$('#topMsgCount span').text(c-1);$('#titleMsgCount').text(c-1);}),500);$('#topMsgCount').click();})
$('#topMsgItems').append($li);})();}
$('#topMsgCount span').text(data.records);$('#titleMsgCount').text(data.records);}}}).fail(function(jqXHR,textStatus){console.log("ajax:other/loadNoticeMsgForMainPage.htm request failed: "+textStatus);});}
function createNoticeTableAlert(rows,btnCallback,width,height){var wbox=$('<div class="widget-box" >');var wheader=$('<div class="widget-header">');var h4=$('<h4 class="smaller">');var span=$('<span class="widget-color-red2">版权到期提醒</span>');var small=$('<small class="pull-right" style="padding-right: 10px;">当前时间:'+getDateStrWithOffset(null,null,'yyyy-MM-dd hh:mm')+'</small>');h4.append(span);h4.append(small);wheader.append(h4);var wbody=$('<div class="widget-body">');var wmain=$('<div class="widget-main">');var well=$('<div class="well well-lg" style="max-height: '+height+'px;overflow: auto;">');{var titleWidth=width*.5,ctimeWidth=width*.29,optWidth=width*.1,opt2Width=width*.1;var table=$('<table class="table table-condensed" >');for(var i=0;i<rows.length;i++){var rowData=rows[i];var tr=$('<tr data-noticeid="'+rowData.id+'"><td data-title style="width:'+titleWidth+'px">'+rowData.title+'</td><td style="width:'+ctimeWidth+'px">'+rowData.createTime+'</td><td data-opt><button class="btn btn-link" >忽略</button> </td><tr>');if(isNoEmpty(btnCallback.tabbtn)&&(typeof btnCallback.tabbtn==='function')){tr.find('button').on('click',function(e){btnCallback['tabbtn'].call(this,e);});}
table.append(tr);}
well.append(table)}
var hr=$('<hr/>');var p=$('<p class="center">');if(isNoEmpty(btnCallback)&&(typeof btnCallback==='object')){if(isNoEmpty(btnCallback.ignore)&&(typeof btnCallback.ignore==='function')){var spanIgnore=$(' <span class="btn btn-warning btn-sm tooltip-warning">忽略全部</span>');spanIgnore.on('click',function(e){btnCallback['ignore'].call(this,e);});p.append(spanIgnore).append('&nbsp;&nbsp;');}
if(isNoEmpty(btnCallback.close)&&(typeof btnCallback.close==='function')){var spanClose=$(' <span class="btn btn-warning btn-sm tooltip-warning">关闭窗口</span>');spanClose.on('click',function(e){btnCallback['close'].call(this,e);});p.append(spanClose);}}
wmain.append(well).append(hr).append(p);wbody.append(wmain);wbox.append(wheader).append(wbody);return wbox;}
function createNoticeAlert(row,btnCallback,width,height){var wbox=$('<div class="widget-box"  data-noticeid='+row.id+' >');var wheader=$('<div class="widget-header">');var h4=$('<h4 class="smaller">');var span=$('<span class="widget-color-red2">公告</span>');var small=$('<small class="pull-right" style="padding-right: 10px;">发布时间:'+row.createTime+'</small>');h4.append(span);h4.append(small);wheader.append(h4);var wbody=$('<div class="widget-body">');var wmain=$('<div class="widget-main">');var well=$('<div class="well well-lg">');var wh4=$('<h4 class="blue">'+row.title+'</h4>');var wspan=$('<span>'+row.detail+'</span>');well.append(wh4).append(wspan);var hr=$('<hr/>');var p=$('<p class="center">');var pspan=$(' <span class="btn btn-warning btn-sm tooltip-warning">已阅读</span>');pspan.on('click',function(e){if(typeof btnCallback==='function'){btnCallback.call(this,e);}});p.append(pspan);wmain.append(well).append(hr).append(p);wbody.append(wmain);wbox.append(wheader).append(wbody);return wbox;}
function readNoticeCallback(noticeIds,func){if($('#noticeItem-'+noticeIds).attr('data-isreaded')=='true')return;var neid,nids=[];if(!isNoEmpty(noticeIds))return;if(typeof noticeIds==='string'||typeof noticeIds==='number'){nids.push(noticeIds);neid=noticeIds;}else if(typeof noticeIds==='object'&&(noticeIds instanceof Array))
nids=noticeIds;else return;if(nids.length<1)return;$.ajax({type:'POST',url:__webroot__+'other/signReadedNotice.htm',data:{'noticeids':nids}}).done(function(data){if(isNoEmpty(neid)){var $noticeElement=$('#unread-'+neid);if(isNoEmpty(data.msg)&&$noticeElement.length>0){$noticeElement.fadeToggle(1000,function(){$noticeElement.remove();});$('#noticeItem-'+neid).attr('data-isreaded','true');}}
if(isNoEmpty(func)){if(typeof func==='function'){func.call(this,data);}}});}
function createUnreadMsgLi(row){var $li=$('<li>');var $div=$('<div class="msg-body" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;course:hand;">');var $dspan1=$('<span class="msg-title">');var $ds1i=$('<i class="ace-icon fa fa-user"></i>');var local={'1':'版权到期','2':'剧集更新','3':'内容集更新'};var $ds1span1=$('<span>'+local[row.type]+':</span>');var $br=$('<br>');var $ds1span2=$('<span>'+row.title+'</span>');var $dspan2=$('<span class="msg-time">');var $ds2i=$('<i class="ace-icon fa fa-clock-o"></i>');var $ds2span1=$('<span>'+row.createTime+'</span>');$dspan1.append($ds1i);$dspan1.append($ds1span1);$dspan1.append($br);$dspan1.append($ds1span2);$dspan2.append($ds2i);$dspan2.append($ds2span1);$div.append($dspan1);$div.append($dspan2);$li.append($div);return $li;}
function alertmsg(type,msg){$("#alertButton").manhua_msgTips({Event:"click",timeOut:2000,msg:msg,speed:800,type:type});$("#alertButton").click();}
function initmyindex(){var d=$("#main_page").find("div [data-value]");d.attr("style","display:none;");var retdata="";$.ajax({type:"post",async:false,url:__webroot__+"other/initmyindex.htm",dataType:"json",cache:false,success:function(data){retdata=data;if(data.index!=null&&""!=data.index){initIndexchebox(data.index);}else{initIndexchebox("");}
if(data.myapp!=null&&""!=data.myapp){initmyappchebox(data.myapp);}else{initmyappchebox("");}
if(data.mywork!=null&&""!=data.mywork){initmyworkchebox(data.mywork);}else{initmyworkchebox("");}if(data.notice!=null&&""!=data.notice){initmynotice(data.notice);}else{initmynotice("");}},Error:function(err){}});return retdata;}
function initmynotice(data){if(data!=""){var notice=$("#mynotice");var detail=data.DETAIL+"";if(detail.length>30){detail=detail.substr(0,30)+"…";}
$(notice.find("span")[0]).text(data.TITLE+": "+detail);var attach=data.attach;if(attach.length>0){$(notice.find("span")[1]).html("<i class='fa fa-download'></i>"+attach.length);initAttachList(attach);}else{$("#attachlink").remove();}}}
function showattrlist(){$("#mainAttachListModal").modal("show");}
function initAttachList(data){var content=$("#mainAttachListModal").find(".content");var child=content.children();if(child.length>1){for(var i=1;i<child.length;i++){$(child[i]).remove();}}else{var ch=child[0];$(ch).find("span").text(data[0].FILE_NAME);$(ch).find("a").attr("href",webroot+"star/downloadFile.htm?path="+data[0].PATH);for(var i=1;i<data.length;i++){var cd=$(child[0]).clone();cd.find("span").text(data[i].FILE_NAME);cd.find("a").attr("href",webroot+"star/downloadFile.htm?path="+data[i].PATH);$(ch).after(cd);}}}
function initmyappchebox(data){var my=$("#myapplicationmodal");var app=my.find("form input[type='checkbox']");if(data!=""){var ms=data.mamSelf.split(",");for(var i=0;i<ms.length;i++){var s=$(app).parent().find("[data-value='"+ms[i]+"']");if(s.length>0){s.prop("checked",true);}}}else{for(var j=0;j<app.length;j++){$(app[j]).prop("checked",true);}}}
function initmyworkchebox(data){var my=$("#myworkmodal");var work=my.find("form input[type='checkbox']");if(data!=""){var ms=data.mamSelf.split(",");for(var i=0;i<ms.length;i++){var s=$(work).parent().find("[data-value='"+ms[i]+"']");if(s.length>0){s.prop("checked",true);}}}else{for(var j=0;j<work.length;j++){$(work[j]).prop("checked",true);}}}
function initIndexchebox(data){var my=$("#myindivmainmodal");var list=my.find("form input[type='checkbox']");if(data!=""){var mam_selfs=data.mamSelf.split(",");for(var i=0;i<mam_selfs.length;i++){var s=$(list).parent().find("[data-value='"+mam_selfs[i]+"']");var d=$("#main_page").find("div [data-value='"+mam_selfs[i]+"']");if(s.length>0){s.prop("checked",true);}
if(d.length>0){d.attr("style","display:block");}}}else{for(var j=0;j<list.length;j++){$(list[j]).prop("checked",true);var d=$("#main_page").find("div [data-value='"+(j+1)+"']");if(d.length>0){d.attr("style","display:block");}}}}
function savemyindivmain(){var my=$("#myindivmainmodal");var list=my.find("form input[type='checkbox']");var myindiv="";for(var i=0;i<list.length;i++){if($(list[i]).prop("checked")==true){myindiv=myindiv+$(list[i]).data("value")+","}}
if(myindiv!=""){myindiv=myindiv.substr(0,myindiv.length-1);savePersonalise(2,myindiv);}else{alertmsg('error',$("#index-select-onelest").val());}
my.modal("hide");}
function saveindexmyapp(){var my=$("#myapplicationmodal");var list=my.find("form input[type='checkbox']");var myindiv="";for(var i=0;i<list.length;i++){if($(list[i]).prop("checked")==true){myindiv=myindiv+$(list[i]).data("value")+","}}
if(myindiv!=""){myindiv=myindiv.substr(0,myindiv.length-1);savePersonalise(3,myindiv);}else{alertmsg('error',$("#index-select-onelest").val());}
my.modal("hide");}
function saveindexmywork(){var my=$("#myworkmodal");var list=my.find("form input[type='checkbox']");var myindiv="";for(var i=0;i<list.length;i++){if($(list[i]).prop("checked")==true){myindiv=myindiv+$(list[i]).data("value")+","}}
if(myindiv!=""){myindiv=myindiv.substr(0,myindiv.length-1);savePersonalise(4,myindiv);}else{alertmsg('error',$("#index-select-onelest").val());}
my.modal("hide");}
function savePersonalise(type,mam){$.ajax({type:"post",async:false,url:__webroot__+"other/savemyself.htm",data:{"type":type,"mam_self":mam},dataType:"json",cache:false,success:function(data){alertmsg('success',data.msg);var ret=initmyindex();initchar(ret);},Error:function(err){alertmsg("error",$("#index-save-err").val());}});}
function getweek(){var date=new Date();var weeks=new Array();for(var i=0;i<7;i++){weeks[6-i]=(date.getMonth()+1)+"-"+date.getDate();date.setDate(date.getDate()-1);}
return weeks;}
function getdata(data){var date=new Date();var retdata=new Array();var day;if(data==null||data==""){for(var k=0;k<7;k++){retdata[k]=0;}}else{for(var i=0;i<7;i++){for(var j=0;j<data.length;j++){var tm=data[j];day=tm[0].substring(tm[0].length-2);if(day==date.getDate()||day=="0"+date.getDate()){retdata[6-i]=tm[1];}}
date.setDate(date.getDate()-1);}
for(var i=0;i<7;i++){if(typeof(retdata[i])=="undefined"){retdata[i]=0;}}}
return retdata;}
function initchar(data){var ret="",app="",work="";if(data.index!=null&&""!=data.index){ret=data.index.mamSelf+"";}
if(data.myapp!=null&&""!=data.myapp){app=data.myapp.mamSelf+"";}
if(data.mywork!=null&&""!=data.mywork){work=data.mywork.mamSelf+"";}
if(ret.indexOf("1")!=-1||ret==""){if(app==""){var my=$("#myapplicationmodal");var list=my.find("form input[type='checkbox']");var myindiv="";for(var i=0;i<list.length;i++){myindiv=myindiv+$(list[i]).data("value")+","}
if(myindiv!=""){myindiv=myindiv.substr(0,myindiv.length-1);app=myindiv;}}
initmyapptab(app);}
if(ret.indexOf("2")!=-1||ret==""){if(work==""){var my=$("#myworkmodal");var list=my.find("form input[type='checkbox']");var myindiv="";for(var i=0;i<list.length;i++){myindiv=myindiv+$(list[i]).data("value")+","}
if(myindiv!=""){myindiv=myindiv.substr(0,myindiv.length-1);work=myindiv;}}
initmyworktab(work);}
if(ret.indexOf("3")!=-1||ret==""){initmyapplication();}
if(ret.indexOf("4")!=-1||ret==""){initmywork();}
if(ret.indexOf("5")!=-1||ret==""){initmycopyright();}
if(ret.indexOf("6")!=-1||ret==""){initmyrecord();}}
function clearprofiledata(feed){var feed=$("#"+feed).children();for(var i=0;i<feed.length;i++){if($(feed[i]).css("display")=="block"){$(feed[i]).remove();}}}
function initmyworktab(work){if(work==""){return;}
var sh=$("#mywork-profile-feed");if(sh.length>0){$.ajax({type:"post",async:false,url:__webroot__+"other/initmyworktab.htm",dataType:"json",data:{"appwork":work},cache:false,success:function(data){clearprofiledata('mywork-profile-feed');initprofilefeed('mywork-profile-feed',data.list,2);},Error:function(err){alert("delete error");}});}}
function initmyapptab(app){if(app==""){return;}
var sh=$("#myapp-profile-feed");if(sh.length>0){$.ajax({type:"post",async:false,url:__webroot__+"other/initmyapptab.htm",dataType:"json",data:{"appwork":app},cache:false,success:function(data){clearprofiledata('myapp-profile-feed');initprofilefeed('myapp-profile-feed',data.list,1);},Error:function(err){alert("delete error");}});}}
function getdblurl(data,type){var ret="";if(type==1){switch(data){case 1:ret="javascript:openPage('"+__webroot__+"asset/myApplypointAsset.htm')";break;case 2:ret="javascript:openPage('"+__webroot__+"pages/liveChannelApplication.htm')";break;case 3:ret="javascript:openPage('"+__webroot__+"pages/listCopyright.htm')";break;case 4:ret="javascript:openPage('"+__webroot__+"star/personage.htm?loadType=apply')";break;case 5:ret="javascript:openPage('"+__webroot__+"pages/awards/application.htm')";break;}}else if(type==2){switch(data){case 1:ret="javascript:openPage('"+__webroot__+"asset/myTaskPointAsset.htm')";break;case 2:ret="javascript:openPage('"+__webroot__+"pages/liveChannelCheck.htm')";break;case 3:ret="javascript:openPage('"+__webroot__+"pages/listCopyrightVerify.htm')";break;case 4:ret="javascript:openPage('"+__webroot__+"star/personage.htm?loadType=task')";break;case 5:ret="javascript:openPage('"+__webroot__+"pages/awards/awardWork.htm')";break;}}
return ret;}
function getdblurl2(data,type,id){var ret="";switch(data){case 1:ret="loadmaindemandpage("+id+","+type+")";break;case 2:ret="loadmainlivepage("+id+","+type+")";break;case 3:ret="loadmaincopyrightpage("+id+","+type+")";break;case 4:ret="loadmainstarpage("+id+","+type+")";break;case 5:ret="loadmainawardspage("+id+","+type+")";break;}
return ret;}
function gettype(data,type){var ret="";if(type==1){switch(data){case 1:ret=$("#index-app-demand").val();break;case 2:ret=$("#index-app-live").val();break;case 3:ret=$("#index-app-copyright").val();break;case 4:ret=$("#index-app-star").val();break;case 5:ret=$("#index-app-award").val();break;}}else if(type==2){switch(data){case 1:ret=$("#index-work-demand").val();break;case 2:ret=$("#index-work-live").val();break;case 3:ret=$("#index-work-copyright").val();break;case 4:ret=$("#index-work-star").val();break;case 5:ret=$("#index-work-award").val();break;}}
return ret;}
function initprofilefeed(feed,data,type){var feed=$("#"+feed);var clone;var nodata=$('#index-search-nodata').val();if(data.length==0){var clone=$("<span class='red'>"+nodata+"</span>");clone.appendTo(feed);}
if(data!=null&&data!=""){for(var i=0;i<data.length;i++){clone=feed.children().first().clone();clone.css('display',"block");clone.attr("ondblclick",getdblurl2(data[i].TYPE,type,data[i].ID));var sp=clone.find("span");$(sp[1]).html(gettype(data[i].TYPE,type));$(sp[2]).html(data[i].NAME);$(sp[3]).html($("#index-apply-store").val());$(sp[4]).html("<i class='fa fa-clock-o bigger-110'></i>"+data[i].TIME);clone.find("a").attr("onclick",getdblurl(data[i].TYPE,type));clone.appendTo(feed);}}}
function initmyapplication(){var sh=$("#myapplicachar");if(sh.length==0){return;}
var dd;$.ajax({type:"post",async:false,url:__webroot__+"other/initmyapplication.htm",dataType:"json",cache:false,success:function(data){dd=data;},Error:function(err){alert("delete error");}});var myapplication=echarts.init(document.getElementById('myapplicachar'));var myappoption={title:{text:$("#index-app-text").val(),subtext:$("#index-subtext").val(),x:'center'},tooltip:{trigger:'axis',axisPointer:{type:'shadow'},backgroundColor:"rgb(153,153,153)",borderWidth:1,borderColor:"rgb(51,51,51)",textStyle:{color:"rgb(255,255,255)",fontStyle:"oblique"}},legend:{orient:'vertical',x:'left',padding:[0,0,5,0],itemGap:5,itemWidth:10,data:[$("#index-demand").val(),$("#index-live").val(),$("#index-copyright").val(),$("#index-star").val(),$("#index-award").val()]},toolbox:{show:true,feature:{mark:{show:false},dataView:{show:false,readOnly:true},magicType:{show:true,type:['line','bar','stack','tiled']},restore:{show:true},saveAsImage:{show:true}}},calculable:true,yAxis:[{type:'value',name:$("#index-number").val()}],xAxis:[{type:'category',data:getweek()}],series:[{name:$("#index-demand").val(),type:'bar',stack:$("#index-sum").val(),data:getdata(dd.demand),barCategoryGap:'50%'},{name:$("#index-live").val(),type:'bar',stack:$("#index-sum").val(),data:getdata(dd.live),barCategoryGap:'50%'},{name:$("#index-copyright").val(),type:'bar',stack:$("#index-sum").val(),data:getdata(dd.copyright),barCategoryGap:'50%'},{name:$("#index-star").val(),type:'bar',stack:$("#index-sum").val(),data:getdata(dd.star),barCategoryGap:'50%'},{name:$("#index-award").val(),type:'bar',stack:$("#index-sum").val(),data:getdata(dd.award),barCategoryGap:'50%'}]};myapplication.setOption(myappoption);}
function initmywork(){var sh=$("#myworkchar");if(sh.length==0){return;}
var dd;$.ajax({type:"post",async:false,url:__webroot__+"other/initmywork.htm",dataType:"json",cache:false,success:function(data){dd=data;},Error:function(err){alert("delete error");}});var mywork=echarts.init(document.getElementById('myworkchar'));var myworkoption={title:{text:$("#index-work-text").val(),subtext:$("#index-subtext").val(),x:'center'},tooltip:{trigger:'axis',axisPointer:{type:'shadow'},backgroundColor:"rgb(153,153,153)",borderWidth:1,borderColor:"rgb(51,51,51)",textStyle:{color:"rgb(255,255,255)",fontStyle:"oblique"}},legend:{orient:'vertical',x:'left',padding:[0,0,5,0],itemGap:5,itemWidth:10,data:[$("#index-demand").val(),$("#index-live").val(),$("#index-copyright").val(),$("#index-star").val(),$("#index-award").val()]},toolbox:{show:true,feature:{mark:{show:false},dataView:{show:false,readOnly:true},magicType:{show:true,type:['line','bar','stack','tiled']},restore:{show:true},saveAsImage:{show:true}}},calculable:true,xAxis:[{type:'category',data:getweek()}],yAxis:[{type:'value',name:$("#index.number").val()}],series:[{name:$("#index-demand").val(),type:'bar',data:getdata(dd.demand),barCategoryGap:'50%'},{name:$("#index-live").val(),type:'bar',data:getdata(dd.live),barCategoryGap:'50%'},{name:$("#index-copyright").val(),type:'bar',data:getdata(dd.copyright),barCategoryGap:'50%'},{name:$("#index-star").val(),type:'bar',data:getdata(dd.star),barCategoryGap:'50%'},{name:$("#index-award").val(),type:'bar',data:getdata(dd.award),barCategoryGap:'50%'}]};mywork.setOption(myworkoption);}
function initmycopyright(){var sh=$("#mycopyright");if(sh.length==0){return;}
var dd;var datalist=new Array();$.ajax({type:"post",async:false,url:__webroot__+"other/initmycopyright.htm",dataType:"json",cache:false,success:function(data){dd=data;},Error:function(err){alert("delete error");}});if(!dd||dd.copyright==null||dd.copyright==""){for(var j=0;j<5;j++){datalist[j]=0;}}else{for(var j=0;j<5;j++){for(var i=0;i<dd.copyright.length;i++){var tm=dd.copyright[i];var s=tm[0];switch(s){case'0':datalist[0]=tm[1];break;case'1':datalist[1]=tm[1];break;case'2':datalist[2]=tm[1];break;case'3':datalist[3]=tm[1];break;}}}
for(var j=0;j<5;j++){if(typeof(datalist[j])=="undefined"){datalist[j]=0;}}}
var mycopyrightcart=echarts.init(document.getElementById('mycopyright'));var mycopyrightoption={title:{text:$("#index-mycopyright").val(),subtext:$("#index-pie-subtext").val(),x:'center'},tooltip:{trigger:'item',formatter:"{a} <br/>{b} : {c} ({d}%)",backgroundColor:"rgb(153,153,153)",borderWidth:1,borderColor:"rgb(51,51,51)",textStyle:{color:"rgb(255,255,255)",fontStyle:"oblique"}},legend:{orient:'vertical',x:'left',data:[$("#index-copyright-submit").val(),$("#index-copyright-check").val(),$("#index-copyright-checkpass").val(),$("#index-copyright-reject").val()]},toolbox:{show:true,feature:{mark:{show:false},dataView:{show:false,readOnly:false},magicType:{show:true,type:['pie','funnel'],option:{funnel:{x:'25%',width:'50%',funnelAlign:'left',max:1548}}},restore:{show:true},saveAsImage:{show:true}}},calculable:true,series:[{name:$("#index-copyright-worknum").val(),type:'pie',radius:'55%',center:['50%','60%'],itemStyle:{normal:{label:{show:true,formatter:"{b}:{c} ({d}%)"}}},data:[{value:datalist[0],name:$("#index-copyright-submit").val()},{value:datalist[1],name:$("#index-copyright-check").val()},{value:datalist[2],name:$("#index-copyright-checkpass").val()},{value:datalist[3],name:$("#index-copyright-reject").val()}]}]};mycopyrightcart.setOption(mycopyrightoption);}
function initmyrecord(){var sh=$("#myrecord");if(sh.length==0){return;}
var dd;var datalist=new Array();$.ajax({type:"post",async:false,url:__webroot__+"other/initmyrecord.htm",dataType:"json",cache:false,success:function(data){dd=data;},Error:function(err){}});if(dd.record==null||dd.record==""){for(var j=0;j<4;j++){datalist[j]=0;}}else{for(var i=0;i<dd.record.length;i++){var tm=dd.record[i];var s=tm[0];switch(s){case 10:datalist[0]=tm[1];break;case 11:datalist[1]=tm[1];break;case 12:datalist[2]=tm[1];break;case 13:datalist[3]=tm[1];break;}}
for(var j=0;j<4;j++){if(typeof(datalist[j])=="undefined"){datalist[j]=0;}}}
var myrecordchart=echarts.init(document.getElementById('myrecord'));var myrecordoption={title:{text:$("#index-myrecord").val(),subtext:$("#index-pie-subtext").val(),x:'center'},tooltip:{trigger:'item',formatter:"{a} <br/>{b} : {c} ({d}%)",backgroundColor:"rgb(153,153,153)",borderWidth:1,borderColor:"rgb(51,51,51)",textStyle:{color:"rgb(255,255,255)",fontStyle:"oblique"}},legend:{orient:'vertical',x:'left',data:[$("#index-record-no").val(),$("#index-record-ing").val(),$("#index-record-ed").val(),$("#index-record-fail").val()]},toolbox:{show:true,feature:{mark:{show:false},dataView:{show:false,readOnly:false},magicType:{show:true,type:['pie','funnel'],option:{funnel:{x:'25%',width:'50%',funnelAlign:'left',max:1548}}},restore:{show:true},saveAsImage:{show:true}}},calculable:true,series:[{name:$("#index-worknum").val(),type:'pie',radius:'55%',center:['50%','60%'],itemStyle:{normal:{label:{show:true,formatter:"{b}:{c} ({d}%)"}}},data:[{value:datalist[0],name:$("#index-record-no").val()},{value:datalist[1],name:$("#index-record-ing").val()},{value:datalist[2],name:$("#index-record-ed").val()},{value:datalist[3],name:$("#index-record-fail").val()}]}]};myrecordchart.setOption(myrecordoption);}
function reloadAppAndWork(){var app;var my=$("#myapplicationmodal");var list=my.find("form input[type='checkbox']");var myindiv="";for(var i=0;i<list.length;i++){myindiv=myindiv+$(list[i]).data("value")+","}
if(myindiv!=""){myindiv=myindiv.substr(0,myindiv.length-1);app=myindiv;}
initmyapptab(app);var work;my=$("#myworkmodal");list=my.find("form input[type='checkbox']");myindiv="";for(var i=0;i<list.length;i++){myindiv=myindiv+$(list[i]).data("value")+","}
if(myindiv!=""){myindiv=myindiv.substr(0,myindiv.length-1);work=myindiv;}
initmyworktab(work);}
function mainshowOrhide(ms){$("#rightPage").slideToggle(ms);$("#mainchangePage").slideToggle(ms);}
function mainshowOrhide2(ms){$("#rightPage").slideToggle(ms);$("#createCopyright").slideToggle(ms);}
function loadmainawardspage(id,type){var tt=type==1?"view":"edit";$('#mainchangePage').load(__webroot__+'pages/awards/awardAdd.jsp',function(){initNewPage(id,tt);award_grid_table_period(id);if(tt=="edit"){bindNewForm();}
$("#new-actions-before").find("button").unbind("click").on('click',function(){mainshowOrhide(500);if(type==2){reloadAppAndWork();}});});mainshowOrhide(500);}
function loadmaindemandpage(id,type){if(type==2){$("#mainchangePage").load(webroot+"asset/assetAction!assetCheck.htm?aid="+id,function(){mainshowOrhide(500);$("#mainchangePage #check_breadcrumbs").hide();$("#return").click(function(){mainshowOrhide(500);reloadAppAndWork();});});}else{$("#mainchangePage").load(webroot+"asset/assetAction!assetApplyView.htm?aid="+id+"&flag=myTaskPointAsset",function(){mainshowOrhide(500);$("#mainchangePage #breadcrumbs").hide();$("#return").click(function(){mainshowOrhide(500);});});}}
function loadmainlivepage(id,type){$liveChannel=$("#rightPage");$edit=$("#mainchangePage");if(type==2){$edit.load(webroot+"live/liveChannelApplyAction!liveChannelAdd.htm?aid="+id,function(){$liveChannel.slideToggle();$edit.slideToggle();$("#saveButton",$edit).hide();$("#submitButton",$edit).hide();$("#rejectButton",$edit).show();$("div[class='breadcrumbs']",$edit).hide();$("#returnBtn",$edit).show().click(function(){$liveChannel.slideToggle();$edit.slideToggle();$edit.empty();reloadAppAndWork();});$type=$('[name="type"]',$edit);$type.attr("disabled","disabled");$type.trigger("chosen:updated");if($type.val()=='9'){$('[name="name"]',$edit).attr("disabled","disabled");$("[name='plus']",$edit).hide();$("[name='remove']",$edit).hide();}
$("#videoDiv",$edit).show();});}else{$edit.load(webroot+"live/liveChannelApplyAction!liveChannelView.htm?aid="+id,function(){$liveChannel.slideToggle();$edit.slideToggle();$("#mainchangePage #returnBtn").off("click").on("click",function(){$liveChannel.slideToggle();$edit.slideToggle();$edit.empty();});});}}
function loadmainstarpage(id,type){if(type==2){Mam.star.loadCreatePage('#mainchangePage','update',true,{'star.id':id});setTimeout(function(){$("#create-actions-before").unbind();$("#create-actions-before").bind('click',function(){mainshowOrhide(500);reloadAppAndWork();});},1000);mainshowOrhide(500);}else{Mam.star.loadCreatePage('#mainchangePage','view',true,{'star.id':id});setTimeout(function(){$("#create-actions-before").unbind();$("#create-actions-before").bind('click',function(){mainshowOrhide(500);});},1000);mainshowOrhide(500);}}
function loadmaincopyrightpage(id,type){if(type==2){editCopyrightInterface(id,function(){mainshowOrhide2(500)});mainshowOrhide2(500);reloadAppAndWork();}else{viewCopyrightInterface(id,function(){mainshowOrhide2(500)});}};