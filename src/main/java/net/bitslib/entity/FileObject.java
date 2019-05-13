package net.bitslib.entity;

import java.io.Serializable;

import com.google.appengine.api.datastore.Blob;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Unindex;

@Entity
public class FileObject implements Serializable {

	@Id
	private Long id;

	@Unindex
	private Blob blob;

	public FileObject() {
	
	}
	public FileObject(String xml) {
		this.blob = new Blob(xml.getBytes());
	}

	public void setContent(String xml){
		this.blob = new Blob(xml.getBytes());
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

	@Override
	public String toString() {
		String content = "";
		if (blob != null)
			content = new String(blob.getBytes());

		return content;
	}
}
