package net.bitslib.repository;

import java.util.Collection;

import org.springframework.stereotype.Repository;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cmd.Query;

import net.bitslib.entity.FileObject;
import net.bitslib.entity.Footprint;
import net.bitslib.entity.FootprintLibrary;
import net.bitslib.entity.Symbol;
import net.bitslib.entity.SymbolLibrary;


@Repository
public class SymbolRepository {

	public void createSymbol(Symbol symbol){
		if(symbol.getContent()!=null){
			FileObject xml=new FileObject(symbol.getContent());
			ObjectifyService.ofy().save().entity(xml).now();		
			symbol.setXml(xml.getKey());	
		}
		
		ObjectifyService.ofy().save().entity(symbol).now();		
	}
	public void updateSymbol(Symbol symbol){
		if(symbol.getXml()!=null){
			FileObject xml=ObjectifyService.ofy().load().type(FileObject.class).id(symbol.getXml().getId()).now();	
			xml.setContent(symbol.getContent());			
			ObjectifyService.ofy().save().entity(xml).now();		
			symbol.setXml(xml.getKey());	
		}else{
			FileObject xml=new FileObject(symbol.getContent());
			ObjectifyService.ofy().save().entity(xml).now();		
			symbol.setXml(xml.getKey());				
		}		
		ObjectifyService.ofy().save().entity(symbol).now();		
	}	
//	public Footprint getFootprint(long id){
//		return ObjectifyService.ofy().load().type(Footprint.class).id(id).now();	
//	}
//	
	public Collection<Symbol> getSymbolList(){
		return ObjectifyService.ofy().load().type(Symbol.class).list();
	}
	
	public FileObject getFileObjectById(Key<FileObject> key){
		return ObjectifyService.ofy().load().type(FileObject.class).id(key.getId()).now();		
	}
	
	public Symbol getSymbol(Key<SymbolLibrary> library, String categoryName, String symbolName) {
		    
		Query<Symbol> query=  ObjectifyService.ofy().load().type(Symbol.class).filter("name",symbolName).filter("library",library);
		if(categoryName!=null){
		  query=query.filter("category",categoryName);	
		}
		return query.distinct(true).first().now();	
	}
	public Collection<Symbol> getSymbolsByLibrary(Key<SymbolLibrary> library) {
	    
		Query<Symbol> query=  ObjectifyService.ofy().load().type(Symbol.class).filter("library",library).filter("category",null);	
		return query.list();	
	}	
}
