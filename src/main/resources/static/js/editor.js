/**
 * 配置参数
 * */
layui.config({
	dir: '/zuozhan/common/layui/',
	base: '/zuozhan/js/'
})
layui.use(['form','upload','laydate','layer','autocomplete'], function(){
  var form = layui.form;
  var upload = layui.upload;
  var layer=layui.layer;
  var laydate=layui.laydate;

  
  var autocomplete = layui.autocomplete;
  //各种基于事件的操作，下面会有进一步介绍
	  autocomplete.render({
		    elem: $('#memberName'),
		    url: searchOptions.url,
		    method:'get',
		    template_val: '{{d.name}}',
		    template_txt: '{{d.id}} <span class=\'layui-badge layui-bg-gray\'>{{d.name}}</span>',
		    onselect: function (resp) {
		    	//选择的参数,例如：{"id":"0002","name":"执行单元1"}
		    	searchOptions.callback(resp);
		    }
		})
 
  var uploadInst = upload.render({
	    elem: '#test1' //绑定元素
	    ,url: PathUtils.upload() //上传接口
	    ,field:'file'
	    ,multiple:true
	    ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
	        layer.load(); //上传loading
	      }
	    ,done: function(res){
	    	layer.closeAll('loading');
	      $("#bannerImg").attr("src",PathUtils.preUrl()+res.data.path);
	      $("input[name='src']").val(res.data.path);
	      alert("上传成功"+JSON.stringify(res));
	    }
	    ,error: function(){
	      //请求异常回调
	    	layer.closeAll('loading');
	    }
	  });
  var checkBox=[];
  var targets=[];
  form.on('checkbox(box)', function(data){
	  console.log(data.value); //复选框value值，也可以通过data.elem.value得到
	  //checkBox作为key
	  checkBox.push({"id":data.value});
	  targets.push({"name":data.elem.title});
	});
  form.on('submit(sub)', function(data){
	  console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
	  console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
	  console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
	  //data.field.icon={"src":data.field.src,"id":data.field.imgId}
	  data.field.targets=checkBox;
	  var a=JSON.stringify(data.field);
	  console.log(a);
	  
	  save(a,function(data){
		  console.log(JSON.stringify(data));
		  layer.msg("操作成功");
		  var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		  parent.layer.close(index);
		  //window.parent.location.reload();
		  //window.location.href=findAll
	  });
	  return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
  
  form.on('submit(next)', function(data){
	  console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
	  console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
	  console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
	  //data.field.icon={"src":data.field.src,"id":data.field.imgId}
	  var items=[];
		$("input[type='checkbox']:checked").each(function(){
			var item={};
			item.id=$(this).val();
			items.push(item);
		})
		data.field.targets=items;
	  var a=JSON.stringify(data.field);
	  next(a,function(data){
		  //var index = parent.layer.getFrameIndex(window.name);
		  window.self.location=PathUtils.task.planList()+data.id;
	  });
	  /*
	  makeNewPlan(a,function(data){
		  var index = parent.layer.getFrameIndex(window.name);
		  layer.iframeSrc(index,"http://127.0.0.1:8080/zuozhan/planList");
	  });*/
	  return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
});
