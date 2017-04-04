//兼容getElementsByClassName
function getElementsByClassName(element,names){
    if(element.getElementsByClassName){
        return element.getElementsByClassName(names);
    }
    else{
        var children = element.getElementsByTagName("*");//获取全部子元素
        var elements = [];
        var names = names.split(" ");
        for(var i = 0;i < children.length;i++){//遍历子元素
            var flag = true;
            var class_name = children[i].className;
            for(var j = 0;j < names.length;j++){
                if(class_name.indexOf(names[j]) == -1){//若不含其中一个指定类名则false
                    flag = false;
                    break;
                }
            }
            if(flag){
                elements.push(children[i]);
            }
        }
        return elements;
    }
}


// 添加类名
function addClass(element, value) {
    if (hasClass(element,value)){
        return false;
    }
    if(element.className == '') {
        element.className = value;    
    } 
    else{
        element.className += ' ' + value;            
    }
}

// 类名存在判断
function hasClass( element,value ){   
    if(element.className == undefined) 
        return false;
    else
        return !!element.className.match( new RegExp( "(\\s|^)" + value + "(\\s|$)") );   
}

// 移除类名
function removeClass(element,value){
    if(hasClass(element,value)){
        var reg = new RegExp('(\\s|^)' + value + '(\\s|$)');
        element.className = element.className.replace(reg, '');
    }
}


//注册和删除事件
function addEvent(element,type,func){
    if(document.addEventListener){
        element.addEventListener(type,func,false);
    }else if(document.attachEvent){
        element.attachEvent("on"+type,func);
    }else{
        element["on"+type] = func;
    }
}
function removeEvent(element,type,func){
    if(document.removeEventListener){
        element.removeEventListener(type,func,false);
    }else if(document.detachEvent){
        element.detachEvent("on"+type,func);
    }else{
        element["on"+type] = func;
    }
}

//阻止事件默认动作
function preventDefault(event){
        if(event.preventDefault) {
            event.preventDefault();
        }else {
            event.returnValue = false;
        }
}

//load事件注册
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}


// Ajax请求GET方法的封装
function get(url,options,callback){//定义get函数
    //查询参数序列化
    function serialize(options){
        if(!options){//如果没有查询参数
            return "";//返回空字符
        }else{//否则
            var pairs=[];//定义一个数组
            for(var name in options){//遍历对象属性
                if(!options.hasOwnProperty(name)) continue;//过滤掉继承的属性和方法
                if(typeof options[name]==="function") continue;//过滤掉方法
                var value=options[name].toString();//属性值转字符串
                name=encodeURIComponent(name);//URI编码
                value=encodeURIComponent(value);//URI编码
                pairs.push(name+"="+value);//属性名和属性值放入数组
            }
            return pairs.join("&");//返回字符串
        }
    }
    var xhr=new XMLHttpRequest();//创建Ajax对象
    xhr.open("get",url+'?'+serialize(options));//开启一个异步请求
    xhr.send(null);//发送请求
    xhr.onreadystatechange = function(){//注册事件 处理返回数据
        if(xhr.readyState==4){//若请求完毕
            if(xhr.status>=200&&xhr.status<300||xhr.status==304){//若请求成功
                callback(xhr.responseText);//调用回调函数处理响应结果
            }else{//若请求失败
                alert('Requst was unsuccessful:'+xhr.status);//返回请求失败原因
            }
        }
    }; 
}


// cookie
function getCookie() {
    var cookie = {};
    var all = document.cookie;
    if (all === '') return cookie;
    var list = all.split('; ');
    for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);      
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}

function setCookie(name, value, days) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    var now = new Date();
    now.setTime(now.getTime()+(days*24*60*60*1000));
    document.cookie = cookie + ";expires=" + now.toGMTString();
}

function removeCookie(name) {
    document.cookie = setCookie(name,"",-1);
}

