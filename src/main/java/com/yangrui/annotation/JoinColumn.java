package com.yangrui.annotation;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface JoinColumn {
    String value() default "";

    /**
     * 当前列，用于on之后的条件，和referColumn对应
     * */
    String column() ;
    /**
     * 关联表的列，用于on之后的条件，和Column对应
     * */
    String referColumn() ;
    /**
     * 两个列之间的关系,column > referColumn或者column < referColumn或者column = referColumn
     * */
    String referRealtion();
    /**
     * 关联的表名
     * */
    String referTable() ;

    /**
     * 两表之间的关联关系
     * 包含left join,inner join
     * */
    String tableRelation();

    /**
     * 仅在entity属性为false时才有作用
     * 查出结果后，用于查询的列名（值对应数据库表的列名），默认不查询列名
     * */
    String receiveColumn() default "";

    /**
     * 仅在entity属性为false时才有作用
     * 返回结果的别名
     * */
    String receiveColumnAlias() default "";

    /**
     * 是否返回结果实体,,如果为真，将会返回所有的结果值
     * */
    boolean entity() default false;
}
