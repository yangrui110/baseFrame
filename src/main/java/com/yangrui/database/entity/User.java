package com.yangrui.database.entity;

import com.yangrui.annotation.*;
import lombok.Data;

@Data
@Table("user")
public class User {
	@PK
	@OrderBy
	@Column(value="id",alias = "idx")
	private String idn;
	@Column
	private String name;

	@Column(value = "age")
	private Integer agex;
	//@Function(function = "avg",param = "id",alias = "classesName")
	@JoinColumn(column = "id",referColumn = "id",referRealtion = "=",referTable = "teacher",tableRelation = "left join",receiveColumn = "classes",receiveColumnAlias = "classesName")
	private String classes;
}
