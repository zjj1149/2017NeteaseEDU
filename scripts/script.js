//media query兼容IE8
function mediaQuery(){
    var body = document.getElementsByTagName("body")[0];
    response();
    addEvent(window,"resize",response);
    function response(){
        if(body.clientWidth < 1205){
            addClass(body,"ie8");
        }else{
            removeClass(body,"ie8");
        }
    }     
}
addLoadEvent(mediaQuery);

// 通知条不显示
function informDisplay(){
    var cookie = getCookie();
    var inform = getElementsByClassName(document,'inform-bg')[0];
    var close_inform = document.getElementById('close-inform');
    if(cookie.informDisplay){   //若设置不再提醒cookie，不显示通知条
        addClass(inform, 'hidden');
    }
    else{
        addEvent(close_inform, 'click', function(){
            addClass(inform, 'hidden');
            setCookie('informDisplay', 'true', 1); 
        });
    }      
}
addLoadEvent(informDisplay);

//视频播放
function videoDisplay(){
    var layer2 = getElementsByClassName(document,"m-layer2")[0];
    var play_video = document.getElementById("play-video");
    //点击图片显示视频浮层
    addEvent(play_video,"click",function(event){
        event = event||window.event;
        preventDefault(event);
        removeClass(layer2,"hidden");
    });
    var close_video = document.getElementById("close-video");
    //点击关闭按钮关闭视频浮层
    addEvent(close_video,"click",function(){
        addClass(layer2,"hidden");
    });
}
addLoadEvent(videoDisplay);


//关注
function follow(){
    var f_btn1 = document.getElementById("f-btn1");
    var f_btn2 = document.getElementById("f-btn2");
    var layer1 = getElementsByClassName(document,"m-layer1")[0];
    var cookie = getCookie();
    //若关注成功，显示“已关注”按钮
    if(cookie.followSuc){
        addClass(f_btn1,"hidden");
        removeClass(f_btn2,"hidden");
    }
    addEvent(f_btn1,"click",function(){
        if(cookie.loginSuc){
            loginReady();           
        }else{
            removeClass(layer1,"hidden");
            login();
        }
    });

    // hover取消改变整个“已关注”按钮背景颜色，按下取消关注
    var cancel = getElementsByClassName(f_btn2,"cancel")[0];
    addEvent(cancel,"mouseover",function(){
        f_btn2.style.backgroundColor = "#ffffff";
    });
    addEvent(cancel,"mouseout",function(){
        f_btn2.style.backgroundColor = "#f8f8f8";
    });
    addEvent(cancel,"click",function(event){
        event = event||window.event;
        preventDefault(event);
        removeCookie("followSuc");
        addClass(f_btn2,"hidden");
        removeClass(f_btn1,"hidden");
    });
}
addLoadEvent(follow);

//登录cookie存在时处理
function loginReady(){
    var url = "http://study.163.com/webDev/attention.htm";
    get(url,"",followCallback);
}

function followCallback(data){
    if(data == 1){
        setCookie("followSuc","true",1);
        var f_btn1 = document.getElementById("f-btn1");
        var f_btn2 = document.getElementById("f-btn2");
        addClass(f_btn1,"hidden");
        removeClass(f_btn2,"hidden");
    }
}


//登录
function login(){
    
    //点击关闭图标，关闭登录框
    var c_btn = document.getElementById("close-form");
    var layer1 = getElementsByClassName(document,"m-layer1")[0];
    addEvent(c_btn,"click",function(){
        addClass(layer1,"hidden");
    });

    //表单验证，检测是否填好
    function isFilled(field){
        if(field.value.replace(" ","").length == 0)
            return false;
        var placeholder = field.placeholder;
        return (field.value != placeholder)
    }
    
    var loginForm = getElementsByClassName(document,"m-form")[0];
    addEvent(loginForm,"submit",function(event){
        event = event||window.event;
        toSubmit(event);
    });
    //处理提交的表单
    function toSubmit(event){
        preventDefault(event);
        var user_name = document.getElementById("userName");
        var pass_word = document.getElementById("password");
        if(!isFilled(user_name)||!isFilled(pass_word)){
            alert("please fill the form");
            return false;    //有未填项弹出提示并返回false
        }
        var url = "http://study.163.com/webDev/login.htm";
        var options = {
            userName: hex_md5(user_name.value),
            password: hex_md5(pass_word.value)
        };
        function loginCallback(data){
            if(data == 0){
                alert("账号或密码错误");
            }else{
                setCookie("loginSuc","true",1);
                addClass(layer1,"hidden");
                loginReady();
            }
        }
        get(url,options,loginCallback);
    } 
}


// 轮播图
//淡入，参数：节点，步数，每步时间
function fadein(ele,steps,stepTime){ 
    //重置
    ele.style.zIndex = 1;
    ele.style.opacity = 0;
    ele.style.filter = "Alpha(opacity=0)";
    
    var stepLen = parseFloat(1/steps);
    function step(){
        var cur_opa = parseFloat(ele.style.opacity) + stepLen;
        if(cur_opa < 1){
            ele.style.opacity = cur_opa;
            ele.style.filter = "Alpha(opacity=" + cur_opa*100 + ")";
        }
        else{
            ele.style.opacity = 1;
            ele.style.filter = "Alpha(opacity=100)";
            clearInterval(setFadein);
        }
    }

    var setFadein = setInterval(step,stepTime);
}

function slide(){
    var banner = getElementsByClassName(document,"banner")[0];
    //banner数组
    var banners = banner.getElementsByTagName("a");  
    //pointer数组
    var points = getElementsByClassName(document,"pointer")[0].getElementsByTagName("span");

    var cur_slide = getElementsByClassName(document,"cur-slide")[0];
    var cur_point = getElementsByClassName(document,"cur-point")[0];
    

    //获取下一张索引值，参数整个数组和当前值
    function getNextIndex(arr,cur){
        var cur_index;
        for(var i=0;i<arr.length;i++){
            if(arr[i] == cur){
                cur_index = i;
                break;
            }
        }
        return (cur_index<arr.length-1)?(cur_index+1):0;
    }

    //循环
    function loopStep(){
        var next_index = getNextIndex(banners,cur_slide);
        var next_slide = banners[next_index];
        var next_point = points[next_index];
        //隐藏当前
        cur_slide.style.zIndex = 0;
        cur_slide.style.opacity = 0;
        cur_slide.style.filter = "Alpha(opacity=0)";
        removeClass(cur_slide,"cur-slide");
        removeClass(cur_point,"cur-point");
        //下一张淡入
        fadein(next_slide,50,10);
        addClass(next_slide,"cur-slide");
        addClass(next_point,"cur-point");
        cur_slide = next_slide;
        cur_point = next_point;
    }
    var setLoop = setInterval(loopStep,5000);    
    //鼠标悬停暂停轮播，离开继续
    addEvent(banner,"mouseover",function(){
        clearInterval(setLoop);
    });
    addEvent(banner,"mouseout",function(){
        setLoop = setInterval(loopStep,5000); 
    });

    for(var i=0;i<points.length;i++){
        addEvent(points[i],"click",clickPointer);
    }
    //点击pointer切换
    function clickPointer(event){
        
        //获取点击的目标及其索引值
        event = event || window.event;
        var target = event.target || event.srcElement;
        for(var i=0;i<points.length;i++){
            if(target == points[i]){
                var clk_index = i;
                break;
            }
        }
        if(banners[clk_index] != cur_slide){
            //点击项不为当前项时暂停轮播，隐藏当前
            clearInterval(setLoop);
            cur_slide.style.zIndex = 0;
            cur_slide.style.opacity = 0;
            cur_slide.style.filter = "Alpha(opacity=0)";
            removeClass(cur_slide,"cur-slide");
            removeClass(cur_point,"cur-point");
            //点击项淡入，继续轮播
            var clk_slide = banners[clk_index];
            var clk_point = points[clk_index];
            fadein(clk_slide,50,10);
            addClass(clk_slide,"cur-slide");
            addClass(clk_point,"cur-point");
            cur_slide = clk_slide;
            cur_point = clk_point;
            setLoop = setInterval(loopStep,5000);
        } 
    }
}
addLoadEvent(slide);

// 最热排行
function getList(){
    var url = "http://study.163.com/webDev/hotcouresByCategory.htm";
    get(url,"",showList);
}
function showList(data){
    //JSON字符串解析得对象数组
    var courses = JSON.parse(data);
    var course_ctn =  getElementsByClassName(document,"t-container")[0];
    //容器加入20个课程,显示默认前10个课程
    for(var i=0;i<20;i++){
        var courseDiv = document.createElement("div");
        addClass(courseDiv,"t-course");
        var createHTML = "<img src='" + courses[i].smallPhotoUrl + "' alt='" + courses[i].name +
        "'><p class='t-name'>" + courses[i].name + "</p><p class='t-num'><span class='t-logo'></span> " + courses[i].learnerCount + "</p>";
        courseDiv.innerHTML = createHTML;
        course_ctn.appendChild(courseDiv);
    }

    //每5s更新
    function newList(){
        //每5s向上移动70px,实现滚动，10次后重置
        function move(ele,steps,stepTime){ 
            var length = -70;
            var top_end = parseInt(ele.style.top) + length;  
            var stepLen = length/steps;

            function step(){
                var cur_top = parseInt(ele.style.top) + stepLen;
                if(cur_top > top_end){
                    ele.style.top = cur_top + "px";
                }
                else{
                    ele.style.top = top_end + "px";
                    clearInterval(setMove);
                }
            }
            var setMove = setInterval(step,stepTime);
        }
        if(parseInt(course_ctn.style.top) > -700){
            move(course_ctn,50,10);
        }else{
           course_ctn.style.top = 0; 
        }
    }
    var setNewList = setInterval(newList,5000);

    //鼠标悬停停止滚动，离开继续
    addEvent(course_ctn,"mouseover",function(){
        clearInterval(setNewList);
    });
    addEvent(course_ctn,"mouseout",function(){
        setNewList = setInterval(newList,5000);
    });
}
addLoadEvent(getList);


//tab选项
function tab(){
    var product = document.getElementById("product");
    var code = document.getElementById("code");
    var main = getElementsByClassName(document,"m-main")[0];
    var container = getElementsByClassName(main,"m-container")[0]; //卡片容器
    var pagesUl = getElementsByClassName(main,"pages")[0]; //ul节点
    getCourse();
    tabChange();
    addEvent(window,"resize",getCourse);

    //获取课程 pageNo：当前页,psize：每页个数,type：产品设计10 编程语言20
    function getCourse(){
        var cur_page = getElementsByClassName(pagesUl,"cur-page")[0];
        var url = "http://study.163.com/webDev/couresByCategory.htm";
        var options = {
        pageNo : cur_page.firstChild.nodeValue,
        type : (hasClass(product,"cur-tab")) ? 10 : 20,
        psize : (document.body.clientWidth >= 1205) ? 20 : 15,
        };
        get(url,options,showCourse);
    }
    //显示课程
    function showCourse(data){
        var back_data = JSON.parse(data);
        var total_page = back_data.totalPage;//总页数
        var page_index = back_data.pagination.pageIndex;//当前页码

        //更新课程卡片
        container.innerHTML = "";
        var cards = back_data.list;
        function createCard(i){
            var card = cards[i];
            var cardDiv = document.createElement("div");
            addClass(cardDiv,"m-course");
            var price = (card.price == 0)?"免费":("¥ " + card.price.toFixed(2));
            var category = (card.categoryName == null) ? ("无") : card.categoryName;
            cardDiv.innerHTML = "<img src='" + card.middlePhotoUrl + "' alt='图片'>" + "<p class='c-name'>" + card.name + "</p><p class='c-provider'>" + card.provider + "</p><p class='c-num'><span></span>" + card.learnerCount + "</p><p class='c-price'>&nbsp;" + price + "</p>";
            //加入浮层
            cardDiv.innerHTML += "<div class='c-layer'><div class='l-head'><img src='" + card.bigPhotoUrl + "' alt='图片'><div class='l-right'><p class='l-name'>" + card.name + "</p><p class='l-num'><span></span>" + card.learnerCount + "人在学</p><p class='l-provider'>发布者：" + card.provider + "</p><p class='l-category'>分类：" + category + "</p></div></div><div class='l-description'><p>" + card.description + "</p></div></div>";
            //为显示卡片上的hover效果，防止浮层直接盖住卡片，设置为鼠标悬停在课程图片上时出现浮层
            var img = cardDiv.getElementsByTagName("img")[0];
            var layer = getElementsByClassName(cardDiv,"c-layer")[0];
            addEvent(img,"mouseover",function(){
                layer.style.display = "block";
            });
            addEvent(layer,"mouseout",function(){
                layer.style.display = "none";
            });
            container.appendChild(cardDiv);       
        }
        for(var i=0;i < back_data.list.length;i++){
            createCard(i);
        }
        //更新翻页器
        pagesUl.innerHTML = "<li class='left-icon'>&lt;</li>"
        for(var i=1;i <= total_page;i++){
            if(i != page_index){
                pagesUl.innerHTML += "<li>" + i +"</li>";
            }else{
                pagesUl.innerHTML += "<li class='cur-page'>" + i +"</li>";
            }       
        }
        pagesUl.innerHTML += "<li class='right-icon'>&gt;</li>";
        pageChange();    
    }
    
    
    //点击tab切换注册
    function tabChange(){
        addEvent(product,"click",function(){
            if(!product.className){
                removeClass(code,"cur-tab");
                addClass(product,"cur-tab");
                getCourse();
            }
        });
        addEvent(code,"click",function(){
            if(!code.className){
                removeClass(product,"cur-tab");
                addClass(code,"cur-tab");
                getCourse();
            }
        }); 
    }
    //点击翻页器切换注册
    function pageChange(){
        var pages = pagesUl.getElementsByTagName("li"); //li数组
        var cur_page = getElementsByClassName(pagesUl,"cur-page")[0];
        for(var i=1;i < pages.length-1;i++){
            addEvent(pages[i],"click",function(event){
                event = event||window.event;
                var target = event.srcElement || event.target;
                if(!hasClass(target,"cur-page")){
                    removeClass(cur_page,"cur-page");
                    addClass(target,"cur-page");
                    cur_page = target;
                    getCourse();
                }
            });
        }
        //向左翻页
        addEvent(pages[0],"click",function(){
            if(cur_page != pages[1]){
                var pre_page = cur_page.previousSibling;
                removeClass(cur_page,"cur-page");
                addClass(pre_page,"cur-page");
                cur_page = pre_page;
                getCourse();
            }
        });
        //向右翻页
        addEvent(pages[pages.length-1],"click",function(){
            if(cur_page != pages[pages.length-2]){
                var next_page = cur_page.nextSibling;
                removeClass(cur_page,"cur-page");
                addClass(next_page,"cur-page");
                cur_page = next_page;
                getCourse();
            }
        }); 
    }
}
addLoadEvent(tab);

