package com.yangrui.config.basic;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

//@Component
public class WebFilter implements Filter {

	//@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

	//@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		//System.out.println("过滤中。。。。"+((HttpServletRequest)request).getRequestURI());
		HttpServletResponse resp = (HttpServletResponse) response;
		resp.setHeader("Access-Control-Allow-Origin", "*");
		resp.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
		resp.setHeader("Access-Control-Max-Age", "3600");
		resp.addHeader("Access-Control-Allow-Credentials","true");
		resp.setHeader("Access-Control-Allow-Headers", "Content-Type,Cache-Control,Date,Pragma,Expires");
	    chain.doFilter(request, response);
		
	}

	//@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

}
