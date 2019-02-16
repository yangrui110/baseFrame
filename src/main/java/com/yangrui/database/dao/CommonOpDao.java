package com.yangrui.database.dao;

import com.yangrui.database.sql.entity.Condition;
import com.yangrui.database.sql.entity.Save;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface CommonOpDao {
    List<Map> findAll(@Param("condition") Condition condition);

    void update(Save save);

    void insert(Save save);

    void delete(Save save);

    int getMaxId(Save save);

    int countAll(Condition condition);
}
