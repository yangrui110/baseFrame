package com.yangrui.config.basic.jsonConfig;

import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import com.yangrui.response.ResultEntity;
import com.yangrui.response.ResultEnum;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;

import java.io.IOException;
import java.util.List;

/**
 * @autor 杨瑞
 * @date 2019/2/12 20:32
 */
public class MyFastJsonConvert extends FastJsonHttpMessageConverter {
    @Override
    protected void writeInternal(Object object, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        ResultEntity resultEntity=new ResultEntity(ResultEnum.OK,object);
        if(object instanceof ResultEntity){
           super.writeInternal(object,outputMessage);
        } else if(!(object instanceof String)) {
            super.writeInternal(resultEntity, outputMessage);
        }else super.writeInternal(object,outputMessage);
    }
}
