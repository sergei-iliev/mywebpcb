package net.bitslib.entity;


import java.io.Serializable;

import com.google.cloud.Timestamp;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Ignore;
import com.googlecode.objectify.annotation.Index;

@Cache
@Entity
public class Footprint implements Serializable{

	@Id
	private Long id;    
	
	@Index
	private String name;
	@Index
    private String lowercasename;  
    
    @Index
	private String category;
    @Index
    private String lowercasecategory; 
    @Index
    private Key<User> user;
    
    @Index
    private Timestamp createDate;
    
	private Key<FileObject> xml;
    
    
	@Index
    private boolean shared;
    
    @Index
    private Key<FootprintLibrary> library;
    
    @Ignore
    private String content;
	
    public Footprint() {
	    this.createDate=Timestamp.now();
	}
    
    public Key<FileObject> getXml() {
		return xml;
	}
	public void setXml(Key<FileObject> xml) {
		this.xml = xml;
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
		this.lowercasename=name.toLowerCase();
	}
	public String getLowercasename() {
		return lowercasename;
	}
	public void setLowercasename(String lowercasename) {
		this.lowercasename = lowercasename;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;		
		this.lowercasecategory=(this.category==null?null: this.category.toLowerCase());
	}
	public String getLowercasecategory() {
		return lowercasecategory;
	}
	public void setLowercasecategory(String lowercasecategory) {
		this.lowercasecategory = lowercasecategory;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	
	public Key<User> getUser() {
		return user;
	}
	public void setUser(Key<User> user) {
		this.user = user;
	}
	public boolean isShared() {
		return shared;
	}
	
	public void setShared(boolean shared) {
		this.shared = shared;
	}
	public Key<FootprintLibrary> getLibrary() {
		return library;
	}
	public void setLibrary(Key<FootprintLibrary> library) {
		this.library = library;
	}
	
    public Timestamp getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Timestamp createDate) {
		this.createDate = createDate;
	}
    
    
    
    
    
}
