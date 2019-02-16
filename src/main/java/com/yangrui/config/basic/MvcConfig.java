package com.yangrui.config.basic;

import java.util.TimeZone;

import javax.servlet.Filter;

import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;
@EnableTransactionManagement
public class MvcConfig extends AbstractAnnotationConfigDispatcherServletInitializer{

	@Override
	protected Class<?>[] getRootConfigClasses() {
		// TODO Auto-generated method stub
		TimeZone.setDefault(TimeZone.getTimeZone("GMT+8"));
		return new Class<?>[] {RootConfig.class};
	}

	@Override
	protected Class<?>[] getServletConfigClasses() {
		// TODO Auto-generated method stub
		return new Class<?>[] {WebConfig.class};
	}

	@Override
	protected String[] getServletMappings() {	
		// TODO Auto-generated method stub
		return new String[] {"/"};
	}

	@Override
	protected Filter[] getServletFilters() {
		// TODO Auto-generated method stub
		return new Filter[] {new WebFilter()};
	}

	

}
