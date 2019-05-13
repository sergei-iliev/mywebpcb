package net.bitslib.repository;

import java.util.Collection;

import org.springframework.stereotype.Repository;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cmd.Query;

import net.bitslib.entity.FileObject;
import net.bitslib.entity.Footprint;
import net.bitslib.entity.FootprintLibrary;


@Repository
public class FootprintRepository {

	public void createFootprint(Footprint footprint){
		if(footprint.getContent()!=null){
			FileObject xml=new FileObject(footprint.getContent());
			ObjectifyService.ofy().save().entity(xml).now();		
			footprint.setXml(xml.getKey());	
		}
		
		ObjectifyService.ofy().save().entity(footprint).now();		
	}
	public void updateFootprint(Footprint footprint){
		if(footprint.getXml()!=null){
			FileObject xml=ObjectifyService.ofy().load().type(FileObject.class).id(footprint.getXml().getId()).now();	
			xml.setContent(footprint.getContent());			
			ObjectifyService.ofy().save().entity(xml).now();		
			footprint.setXml(xml.getKey());	
		}else{
			FileObject xml=new FileObject(footprint.getContent());
			ObjectifyService.ofy().save().entity(xml).now();		
			footprint.setXml(xml.getKey());				
		}		
		ObjectifyService.ofy().save().entity(footprint).now();		
	}	
	public Footprint getFootprint(long id){
		return ObjectifyService.ofy().load().type(Footprint.class).id(id).now();	
	}
	
	public Collection<Footprint> getFootprintList(){
		return ObjectifyService.ofy().load().type(Footprint.class).list();
	}
	
	public FileObject getFileObjectById(Key<FileObject> key){
		return ObjectifyService.ofy().load().type(FileObject.class).id(key.getId()).now();		
	}
	
	public Footprint getFootprint(Key<FootprintLibrary> library, String categoryName, String footprintName) {
		    
		Query<Footprint> query=  ObjectifyService.ofy().load().type(Footprint.class).filter("name",footprintName).filter("library",library);
		if(categoryName!=null){
		  query=query.filter("category",categoryName);	
		}
		return query.distinct(true).first().now();	
	}
	public Collection<Footprint> getFootprintsByLibrary(Key<FootprintLibrary> library) {
	    
		Query<Footprint> query=  ObjectifyService.ofy().load().type(Footprint.class).filter("library",library).filter("category",null);	
		return query.list();	
	}	
}
