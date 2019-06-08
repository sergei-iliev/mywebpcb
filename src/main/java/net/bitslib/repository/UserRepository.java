package net.bitslib.repository;

import org.springframework.stereotype.Repository;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;

import net.bitslib.entity.User;

@Repository
public class UserRepository {

	public Key<User> createUser(User user){
		return ObjectifyService.ofy().save().entity(user).now();	
	}
}
