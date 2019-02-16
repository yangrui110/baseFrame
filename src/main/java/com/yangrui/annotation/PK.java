package com.yangrui.annotation;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
/**
 * 标识此列是主键,用于删除、更新、保存三大操作的使用，属于必备的注解
 * */
public @interface PK {
    String value() default "";

}
