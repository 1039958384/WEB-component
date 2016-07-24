# 本仓库是我实践过程中自己开发的 WEB 组件
## WEB 组件开发过程中遇到的问题总结：
### 最简单的 WEB 组件 开发加载方式

* 以外部文件引入的方式，引入该组件的 css 文件
* 以外部文件引入的方式，引入该组件的 js 文件，js 以对象的方式对该外部组件进行封装
* 应用层加载时，直接对 该 WEB 组件 进行实例化，通过实例化的对象调用该组件的功能接口和属性进行WEB应用开发

### 命名空间

* 当引入多个 WEB 组件 时，多个css文件之间 或 多个js文件之间容易导致命名冲突
* 解决办法 ： 给 css 的类名或id名 加组件前缀 如 Layer_screen ；
* 将JS文件通过匿名空间隔开共有私有，对应用层只暴露出一个类接口,如 ：

Layer.js
```JavaScript
(function(){
    function Layer (){
      this.head="a";
      this.content="b";
    }
    Layer.prototype={
      init : function(){......};
      drag : function(){......};
      ......
    }
    window.Layer = Layer;
})();
```

index.js
```JavaScript
  var pop = new Layer;
  pop.init();
```

### 基于require.js重构代码

当页面组件太多时，会导致加载项太多，破坏页面整洁度；且各个组件之间的依赖关系需要手动处理。<br>
这时候就需要 require.js 这种模块化工具。<br>
require.js 是一个 AMD规范的 JavaScript 文件和模块加载器，可以提高代码加载速度。它通过define定义模块、声明模块依赖，通过require定义程序的执行入口。
## 本仓库中的 WEB 组件说明

以下4个WEB组件都可以兼容所有主流浏览器及IE8。

1. 弹出层组件(Layer) ：[Demo](https://1039958384.github.io/WEB-component/Layer/); <br>
   弹出层组件是以 require.js对代码做了重构，用require.js 引入WEB组件的示例, 也可以 像Calendar一样 以外部文件的方式引入 Layer.js 和 Layer.css 。

2. 日历组件(Calendar) ：[Demo](https://1039958384.github.io/WEB-component/Calendar/);

3. 支持表头冻结的可排序表格组件(SortableTable) ：[Demo](https://1039958384.github.io/WEB-component/SortableTable/);

4. 富文本编辑器组件(Editor) : [Demo](https://1039958384.github.io/WEB-component/Editor/)。
