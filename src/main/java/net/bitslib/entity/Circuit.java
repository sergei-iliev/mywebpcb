package net.bitslib.entity;

import java.io.Serializable;

import com.google.cloud.Timestamp;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Ignore;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Circuit implements Serializable{
	@Id
	private Long id;

	@Index
	private String name;

	@Index
	private String lowercasename;

	@Index
	private Timestamp createDate;

	@Index
	private Key<CircuitWorkspace> workspace;

	@Index
	private Key<User> user;

	private Key<FileObject> xml;

	@Index
	private boolean shared;

	@Ignore
	private String content;
	
	
	public Circuit(Key<CircuitWorkspace> workspace) {
		this();
		this.workspace = workspace;
	}

	public Circuit() {
		this.createDate = Timestamp.now();
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
		if (name != null) {
			this.lowercasename = name.toLowerCase();
		}
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

	public Key<CircuitWorkspace> getWorkspace() {
		return workspace;
	}

	public void setWorkspace(Key<CircuitWorkspace> workspace) {
		this.workspace = workspace;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	public String getContent() {
		return content;
	}	
}
