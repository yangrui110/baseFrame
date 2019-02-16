function init() {
        Bev.Theme.set("bev-base");

        map = new SuperMap.Map("map", {
            controls: [
                new SuperMap.Control.LayerSwitcher(),
                new SuperMap.Control.ScaleLine(),
                new SuperMap.Control.Zoom(),
                new SuperMap.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                })]/*,
                eventListeners:{"movestart":function(){
                    menu.style.visibility="hidden";
                },
                    "click":function(){
                        menu.style.visibility="hidden";
                    }}*/
        });
        
        //设置底图
        //weixingPng=new SuperMap.Layer.TiledDynamicRESTLayer("卫星图", weixingurl, {transparent: true, cacheEnabled: true}, {maxResolution: "auto"});
        //dixingPng.events.on({"layerInitialized": addLayer});
        //weixingPng = new SuperMap.Layer.CloudLayer({name:'矢量图'});
        shiliangPng=new SuperMap.Layer.TiledDynamicRESTLayer("矢量图", shiliangurl, {transparent: true, cacheEnabled: true}, {maxResolution: "auto"});;
        shiliangPng.events.on({"layerInitialized": addLayer});
        //给Map增加事件
        map.events.on({
        	"click": callbackFunction,
        	"moveend":zoomEnd,
        	"movestart":function(){
        		menu.style.visibility="hidden";
        	}});
        var options = {numZoomLevels: 12, useCanvas: true};
        var bounds = new SuperMap.Bounds(-180, -90, 180, 90);
        img = new SuperMap.Layer.Image(        //image图层
            'World_Day',
            'images/Day.jpg',
            bounds,
            options
        );
        //img1 = new SuperMap.Layer.TiledDynamicRESTLayer("img1", weixingurl, {transparent: true, cacheEnabled: true});   //获取World地图服务地址

        tiandituLayer = new SuperMap.Layer.Tianditu();
        tiandituLayer.layerType = "img";
        tiandituLayer.isLabel = false;
        tiandituLayer.name="影像图";
        tianditu = new SuperMap.Layer.Tianditu();
        tianditu.layerType = "ter";
        tianditu.name="地形";

        baidu=new SuperMap.Layer.Baidu();
        gool=new SuperMap.Layer.Google();
        bing=new SuperMap.Layer.OSM();
        /*标注点*/
        markerlayer = new  SuperMap.Layer.Markers("图元对象层");

        endMarkerlayer = new  SuperMap.Layer.Markers("标记点图层");
        //总控类
        plotting = SuperMap.Plotting.getInstance(map, serverUrl);

        
        sitManager = plotting.getSitDataManager();
        sitManager.events.on({
            "getSMLInfosCompleted": getSMLInfosSucess,
            "getSMLInfosFailed": getSMLInfosFail,
            "openSmlFileCompleted": openSuccess,
            "openSmlFileFailed": openFail,
            "saveSmlFileCompleted": saveSuccess,
            "saveSmlFileFailed": saveFail
        });

        plottingLayer = new SuperMap.Layer.PlottingLayer("标绘图层", serverUrl);
        //空间分析服务地址：目前使用的是服务器默认空间分析地址，可更换成实际使用的空间分析服务地址
        //plottingLayer.spatialAnalystUrl = host + "/iserver/services/spatialanalyst-sample/restjsr/spatialanalyst";
		
        plottingLayer.style = {
            fillColor: "#ff0000",
            fillOpacity: 0.4,
            strokeColor: "#ff0000",
            strokeOpacity: 1,
            strokeWidth: 3,
            pointRadius: 6
        };

        //态势标绘编辑
        plottingEdit = new SuperMap.Control.PlottingEdit();
        //plottingEdits.push(plottingEdit);

        // 绘制标号;
        var drawGraphicObject = new SuperMap.Control.DrawFeature(plottingLayer, SuperMap.Handler.GraphicObject);
        drawGraphicObjects.push(drawGraphicObject);

        var callbacks = {
                rightclick: creatMenu
            };
        //监听路径标绘的右击事件
        var selectFeature = new SuperMap.Control.SelectFeature(pathVectoreLayer,
                {
                    callbacks: callbacks
                });
        
        //添加态势标绘控件
        map.addControls([plottingEdit, drawGraphicObject,selectFeature]);
        selectFeature.activate();
        map.addControl(new SuperMap.Control.LayerSwitcher(), new SuperMap.Pixel(42, 80));
       /* addData();*/
        // timer(); 
       var con={condition:''};
       
    }/*初始化结束*/
/*点击事件*/
    function callbackFunction(e){
        var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
        menu.style.visibility="hidden";
        $("#selectLon").val(lonlat.lon);
        $("#selectLat").val(lonlat.lat);
    }
		
   
    
    function initializeCompleted(evt) {
        if (drawGraphicObjects.length > 0) {
            plotPanel.setDrawFeature(drawGraphicObjects[0]);
        }

        plotting.getSymbolLibManager().cacheSymbolLib(100);
    }

    //取消标绘与编辑
    function plottingAllDeactivate() {
        for (var i = 0; i < drawGraphicObjects.length; i++) {
            drawGraphicObjects[i].deactivate();
        }
        plottingEdit.deactivate();
    }

    //清空绘制
    function PlottingClear() {

        plottingAllDeactivate();

        for (var i = 0; i < map.layers.length; i++) {
            if (map.layers[i].CLASS_NAME === "SuperMap.Layer.PlottingLayer") {
                map.layers[i].removeAllFeatures();
            }
        }
    }

    //删除选中标号
    function deleteSymbol() {
        plottingEdit.deleteSelectFeature();
    }

    //取消标绘，激活标绘编辑控件
    function PlottingDrawCancel() {
        plottingAllDeactivate();

        plottingEdit.activate();

    }

    //复制
    function copySymbol() {
        plotting.getEditor().copy();
    }

    //剪切
    function cutSymbol() {
        plotting.getEditor().cut();
    }

    //粘贴
    function pasteSymbol() {
        plotting.getEditor().paste();
    }

    //添加图层
    function addPlottingLayer() {
        PlottingDrawCancel();
        var newPlottingLayer = new SuperMap.Layer.PlottingLayer(getNewPlottingLayerName(), serverUrl);
        newPlottingLayer.style = {
            fillColor: "#66cccc",
            fillOpacity: 0.4,
            strokeColor: "#66cccc",
            strokeOpacity: 1,
            strokeWidth: 3,
            pointRadius: 6
        };

        //newPlottingLayer.spatialAnalystUrl = host + "/iserver/services/spatialanalyst-sample/restjsr/spatialanalyst";

        var drawGraphicObject = new SuperMap.Control.DrawFeature(newPlottingLayer, SuperMap.Handler.GraphicObject);
        drawGraphicObjects.push(drawGraphicObject);

        //将新创建的图层添加到属性面板中
        stylePanel.addEditLayer(newPlottingLayer);

        //将标绘句柄赋给标绘面板
        plotPanel.setDrawFeature(drawGraphicObject);

        map.addControls([drawGraphicObject]);
        map.addLayers([newPlottingLayer]);
        
    }

    //保存态势图
    /*
    function saveSimulationMap() {
        plottingAllDeactivate();
        plotting.getSitDataManager().saveAsSmlFile("situationMap");
    }

    function loadSimulationMap() {
        {
            plotting.getSitDataManager().openSmlFileOnServer("situationMap");
        }

    }*/

    function success() {
        var sitDataLayers = plotting.getSitDataManager().getSitDataLayers();
        plottingLayer = sitDataLayers[0];
        drawGraphicObjects = [];
        for (var i = 0; i < sitDataLayers.length; i++) {
            drawGraphicObjects.push(sitDataLayers[i].drawGraphicObject);
            stylePanel.addEditLayer(sitDataLayers[i]);
        }
        plotPanel.setDrawFeature(drawGraphicObjects[0]);
    }

    function getNewPlottingLayerName() {
        var layerCount = map.layers.length;
        var layerName = "新建标绘图层";

        var bExist = true;
        while (bExist) {
            bExist = false;
            var tempLayerName = layerName + layerCount;

            for (var i = 0; i < map.layers.length; i++) {
                var layer = map.layers[i];
                if (null == layer) {
                    continue;
                }

                if (tempLayerName === layer.name) {
                    bExist = true;
                }
            }

            if (!bExist) {
                layerName = tempLayerName;
            }
            layerCount++;
        }

        return layerName;
    }

    function editCircusRetangle() {
        plottingEdit.setEditMode(SuperMap.Plot.EditMode.EDITCIRCUMRECTANGLE);
    }

    function editContorPoints() {
        plottingEdit.setEditMode(SuperMap.Plot.EditMode.EDITCONTROLPOINT);
    }

    function addControlPoints() {
        plottingEdit.setEditMode(SuperMap.Plot.EditMode.ADDCONTROLPOINT);
    }

    //切换多选模式
    function multiSelectModel() {
        plottingEdit.multiSelect();
    }

    //多选对齐--左对齐
    function setSymbolAlighLeft() {
        plottingEdit.align(SuperMap.Plot.AlignType.LEFT);
    }

    //多选对齐--右对齐
    function setSymbolAlighRight() {
        plottingEdit.align(SuperMap.Plot.AlignType.RIGHT);
    }

    //多选对齐--上对齐
    function setSymbolAlighUp() {
        plottingEdit.align(SuperMap.Plot.AlignType.UP);
    }

    //多选对齐--下对齐
    function setSymbolAlighDown() {
        plottingEdit.align(SuperMap.Plot.AlignType.DOWN);
    }

    //多选对齐--竖直居中对齐
    function setSymbolAlighVerticalcenter() {
        plottingEdit.align(SuperMap.Plot.AlignType.VERTICALCENTER);
    }

    //多选对齐--水平居中对齐
    function setSymbolAlighHorizontalcenter() {
        plottingEdit.align(SuperMap.Plot.AlignType.HORIZONTALCENTER);
    }

    //切换图层是否锁定
    function setPlottingLayerIsLocked() {
        if (plottingLayer.getLocked() === true) {
            plottingLayer.setLocked(false);
        } else {
            plottingLayer.setLocked(true);
        }
    }

    //切换图层是否可编辑模式
    function setPlottingLayerIsEdit() {
        if (plottingLayer.getEditable() === true) {
            plottingLayer.setEditable(false);
        } else {
            plottingLayer.setEditable(true);
        }
    }

    //切换图层是否可选择模式
    function setPlottingLayerIsSelected() {
        if (plottingLayer.getSelected() === true) {
            plottingLayer.setSelected(false);
        } else {
            plottingLayer.setSelected(true);
        }
    }

    //截屏
    function mapToImg1() {
        MapToImg && MapToImg.excute(map);
    }

    //绘制避让区域
    function drawAvoidRegion() {
        plottingEdit.avoidEdit(true);
    }

    //退出避让编辑
    function doneAvoidEdit() {
        plottingEdit.avoidEdit(false);
    }

    //删除避让编辑
    function deleteAvoidEdit() {
        plottingEdit.removeAllAvoidRegion();
    }

    //创建组合对象
    function createGroupObjects() {
        var features = plottingEdit.features;
        if (features.length >= 2) {
            plottingLayer.createGroupObject(features);
        }

    }

    //创建多旗
    function createDrawFlags() {
        var features = plottingEdit.features;
        if (features.length >= 2) {
            plottingLayer.createFlags(features);
        }
    }

    //解绑组合对象
    function testUnGroupObject() {
        var features = plottingEdit.features;
        for (var i = features.length - 1; i >= 0; i--) {
            if (features[i].geometry instanceof SuperMap.Geometry.GroupObject) {
                plottingLayer.unGroupObject(features[i].geometry.uuid);
            }

        }
    }

    function undo(){
        plotting.getTransManager().undo();
    }

    function redo(){
        plotting.getTransManager().redo();
    }

  //取消标绘
    function plottingAllDeactivate() {
        for (var i = 0; i < drawGraphicObjects.length; i++) {
            drawGraphicObjects[i].deactivate();
        }
        plottingEdit.deactivate();
    }

    //取消标绘，激活标绘编辑控件
    function PlottingDrawCancel() {
        widgets.alert.clearAlert();
        plottingAllDeactivate();
        plottingEdit.activate();
    }

    function getSMLInfos() {
        sitManager.getSMLInfos(0, 10);
    }

    function getSMLInfosSucess(result) {
        select = document.getElementById("SLT");
        while (select.hasChildNodes()) {
            select.removeChild(select.firstChild);
        }
        for (var i = 0, len = result.length; i < len; i++) {
            var options = document.createElement("option");
            options.setAttribute("value", result[i].SMLFileName);
            options.innerHTML = result[i].SMLFileName;
            select.appendChild(options);
        }
        return false;
    }

    function getSMLInfosFail(result) {
        console.log(result);
    }

    //态势图保存
    function save() {
        widgets.alert.clearAlert();
        plottingAllDeactivate();
        sitManager.saveSmlFile();
    }

    //态势图另存为
    function SaveAsSmlFile() {
        plottingAllDeactivate();
        SMLName = document.getElementById("txt").value;
        if (SMLName.length !== 0) {
            sitManager.saveAsSmlFile(SMLName);
        } else {
            widgets.alert.showAlert(resources.msg_inputName, true);
        }
    }

    function saveSuccess() {
        getSMLInfos();
    }

    function saveFail() {

    }

    //加载态势图
    function loadSimulationMap() {
        widgets.alert.clearAlert();
        var select = document.getElementById("SLT");
        for (var i = 0; i < select.children.length; i++) {
            if (select.children[i].selected) {
                sitManager.openSmlFileOnServer(select.children[i].value);

            }
        }
    }

    function openSuccess() {
        var sitDataLayers = sitManager.getSitDataLayers();
        drawGraphicObjects = [];
        for (var i = 0; i < sitDataLayers.length; i++) {
            drawGraphicObjects.push(sitDataLayers[i].drawGraphicObject);
            stylePanel.addEditLayer(sitDataLayers[i]);
        }
        plotPanel.setDrawFeature(drawGraphicObjects[0]);
    }

    function openFail() {
        console.log("error");
    }

    //清空绘制
    function PlottingClear() {
        widgets.alert.clearAlert();
        plottingAllDeactivate();
        for (var i = 0; i < map.layers.length; i++) {
            if (map.layers[i].CLASS_NAME === "SuperMap.Layer.PlottingLayer") {
                map.layers[i].removeAllFeatures();
            }
        }
    }
    
    document.onmouseup = function (evt) {
        var evt = evt || window.event;
        if (evt.button === 2) {
            PlottingDrawCancel();
            return false;
        }
        evt.stopPropagation();
    }