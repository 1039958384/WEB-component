(function(){
	
	function Calendar(option){
		this.element = option.element;
		
		this.date = new Date;
		this.year = this.date.getFullYear(); //得到当前年份
		this.month = this.date.getMonth()+1; //得到当前月份
		this.day = this.date.getDate();  //得到当前日期
		this.th= ["日","一","二","三","四","五","六"];
		this.tb=[];//存储表格数据	
		
		this.selMonth;
		this.selYear;
		this.selDay;
		
		this.getDate = option.showDate;
		this.callback = option.callback;
		
		this.display();
		
	}
	
	Calendar.prototype = {
		display : function(){
		
			this.genDom();
			
			var	prevMonthBtn = document.querySelector(".left"),
				nextMonthBtn = document.querySelector(".right");
				
		    //默认情况下显示当前日期
			//获取日期接口
			this.selMonth = this.month;   //存储当前日历中选中的月
			this.selYear = this.year;     //存储当前日历中选中的年份
			this.selDay = this.day;         //存储当前日历中选择的天
			this.getSelDate();
			
			//产生设定日期对应的日历	
			this.getEcho();//日历最上方显示当前年月
			this.tbodyData();
			this.genTable();
			
			var _this = this;
            //点击左右三角，切换到上一月或下一月
			this.addHandler(prevMonthBtn,"click",function(){
				_this.prevDay();
				
			});
			this.addHandler(nextMonthBtn,"click",function(){
				prevMonthBtn.style.borderRight='7px solid #FFF';
				_this.nextDay();
			});
		},
		
		//生成Dom
		genDom : function(){
			this.element.innerHTML = '<div class="calendar"><form>'+
									  '<span class="left"></span>'+
									  '<div class="echo">2016年05月</div>'+
									  '<span class="right"></span>'+
								  '</form>'+
								  '<table class="tb"></table></div>';
		},
		
		//在文本框中显示用户选择的日期
		getSelDate : function(){
			if(parseInt(this.selMonth)<=9){
					if(parseInt(this.selDay)<=9){
						this.getDate.value=this.selYear+"-"+"0"+this.selMonth +"-0"+this.selDay;
					}else{
						this.getDate.value=this.selYear+"-"+"0"+this.selMonth +"-"+this.selDay;
					}
				}else{
				   this.getDate.value=this.selYear+ "-"+this.selMonth +"-"+this.selDay;
				}
				this.callback();
		},

		//获取当前年月
		getEcho : function(){
			var echo = document.querySelector(".echo");
			if(parseInt(this.selMonth)<=9){
				echo.innerHTML=this.selYear+"年0" + this.selMonth +"月";
			}else{
			   echo.innerHTML=this.selYear+"年" + this.selMonth +"月";
			}
		},
		
		//点击左三角的处理函数
		prevDay : function(){
			var table = document.querySelector(".tb");
			if(this.selMonth == 1){
					this.selMonth = 12;
					this.selYear = this.selYear-1;
				}else{
					this.selMonth = this.selMonth-1;
					this.selYear = this.selYear;
				}
				//更新日历
				this.getEcho();
				this.tbodyData();
				//根据tb的值重新渲染日历表格
				table.removeChild(document.getElementsByTagName("thead")[0]);
				table.removeChild(document.getElementsByTagName("tbody")[0]);
				this.genTable();
		},
		
		//点击右三角的处理函数
		nextDay : function(){
			var table = document.querySelector(".tb");
			if(parseInt(this.selMonth) == 12){
					this.selMonth = 1;
					this.selYear = parseInt(this.selYear)+1;
				}else{
					this.selMonth = parseInt(this.selMonth)+1;
					this.selYear = this.selYear;
				}
				//更新日历
				this.getEcho();
				this.tbodyData();
				//根据tb的值重新渲染日历表格
				table.removeChild(document.getElementsByTagName("thead")[0]);
				table.removeChild(document.getElementsByTagName("tbody")[0]);
				this.genTable();
		},
		
		//产生日历表格tb数据
		tbodyData : function(){
			var selDate = new Date(this.selYear,this.selMonth);
		   //得到该月的天数
			var days = selDate.getUTCDate();
		   //得到该月的1号是星期几
			//Date对象的getDay()方法,返回日期是星期几:0-6
			var week = new Date(this.selYear,this.selMonth-1,1).getDay();
			
		   //得到表格的初始化数据
			//声明二维数组的方式
			for(var i=0;i<6;i++){
				this.tb[i]=[];
			}
			
			var preDays = new Date(this.selYear,this.selMonth-1).getUTCDate();
			
			//得到数组的第一行
			if(week == 0){
				for(var i=0;i<7;i++){
					this.tb[0][i]= preDays-6+i;
				}
			}else{
				this.tb[0][week]=1;
				for(var i=0;i<7;i++){
					if (i<week){//不可选日期
						this.tb[0][i]=preDays-week+1+i;				
					}else if(i>week){
						this.tb[0][i]=this.tb[0][i-1]+1;
					}
				}
			}
			//得到后面的数据
			for (var i=1;i<6;i++){
				for (var j=0; j<7; j++){
					if(week==0) this.tb[1][0]=1;
					else this.tb[1][0]=this.tb[0][6]+1;
					
					if(j==0 && i!=1){
						this.tb[i][j]= this.tb[i-1][6]+1;
					}else{
						this.tb[i][j]= this.tb[i][j-1]+1;
					}

					if(this.tb[i][j] > days){//不可选日期
						this.tb[i][j] = this.tb[i][j]-days;
					}
					
				}
			}
		},
		
		//根据表格数据动态产生日历表格
		genTable : function(){
			this.createThead();//创建表头
			this.createTbody(this);//创建表格主体
		},
		createThead : function(){
			var table = document.querySelector(".tb");
			var thead = document.createElement("thead");
			var tr = document.createElement("tr");
			
			for (var i=0; i<this.th.length; i++){
				var td = document.createElement("td");
				var tdText = document.createTextNode(this.th[i]);
				td.appendChild(tdText);
				tr.appendChild(td);
			}
			thead.appendChild(tr);
			table.appendChild(thead);
		},
        createTbody : function(_this){
				var table = document.querySelector(".tb");
				var current_td=[];//存储本月的td元素
				var preMonth_td=[];//存储上月的td元素
				var nextMonth_td=[];//存储下月的td元素
				
				var tbody = document.createElement("tbody");
				for(var i=0; i<this.tb.length; i++){
					//创建tr
					var tr = document.createElement("tr");
					for(var j=0; j<this.tb[i].length; j++){
						//创建td
						var td = document.createElement("td");
						var tdText = document.createTextNode(this.tb[i][j]);
						td.appendChild(tdText);
		
						if(i==0 && this.tb[i][j]>7){ //将上月的td添加临时数组
							td.style.color="#999";
							preMonth_td.push(td);
						}else if(i>3 && this.tb[i][j]<20){//将下月的td添加临时数组
							td.style.color="#999";
							nextMonth_td.push(td); 
						}else{//将本月的td添加临时数组
							current_td.push(td);					
						}
						tr.appendChild(td);
					}
					tbody.appendChild(tr);
				}
				
				//给本月日期添加点击事件的处理函数
				for(var i=0;i<current_td.length;i++){
					this.addHandler(current_td[i],"mouseover",function(event){
						var e = window.event||event; //--兼容IE8
					    var srcElement = e.target || e.srcElement;
						
						srcElement.style.backgroundColor="#f96";
						srcElement.style.color="#fff";
					});
					this.addHandler(current_td[i],"mouseout",function(){
						clearColor();	
					});
					
					this.addHandler(current_td[i],"click",function(event){
						var e = window.event||event;
					    var srcElement = e.target || e.srcElement;
						
						_this.selDay = srcElement.innerHTML;
						
						_this.element.style.display="none";
						
						_this.getSelDate();
					});
				}
				
				//给上月日期添加点击事件的处理函数
				for(var i=0;i<preMonth_td.length;i++){
					this.addHandler(preMonth_td[i],"click",function(event){
						
						var e = window.event||event;
						var srcElement = e.target || e.srcElement;
						
						_this.prevDay();
					});
				}
				//给下月日期添加点击事件的处理函数
				for(var i=0;i<nextMonth_td.length;i++){
					this.addHandler(nextMonth_td[i],"click",function(event){
						
						var e = window.event||event;
						var srcElement = e.target || e.srcElement;
						
						_this.nextDay();//选择不是当月日期时不显示
					});
				}
				
				
				function clearColor(){
					if(current_td.forEach){//IE8不支持forEach
						current_td.forEach(function(element){
							element.style.backgroundColor="#fff";
							element.style.color="#636";
						});
					}else{
						for(var i=0;i<current_td.length;i++){
							current_td[i].style.backgroundColor="#fff";
							current_td[i].style.color="#636";
						}
					}	
				}
				
				table.appendChild(tbody);
		},
		
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
	
	
	window.Calendar = Calendar;
	
})();
	
	
