(function () {
   
    function Editor(div){
		this.tag = div;
		
		this.initAll();
	};
    
    Editor.prototype = {
		//生成DOM及初始化
		initAll : function(){
			var ihtml="";
			ihtml='<div id="Editor">'+
	                '<ul class="toolBar">'+
		                '<li class="fontNameBtn"><img src="images/4.gif" alt="字体" title="字体"/>'+
		                    '<ul><li unselectable="on">宋体</li><li unselectable="on">仿体</li><li unselectable="on">黑体</li><li unselectable="on">楷体</li><li unselectable="on">微软雅黑</li><li unselectable="on">Arial</li><li unselectable="on">Arial Black</li><li unselectable="on">Times New Roman</li><li unselectable="on">Comic Sans MS</li></ul>'+
                        '</li>'+
		                '<li class="fontSizeBtn"><img src="images/5.gif" alt="字号" title="字号"  />'+
							'<ul><li unselectable="on">极小号</li><li unselectable="on">特小号</li><li unselectable="on">小号</li><li unselectable="on">中号</li><li unselectable="on">大号</li><li unselectable="on">特大号</li><li unselectable="on">极大号</li></ul>'+
		                '</li>'+
		                '<li class="line"> </li>'+
						'<li class="boldButton"><img src="images/6.gif" alt="加粗" title="加粗" /></li>'+
						'<li class="italicButton"><img src="images/7.gif" alt="倾斜" title="倾斜" /></li>'+
						'<li class="underLineButton"><img src="images/8.gif" alt="下划线"  title="下划线"/></li>'+
						'<li class="line"> </li>'+
						'<li class="leftAlign"><img src="images/9.gif" alt="左对齐"  title="左对齐"/></li>'+
						'<li class="centerAlign"><img src="images/10.gif" alt="居中对齐"  title="居中对齐"/></li>'+
						'<li class="rightAlign"><img src="images/11.gif" alt="右对齐" title="右对齐" /></li>'+
						'<li class="line"> </li>'+
						'<li class="setFontColor"><img src="images/16.gif" alt="字体颜色" title="字体颜色" /></li>'+
						'<li class="setBgColor"><img src="images/17.gif" alt="背景颜色" title="背景颜色" /></li>'+
						'<li class="line"> </li>'+
						'<li class="insertLink"><img src="images/18.gif" alt="插入超链接"  title="插入超链接"/></li>'+
						'<li class="insertImage"><img src="images/19.gif" alt="插入图片" title="插入图片" /></li>'+
						'<li class="insertQQ"><img src="images/20.gif" alt="插入表情" title="插入表情" /></li>'+
						'<li class="line"> </li>'+
						'<li class="viewHTML"><input type="checkbox" name="view" title="查看HTML源代码" class="view" /></li>'+
					'</ul>'+
					'<textarea name="content" class="content"></textarea>'+
					'<iframe id="EditorFrame" frameborder="0"></iframe>'+
					'<table class="portraitTable"></table>'+
					'<table class="colorTable"></table>'+
				'</div>';
				
			this.tag.innerHTML = ihtml;

            //隐藏textarea
			var textArea = document.querySelector("#Editor .content");
			textArea.style.display="none";//元素不再占有空间
			//textArea.style.visibility="hidden";//元素仍然占有空间

            //初始化编辑器
			var EditorFrame = document.querySelector("#Editor #EditorFrame");
			var FrameWin = EditorFrame.contentWindow;
			var FrameDoc = FrameWin.document;
			FrameDoc.designMode = "on";//设置为可编辑
			
			FrameDoc.write("<!DOCTYPE html><html><head><title>Content</title><style type='text/css'> body {margin:0;padding:10px;}</style></head><body> </body></html>");
			FrameDoc.close();//防止网页一直处于加载状态
			
			//添加事件交互
            this.addEvent();			
		},
		
		//添加交互事件
		addEvent : function(){	
		    //点击iframe时关闭所有弹出层
			this.popClose();
			//查看HTML源代码
			this.viewHTML();
			//插入表情和颜色表格
			this.insertQ();
			this.insertColor();
			//设置字体字号
			this.setFont();
			//插入图片和超链接
			this.insertUrl();
			//设置文本格式
			this.setFormat();	
		},
		
		//点击iframe时,关闭所有的层
		popClose : function(){
			var FrameDoc = document.querySelector("#Editor #EditorFrame").contentWindow.document;
			var portraitTable = document.querySelector("#Editor .portraitTable");
			var colorTable = document.querySelector("#Editor .colorTable");
			var nameUl = document.querySelector("#Editor .fontNameBtn ul");
			var sizeUl = document.querySelector("#Editor .fontSizeBtn ul");
			
			this.addHandler(FrameDoc,"click",function(){
				portraitTable.style.display="none";
				colorTable.style.display="none";
				nameUl.style.display="none";
				sizeUl.style.display="none";
			});
		},
		
		//查看HTML源代码按钮-----在 textarea 和 iframe 之间切换
		viewHTML : function(){
			var EditorFrame = document.querySelector("#Editor #EditorFrame");
			var FrameDoc = EditorFrame.contentWindow.document;
			var textArea = document.querySelector("#Editor .content");
			var viewHTML = document.querySelector("#Editor .viewHTML .view");
			viewHTML.checked = false;
			this.addHandler(viewHTML,"click",function(){
				if (viewHTML.checked) {
					textArea.value = FrameDoc.body.innerHTML;
					textArea.style.display="block";
					EditorFrame.style.display="none";
				} else {
					textArea.style.display="none";
					EditorFrame.style.display="block";
					FrameDoc.body.innerHTML = textArea.value;
				}
			});
		}, 
	
	    //QQ表情
		insertQ : function(){
			var editor = document.querySelector("#Editor");
			var table = document.querySelector("#Editor .portraitTable");
			var portraitTable = getPortraitTable(table,"表情",11);
			var colorTable = document.querySelector("#Editor .colorTable");
			var nameUl = document.querySelector("#Editor .fontNameBtn ul");
			var sizeUl = document.querySelector("#Editor .fontSizeBtn ul");
			
			editor.appendChild(portraitTable);
			
			var insertQQ = document.querySelector("#Editor .insertQQ");
			var that = this;
			
			this.addHandler(portraitTable,"click",function(evt){
				var evt = evt || window.event;
				var target = evt.target || evt.srcElement; //兼容IE
				if (target.tagName =="IMG") {
					that.cmd("InsertImage",target.src);
					portraitTable.style.display="none";
				}
			});
			
			
			this.addHandler(insertQQ,"click",function(){
				colorTable.style.display="none";
				nameUl.style.display="none";
				sizeUl.style.display="none";
				
				that.toggle(portraitTable,"display","block","none");
			});
			//产生QQ表情
			function getPortraitTable(table,caption,cols) {
				var PortraitText = ["微笑","撇嘴","色","发呆","得意","流泪","害羞","闭嘴","睡","大哭","尴尬","发怒","调皮","呲牙","惊讶","难过","酷","冷汗","抓狂","吐","偷笑","可爱","白眼","傲慢","饥饿","困","惊恐","流汗","憨笑","大兵","奋斗","咒骂","疑问","嘘...","晕","折磨","衰","骷髅","敲打","再见","擦汗","抠鼻","鼓掌","糗大了","坏笑","左哼哼","右哼哼","哈欠","鄙视","委屈","快哭了","阴险","亲亲","吓","可怜"];
				if (caption) {table.createCaption().innerHTML = caption;}
				
				var PortraitNum = PortraitText.length;
				var rowsNum = Math.ceil(PortraitNum/cols);
				var row;
				var cell;
				var img;
				var index;
				for (var i=0;i<rowsNum;i++) {
					row = table.insertRow(i);
					for (var j=0;j< cols;j++) {
						index = cols*i+j;
						if (PortraitText[index]) {
							cell = row.insertCell(j);
							img = document.createElement("img");
							img.title= PortraitText[index];
							img.alt =PortraitText[index];
							img.src="images/portrait/"+index+".gif";
							cell.appendChild(img);
						} else {
							break;
						}
					}
				}
				return table;
			};	
		}, 
		
		//颜色表
		insertColor : function(){
			var editor = document.querySelector("#Editor");
			var table = document.querySelector("#Editor .colorTable");
			var colorTable = getColorTable(table);
	        editor.appendChild(colorTable);
			
			var portraitTable = document.querySelector("#Editor .portraitTable");
			var nameUl = document.querySelector("#Editor .fontNameBtn ul");
			var sizeUl = document.querySelector("#Editor .fontSizeBtn ul");
			
			var setFontColor = document.querySelector("#Editor .setFontColor");
			var setBgColor = document.querySelector("#Editor .setBgColor");
			
			var that = this;
			
			this.addHandler(setFontColor,"click",function(){
				portraitTable.style.display="none";
				nameUl.style.display="none";
				sizeUl.style.display="none";
				
				that.toggle(colorTable,"display","block","none");
				colorTable.command ="ForeColor";
				colorTable.onclick = setColor;
			});
			
			this.addHandler(setBgColor,"click",function(){
				portraitTable.style.display="none";
				nameUl.style.display="none";
				sizeUl.style.display="none";
				
				that.toggle(colorTable,"display","block","none");
				colorTable.command ="BackColor";
				colorTable.onclick = setColor;
			});
			//产生颜色表
			function getColorTable(table){
				table.createCaption().appendChild(document.createTextNode("颜色表"));
				table.cellspacing=0;
				table.cellpadding=0;

				var row = table.insertRow(0);
				for (var i=0;i<12;i++) {
					for (var j=0;j<18;j++) {
						var cell = row.insertCell(row.cells.length);
						cell.innerHTML ="&nbsp;";

						var g = fixColor((j>6)?((j%6)*3):j*3);
						var b = fixColor((i>6)?((i%6)*3):i*3);
						var r =parseInt(j/6)*3;

						if (i>5) {r+=9;}
						r= fixColor(r);
						var color = "#"+r+r+g+g+b+b;

						cell.style.backgroundColor=color;
						cell.title = color;
						cell.setAttribute("unselectable","on");

					}

					row = table.insertRow(table.rows.length);
				}
				
				row = table.insertRow(table.rows.length);
				return table;
				
				function fixColor(c) {
					var hexNum = [0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"];
					c = parseInt(c);
					return hexNum[c]?hexNum[c]:0;
				}
			};
			
			//设置颜色
			function setColor(evt){
				var evt =evt || window.event;
				var obj = evt.target || evt.srcElement;
				if (obj.tagName=="TD" && obj.title) {
					that.cmd(this.command,obj.title);
					this.style.display="none";
				}
			};
			
		},
		
		//设置字体字号
	    setFont : function(){
			//字体
			var fontName = document.querySelector("#Editor .fontNameBtn");
			var nameUl = fontName.querySelector("ul");
			var nameLi = nameUl.querySelectorAll("li");
			var portraitTable = document.querySelector("#Editor .portraitTable");
			var colorTable = document.querySelector("#Editor .colorTable");
			
			var _this=this;
			
			this.addHandler(fontName,"click",function(){
				_this.toggle(nameUl,"display","block","none");
				portraitTable.style.display="none";
				colorTable.style.display="none";
				sizeUl.style.display="none";
			});
				
			for(var i=0;i<nameLi.length;i++){
				(function(j){
					_this.addHandler(nameLi[j],"mouseover",function(){
						nameLi[j].style.backgroundColor="#eee";
					});
					_this.addHandler(nameLi[j],"mouseout",function(){
						nameLi[j].style.backgroundColor="#fff";
					});
					_this.addHandler(nameLi[j],"click",function(){
						_this.cmd("FontName",nameLi[j].innerHTML);
					});
				})(i)
				
			};
			//字号
			var fontSize = document.querySelector("#Editor .fontSizeBtn");
			var sizeUl = fontSize.querySelector("ul");
			var sizeLi = sizeUl.querySelectorAll("li");
			
			this.addHandler(fontSize,"click",function(){
				_this.toggle(sizeUl,"display","block","none");
			
				portraitTable.style.display="none";
				colorTable.style.display="none";
				nameUl.style.display="none";
			});
			for(var i=0;i<sizeLi.length;i++){//position为static时无法获取焦点
				(function(j){
					_this.addHandler(sizeLi[j],"mouseover",function(){
						sizeLi[j].style.backgroundColor="#eee";
					});
					_this.addHandler(sizeLi[j],"mouseout",function(){
						sizeLi[j].style.backgroundColor="#fff";
					});
					_this.addHandler(sizeLi[j],"click",function(){
						_this.cmd("FontSize",j+1);
					});
				})(i)
				
			};	
		},
		
		//插入图片和超链接
		insertUrl : function(){
			var FrameWin = EditorFrame = document.querySelector("#Editor #EditorFrame").contentWindow;
			var insertImage = document.querySelector("#Editor .insertImage");
			var insertLink = document.querySelector("#Editor .insertLink");
			var that = this;
			//图片
			this.addHandler(insertImage,"click",function(){
				var url = prompt("请输入图像地址!","http://");
				if (url && url!= "http://") {
					var img = document.createElement("img");

					img.onload = function () {
						that.cmd("InsertImage",url);
					};

					img.onerror =function () {
						alert("图像载入出错,请检查您输入的URL是否正确!\n"+url);
					};

					img.src=url;
				}
			});

			//超链接
			this.addHandler(insertLink,"click",function(){
				//if (!!window.ActiveXObject) {//判断是否为IE浏览器
					that.cmd("CreateLink");
				//} else {
					if (!FrameWin.getSelection().toString()) {
						return alert("请先选择要添加链接的文本!");
					}

					var url = prompt("请输入URL:","http://");

					if (url && url != "http://") {
						that.cmd("CreateLink",url);
					}
				//}
			});
		},
		
		//改变文本格式:加粗,倾斜,下划线,左/右/居中对齐
		setFormat : function(){
			var _this=this;
			//加粗
			var boldButton = document.querySelector("#Editor .boldButton");
			boldButton.onclick = function () {
				_this.cmd("Bold");
			};
			//倾斜
			var italicButton = document.querySelector("#Editor .italicButton");
			italicButton.onclick = function () {
				_this.cmd("Italic");
			};
			//下划线
			var underLineButton=document.querySelector("#Editor .underLineButton");
			underLineButton.onclick = function () {
				_this.cmd("UnderLine");
			};
			//左对齐
			var leftAlign =document.querySelector("#Editor .leftAlign");
			leftAlign.onclick = function () {
				_this.cmd("JustifyLeft");
			};
			//右对齐
			var rightAlign =document.querySelector("#Editor .rightAlign");
			rightAlign.onclick = function () {
				_this.cmd("JustifyRight");
			};
			//居中对齐
			var centerAlign =document.querySelector("#Editor .centerAlign");
			centerAlign.onclick = function () {
				_this.cmd("JustifyCenter");
			};

		},
		
		//执行命令
		cmd : function(type,param){
			var EditorFrame = document.querySelector("#Editor #EditorFrame");
			var FrameWin = EditorFrame.contentWindow;
			
			FrameWin.focus();
		    FrameWin.document.execCommand(type,false,null||param);
		},
		
	    //切换函数
		toggle : function(obj,css,val1,val2){
			obj.style[css]= obj.style[css]==val1?val2:val1;
		},
		
		//事件绑定浏览器兼容性处理
		addHandler : function(element, type, handler){
			if(element.addEventListener) {
				addHandler = function(element, type, handler) {
					element.addEventListener(type, handler, false);
				};
			} else if (element.attachEvent) {
				addHandler = function(element, type, handler) {
					element.attachEvent("on"+type, handler);
				};
			} else {
				addHandler = function(element, type, handler) {
					element["on"+type] = handler;
				};
			}
			return addHandler(element, type, handler);
	    }
	
	} 	
	
    window.Editor = Editor;
	
})();
