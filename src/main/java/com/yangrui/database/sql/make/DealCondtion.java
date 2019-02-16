package com.yangrui.database.sql.make;

import com.alibaba.fastjson.JSONObject;
import com.yangrui.annotation.*;
import com.yangrui.database.sql.entity.Condition;
import com.yangrui.database.sql.entity.Save;
import com.yangrui.exception.BaseException;
import com.yangrui.util.math.RandomUtil;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

/**
 * @autor 杨瑞
 * @date 2019/2/4 18:02
 */
public class DealCondtion {

    public static void dealUpdate(Save save) throws ClassNotFoundException {
        if(!StringUtils.isEmpty(save.getJsonMap())) {
            JSONObject object = JSONObject.parseObject(save.getJsonMap());
            //save.setMaps(object);
            //1.获取类的所有属性
            Class cs=getEntityClass(save.getEntityName());
            //2.遍历判断属性的别名是否存在，如果存在，就改为数据库中存储的列名
            Map result=new HashMap();
            Field[] fields=cs.getDeclaredFields();
            for (Field f : fields) {
                if (f.isAnnotationPresent(Column.class)){
                    Column column=f.getAnnotation(Column.class);
                    String orign=f.getName();
                    if(!StringUtils.isEmpty(column.value()))
                        orign=column.value();
                    String alias=f.getName();
                    if(!StringUtils.isEmpty(column.alias()))
                        alias=column.alias();
                    Object value=object.get(alias);
                    if(!StringUtils.isEmpty(value)){
                        result.put(orign,value);
                    }
                }
            }
            save.setMaps(result);
        }
    }

    //处理通用的删除操作参数
    public static void dealDelete(Save save) throws ClassNotFoundException {
        if(!StringUtils.isEmpty(save.getJsonMap())){
            JSONObject object=JSONObject.parseObject(save.getJsonMap());
            save.setMaps(object);
            /*
            Class cs=getEntityClass(save.getEntityName());
            Field[] fields=cs.getDeclaredFields();
            for (Field f:fields) {
                if(f.isAnnotationPresent(PK.class)){
                    //有column和joincolumn注解时，才会解析Pk
                    if(f.isAnnotationPresent(Column.class)){
                        Column column=f.getAnnotation(Column.class);
                        String refer=column.value()==null?f.getName():column.value();
                        String alias=null;
                        if(!StringUtils.isEmpty(column.alias()))
                            alias=column.alias();
                        String key=alias==null?refer:alias;
                        save.getPk().setKey(refer);
                        save.getPk().setValue(object.getString(key));
                    }
                }
            }*/
        }
    }
    /**
     *处理查询
     * 1.确保实体存在
     * 2.处理实体上的注解
     * 3.处理condition的json数据
     **/
    public static void dealCondition(Condition condition) throws ClassNotFoundException {
        Map<String,String> keys=new HashMap<>();   //存放的是table的别名
        if (!StringUtils.isEmpty(condition.getEntityName())){
            Class cs=getEntityClass(condition.getEntityName());
            dealAnnotation(cs,condition,keys);
        }else throw new BaseException(411,"视图名不能传入空值");
        StringBuilder builder=new StringBuilder();
        Map mapColumns=getMapColumns(condition);
        dealWhereParams(condition.getConditions(),builder,keys,0,mapColumns);
        System.out.println("builder="+builder.toString());
        condition.setWhereParams(builder.toString());
        if(condition.getPage()!=null&&condition.getLimit()!=null){
            condition.setStart((condition.getPage()-1)*condition.getLimit());
            condition.setEnd(condition.getPage()*condition.getLimit());
        }
    }

    /**
     * @return 获取实体的属性名和列名之间的对应关系
     * */
    private static Map getMapColumns(Condition condition) throws ClassNotFoundException {
        Class cs=getEntityClass(condition.getEntityName());
        Field[] fields=cs.getDeclaredFields();
        Map<String,Object> maps=new HashMap<>();
        for (Field f:fields) {
            String alias=f.getName();
            if(f.isAnnotationPresent(Column.class)){
                Column c=f.getAnnotation(Column.class);
                if(!StringUtils.isEmpty(c.value()))
                    maps.put(alias,c.value());
                else maps.put(alias,alias);
            }else if(f.isAnnotationPresent(JoinColumn.class)){
                JoinColumn joinColumn=f.getAnnotation(JoinColumn.class);
                if(!StringUtils.isEmpty(joinColumn.receiveColumn()))
                    maps.put(alias,joinColumn.receiveColumn());
                else maps.put(alias,alias);
            }
        }
        return maps;
    }
    /**
     * 处理condition
     * */
    private static void dealWhereParams(String jsonStr,StringBuilder builder,Map keys,int direct,Map map){
        if(isJson(jsonStr)){
            JSONObject os=JSONObject.parseObject(jsonStr);
            if(os.containsKey("left")||os.containsKey("right")||os.containsKey("pare")) {
                dealWhereParams(os.getString("left"), builder, keys, 1,map);
                builder.append(os.getString("pare")).append(" ");
                dealWhereParams(os.getString("right"), builder, keys, 2,map);
            }
        }else {
            if(direct==1) {
                if(map.get(jsonStr)!=null)
                    builder.append(keys.get(jsonStr)).append(".").append(map.get(jsonStr)).append(" ");
            }
            else if(direct==2)
                builder.append("'").append(jsonStr).append("'").append(" ");
        }
    }

    private static boolean isJson(String str){
        if(StringUtils.isEmpty(str))
            return false;
        try {
            JSONObject.parseObject(str);
            return true;
        }catch (Exception e){
            return false;
        }
    }
    public static String parseFirstToUp(String result){
        String r1=result.substring(0,1);
        String r2=result.substring(1);
        return r1.toUpperCase()+r2;
    }

    private static void dealAnnotation(Class cs,Condition toCondition,Map maps){
        Field[] fields=cs.getDeclaredFields();
        String tableName = dealTable(cs,toCondition);
        if(StringUtils.isEmpty(tableName))
            throw new BaseException(413,"实体"+cs.getName()+"没有添加@Table注解");
        //处理每个属性上的注解
        for (Field f :fields) {
            if (f.isAnnotationPresent(Column.class)) {
                dealColumnAnnotation(f,toCondition,tableName,maps);
            } else if (f.isAnnotationPresent(JoinColumn.class)) {
                dealJoinColumnAnnotation(f,toCondition,tableName,maps);
            }
        }
    }

    private static void dealColumnAnnotation(Field f,Condition toCondition,String tableName,Map maps){
        maps.put(f.getName(),tableName);   //为了方便，将tableName的key存为f.getName()
        Column s = f.getAnnotation(Column.class);
        String value = f.getName(); //列的名字
        String alias=f.getName();  //列的别名
        if (!StringUtils.isEmpty(s.value()))
            value = s.value();
        if(!StringUtils.isEmpty(s.alias()))
            alias=s.alias();

        if(f.isAnnotationPresent(OrderBy.class)){
            OrderBy orderBy=f.getDeclaredAnnotation(OrderBy.class);
            toCondition.setOrderBy(tableName+"."+value+" "+orderBy.value());
        }
        if(f.isAnnotationPresent(Function.class)){
            Function function=f.getDeclaredAnnotation(Function.class);
            String alias1=function.alias();
            if(StringUtils.isEmpty(alias1))
                alias1=f.getName();
            toCondition.getColumnParams().add(function.function()+"("+tableName+"."+function.param()+") as "+alias1);
        }else toCondition.getColumnParams().add(tableName+"."+value+" as "+alias);
    }

    private static void dealJoinColumnAnnotation(Field f,Condition toCondition,String tableName,Map maps){
        JoinColumn joinColumn=f.getAnnotation(JoinColumn.class);
        boolean entity=joinColumn.entity();  //是否对应的实体,如果为true，则查询所有
        String column=joinColumn.column();
        String referRelation=joinColumn.referRealtion();
        String referColumn=joinColumn.referColumn();
        String referTable = joinColumn.referTable();
        String relation=joinColumn.tableRelation();
        String tableAlias=RandomUtil.randNum(3);
        maps.put(f.getName(),tableAlias);
        //得到原列名和列别名
        String receiveColumn=f.getName();
        String receiveColumnAlias=f.getName();
        if(!StringUtils.isEmpty(joinColumn.receiveColumn()))
            receiveColumn=joinColumn.receiveColumn();
        if(!StringUtils.isEmpty(joinColumn.receiveColumnAlias()))
            receiveColumnAlias=joinColumn.receiveColumnAlias();
        //开始构造
        StringBuilder builder=new StringBuilder();
        builder.append(relation).append(" ").append(referTable).append(" as ").append(tableAlias).append(" on ").append(tableName).append(".").append(column).append(referRelation).append(" ").append(tableAlias).append(".").append(referColumn);
        if(f.isAnnotationPresent(OrderBy.class)){
            OrderBy orderBy=f.getDeclaredAnnotation(OrderBy.class);
            toCondition.setOrderBy(tableAlias+"."+receiveColumn+" "+orderBy.value());
        }
        if(f.isAnnotationPresent(Function.class)){
            Function function=f.getDeclaredAnnotation(Function.class);
            String alias1=function.alias();
            if(StringUtils.isEmpty(alias1))
                alias1=f.getName();
            toCondition.getColumnParams().add(function.function()+"("+tableAlias+"."+function.param()+") as "+alias1);
        }
        toCondition.getRelationParams().add(builder.toString());
        //开始选取列
        if(entity)
            toCondition.getColumnParams().add(tableAlias+".*");
        else if (!f.isAnnotationPresent(Function.class)){
            toCondition.getColumnParams().add(tableAlias+"."+receiveColumn+" as "+receiveColumnAlias);
        }
    }

    private static String dealTable(Class cs,Condition toCondition){
        Table table= (Table) cs.getDeclaredAnnotation(Table.class);
        String alias=null;
        if(table!=null) {
           String value = table.value();
            if (StringUtils.isEmpty(value))
                value = cs.getSimpleName();
            alias= RandomUtil.randNum(3);
            toCondition.setFromTable(value+" as "+alias);
        }
        return alias;
    }

    private static Class getEntityClass(String entityName) throws ClassNotFoundException {
        Class cs=Class.forName("com.yangrui.database.entity."+parseFirstToUp(entityName));
        if(cs==null){
            throw new BaseException(412,"传入的视图名没有对应一个实体，请审核");
        }else{
           return cs;
        }
    }
}
