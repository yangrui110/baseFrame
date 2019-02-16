package com.yangrui.aspect;

import com.yangrui.database.sql.entity.Condition;
import com.yangrui.database.sql.entity.Save;
import com.yangrui.database.sql.make.DealCondtion;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @autor 杨瑞
 * @date 2019/2/2 23:39
 * 作用：处理通用的数据库操作
 */
@Aspect
@Component
public class DealCommonOp {

    @Pointcut("execution(* com.yangrui.database.service.CommonOpService.findAll(..))")
    public void point(){}

    @Pointcut("execution(* com.yangrui.database.service.CommonOpService.save(com.yangrui.database.sql.entity.Save))")
    public void ups(){}

    @Pointcut("execution(* com.yangrui.database.service.CommonOpService.delete(..))")
    public void del(){}
    /**
     * 调用目标方法之前，需要进行参数的判断，并且封装成所需要的参数属性
     * 处理条件查询（包含子查询以及函数表达式）、连接查询、排序、分组、分页
     * */
    @Before("point()")
    public void before(JoinPoint joinPoint) throws ClassNotFoundException {
        Object[] os=joinPoint.getArgs();
        for(int i=0;i<os.length;i++){
            if( os[i] instanceof Condition){
                Condition condition=(Condition)os[i];
                DealCondtion.dealCondition(condition);
            }
        }
    }

    @Before("ups()")
    public void upsBefore(JoinPoint joinPoint) throws ClassNotFoundException {
        Object[] os=joinPoint.getArgs();
        for(int i=0;i<os.length;i++){
            if( os[i] instanceof Save){
                Save condition=(Save)os[i];
                DealCondtion.dealUpdate(condition);
            }
        }
    }

    @Before("del()")
    public void delBefore(JoinPoint joinPoint) throws ClassNotFoundException {
        Object[] os=joinPoint.getArgs();
        for(int i=0;i<os.length;i++){
            if( os[i] instanceof Save){
                Save condition=(Save)os[i];
                DealCondtion.dealDelete(condition);
            }
        }
    }
}
