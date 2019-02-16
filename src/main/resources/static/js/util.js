var HttpUtils = (function() {

	function openSigninPage() {
		alert("未登录，请先登录");
		window.location.href="login.html";
	}

	function ajax(type, params) {
		if(params.needSignin && StringUtils.isBlank(localStorage.getItem('token'))) {
			return openSigninPage();
		}
		var contentType="application/json";
		if(!StringUtils.isBlank(params.contentType))
			contentType=params.contentType;
		
		$.ajax({
			type: type,
			url: params.url,
			dataType: 'json',
			data: params.data,
			contentType:contentType,/*
			beforeSend: function(request) {
	            request.setRequestHeader("token", UserUtils.getToken());
	        },*/
			success: params.success,
			error:function(xhr, errorType, error) {
				var errorCallback = params.dataError;
				
				if(errorCallback!=''&&errorCallback!=null) {
					errorCallback(xhr, errorType, error);
				} else {
					alert(xhr.responseJSON.msg);
					//alert('服务器繁忙，请稍后再试.[E-000-500]');
				}
			},
			xhrFields: {withCredentials: true},
		   crossDomain: true
		 });
	}

	return {
		doGet: function(params) {
			ajax('GET', params);
		},
		doPost: function(params) {
			ajax('POST', params);
		},
		doPut: function(params) {
			ajax('PUT', params);
		},
		doDelete: function(params) {
			ajax('DELETE', params);
		},
		doUpload: function(params) {
			upload(params);
		}
	};
})();

var UserUtils = (function() {
	return {
		setUserProfile: function(u) {
			localStorage.setItem('user', JSON.stringify(u || {}));
		},
		getUserProfile: function() {
			return JSON.parse(localStorage.getItem('user') || "{}");
		},
		clearUserProfile: function() {
			localStorage.removeItem('user');
		},
		getUserId: function() {
			return localStorage.getItem('userId');
		},
		setUserId: function(id) {
			localStorage.setItem('userId',id);
		},
		setToken: function(token) {
			localStorage.setItem('token', token);
		},
		getToken: function() {
			return localStorage.getItem('token');
		},
		clearToken: function() {
			localStorage.removeItem('token');
		}
	};
})();

var MoneyUtil=(function(){
	return {
		getMoney:function(){
			return JSON.parse(localStorage.getItem('money'));
		}
	}
})();

var DateUtils = (function() {
	function format(date, fmt) {
		var o = {
			"M+": date.getMonth() + 1, //月份   
			"d+": date.getDate(), //日   
			"h+": date.getHours(), //小时   
			"m+": date.getMinutes(), //分   
			"s+": date.getSeconds(), //秒   
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
			"S": date.getMilliseconds() //毫秒   
		};
		if(/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

		return fmt;
	}

	return {
		format: function(date, fmt) {
			return format(date, fmt);
		},
		parse: function(dateStr, fmt) {
			return new Date(Date.parse(dateStr));
		},
		ceil4Quarter: function() {
			var now = new Date();
			var mins = Math.ceil(now.getMinutes() / 15) * 15;
			now.setMinutes(mins);

			return format(now, 'yyyy-MM-dd hh:mm');
		},
		floor4Quarter: function() {
			var now = new Date();
			var mins = Math.floor(now.getMinutes() / 15) * 15;
			now.setMinutes(mins);

			return format(now, 'yyyy-MM-dd hh:mm');
		},
		getCurrentYear: function() {
			return(new Date()).getFullYear();
		},
		getCurrentTime: function() {
			return new Date();
		},
		getCurrentTimeText: function() {
			return format(new Date(), 'yyyy-MM-dd hh:mm');
		},
		addDays: function(date, intervals) {
			return new Date(date.getTime() + 86400000 * intervals);
		},
		addMonths: function(date, months) {
			var t = new Date(date.getTime());

			t.setMonth(t.getMonth() + months);

			if(t.getDay() == 31) {
				t.setTime(t.getTime() - 86400000);
			}

			return t;
		},
		addYears: function(date, years) {
			var t = new Date(date.getTime());

			t.setYear(t.getFullYear() + years);

			return t;
		},
		getIntervalMonths: function(s, e) {
			var intervals = (e.getFullYear() - s.getFullYear()) * 12;

			var t = DateUtils.addYears(s, (e.getFullYear() - s.getFullYear()));

			if(t.getTime() >= e.getTime()) {
				while(t.getTime() >= e.getTime()) {
					t = DateUtils.addMonths(t, -1);
					intervals = intervals - 1;
				}
			} else {
				while(t.getTime() <= e.getTime()) {
					t = DateUtils.addMonths(t, 1);
					intervals = intervals + 1;
				}
				intervals = intervals - 1;
			}

			return intervals;
		}
	};
})();

var StringUtils = (function() {

	return {
		isBlank: function(str) {
			return str == 'undefined' || str == null || str.length == 0;
		},
		trim: function(str) {
			if(!StringUtils.isBlank(str)) {
				return str;
			} else {
				return '';
			}
		},
		split: function(str, sChar) {
			return str.split(sChar);
		}
	};
})();

var CacheUtils = (function() {
	return {
		setCache: function(k, v) {
			localStorage.setItem(k, JSON.stringify(v || {}));
		},
		loadCache: function(k) {
			return JSON.parse(localStorage.getItem(k));
		},
		clearCache: function(k) {
			localStorage.removeItem(k);
		}
	}
})();

var PathUtils= (function(){
	return {
		preUrl: function(){
			return "http://127.0.0.1:8081";
		},
		upload:function(){
			return "http://localhost:8282/microblog/upload";
		},
		member:{
			findAll:function(){
				return "/zuozhan/member/findAll";
			},
			addOne:function(){
				return "/zuozhan/member/memberEditor";
			},
			search:function(){
				return "/zuozhan/member/search";
			}
		},
		task:{
			findAll:function(){
				return "/zuozhan/task/findAll";
			},
			addOne:function(){
				return "/zuozhan/task/editor";
			},
			editorUrl:function(){
				return "/zuozhan/task/editor?id=";
			},
			findDetails:function(){
				return "/zuozhan/task/findDetails";
			},
			findActiveDetails1:function(){
				return "/zuozhan/task/findActiveTaskDetails1";
			},
			detailList:function(){
				return "/zuozhan/task/detailList?taskId=";
			},
			executerDetailList:function(){
				return "/zuozhan/task/executerDetailList?executeId=";
			},
			findArmsDetails:function(){
				return "/zuozhan/task/findArmsDetails";
			},
			findActiveDetails:function(){
				return "/zuozhan/task/findActiveTaskDetails";
			},
			progress:function(){
				return "/zuozhan/task/taskProgress";
			},
			planList:function(){
				return "/zuozhan/task/planList?taskId=";
			},
			editorDetailUrl:function(){
				return "/zuozhan/task/exeEditor?id="
			}
		},
		group:{
			editorUrl:function(){
				return "/zuozhan/group/groupEditor?id=";
			},
			detailUrl:function(){
				return "/zuozhan/member/memberList?groupId="
			},
			findAll:function(){
				return "/zuozhan/group/findAll";
			},
			addOne:function(){
				return "/zuozhan/group/groupEditor";
			},
			listUrl:function(){
				return "/zuozhan/group/groupList";
			}
		},
		user:{
			findAll:function(){
				return "/zuozhan/user/findAll";
			},
			addOne:function(){
				return "/zuozhan/user/userEditor"
			},
			search:function(){
				return "/zuozhan/user/search";
			}
		},
		friend:{
			findAll:function(){
				return "/zuozhan/friend/findAll";
			},
			addOne:function(){
				return "/zuozhan/friend/friendEditor"
			},
			search:function(){
				return "/zuozhan/friend/search";
			}
		},
		role:{
			findAll:function(){
				return "/zuozhan/role/findAll";
			},
			addOne:function(){
				return "/zuozhan/role/roleEditor"
			},
			detail:function(){
				return "/zuozhan/role/userRole";
			}
		},
		permission:{
			detail:function(){
				return "/zuozhan/permission/rolePermissionList";
			}
		},
		target:{
			findAll:function(){
				return "/zuozhan/target/findAll";
			},
			addOne:function(){
				return "/zuozhan/target/targetEditor"
			}
		},
		arms:{
			findAll:function(){
				return "/zuozhan/arms/findAll";
			},
			addOne:function(){
				return "/zuozhan/arms/armsEditor"
			}
		},
		car:{
			findAll:function(){
				return "/zuozhan/car/findAll";
			},
			addOne:function(){
				return "/zuozhan/car/carEditor"
			}
		},
		cargroup:{
			findAll:function(){
				return "/zuozhan/cargroup/findAll";
			},
			addOne:function(){
				return "/zuozhan/cargroup/editor"
			}
		},
		fire:{
			detail:function(){
				return "/zuozhan/car/fireEditor";
			}
		},
		weather:{
			detail:function(){
				return "/zuozhan/car/weatherEditor";
			}
		},
		aviation:{
			detail:function(){
				return "/zuozhan/car/aviationEditor";
			}
		},
		flow:{
			detail:function(){
				return "/zuozhan/car/flowEditor";
			}
		},
		self:{
			findAll:function(){
				return "/zuozhan/self/findAll";
			}
		},
		pics:{
			picsUrl:function(){
				return "/zuozhan/task/timeLine?id="
			}
		}
	}
})();
