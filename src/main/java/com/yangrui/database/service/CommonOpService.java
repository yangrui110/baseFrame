package com.yangrui.database.service;

import com.yangrui.database.dao.CommonOpDao;
import com.yangrui.database.sql.entity.Condition;
import com.yangrui.database.sql.entity.Save;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;

/**
 * @autor 杨瑞
 * @date 2019/2/2 23:56
 */
@Service
public class CommonOpService {

    @Autowired
    private CommonOpDao commonOpDao;

    public List<Map> findAll(Condition condition){

        List<Map> s=commonOpDao.findAll(condition);
        return  s;
    }

    public void save(Save save){
        if(save.getPk()==null)
            commonOpDao.insert(save);
        else if(StringUtils.isEmpty(save.getPk().getValue())) {
            int maxId=commonOpDao.getMaxId(save);
            save.getPk().setValue(""+maxId);
            save.getMaps().put(save.getPk().getKey(),""+maxId);
            commonOpDao.insert(save);
        }else {
            save.getMaps().remove(save.getPk().getKey());
            commonOpDao.update(save);
        }
    }

    public int countAll(Condition condition){
        return commonOpDao.countAll(condition);
    }

    public void delete(Save save){
        commonOpDao.delete(save);
    };
}
