package com.yangrui.config.basic.properties;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;

import com.alibaba.druid.pool.DruidDataSource;

@Configuration
public class DataSourceConfig {

	@Value("${database.url}")
	private String url;
	@Value("${database.user}")
	private String user;
	@Value("${database.password}")
	private String password;
	@Value("${database.driverName}")
	private String driverName;
	@Value("${database.maxActive}")
	private Integer maxActive;
	@Value("${database.minIdle}")
	private Integer minIdle;
	@Value("${database.initialSize}")
	private Integer initialSize;
	@Value("${database.maxWait}")
	private Integer maxWait;
	
	
	
	public String getDriverName() {
		return driverName;
	}

	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}

	public int getMaxActive() {
		return maxActive;
	}

	public void setMaxActive(int maxActive) {
		this.maxActive = maxActive;
	}

	public int getMinIdle() {
		return minIdle;
	}

	public void setMinIdle(int minIdle) {
		this.minIdle = minIdle;
	}

	public int getInitialSize() {
		return initialSize;
	}

	public void setInitialSize(int initialSize) {
		this.initialSize = initialSize;
	}

	public int getMaxWait() {
		return maxWait;
	}

	public void setMaxWait(int maxWait) {
		this.maxWait = maxWait;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	@Bean
	@Primary
	public DataSource dataSource() throws Exception {
		//Resource resource=new PathMatchingResourcePatternResolver().getResource("");
		System.out.println("user="+user);
		DruidDataSource dataSource=new DruidDataSource();
		dataSource.setUsername(user);
		dataSource.setPassword(password);
		dataSource.setUrl(url);
		dataSource.setDriverClassName(driverName);
		dataSource.setMaxActive(maxActive);
		dataSource.setMinIdle(minIdle);
		dataSource.setInitialSize(initialSize);
		dataSource.setMaxWait(maxWait);
		dataSource.setRemoveAbandoned(true);
		dataSource.setRemoveAbandonedTimeout(10);
		dataSource.setDefaultAutoCommit(true);
		
		return dataSource;
	}
	
}
