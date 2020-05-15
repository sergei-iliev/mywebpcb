package net.bitslib.repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.googlecode.objectify.ObjectifyService;

import net.bitslib.entity.Footprint;
import net.bitslib.entity.FootprintLibrary;
import net.bitslib.entity.Symbol;
import net.bitslib.entity.SymbolLibrary;
import net.bitslib.entity.User;

@Repository
public class SymbolLibraryRepository {
    
	@Autowired
	private SymbolRepository symbolRepository;
	
	public void createLibrary(SymbolLibrary library) {
		ObjectifyService.ofy().save().entity(library).now();	
	}
	
	public SymbolLibrary getLibraryById(long id){
		return ObjectifyService.ofy().load().type(SymbolLibrary.class).id(id).now();
	}

	public SymbolLibrary getLibraryByName(String name){
		return ObjectifyService.ofy().load().type(SymbolLibrary.class).filter("lowercasename =",name.toLowerCase()).first().now();
	}
	
	public String getLibrariesToXML(User user) {
		    List<SymbolLibrary> libraries=ObjectifyService.ofy().load().type(SymbolLibrary.class).order("name").list();
		   

			StringBuffer xml = new StringBuffer();
			xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><library>\r\n");
			for (SymbolLibrary library : libraries) {
				xml.append("<name>" + library.getName() + "</name>\r\n");
			}
			xml.append("</library>");
						
			return xml.toString();		
	}
	
	public String getSymbolsByCategoryNameToXML(String libraryName,String categoryName){
		SymbolLibrary library= this.getLibraryByName(libraryName);
		if(library==null){
			throw new IllegalAccessError("Library "+libraryName+" does not exist");
		}
		List<Symbol> footprints=new ArrayList<>();
		if(categoryName!=null){
			footprints.addAll(ObjectifyService.ofy().load().type(Symbol.class).filter("category =",categoryName).filter("library =",library.getKey()).list());
		}
			
		StringBuffer xml = new StringBuffer();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><units>\r\n");
	    for(Symbol file:footprints){
	    	 xml.append("<name fullname=\"" + file.getName() + "\" category=\"" + categoryName +"\"  library=\"" + library.getName() + "\">" + file.getName()+ "</name>\r\n");
	    }		
		xml.append("</units>");
		return xml.toString();		
	}
	
	
	public String getCategoriesByLibraryNameToXML(String name) {
		SymbolLibrary library= ObjectifyService.ofy().load().type(SymbolLibrary.class).filter("name =",name).first().now();
		
		StringBuffer xml = new StringBuffer();
		if (library == null) {
			xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><category>\r\n");
			xml.append("</category>");
			return xml.toString();
		}
		//read free footprints without category
		Collection<Symbol> symbols= symbolRepository.getSymbolsByLibrary(library.getKey());

		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><category>\r\n");
		for (String category : library.getCategories()) {
			xml.append("<name library=\""+library.getName()+"\" category=\""+category+"\">"+category+"</name>\r\n");			
		}
		for(Symbol symbol:symbols){
			xml.append("<name library=\""+library.getName()+"\">"+symbol.getName()+"</name>\r\n");
		}
		xml.append("</category>");

		return xml.toString();
	}
}
