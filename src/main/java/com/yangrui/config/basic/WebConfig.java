
package com.yangrui.config.basic;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import com.yangrui.config.basic.jsonConfig.MyFastJsonConvert;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.config.annotation.*;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.spring5.view.ThymeleafViewResolver;
import org.thymeleaf.templatemode.TemplateMode;

import com.alibaba.fastjson.serializer.SerializerFeature;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import com.yangrui.config.interceptor.LoginInterceptor;
import com.yangrui.exception.ExceptionHandler;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages= {"com.yangrui.*"},
includeFilters= {@Filter(type=FilterType.ANNOTATION,classes= {Controller.class})},
useDefaultFilters=false)
public class WebConfig extends WebMvcConfigurerAdapter implements ApplicationContextAware{
	
	private ApplicationContext applicationContext;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// TODO Auto-generated method stub
		registry.addMapping("/zuozhan/**")
		.allowCredentials(true)
		.allowedOrigins("http://127.0.0.1:8081")
		.allowedMethods("*")
		.allowedHeaders("Content-Type,Origin")
		.maxAge(3600);
	}

	@Override
	public void configureHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
		// TODO Auto-generated method stub
		//super.configureHandlerExceptionResolvers(resolvers);
		resolvers.add(new ExceptionHandler());
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		// TODO Auto-generated method stub
		//WebMvcConfigurer.super.addInterceptors(registry);
		registry.addInterceptor(new LoginInterceptor());
	}


	@Override
	public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
		// TODO Auto-generated method stub
		//StringHttpMessageConverter messageConverter=new StringHttpMessageConverter();
		//messageConverter.setDefaultCharset(Charset.forName("UTF-8"));
		//converters.add(messageConverter);
		FastJsonHttpMessageConverter fastJsonHttpMessageConverter=new MyFastJsonConvert();
		fastJsonHttpMessageConverter.setDefaultCharset(Charset.forName("UTF-8"));
		List<MediaType> supportedMediaTypes=new ArrayList<>();
		supportedMediaTypes.add(MediaType.APPLICATION_JSON);
	       supportedMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
	       supportedMediaTypes.add(MediaType.APPLICATION_ATOM_XML);
	       supportedMediaTypes.add(MediaType.APPLICATION_FORM_URLENCODED);
	       supportedMediaTypes.add(MediaType.APPLICATION_OCTET_STREAM);
	       supportedMediaTypes.add(MediaType.APPLICATION_PDF);
	       supportedMediaTypes.add(MediaType.APPLICATION_RSS_XML);
	       supportedMediaTypes.add(MediaType.APPLICATION_XHTML_XML);
	       supportedMediaTypes.add(MediaType.APPLICATION_XML);
	       supportedMediaTypes.add(MediaType.IMAGE_GIF);
	       supportedMediaTypes.add(MediaType.IMAGE_JPEG);
	       supportedMediaTypes.add(MediaType.IMAGE_PNG);
	       supportedMediaTypes.add(MediaType.TEXT_EVENT_STREAM);
	       supportedMediaTypes.add(MediaType.TEXT_HTML);
	       supportedMediaTypes.add(MediaType.TEXT_MARKDOWN);
	       supportedMediaTypes.add(MediaType.TEXT_PLAIN);
	       supportedMediaTypes.add(MediaType.TEXT_XML);
		fastJsonHttpMessageConverter.setSupportedMediaTypes(supportedMediaTypes);
		FastJsonConfig config=new FastJsonConfig();
		config.setDateFormat("yyyy-MM-dd HH:mm:ss");
		config.setCharset(Charset.forName("UTF-8"));
		config.setSerializerFeatures(SerializerFeature.WriteMapNullValue);
		//config.setSerializerFeatures(SerializerFeature.DisableCircularReferenceDetect);
		fastJsonHttpMessageConverter.setFastJsonConfig(config);
		converters.add(fastJsonHttpMessageConverter);
		
	}
	
	
	
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		// TODO Auto-generated method stub
		
		this.applicationContext=applicationContext;
	}

	@Bean
    public SpringResourceTemplateResolver templateResolver(){
        // SpringResourceTemplateResolver automatically integrates with Spring's own
        // resource resolution infrastructure, which is highly recommended.
        SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();
        templateResolver.setApplicationContext(this.applicationContext);
        templateResolver.setPrefix("classpath:/templates/");
        templateResolver.setSuffix(".html");
        templateResolver.setCharacterEncoding("utf-8");
        // HTML is the default value, added here for the sake of clarity.
        templateResolver.setTemplateMode(TemplateMode.HTML);
        // Template cache is true by default. Set to false if you want
        // templates to be automatically updated when modified.
        templateResolver.setCacheable(false);
        return templateResolver;
    }

    @Bean
    public SpringTemplateEngine templateEngine(){
        // SpringTemplateEngine automatically applies SpringStandardDialect and
        // enables Spring's own MessageSource message resolution mechanisms.
        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver());
        // Enabling the SpringEL compiler with Spring 4.2.4 or newer can
        // speed up execution in most scenarios, but might be incompatible
        // with specific cases when expressions in one template are reused
        // across different data types, so this flag is "false" by default
        // for safer backwards compatibility.
        templateEngine.setEnableSpringELCompiler(true);
        return templateEngine;
    }

    @Bean
    public ThymeleafViewResolver viewResolver(){
        ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
        viewResolver.setTemplateEngine(templateEngine());
        viewResolver.setCharacterEncoding("UTF-8");
        return viewResolver;
    }


	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// TODO Auto-generated method stub
		registry.addResourceHandler("/images/**").addResourceLocations("classpath:static/images/");
        registry.addResourceHandler("/css/**").addResourceLocations("classpath:static/css/");
        registry.addResourceHandler("/js/**").addResourceLocations("classpath:static/js/");
        registry.addResourceHandler("/common/**").addResourceLocations("classpath:static/common/");
        registry.addResourceHandler("/font/**").addResourceLocations("classpath:static/font/");
        registry.addResourceHandler("/fonts/**").addResourceLocations("classpath:static/fonts/");
        registry.addResourceHandler("/json/**").addResourceLocations("classpath:static/json/");
        registry.addResourceHandler("/jsplug/**").addResourceLocations("classpath:static/jsplug/");
        registry.addResourceHandler("/leaflet/**").addResourceLocations("classpath:static/leaflet/");
        registry.addResourceHandler("/iclient/**").addResourceLocations("classpath:static/iclient/");
        registry.addResourceHandler("/map/**").addResourceLocations("classpath:static/map/");
		registry.addResourceHandler("/project/common/**").addResourceLocations("classpath:static/project/common/");
		registry.addResourceHandler("/templates/**").addResourceLocations("classpath:templates/");
	}

}
