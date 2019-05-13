package net.bitslib.entity;


import java.io.Serializable;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Board implements Serializable{

	@Id
	private Long id;    
	
	private String name;
    private String lowercasename;  
    
	
  
    //private Key<User> user;
    private Key<FileObject> xml;



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
	}



	public String getLowercasename() {
		return lowercasename;
	}



	public void setLowercasename(String lowercasename) {
		this.lowercasename = lowercasename;
	}



	public Key<FileObject> getXml() {
		return xml;
	}



	public void setXml(Key<FileObject> xml) {
		this.xml = xml;
	}
	
   
    
    
    
    
}
