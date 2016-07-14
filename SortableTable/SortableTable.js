
(function(){
	
	function SortableTable(table,init){
		this.table = table;
		this.init = init;
		
		if(this.init.FrozenThead == undefined){
			this.init.FrozenThead = false;
		}
		if(this.init.sortable == undefined){
			this.init.sortable = [];
		}
		
	}
	
	
	SortableTable.prototype = {
		
		//创建表格
		genTable : function(){
			this.createThead();//创建表头
			this.createTbody();//创建表格主体
		},
		
		//创建表头
		createThead : function(){
			var thead = document.createElement("thead");
			var tr = document.createElement("tr");
			tr.style.background = this.init.thTrBackground;
			
			//冻结thead
			if(this.init.FrozenThead){
				this.addHandler(window,"scroll",function(){
					var scrollTop = document.documentElement.scrollTop|| document.body.scrollTop;
					if(scrollTop < table.offsetTop){//视口还未接触到表格上边沿
						thead.style.position="static";
					}else if(scrollTop >= table.offsetTop && scrollTop <= table.offsetTop + table.offsetHeight){
						thead.style.position="fixed";    //(视口上边沿在表格的上、下边沿之间时)
						thead.style.top=0;
						thead.style.left=table.offsetLeft;
					}else {//表格离开视口
						thead.style.position = 'absolute';//为了让表格不回退---
												//重新设置为static时表格会回退，表头会来回闪
					}
				});
			}
			
			
			//添加数据
			for (var i=0; i<this.init.colNum; i++){
				var td = document.createElement("td");
				
				this.addTdStyle(td);//td的通用样式
				//表头td的特殊样式
				td.style.fontWeight = this.init.thTdFontWeight;
				td.style.color = this.init.thTdColor;
				
				var tdText = document.createTextNode(this.init.thTrContent[i]);
				td.appendChild(tdText);
				
				//给指定的表头中的td添加排序功能
				td.style.position = "relative";
				td.style.top = "0px";
				td.style.left = "0px";
				if(this.indexOf(this.init.sortable,i+1) != -1){//给后四个td添加排序按钮--排序功能配置
					this.addupTria(td); //默认排序方式:从小到大排序
					this.addlowTria(td); //从大到小排序
				}
				
				tr.appendChild(td);
			}
			thead.appendChild(tr);
			this.table.appendChild(thead);
		},
		
		//创建表格主体部分
		createTbody : function(){
			var tbody = document.createElement("tbody");
			for(var i=0; i<this.init.rowNum-1; i++){//创建tr
				var tr = document.createElement("tr");
				for(var j=0; j<this.init.colNum; j++){//创建td
					var td = document.createElement("td");
					
					this.addTdStyle(td);//给td设置样式
					
					var tdText = document.createTextNode(this.init.tbTrContent[i][j]);
					td.appendChild(tdText);
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			}
			this.table.appendChild(tbody);
		},
		
		//给所有td设置统一样式
		addTdStyle : function(td){
			td.style.width = this.init.tdWidth;
			td.style.height = this.init.tdHeight;
			td.style.fontSize = this.init.fontSize;
			td.style.lineHeight = this.init.lineHeight;
			td.style.border = this.init.border;
		},
		
		//设置上三角样式
		addupTria : function(td){
			var span = document.createElement("span");
			
			this.addTria(span,true);//从小到大排序
			
			span.style.top="10px";
			span.style.borderBottom="12px solid #fff";
			
			td.appendChild(span);
		},
		
		//设置下三角样式
		addlowTria : function(td){
			var span = document.createElement("span");
			
			this.addTria(span,false);//从大到小排序
			
			span.style.bottom="10px";
			span.style.borderTop="12px solid #fff";
			
			td.appendChild(span);
		},
		
		//给td中添加三角的基础样式和排序功能
		addTria : function(span,flag){
			span.style.position="absolute";
			span.style.right="30px";
			span.style.display="inline-block";
			span.style.width="0px";
			span.style.height="0px";
			
			span.style.borderLeft="6px solid transparent";
			span.style.borderRight="6px solid transparent";
			
			span.style.cursor="pointer";
			
			//点击上下三角实现：该列数据排序
			var _this = this;
			this.addHandler(span,"click",function(event){
				//获取该列索引 
				var e = window.event || event;
				var src = e.srcElement || e.target;
				//alert(e.target)//----IE8中的this指向window  换为e.srcElement
				var text = _this.getInnerText(src.parentNode);
				var index = _this.indexOf(_this.init.thTrContent,text);//得到点击列数的索引值
				
				//获取该列数据
				var temp=[];
				for(var i=0;i<_this.init.rowNum-1;i++){
					temp.push(_this.init.tbTrContent[i][index]);
				}

				//根据temp中的值，对this.init.tbTrContent的行进行排序
				if(flag){//flag=true时从小到大排序
					_this.init.tbTrContent.sort(function(x,y){return x[index]-y[index];});
				}else{//否则相反
					_this.init.tbTrContent.sort(function(x,y){return y[index]-x[index];});
				}	
				
				//根据排完序的this.init.tbTrContent重新渲染tbody
				table.removeChild(src.parentNode.parentNode.parentNode.nextSibling);//移除"tbody"
				_this.createTbody();
			});
		},
		
        //跨浏览器获取节点的文本		
        getInnerText : function(node){
			return node.innerText ? node.innerText : node.textContent;
		},
		
		//indexOf兼容IE8
		indexOf : function(array, item){
			var result=-1;
			if(array.length==0) return result;
			
			if(array.indexOf){
				result = array.indexOf(item);
			}else{
				for(var i=0;i<array.length;i++){
					if(array[i] == item){
						result=i; 
						break;
					}
				}
			}
			return result;
		},
		
	    //事件绑定浏览器兼容性处理
		addHandler : function (element, type, handler) {
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
 
 
    window.SortableTable = SortableTable;
	
})();