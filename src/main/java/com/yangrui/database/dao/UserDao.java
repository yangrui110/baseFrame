package com.yangrui.database.dao;

import java.util.List;

import com.yangrui.database.entity.User;

public interface UserDao {
	
	public List<User> findAll();

}
