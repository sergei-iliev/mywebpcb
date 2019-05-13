package net.bitslib.entity;


import java.io.Serializable;
import java.util.SortedSet;
import java.util.TreeSet;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Cache
@Entity
public class FootprintLibrary implements Serializable{

	@Id
	private Long id;    
	@Index
	private String name;
	@Index
    private String lowercasename;  
    
	private SortedSet<String> categories=new TreeSet<>();

	public Long getId() {
		return id;
	}
	public void addCategory(String category){
	  if(category!=null&&!category.equals("")){
	     categories.add(category); 
	  }
	}		
	public Key<FootprintLibrary> getKey() {
	   return Key.create(FootprintLibrary.class, id);
	}
	
	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
		this.lowercasename=this.name.toLowerCase();
	}

	public String getLowercasename() {
		return lowercasename;
	}

	public void setLowercasename(String lowercasename) {
		this.lowercasename = lowercasename;
	}

	public SortedSet<String> getCategories() {
		return categories;
	}

	public void setCategories(SortedSet<String> categories) {
		this.categories = categories;
	} 
    
	
	
    
    
}
