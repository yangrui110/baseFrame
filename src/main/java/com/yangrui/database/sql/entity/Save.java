package com.yangrui.database.sql.entity;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * @autor 杨瑞
 * @date 2019/2/6 22:14
 */
@Data
public class Save {

    private String entityName;
    private String jsonMap; //首先由jsonMap接收Json字符串，再转为maps存储key--value

    private Map maps =new HashMap();
    private PK pk;
}
