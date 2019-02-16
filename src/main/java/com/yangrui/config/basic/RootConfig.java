package com.yangrui.config.basic;
import java.io.IOException;
import java.util.Properties;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.*;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.alibaba.druid.pool.DruidDataSource;
import com.yangrui.util.file.PathUtil;

import redis.clients.jedis.JedisPoolConfig;

@Configuration
@EnableTransactionManagement
@EnableAspectJAutoProxy
@ComponentScan("com.yangrui")
@MapperScan("com.yangrui.database.dao")
@PropertySource("classpath:application.properties")
public class RootConfig {

	@Bean
	public CommonsMultipartResolver multipartResolver() throws IOException {
		
		CommonsMultipartResolver resolver=new CommonsMultipartResolver();
		resolver.setDefaultEncoding("utf-8");
		resolver.setUploadTempDir(new PathResource(PathUtil.systemPath()));
		return resolver;
	}
	
	@Bean(name="sqlSessionFactory")
	@Primary
	public SqlSessionFactory sqlSessionFactoryBean(DataSource dataSource) throws Exception {
		SqlSessionFactoryBean sqlSessionFactoryBean=new SqlSessionFactoryBean();
		sqlSessionFactoryBean.setDataSource(dataSource);
		Properties properties=new Properties();
		properties.setProperty("useGeneratedKeys", "false");
		properties.setProperty("useColumnLabel", "true");
		properties.setProperty("mapUnderscoreToCamelCase", "true");
		properties.setProperty("logImpl", "STDOUT_LOGGING");
		//properties.setProperty("sqlmapper", "classpath:mapper/*.xml");
		sqlSessionFactoryBean.setConfigurationProperties(properties);
		sqlSessionFactoryBean.setConfigLocation(new PathMatchingResourcePatternResolver().getResource("classpath:mybatisConfig.xml"));
		sqlSessionFactoryBean.setTypeAliasesPackage("com.yangrui.database.entity");
		Resource[] resources = new PathMatchingResourcePatternResolver()
                .getResources("classpath*:mapper/*.xml");
		sqlSessionFactoryBean.setMapperLocations(resources);
		SqlSessionFactory factory=sqlSessionFactoryBean.getObject();
		return factory;
	}
	
	@Bean
	public DataSourceTransactionManager transactionManager(DataSource dataSource) throws Exception {
		DataSourceTransactionManager transactionManager=new DataSourceTransactionManager(dataSource);
		//AnnotationTransactionAspect.aspectOf().setTransactionManager(txManager);
		return transactionManager;
	}
	
	//@Bean
	public JedisPoolConfig jedisPoolConfig() {
		JedisPoolConfig jedisPoolConfig=new JedisPoolConfig();
		jedisPoolConfig.setMaxIdle(10);
		jedisPoolConfig.setMinIdle(4);
		jedisPoolConfig.setMaxWaitMillis(1000);
		jedisPoolConfig.setTestOnBorrow(true);
		
		return jedisPoolConfig;
	}
	
	//@Bean
	public JedisConnectionFactory jedisConnectionFactory() {
		JedisConnectionFactory jedisConnectionFactory=new JedisConnectionFactory();
		jedisConnectionFactory.setHostName("127.0.0.1");
		jedisConnectionFactory.setPassword("134167");
		jedisConnectionFactory.setPort(6379);
		jedisConnectionFactory.setPoolConfig(jedisPoolConfig());
		return jedisConnectionFactory;
	}
	
	//@Bean
	public StringRedisTemplate redisTemplate() {
		StringRedisTemplate  redisTemplate=new StringRedisTemplate();
		redisTemplate.setConnectionFactory(jedisConnectionFactory());
		return redisTemplate;
	}
}
