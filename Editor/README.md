# 用JS实现的精简版的富文本编辑器
   [Demo](https://1039958384.github.io/WEB-component/Editor/)

## 让网页处于编辑状态的三种方法

* 文本域
常见输入框(textarea,input)，只能输入文字，不能输入图片或链接等多媒体元素

* 将元素的 contenteditable属性设为true 的div
如果利用div开发富文本编辑器的话，就无法借助现成的document.execCommand方法。<br>
那么就需要先提取选中的文字，然后再对选中的文字对象做处理，处理完后再获取光标位置，最后插入到对应的位置，还要处理浏览器的兼容性。<br>

* 设置了designMode为”on”的iframe
在网页中插入iframe，那么iframe就可以看做一个单独的文档，<br>
将iframe的designMode属性设置为on，再使用结合document.execCommand方法,<br>
就可以在这个文档中实现编辑、插入等功能。


##实现

* 新建iframe并将textArea隐藏，便于在源码以及编辑进行切换。

* 将iframe设置为可编辑
```JavaScript
FrameDoc.designMode = "on";
FrameDoc.write("<!DOCTYPE html><html><head><title>Content</title><style type='text/css'> body {margin:0;padding:10px;}</style></head><body> </body></html>");
FrameDoc.close();//防止网页一直处于加载状态
```

* JavaScript提供了操作文档的方法，即document.execCommand，通过该命令实现编辑命令。此方法有三个参数，用法如下：

```JavaScript
document.execCommand(commandName,false,[null|string]);
```

第一个参数commandName：要执行的命令名称<br>
第二个参数false：应该始终设置为false，因为在firefox中若参数为true时报错<br>
第三个参数null或者字符串：表示浏览器是否应该为当前命令提供用户界面的一个布尔值和执行命令必须的一个值（如果不需要值，则传递null）

## 实现过程中遇到的问题

* 低版本的ie中，点击iframe以外的元素，iframe会失去焦点，回到iframe第一行最开始编辑的位置。

解决方案是给选择功能的元素加属性值on的unselectable属性。
```JavaScript
ele[i].setAttribute("unselectable" , "on");
```

* 低版本ie在execCommand方法中不支持三位数的颜色。

即
```JavaScript
iframeDocument.execCommand("ForeColor",false,"#369");//设置背景颜色正常,设置字体颜色失效
```

命令在IE中不起重要,将产生颜色值修改为6位数，字体颜色也起作用了。
```JavaScript
iframeDocument.execCommand("ForeColor",false,"#336699");//设置背景颜色正常,设置字体颜色失效
```