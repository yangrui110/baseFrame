/**
 * 判断点所在的方位,返回三点坐标
 * 四个方位的判断1.判断右边，2判断上边，3判断左边，4判断下边
 * @Param curPos 当前的点所在的坐标
 * @param bounds 发射区的边界值
 */
function getUseDirect(curPos,bounds){
	var maxLeft=bounds.left;
	var maxRight=bounds.right;
	var maxTop=bounds.top;
	var maxBottom=bounds.bottom;
	
	var curx=curPos.x;
	var cury=curPos.y;
	//1.判断右边
	var ps=[];
	if(curx>maxRight){
		var cen=(maxTop+maxBottom)/2;
		var cenA=cen-1;
		var cenB=cen+1;
		ps.push(new SuperMap.Geometry.Point(maxRight,cenA));
		ps.push(new SuperMap.Geometry.Point(maxRight,cenB));
		ps.push(curPos);
		return ps;
	}else if(curx<maxLeft){
		var cen=(maxTop+maxBottom)/2;
		var cenA=cen-1;
		var cenB=cen+1;
		ps.push(new SuperMap.Geometry.Point(maxLeft,cenA));
		ps.push(new SuperMap.Geometry.Point(maxLeft,cenB));
		ps.push(curPos);
		return ps;
	}else if(cury>maxTop){
		var cen=(maxRight+maxLeft)/2;
		var cenA=cen-1;
		var cenB=cen+1;
		ps.push(new SuperMap.Geometry.Point(cenA,maxTop));
		ps.push(new SuperMap.Geometry.Point(cenB,maxTop));
		ps.push(curPos);
		return ps;
	}else if(cury<maxBottom){
		var cen=(maxRight+maxLeft)/2;
		var cenA=cen-1;
		var cenB=cen+1;
		ps.push(new SuperMap.Geometry.Point(cenA,maxBottom));
		ps.push(new SuperMap.Geometry.Point(cenB,maxBottom));
		ps.push(curPos);
		return ps;
	}
}
