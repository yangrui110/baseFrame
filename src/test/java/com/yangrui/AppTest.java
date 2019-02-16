package com.yangrui;

import static org.junit.Assert.assertTrue;

import com.alibaba.fastjson.JSONObject;
import org.junit.Test;

/**
 * Unit test for simple App.
 */
public class AppTest 
{
    /**
     * Rigorous Test :-)
     */
    @Test
    public void shouldAnswerWithTrue()
    {
        assertTrue( true );
    }

    public static void main(String[] args) {
        JSONObject os=new JSONObject();
        os.put("left","123");
        os.put("right","xyz");
        os.put("relation","=");
        System.out.println(os.toJSONString());

        String str="{\"left\":\"123\",\"right\":\"xyz\",\"relation\":\"=\"}";
        JSONObject object=JSONObject.parseObject(str);
        System.out.println(object.get("left"));
    }
}
