<script type="text/javascript">
var options= {
	chart: {
		renderTo:'container',
		type: 'xrange'
	},
	title: {
		text: '甘特图'
	},
	xAxis: {
		type: 'datetime',
		dateTimeLabelFormats: {
			second:'%Y/%m/%d %H:%M:%S'
		}
	},
	yAxis: {
		title: {
			text: ''
		},
		categories: [],
		reversed: true
	},
	tooltip: {
		dateTimeLabelFormats: {
			day:'%Y/%m/%d %H:%M:%S'
		}
	},
	series: [
	
	]
};
//动态加载数据
	function portray(){
		var name=$("#tname1").val();
		var beging=$("#tbeging").val();
		var end=$("#tend").val();
		console.log(beging)
		var by=beging.substr(0,4);
		var bm=beging.substr(5,2);
		var bd=beging.substr(8,2);
		var bh=beging.substr(11,2);
		var bf=beging.substr(14,2);
		var bs=beging.substr(17,2);
		
		var ey=end.substr(0,4);
		var em=end.substr(5,2);
		var ed=end.substr(8,2);
		var eh=end.substr(11,2);
		var ef=end.substr(14,2);
		var es=end.substr(17,2);
	
		var cn=new Array();
		for(var i in NameMap){
           console.log(NameMap[i])
           for(var k=0;k<NameMap[i].length;k++){
        	   cn.push(NameMap[i][k]);
           }
          }
		//设置y坐标栏目
		options.yAxis.categories=cn;
		
		for(var i=0;i<cn.length;i++){
			 options.series[i*2+1]={
						name: '行军',
						// pointPadding: 0,
						// groupPadding: 0,
						borderColor: 'gray',
						pointWidth: 20,
						data: [{
							x: Date.UTC(by, bm, bd,bh,bf,bs),
							x2: Date.UTC(ey, em, ed,eh-1,ef,es),
							y: i,
							partialFill: 0
						}],
						dataLabels: {
							enabled: true
						}
					};
			 options.series[i*2]={
						name: '轰炸',
						// pointPadding: 0,
						// groupPadding: 0,
						borderColor: 'gray',
						pointWidth: 20,
						data: [{
							x: Date.UTC(ey, em, ed,eh-1,ef,es),
							x2: Date.UTC(ey, em, ed,eh,ef,es),
							y: i,
							partialFill: 0
						}],
						dataLabels: {
							enabled: true
						}
					};
		}
	
		var chart = new Highcharts.Chart(options);
		
}
</script>