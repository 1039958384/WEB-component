require(["util","layer"],function(util,layer){
	
	var foot = document.querySelector(".foot");
	var btn = foot.querySelector("button");

	//点击btn,显示弹出层
	util.addHandler(btn,"click",function(){
		
		var draken = document.querySelector(".draken");
		
		layer.layerOut({
			element: draken,
			head : "提示",
			content : "是否发布问卷？",
			callback : function(){
				layer.layerOut({
					element: draken,
					head : "提示",
			        content : "发布成功！",
					callback : function(){}
				});
			}
		});
		
	});
	
});