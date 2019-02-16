package com.yangrui.exception;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.yangrui.response.ResultEntity;
import com.yangrui.response.ResultEnum;

public class ExceptionHandler extends ExceptionHandlerExceptionResolver{
	Logger logger=LoggerFactory.getLogger(ResultEntity.class);
	@Override
	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler,
			Exception ex) {
		// TODO Auto-generated method stub
		//return super.resolveException(request, response, handler, ex);
		ExceptionEntity exceptionEntity=null;
		if(ex instanceof BaseException) {
			exceptionEntity=((BaseException) ex).getExceptionEntity();
			exceptionEntity.setPath(request.getRequestURI());
			if(exceptionEntity.getCode()==401)
				return new ModelAndView("login");
		} else {
			exceptionEntity=new ExceptionEntity(ResultEnum.ERROR);
			exceptionEntity.setPath(request.getRequestURI());
			ByteArrayOutputStream out=new ByteArrayOutputStream();
			ex.printStackTrace(new PrintStream(out));
			try {
				logger.error(out.toString("UTF-8"));
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		if(parseAndReturn(request,response,exceptionEntity))
			return new ModelAndView();
		Map<String,Object> os=new HashMap<>();
		os.put("e", ex);
		return new ModelAndView("error",os);
	}
	
	private boolean parseAndReturn(HttpServletRequest request,HttpServletResponse response,ExceptionEntity exceptionEntity) {
		String accept=request.getHeader("accept");
		if(!accept.contains("text/html")) {
			response.setContentType("application/json");
			response.setCharacterEncoding("utf-8");
			JSON jsonObject=(JSON) JSONObject.toJSON(exceptionEntity);
			try {
				response.getWriter().write(jsonObject.toJSONString());
				return true;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return false;
	}
}
