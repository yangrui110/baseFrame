package com.yangrui.database.sql.entity;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @autor 杨瑞
 * @date 2019/2/3 0:18
 */
@Data
public class Condition {
    private String entityName;
    private String conditions;

    private Integer page;
    private Integer limit;
    //其它的参数设置
    private List<String> relationParams = new ArrayList<>();
    private List<String> columnParams = new ArrayList<>();
    private String whereParams;
    private String groupBy;
    private String orderBy;
    private String fromTable;
    private Integer start;
    private Integer end;
}
