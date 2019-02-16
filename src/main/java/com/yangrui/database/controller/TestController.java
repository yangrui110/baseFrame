package com.yangrui.database.controller;

import com.alibaba.fastjson.JSONObject;
import com.yangrui.database.service.CommonOpService;
import com.yangrui.database.sql.entity.Condition;
import com.yangrui.database.sql.entity.PK;
import com.yangrui.database.sql.entity.Save;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Map;

/**
 * @autor 杨瑞
 * @date 2019/2/2 16:13
 */
@Controller
@RequestMapping("test")
public class TestController {
    @Autowired
    private CommonOpService commonOpService;


    @ResponseBody
    @GetMapping("t1")
    public List test(){
        Condition condition=new Condition();
        condition.setEntityName("user");

        JSONObject object3=new JSONObject();
        object3.put("left","id");
        object3.put("right","1");
        object3.put("pare","=");

        JSONObject object=new JSONObject();
        object.put("left","id");
        object.put("right","5");
        object.put("pare","=");

        JSONObject object2=new JSONObject();
        object2.put("left","name");
        object2.put("right","李四");
        object2.put("pare","=");

        JSONObject object1=new JSONObject();
        object1.put("left",object);
        object1.put("right",object2);
        object1.put("pare","and");

        JSONObject object4=new JSONObject();
        object4.put("left",object3);
        object4.put("right",object1);
        object4.put("pare","or");
        condition.setConditions(object1.toJSONString());
        System.out.println(object4.toJSONString());
        List<Map> s= commonOpService.findAll(condition);
        return s;
    }

    @ResponseBody
    @GetMapping("t2")
    public void update(){
        PK pk=new PK();
        pk.setKey("id");
        Save save=new Save();
        save.setPk(pk);
        JSONObject jsonObject=new JSONObject();
        jsonObject.put("name","汪涵");
        save.setJsonMap(jsonObject.toJSONString());
        save.setEntityName("user");
        commonOpService.save(save);
    }

    @GetMapping("t3")
    public ModelAndView t3(){

        return new ModelAndView("common/list");
    }
}