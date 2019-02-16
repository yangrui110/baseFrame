var tableId="demo";
layui.use(['table','form'], function(){
    var table = layui.table;
    var form = layui.form;
    //第一个实例
    var tableIns=table.render({
        elem: '#'+tableId
        ,url: '/common/findAll' //数据接口
        ,method:'post'
        ,where:{
            entityName:'user'
        }
        ,response:{
            statusCode:200,
        }
        ,contentType:'application/json'
        ,page: {
            curr: location.hash.replace('#!fenye=', '') //获取hash值为fenye的当前页
            ,hash: 'fenye' //自定义hash值
        }//开启分页
        ,cols: [
            [ //表头
             {type:'checkbox',align:'center'}
            ,{field: 'idx', title: 'ID', width:120,align:"center"}
            ,{field: 'name', title: '用户名',align:"center"}
            ,{field: 'agex', title: '年龄',align:"center"}
            ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:150}
        ]
        ]
    });
    form.on('submit(search)', function(data){
        console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        var fields=data.field;
        var condition={};
        var result={};
        condition.entityName="user";
        for(var key in fields){
            if(fields[key]!='') {
                var a1 = {};
                a1.left = key;
                a1.right = fields[key];
                a1.pare = "=";
                if(JSON.stringify(result)=="{}")
                    result=a1;
                else result= pushRight(a1,result);
            }
        }
        condition.conditions=result;
        tableIns.reload({
            where: condition
            ,page: {
                curr: 0 //重新从第 1 页开始
                ,hash: 'fenye' //重新从第 1 页开始
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    table.on('tool(test)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"

        var data = obj.data; //获得当前行数据
        var layEvent=obj.event;
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        console.log(JSON.stringify($(tr).find("td[data-field='name']").text()));
        if(layEvent === 'del'){ //删除
            layer.confirm("您确定要删除这条记录么？",{icon: 3, title:'提示'},function (index) {
                layer.close(index);
                var condition={};
                condition.entityName="user";
                condition.jsonMap=data;
                condition.PK={key:"id",value:data.idx}
                apiClient.delete(JSON.stringify(condition),function (data) {
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
                })
            })
        } else if(layEvent === 'edit'){
            var cl=false;
            window.top.layer.open({
                title:"编辑界面",
                type:2,
                area:["1000px","600px"],
                resize:false,
                moveOut :true,
                content:"/common/add/common/editor",
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
        }
    });
    /**顶部的增加、批量删除、搜索的事件监听*/
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
                var condition=[];
                for(var i=0;i<data.length;i++){
                    var c={}
                    c.entityName="user";
                    c.jsonMap=data[i];
                    c.PK={key:"id",value:data[i].idx}
                    condition.push(c);
                }
                apiClient.delSelect(JSON.stringify(condition),function(data){
                    //执行重载
                    table.reload(tableId, {
                        page: {
                            //curr: pg //获取起始页
                        }
                    });
                });
            })
        },

        addOne: function(){
            var cl=false;
            window.top.layer.open({
                title:"新增界面",
                type:2,
                area:["1000px","600px"],
                resize:false,
                moveOut :true,
                content:"/common/add/common/add",
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

function pushRight(json,toJsonObject) {
    var ts={};
    ts.left=json;
    ts.right=toJsonObject;
    ts.pare="and";
    return ts;
}