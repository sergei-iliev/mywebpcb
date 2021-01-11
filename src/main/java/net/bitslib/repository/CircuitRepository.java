package net.bitslib.repository;

import org.springframework.stereotype.Repository;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;

import net.bitslib.entity.Circuit;
import net.bitslib.entity.CircuitWorkspace;
import net.bitslib.entity.FileObject;

@Repository
public class CircuitRepository {

	public void updateCircuit(Circuit circuit){
		if(circuit.getXml()!=null){
			FileObject xml=ObjectifyService.ofy().load().type(FileObject.class).id(circuit.getXml().getId()).now();	
			xml.setContent(circuit.getContent());			
			ObjectifyService.ofy().save().entity(xml).now();		
			circuit.setXml(xml.getKey());	
		}else{
			FileObject xml=new FileObject(circuit.getContent());
			ObjectifyService.ofy().save().entity(xml).now();		
			circuit.setXml(xml.getKey());				
		}		
		ObjectifyService.ofy().save().entity(circuit).now();		
	}
	
	public Key<Circuit> createCircuit(Circuit circuit){
		FileObject xml=new FileObject(circuit.getContent());		
		ObjectifyService.ofy().save().entity(xml).now();		
		circuit.setXml(xml.getKey());			
		
		return ObjectifyService.ofy().save().entity(circuit).now();	
	}	
	public Circuit getCircuit(Key<CircuitWorkspace> owner, String name) {
		  return ObjectifyService.ofy().load().type(Circuit.class).filter("workspace",owner).filter("lowercasename =",name.toLowerCase()).first().now();	
	}
	
	public FileObject getFileObjectById(Key<FileObject> key){
		return ObjectifyService.ofy().load().type(FileObject.class).id(key.getId()).now();		
	}	
}
