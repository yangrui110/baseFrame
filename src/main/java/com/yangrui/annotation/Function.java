package com.yangrui.annotation;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Function {
    //函数名
    String function() default "";
    //函数参数
    String param() default "";
    //别名
    String alias() default "";
}
