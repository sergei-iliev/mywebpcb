package net.bitslib.entity;

import java.io.Serializable;

import com.google.cloud.Timestamp;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Cache
@Entity
public class BoardWorkspace implements Serializable{

	@Id
	private Long id;    
	
	@Index
	private String name;
	
	@Index
    private String lowercasename; 
	
    @Index
    private Key<User> user;
    
    @Index
    private Timestamp createDate;

    public BoardWorkspace() {
    	this.createDate=Timestamp.now();
	}
	public Key<BoardWorkspace> getKey() {
		   return Key.create(BoardWorkspace.class, id);
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
		if(name!=null){
		  this.lowercasename=name.toLowerCase();
		}
	}

	public String getLowercasename() {
		return lowercasename;
	}

	public void setLowercasename(String lowercasename) {
		this.lowercasename = lowercasename;
	}

	public Key<User> getUser() {
		return user;
	}

	public void setUser(Key<User> user) {
		this.user = user;
	}

	public Timestamp getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Timestamp createDate) {
		this.createDate = createDate;
	}
    
    
	
}
