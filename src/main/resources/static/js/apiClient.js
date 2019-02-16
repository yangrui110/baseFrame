var apiClient=(function(){
    var apiUrl="";
     function onSuccess(data,callback){
         if(data.code==200){
             callback(data.data);
         }else{
            // alert(data.msg);
        	 layer.msg(data.msg);
         }
     }
     return {
		 delete:function(data,callback){
             HttpUtils.doDelete({
                 url:apiUrl+"/common/delete",
                 data:data,
                 success:function(data){
                     onSuccess(data,callback);
                 }
             });
         },
		 delSelect:function(data,callback){
             HttpUtils.doDelete({
                 url:apiUrl+"/common/deleteSelect",
                 data:data,
                 success:function(data){
                     onSuccess(data,callback);
                 }
             });
		 },
         finds:function(data,callback){
             HttpUtils.doPost({
                 url:apiUrl+"/common/findAll",
                 data:data,
                 success:function(data){
                     onSuccess(data,callback);
                 }
             });
         },
		 save:function(data,callback){
             HttpUtils.doPost({
                 url:apiUrl+"/common/save",
                 data:data,
                 success:function(data){
                     onSuccess(data,callback);
                 }
             });
         }
    }
})(); 