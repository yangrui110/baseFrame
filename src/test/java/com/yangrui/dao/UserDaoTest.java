package com.yangrui.dao;

import com.yangrui.annotation.TableAlias;
import com.yangrui.config.basic.RootConfig;
import com.yangrui.database.dao.UserDao;
import com.yangrui.database.entity.User;
import com.yangrui.database.service.CommonOpService;
import com.yangrui.database.sql.entity.Condition;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @autor 杨瑞
 * @date 2019/2/2 16:38
 */
@RunWith(SpringRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = {RootConfig.class})
public class UserDaoTest {

    @Autowired
    private UserDao userDao;

    @Autowired
    private CommonOpService commonOpService;

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    //@Test
    public void test(){
        List<User> users=userDao.findAll();
        System.out.println(users.size());
        Class cla=User.class;
       TableAlias alias= (TableAlias) cla.getAnnotation(TableAlias.class);
        System.out.println(alias.value());
    }

    @Test
    public void test2() throws Exception {
        this.mockMvc.perform(get("/test/t2").accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }
}
