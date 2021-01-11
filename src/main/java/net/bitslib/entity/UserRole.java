package net.bitslib.entity;

import java.io.Serializable;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class UserRole implements Serializable{
	
	public enum UserRoleType{
		USER_ROLE,
		ADMIN_ROLE
	}
	
	
	@Id
	private Long id;
	@Index
	private UserRoleType role;
	@Index
	private Key<User> user;
	
	

}
