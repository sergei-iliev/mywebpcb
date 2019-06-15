package net.bitslib.entity;

import java.io.Serializable;

import com.google.appengine.api.datastore.Blob;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Unindex;

@Entity
public class FileObject implements Serializable {

	@Id
	private Long id;

	private long size;
	
	@Index
	private String mimeType;
	
	@Unindex
	private Blob blob;

	public FileObject() {
	     mimeType="application/xml";
	}
	
	public FileObject(String xml) {
		this.blob = new Blob(xml.getBytes());
	    this.size=xml.getBytes().length;
	}

	public void setContent(String xml){
		this.blob = new Blob(xml.getBytes());
		this.size=xml.getBytes().length;
	}
	
	public Key<FileObject> getKey() {
		return Key.create(FileObject.class, id);
	}

	public Blob getBlob() {
		return blob;
	}

	public void setBlob(Blob blob) {
		this.blob = blob;	
	}

	public long getSize() {
		return size;
	}	
	
	public void setSize(long size) {
		this.size = size;
	}
	@Override
	public String toString() {
		String content = "";
		if (blob != null)
			content = new String(blob.getBytes());

		return content;
	}
}
