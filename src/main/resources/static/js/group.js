
layui.use(['table','layer','form'], function(){
  var table = layui.table;
  var form=layui.form;
  var tableId='demoTable';
  //var te=JSON.stringify({'id':'200001','name':'战斗er组'});
  //第一个实例
  table.render({
    elem: '#'+tableId
    ,url:  findAll//数据接口
    ,method:'post'
    //,cellMinWidth: 100
    ,contentType:'application/json'
   ,where:{"condition":data}
  ,response:{
	  statusCode:200,
  }
  ,cellMinWidth:60
  ,done: function(){
	  var index=-1;
	  $("td").hover(function(){
		 index= layer.tips($(this).text(),this,{
			 time:10000
		 });
	  },function(){
		  layer.close(index);
	  });
  }
    ,page: {
    		curr: location.hash.replace('#!fenye=', '') //获取hash值为fenye的当前页
            ,hash: 'fenye' //自定义hash值
          }//开启分页
    ,cols:arr
  });

  form.on('submit(search)', function(data){
	  console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
	  console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
	  console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
	  table.reload(tableId, {
          page: {
            curr: 0 //获取起始页
            ,hash: 'fenye' //重新从第 1 页开始
          },
          where:{"condition":JSON.stringify(data.field)}
        });
	  return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
  
  table.on('checkbox(test)', function(obj){
	  console.log(obj.checked); //当前是否选中状态
	  console.log(obj.data); //选中行的相关数据
	  console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
	});
  
//监听单元格编辑
  table.on('edit(test)', function(obj){
    var value = obj.value //得到修改后的值
    ,data = obj.data //得到所在行所有键值
    ,field = obj.field; //得到字段
    console.log(JSON.stringify(data));
   // layer.msg('[ID: '+ data.id +'] ' + field + ' 字段更改为：'+ value);
    update(JSON.stringify(data),function(data){
    	if(data.result){
    		layer.msg("修改成功");	
    	}
    });
  });
  //监听行双击事件
  table.on('rowDouble(test)', function(obj){
	 // console.log(obj.tr) //得到当前行元素对象
	  console.log(obj.data) //得到当前行数据
	  var cl=false;
	  window.top.layer.open({
	  		title:editorOptions.title,
	  		type:2,
	  		area:editorOptions.area,
	  		resize:false,
	  		moveOut :true,
	  		content:editorOptions.url+obj.data.id,
	  		cancel: function(){
    			cl=true;
    		},
    		end:function(){
    			if(!cl){
    				table.reload(tableId, {
    			          page: {
    			            curr: 0 //获取起始页
    			            ,hash: 'fenye' //重新从第 1 页开始
    			          }
    			        });
    			}
    			console.log('end');
    		}
	  	});
	})
  table.on('tool(test)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
	  
	  var data = obj.data; //获得当前行数据
	 var layEvent=obj.event;
	 var tr = obj.tr; //获得当前行 tr 的DOM对象
	 console.log(JSON.stringify($(tr).find("td[data-field='name']").text()));
	  if(layEvent === 'detail'){ //查看
		  if(!data.id){
				layer.msg("该操作不合法，请重新选择");
			}
		  var rs=window.top.layer.open({
				type:2,
				title:'【'+$(tr).find("td[data-field='name']").text()+'】的详情',
				area:detailOptions.area,
				resize:false,
				moveOut :true,
				content:detailOptions.url+data.id
			});
		  
			
	    //do somehing
	  } else if(layEvent === 'detail1'){ //查看
		  if(!data.id){
				layer.msg("该操作不合法，请重新选择");
			}
		  var rs=window.top.layer.open({
				type:2,
				title:'【'+$(tr).find("td[data-field='name']").text()+'】的详情',
				area:detailOptions.area,
				resize:false,
				moveOut :true,
				content:detailOptions.url+data.id+"&status="+status
			});
		  
			
	    //do somehing
	  }else if(layEvent === 'del'){ //删除
	    layer.confirm('确定删除这条记录值么？',{icon: 3, title:'提示'}, function(index){
	      //obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
	      layer.close(index);
	      //向服务端发送删除指令
	      delOne(JSON.stringify(data),function(data){
	    	  var cur=location.hash.replace('#!fenye=', '');
	    	  var dataIndex = $(obj.tr[0]).attr("data-index");
	    	  var pg=dataIndex==0 && cur!=1 ?dataIndex:cur;
	    	  console.log('cur='+cur+'dataIndex='+dataIndex);
	      	  layer.msg("删除成功");
	      	  //执行重载
	            table.reload(tableId, {
	              page: {
	                //curr:  pg//获取起始页
	              }
	            });
	        });
	    });
	  } else if(layEvent === 'progress'){ //进程
	    //do something
		  var rs=window.top.layer.open({
				type:2,
				title:'【'+$(tr).find("td[data-field='name']").text()+'】的执行进度',
				area:progressOptions.area,
				resize:false,
				moveOut :true,
				content:progressOptions.url+data.id
			});
		  
	  }else if(layEvent === 'getSelect'){ //进程
	    //do something
		  var rs=window.top.layer.open({
				type:2,
				title:'系统方案选择',
				area:['1000px','500px'],
				resize:false,
				moveOut :true,
				content:'/zuozhan/task/planList?taskId='+data.id
			});
	  }else if(layEvent === 'change'){ //改变
	    //更改状态
		  var temp={id:data.id,status:data.status+1};
		  apiClient.saveSelfTask(JSON.stringify(temp),function(data){
			  console.log(JSON.stringify(data));
		  });
		  window.location.reload();
		  
	  }else if(layEvent === 'changeUseStatus'){ //改变
	    //更改状态 1-10是发射区域,20-27是异常区域，40-44是大致区域
		  apiClient.changeUseStatus(JSON.stringify(data),function(data){
			  var cur=location.hash.replace('#!fenye=', '');
	    	  var dataIndex = $(obj.tr[0]).attr("data-index");
	    	  var pg=dataIndex==0 && cur!=1 ?(cur-1):cur;
			  table.reload(tableId, {
	              page: {
	                curr:  location.hash.replace('#!fenye=', '')//获取起始页
	              }
	            });
		  });
		  
	  }else if(layEvent === 'setfire'){ //火力
	    //do something
		  var rs=window.top.layer.open({
				type:2,
				title:'【'+$(tr).find("td[data-field='name']").text()+'】的火力详情',
				area:fireDetail.area,
				resize:false,
				moveOut :true,
				content:fireDetail.url+data.id
			});
		  
	  }else if(layEvent === 'setWeather'){ //气象
	    //do something
		  var rs=window.top.layer.open({
				type:2,
				title:'设置气象',
				area:weatherDetail.area,
				resize:false,
				moveOut :true,
				content:weatherDetail.url+data.id
			});
		  
	  } else if(layEvent === 'setAviation'){ //空情
		    //do something
			  var rs=window.top.layer.open({
					type:2,
					title:'设置空情',
					area:aviationDetail.area,
					resize:false,
					moveOut :true,
					content:aviationDetail.url+data.id
				});
			  
		  }else if(layEvent === 'setFlow'){ //流程
		    //do something
			  var rs=window.top.layer.open({
					type:2,
					title:'设置发射流程',
					area:flowDetail.area,
					resize:false,
					moveOut :true,
					content:flowDetail.url+data.id
				});
			  
		  }else if(layEvent === 'setfire1'){ //火力
			    //do something
			  var rs=window.top.layer.open({
					type:2,
					title:'【'+$(tr).find("td[data-field='name']").text()+'】的火力详情',
					area:fireDetail.area,
					resize:false,
					moveOut :true,
					content:fireDetail.url+data.id+"&enable=true"
				});
			  
		  }else if(layEvent === 'setPics'){ //火力
			    //do something
			  var rs=window.top.layer.open({
					type:2,
					title:'【'+$(tr).find("td[data-field='name']").text()+'】的状态详情',
					area:pics.area,
					resize:false,
					moveOut :true,
					content:pics.url+data.id+"&enable=true"
				});
			  
		  }else if(layEvent === 'setWeather1'){ //气象
		    //do something
			  var rs=window.top.layer.open({
					type:2,
					title:'查看气象',
					area:weatherDetail.area,
					resize:false,
					moveOut :true,
					content:weatherDetail.url+data.id+"&enable=true"
				});
			  
		  } else if(layEvent === 'setAviation1'){ //空情
			    //do something
				  var rs=window.top.layer.open({
						type:2,
						title:'查看空情',
						area:aviationDetail.area,
						resize:false,
						moveOut :true,
						content:aviationDetail.url+data.id+"&enable=true"
					});
				  
			  }else if(layEvent === 'setFlow1'){ //流程
			    //do something
				  var rs=window.top.layer.open({
						type:2,
						title:'查看发射流程',
						area:flowDetail.area,
						resize:false,
						moveOut :true,
						content:flowDetail.url+data.id+"&enable=true"
					});
				  
			  }
	});
  var $ = layui.$, active = {
		 deleteSelect: function(){ //获取选中数据
	      var checkStatus = table.checkStatus(tableId)
	      ,data = checkStatus.data;
	      //已经获取到全部的数据
	      //alert(JSON.stringify(data));
	      layer.confirm("您确定要删除已选择的数据么？",{icon: 3, title:'提示'},function(index){
	    	  layer.close(index);
	    	  var cur=location.hash.replace('#!fenye=', '');
	    	  var pg=checkStatus.isAll&&cur!=1 ? (cur-1):cur;
		      delSelect(JSON.stringify(data),function(data){
		       	//执行重载
             table.reload(tableId, {
	               page: {
	                  //curr: pg //获取起始页
	               }
	             });
	         });
	      })
	    },
	    exeTask: function(){ //获取选中数据
		      var checkStatus = table.checkStatus(tableId)
		      ,data = checkStatus.data;
		      //已经获取到全部的数据
		      //alert(JSON.stringify(data));
		      for(i=0;i<data.length;i++){
		    	  var item=data[i];
		    	  if(item.useStatus!=60){
		    		  layer.msg("【"+item.carName+"】未在待发射状态，不能进行发射操作");
		    		  return;
		    	  }
		      }
		      apiClient.exeTask(JSON.stringify(data),function(data){
		    	  table.reload(tableId, {
		               page: {
		                  //curr: pg //获取起始页
		               }
		             });
		      });
		    },
		    stopTask: function(){ //获取选中数据
			      var checkStatus = table.checkStatus(tableId)
			      ,data = checkStatus.data;
			      //已经获取到全部的数据
			      //alert(JSON.stringify(data));
			      if(data.length<=0){
			    	  layer.msg("您还没有选择子任务");
			      }else{
			    	  var result="";
			    	  for(var i=0;i<data.length;i++){
			    		  result=result+data[i].id+"、"
			    	  }
			    	  layer.confirm("您将会终止任务编号为："+result.substring(0,result.length-2)+"的发射流程",{icon: 3, title:'提示'},function(index){
			    		  layer.close(index);
			    		  apiClient.stopTask(JSON.stringify(data),function(data){
					    	  table.reload(tableId, {
					               page: {
					                  //curr: pg //获取起始页
					               }
					             });
					      });
			    	  })
			      }
			      
			    },
	    addOne: function(){
	    	var cl=false;
	    	window.top.layer.open({
	    		title:addOptions.title,
	    		type:2,
	    		area:addOptions.area,
	    		resize:false,
	    		moveOut :true,
	    		content:addOptions.url,
	    		cancel: function(){
	    			cl=true;
	    		},
	    		end:function(){
	    			if(!cl){
	    				table.reload(tableId, {
	 		               page: {
	 		                  //curr: pg //获取起始页
	 		               }
	 		             });
	    			}
	    		}
	    	});
	    	//window.location.href= addOne
	    },
	   
  }

	  $('.layui-btn').on('click', function(){
	    var type = $(this).data('type');
	    active[type] ? active[type].call(this) : '';
	  });
});
