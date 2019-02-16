package com.yangrui.database.controller;

import com.alibaba.fastjson.JSONObject;
import com.yangrui.database.service.CommonOpService;
import com.yangrui.database.sql.entity.Condition;
import com.yangrui.database.sql.entity.Save;
import com.yangrui.response.ResultEntity;
import com.yangrui.response.ResultEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @autor 杨瑞
 * @date 2019/2/2 23:56
 */
@Controller
@RequestMapping("common")
public class CommonOp {

    @Autowired
    private CommonOpService commonOpService;

    @ResponseBody
    @PostMapping("findAll")
    public ResultEntity findAll(@RequestBody Condition condition){

        List<Map> lists=commonOpService.findAll(condition);
        int count=commonOpService.countAll(condition);
        return new ResultEntity(ResultEnum.OK,lists,count);
    }

    @ResponseBody
    @PostMapping("save")
    public ModelMap save(@RequestBody  Save save){
        commonOpService.save(save);
        return new ModelMap("result",true);
    }

    @ResponseBody
    @DeleteMapping("deleteSelect")
    public ModelMap deleteSelect(@RequestBody List<Save> saves){
        for (Save save :saves) {
            delete(save);
        }
        return new ModelMap("result",true);
    }

    @ResponseBody
    @DeleteMapping("delete")
    public ModelMap delete(@RequestBody  Save save){
        commonOpService.delete(save);
        return new ModelMap("result",true);
    }

    @GetMapping("add/{projectName}/{listName}")
    public ModelAndView add(@PathVariable String projectName,@PathVariable String listName){
        return new ModelAndView(projectName+"/"+listName);
    }

}
