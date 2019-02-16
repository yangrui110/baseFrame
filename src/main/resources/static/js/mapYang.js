
function creatMenu(){
	console.log('xxxx');
}

$(document).ready(function(){
	
	$("#bottomPic").val(getBottom());
});
function getBottom(){
	switch(bottomType){
	case 0: return "矢量图";
	case 1:return "地形图";
	case 2:return "卫星图";
	default :return "";
	}
}
/**
 * 创建图层
 * */
function createLayer() {
    widgets.alert.clearAlert();
    PlottingDrawCancel();
    if (plottingEdit) {
        plottingEdit.deactivate();
    }

    var plottingLayerName = "plottingLayer_" + Math.ceil(Math.random() * 1000);
    var plottingLayer = new SuperMap.Layer.PlottingLayer(plottingLayerName, serverUrl);
    plottingLayer.events.on({"added": layerAdded});
    map.addLayers([plottingLayer]);
}
/**
 * 增加图层
 * */
function layerAdded(addedEvt) {
    plottingLayers.push(addedEvt.layer);
    var successMessage = resources.text_layer + addedEvt.layer.name + resources.text_createSuccess;
    widgets.alert.showAlert(successMessage, true);

    // 绘制标号;
    drawGraphicObject = new SuperMap.Control.DrawFeature(addedEvt.layer, SuperMap.Handler.GraphicObject);
    //态势标绘编辑
    plottingEdit = new SuperMap.Control.PlottingEdit();
    //添加态势标绘控件
    map.addControls([plottingEdit, drawGraphicObject]);
    
}
/**
 * 删除图层
 * */
function removeLayer() {
    widgets.alert.clearAlert();
    if (plottingLayers.length !== 0) {
        plottingEdit.unselectFeatures();
        var plottingLayer = plottingLayers[plottingLayers.length - 1];
        plottingLayer.events.on({"removed": layerRemoved});
        map.removeLayer(plottingLayer);
        map.removeControl(plottingLayer.drawGraphicObject);
    } else {
        widgets.alert.showAlert(resources.msg_NoPlottingLayer, false);
    }

    if (plottingLayers.length !== 0) {
        drawGraphicObject.layer = plottingLayers[plottingLayers.length - 1];
    } else {
        drawGraphicObject = null;
    }
}

function layerRemoved(removedEvt) {
    plottingLayers.pop();
    var successMessage = resources.text_layer + removedEvt.layer.name + resources.text_deleteSuccess;
    widgets.alert.showAlert(successMessage, true);
}

//取消绘制
function PlottingDrawCancel() {
    widgets.alert.clearAlert();
    if (drawGraphicObject) {
        drawGraphicObject.deactivate();
    } else {
        var map = document.getElementById('map');
        map.oncontextmenu = function () {
            window.event.returnValue = false;
            return false;
        }
    }

    if (plottingEdit) {
        plottingEdit.activate();
    } else {
        var map = document.getElementById('map');
        map.oncontextmenu = function () {
            window.event.returnValue = false;
            return false;
        }
    }
}
/* 界面查询 */
function fieldStatistic(){
	//获取提交的值
	var data={limit:20};
	var type=document.getElementById("layerSelect").value;
	var inval=document.getElementById("inval").value;
	switch(type){
	case '打击目标':
		zoomEnd();
		if(tars.length>0){
			var l=tars[0].getLonLat();
			map.setCenter(new SuperMap.LonLat(l.lon,l.lat), 3);
		}
		break;
	case '固定建设':
		zoomEnd();
		if(tars.length>0){
			var l=tars[0].getLonLat();
			map.setCenter(new SuperMap.LonLat(l.lon,l.lat), 3);
		}
		break;
	case '发射车':
		zoomEnd();
		if(cars.length>0){
			var l=cars[0].getLonLat();
			map.setCenter(new SuperMap.LonLat(l.lon,l.lat), 3);
		}
		break;
	case '计划':makePlan();break;
	}
	
}

//添加基础图层
function addLayer() {
	//设置layer为基础图层
    //weixingPng.isBaseLayer = true;
	//dixingPng.isBaseLayer = true;
    shiliangPng.isBaseLayer = true;
    
    map.addLayers([shiliangPng,vectorLayer,endMarkerlayer,plottingLayer,markerlayer,pathVectoreLayer]);
    map.setCenter(new SuperMap.LonLat(104, 35), 3);
    
    //创建标绘面板
    plotPanel = new SuperMap.Plotting.PlotPanel("plotPanel", serverUrl, map);
    plotPanel.events.on({"initializeCompleted": initializeCompleted});
    plotPanel.initializeAsync();

    //创建属性面板
    stylePanel = new SuperMap.Plotting.StylePanel("stylePanel");
    stylePanel.addEditLayer(plottingLayer);
    
    getSMLInfos();
    makePlan();
   // timer()
    
}
		
/*定时器*/
function timer(){
    setTimeout(function(){
        //要执行的代码
    	var maxBounds=map.getExtent();
    	var condition={condition:maxBounds}
    	
    	var select=document.getElementById("layerSelect").value;
    	var value=document.getElementById("inval").value;
    	if(select=='发射车')
    		maxBounds.aname=value;
    	findCars(condition);
        setTimeout(arguments.callee,2000);
    },2000);
}
function addLayer1(){
	dixingPng=new SuperMap.Layer.TiledDynamicRESTLayer("地形图", dixingurl, {transparent: true, cacheEnabled: true}, {maxResolution: "auto"});
    
    //dixingPng.events.on({"layerInitialized": addLayer2});
}
function addLayer2(){
	shiliangPng=new SuperMap.Layer.TiledDynamicRESTLayer("矢量图", shiliangurl, {transparent: true, cacheEnabled: true}, {maxResolution: "auto"});;
    shiliangPng.events.on({"layerInitialized": addLayer});
}
//切换底图
function changeBottomImg(){
	var leave=count%3;
	if(leave==0){
		weixingPng.setVisibility(true);
		dixingPng.setVisibility(false);
		shiliangPng.setVisibility(false);
		map.setBaseLayer(weixingPng);
	}else if(leave==1){
		weixingPng.setVisibility(false);
		dixingPng.setVisibility(true);
		map.setBaseLayer(dixingPng);
	}else{
		weixingPng.setVisibility(false);
		dixingPng.setVisibility(false);
		shiliangPng.setVisibility(true);
		map.setBaseLayer(shiliangPng);
	}
	count++;
}
//响应缩放事件
function zoomEnd(){
	var maxBounds=map.getExtent();
	var condition={condition:maxBounds}
	
	var select=document.getElementById("layerSelect").value;
	var value=document.getElementById("inval").value;
	if(select=='发射车')
		maxBounds.aname=value;
	if(select=='打击目标')
		maxBounds.bname=value;
	if(select=='固定建设'){
		var select1=document.getElementById("layerSelectNext").value;
		maxBounds.arms={name:value,type:select1};
	}
	findCars(condition);
	findTars(condition);
	findArms(condition);
}
function findCars(condition){
	
	apiClient.getBoundsCar(JSON.stringify(condition),function(data){
		var result=[];
		console.log(data);
		var sends=[]; //存储发射区域信息
		for(i=0;i<data.length;i++){
			var um={};
			um.x=data[i].posx;
			um.y=data[i].posy;
			um.detail="id:"+data[i].id+"<br>名称:"+data[i].name+"<br>位置:"+getTwo(data[i].posy)+","+getTwo(data[i].posx)+"<br>状态:"+data[i].curStatu;
			um.path=data[i].path;
			um.name=data[i].name;
			result.push(um);
			//转换position
			sends.push(data[i].send.position);
		}
		//发射区域
		var result1=[];
    	for(i=0;i<sendAreas.length;i++){
    		vectorLayer.removeFeatures(sendAreas[i]);
    	}
    	console.log(result);
    	var points=[];
		for(j=0;j<sends.length;j++){
			points=JSON.parse(sends[j]);
			var pos=[];
    		for(i=0;i<points.length;i++){
    			pos.push(new SuperMap.Geometry.Point(points[i].y,points[i].x));
    		}
		  linearRings = new SuperMap.Geometry.LinearRing(pos),
		  region = new SuperMap.Geometry.Polygon([linearRings]);
		  var style = {
				    strokeColor:"#f56c6c",
				    strokeOpacity:1,
				    strokeWidth:1,
				    pointRadius:6,
				    fillColor:"#f56c6c",
				    fillOpacity:0.3,
				    label:sends[j].name,
				    fontColor:"#fff"
				}
		  var pointFeature = new SuperMap.Feature.Vector(region,null,style);
		  vectorLayer.addFeatures(pointFeature);
		  result1.push(pointFeature);
		}
		sendAreas=result1;
		addData(result,cars,'/zuozhan/map/images/sendCar.png');
		
	});
}
function findTars(condition){
	apiClient.getBoundsTars(JSON.stringify(condition),function(data){
		var result=[];
		console.log(data);
		for(i=0;i<data.length;i++){
			var um={};
			um.x=data[i].latitude;
			um.y=data[i].longitude;
			um.detail="名称:"+data[i].name+"<br>经度："+getTwo(data[i].longitude)+"<br>纬度："+getTwo(data[i].latitude)+"<br>类型:打击目标";
			um.path=data[i].path;
			result.push(um);
			//转换position
		}
		addData(result,tars,'/zuozhan/map/images/gc.png');
	});
}

function findArms(condition){
	apiClient.getBoundsArms(JSON.stringify(condition),function(data){
		var result=[];//军营
		var base=[];//基地
		console.log(data);
		for(i=0;i<data.length;i++){
			var um={};
			um.x=data[i].latitude;
			um.y=data[i].longitude;
			um.detail="名称:"+data[i].name+"<br>经度："+getTwo(data[i].latitude)+"<br>纬度："+getTwo(data[i].longitude);
			um.path=data[i].path;
			if(data[i].type=='军队')
				result.push(um);
			else if(data[i].type=='基地')
				base.push(um);
			//转换position
			console.log(data[i].type);
		}
		addData(result,arms,'/zuozhan/map/images/006.png');
		addData(base,bases,'/zuozhan/map/images/jd2.png');
	});
}
//添加Marker数据
function addData(carData,mark,icon) {

	if(mark[0]!=null){
		for(var i=0;i<mark.length;i++){
    		markerlayer.removeMarker(mark[i]);
    	} 
	}
    var size = new SuperMap.Size(44, 33);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    for(var k=0;k<carData.length;k++){
    	var path=icon;
    	if(carData[k].path!=undefined&&carData[k].path!=null&&carData[k].path!='')
    		path=carData[k].path
        var icon1 = new SuperMap.Icon(path, size, 0);
    	mark[k]= new SuperMap.Marker(new SuperMap.LonLat(carData[k].y, carData[k].x), icon1);
    	mark[k].events.on({
             "click": openInfoWin,
             
             "touchstart": openInfoWin ,   //假如要在移动端的浏览器也实现点击弹框，则在注册touch类事件
             "scope":mark[k] 
         });
    	mark[k].data=carData[k];
    	//rs.push(uv);
        markerlayer.addMarker(mark[k]);
    }
}
//获取两位小数
function getTwo(lon){
	if(lon!=undefined&&lon!=''){
		var num=parseFloat(lon);
		return Math.round(num*1000)/1000
	}else return 0;
}

function test(){
	var positionPoints=new SuperMap.Geometry.Point(71.47113163972, 42.560623556582);
	var as=[new SuperMap.Geometry.Point(67.83371824481,32.531755196304),
		new SuperMap.Geometry.Point(67.937644341808,30.868937644341),
		new SuperMap.Geometry.Point(80.304849884533,32.739607390299)];
	plottingLayer.createSymbolWC(22,1011, as, "symbol_01", {strokeColor:"#ff0000"}, {scaleByMap:true});
   	}

//画箭头线
function drawLian(bounds,l3,l4,bai){
	var lianRedStyle={
			strokeColor:"red",
			fillGradientMode:"LINEAR",
			fillColor:  "white",
			fill:true,
			fillBackOpacity:1,
			strokeWidth:1,
			fillBackColor:'red'
	}
	var lianBlueStyle={
			strokeColor:"blue",
			fillGradientMode:"LINEAR",
			fillColor:  "white",
			fill:true,
			fillBackOpacity:1,
			strokeWidth:1,
			fillBackColor:'blue'
	}
	var as=getUseDirect(new SuperMap.Geometry.Point(l3,l4),bounds);
	if(getLianStyle(bai)=='red'){
		
		plottingLayer.createSymbolWC(22,1004, as, "symbol_01", lianRedStyle, {scaleByMap:true});
	}else 
		plottingLayer.createSymbolWC(22,1004, as, "symbol_01", lianBlueStyle, {scaleByMap:true});
}
/**
 * @Param bai代表状态
 * */
function drawWay(start,end,bai){
	
	var pa=new SuperMap.Cloud.PathAnalystParameter({startPoint:start,endPoint:end,routeMode:SuperMap.Cloud.RouteType.MINLENGTH,to:4326});
	var uls="http://www.supermapol.com/iserver/services/navigation/rest/navigationanalyst/China/pathanalystresults";
	SuperMap.Credential.CREDENTIAL = new SuperMap.Credential("aG4NtVAIk8eaY2bIKnMLX5LY", "key");
	if(getWayStyle(bai)=='red'){
		var s1=new SuperMap.Cloud.PathAnalystService(uls,{eventListeners:{processCompleted :drawBlueWay ,processFailed :processFailed1 }});
		s1.processAsync(pa,SuperMap.Credential.CREDENTIAL);
	}else {
		var s1=new SuperMap.Cloud.PathAnalystService(uls,{eventListeners:{processCompleted :drawRedWay ,processFailed :processFailed1 }});
		s1.processAsync(pa,SuperMap.Credential.CREDENTIAL);
	}
}
//响应路线画完后的事件，并且成功
function processCompleted1(e){
	console.log(e.result);

	var pathFeature = new SuperMap.Feature.Vector();
	var result=e.result;
	if(result){
		result=result[0].pathPoints;
		pathFeature.geometry = new SuperMap.Geometry.LineString(result)
	}
	pathFeature.style = wayStyle;
	pathVectoreLayer.addFeatures(pathFeature);
}
//画线失败事件
	function processFailed1(){
		console.log("error");
	}

//获取发射区的中心点
function getCenter1(positions){
	var center={x:0,y:0};
	
	if(positions.length>0){
		for(i=0;i<positions.length;i++){
			center.x=center.x+positions[i].x;
			center.y=center.y+positions[i].y;
		}
	}
	center.x=center.x/2;
	center.y=center.y/2;
	return center;
}

//给每个结束的路线点添加标记覆盖物
function overMarker(endsPoints){
	var carData=[];
	for(var s=0;s<endsPoints.length;s++){
		var vm={};
		vm.x=endsPoints[s].y;
		vm.y=endsPoints[s].x;
		vm.detail="预计发射阵地<br>位置:"+getTwo(vm.y)+","+getTwo(vm.x);
		vm.executeId=endsPoints[s].id;
		vm.type=endsPoints[s].type;
		vm.p=endsPoints[s].p;
		carData.push(vm);
	}
	var mark=endPoints;
	var size = new SuperMap.Size(44, 33);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    for(var k=0;k<carData.length;k++){
    	var path='/zuozhan/map/images/marker.png';
    	if(carData[k].path!=undefined&&carData[k].path!=null&&carData[k].path!='')
    		path="/zuozhan"+carData[k].path
        var icon1 = new SuperMap.Icon(path, size, 0);
    	mark[k]= new SuperMap.Marker(new SuperMap.LonLat(carData[k].y, carData[k].x), icon1);
    	mark[k].events.on({
             "click": openInfoWin,
             "touchstart": openInfoWin ,   //假如要在移动端的浏览器也实现点击弹框，则在注册touch类事件
             "rightclick":setEnd,
             "scope":mark[k]
         });
    	mark[k].data=carData[k];
    	//rs.push(uv);
    	endMarkerlayer.addMarker(mark[k]);
    }
}
function selectSend(){
	if(needSelect!=null){
		//执行更新计划到execute中，设置发射点坐标
		var lonlat=needSelect.lonlat;
		var entity={id:needSelect.data.executeId,launchLon:lonlat.lon,launchLat:lonlat.lat};
		apiClient.saveExecute(JSON.stringify(entity),function(data){
			//1.移除所有的path
			//2.移除对应的marker
			pathVectoreLayer.removeAllFeatures();
			/*var mas=[];
			var fas=endMarkerlayer.markers;
			for(var i=0;i<fas.length;i++){
				if(fas[i].data.type!=needSelect.data.type){
					mas.push(fas[i]);
				}
			}
			mas.push(needSelect);
			//重绘marker
			*/
			endMarkerlayer.clearMarkers();
			/*for(var i=0;i<mas.length;i++){
				var start=mas[i].data.p;
				var lonlat=mas[i].getLonLat();
				var end=new SuperMap.Geometry.Point(lonlat.lon,lonlat.lat);
				console.log(data[i]);
				drawWay(start,end,data[i].data.useStatus);
				endMarkerlayer.addMarker(mas[i]);
			}*/
			makePlan();
		});
	}
	 menu.style.visibility = "hidden";
}
//鼠标右键将结果更新到execute中，将图标点设置为发射点
function setEnd(){
	console.log(this);
	var p = map.getPixelFromLonLat(this.lonlat);
    menu.style.left = p.x+80+112 + "px";
    menu.style.top = p.y+20+ "px";
    menu.style.visibility = "visible";
    needSelect=this;
}

function isEmpty(str){
	if(str!=''&&str!=undefined)
		return false;
	else return true;
}

/**
 * @param bai 当前的useStatus
 * @return 返回blue代表蓝色，返回red代表红色
 * */
function getWayStyle(bai){
	if(bai==1){
		return 'red';
	}else return 'blue';
}
function getLianStyle(bai){
	if(bai>=44&&bai<=46)
		return 'blue';
	else return 'red'
}
/**
 * 画出红色路线*/
function drawRedWay(e){
	var redStyle = {
            strokeColor: "red",
            strokeWidth: 2,
            pointerEvents: "visiblePainted",
            fill: false
        }
	

	var pathFeature = new SuperMap.Feature.Vector();
	var result=e.result;
	if(result){
		result=result[0].pathPoints;
		pathFeature.geometry = new SuperMap.Geometry.LineString(result)
	}
	pathFeature.style = redStyle;
	pathVectoreLayer.addFeatures(pathFeature);
	
}
/**画出蓝色路线*/
function drawBlueWay(e){
	var blueStyle = {
            strokeColor: "#304DBE",
            strokeWidth: 2,
            pointerEvents: "visiblePainted",
            fill: false
        }

	var pathFeature = new SuperMap.Feature.Vector();
	var result=e.result;
	if(result){
		result=result[0].pathPoints;
		pathFeature.geometry = new SuperMap.Geometry.LineString(result)
	}
	pathFeature.style = blueStyle;
	pathVectoreLayer.addFeatures(pathFeature);
	
}
//获取行动计划，并且画出计划中的发射区的起始点和发射区的结束
function makePlan(){
	if(type!=''&&taskId!=''){
    	var condition={taskId:taskId,type:type};
    	apiClient.getPlans(JSON.stringify(condition),function(data){
    		var length=data.length
    		console.log(length);
    		var pss=[];  //存储的是所有终点的坐标值
    		for(var i=0;i<length;i++){
    			//设置wayStyle的值
    			//setWayStyle(data[i].useStatus);
    			//setLianStyle(data[i].useStatus);
    			//随机获取三个点
    			console.log(data);
    			var positions=data[i].positions
    			var tar=data[i].tar;
    			//如果预存的发射点不为空，就不会进行三条路径的选择
    			var ran=[];
    			var cstart=new SuperMap.Geometry.Point(data[i].carLon,data[i].carLat);
    			if(isEmpty(data[i].launchLon)||isEmpty(data[i].launchLat)){
	    			ran=get3Random(positions);
	    			console.log(ran)
	    			for(var k=0;k<ran.length;k++){
	    				ran[k].id=data[i].id;
	    				ran[k].type=i;
	    				ran[k].p=cstart;
	    				pss.push(ran[k]);
	    			}
    			}else {
    				var p=new SuperMap.Geometry.Point(data[i].launchLon,data[i].launchLat);
    				p.type=i;
    				p.p=cstart;
    				ran.push(p);
    				pss.push(p);
    			}
    			
    			for(var m=0;m<ran.length;m++){
    				//console.log('--cs'+cstart+'---en'+ran[m]);
    				var start=cstart;
    				var end=ran[m];
    				drawWay(start,end,data[i].useStatus);//画出车辆到发射点的路线
    			}
    			//获取最大的横坐标,最小的纵坐标
    			var area=[];
    			for(var j=0;j<positions.length;j++){
    				area.push(new SuperMap.Geometry.Point(positions[j].y,positions[j].x));
    			}
    			if(tar){
    				var end={};
    				end.x=tar.longitude;
    				end.y=tar.latitude;
    				ses = new SuperMap.Geometry.LinearRing(area),
    				pol = new SuperMap.Geometry.Polygon([ses]);
    				drawLian(pol.getBounds(),end.x,end.y,data[i].useStatus);
    			}
    		}
    		overMarker(pss);
    	});
	}
}
//在发射区内获取3个随机点
function get3Random(data1){
	var arrs=[];
	for(s=0;s<data1.length;s++){
		var point = new SuperMap.Geometry.Point(data1[s].y, data1[s].x);
		arrs.push(point);
	}
	
	var poly=new SuperMap.Geometry.Polygon([new SuperMap.Geometry.LinearRing(arrs)])
	var bounds=poly.getBounds();
	console.log(bounds);
	var result=[];
	while(result.length<3){
		var y=Math.random()*(bounds.top-bounds.bottom)+bounds.bottom
		var x=Math.random()*(bounds.right-bounds.left)+bounds.left
		var cur=new SuperMap.Geometry.Point(x,y);
		if(poly.intersects(cur)){
			result.push(cur);
		}
	}
	return result;
}

//打开信息框
function openInfoWin(k) {
    //closeInfoWin();
    console.log(k);
    var rm=this;
    var lonlat = rm.getLonLat();
    var size = new SuperMap.Size(0, 33);
    var offset = new SuperMap.Pixel(11, -30);
    var icon = new SuperMap.Icon("./images/marker.png", size, offset);
    var popup = new SuperMap.Popup("popwin",
        new SuperMap.LonLat(lonlat.lon, lonlat.lat),
        new SuperMap.Size(120,90),
       	rm.data.detail,
        true);
    infowin = popup;
    map.addPopup(popup);
}
//关闭信息框
function closeInfoWin() {
    if (infowin) {
        try {
            infowin.hide();
            infowin.destroy();
        }
        catch (e) {
        }
    }
}