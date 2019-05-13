package net.bitslib.repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.googlecode.objectify.ObjectifyService;

import net.bitslib.entity.Footprint;
import net.bitslib.entity.FootprintLibrary;
import net.bitslib.entity.User;

@Repository
public class FootprintLibraryRepository {
    
	@Autowired
	private FootprintRepository footprintRepository;
	
	public void createLibrary(FootprintLibrary library) {
		ObjectifyService.ofy().save().entity(library).now();	
	}
	
	public FootprintLibrary getLibraryById(long id){
		return ObjectifyService.ofy().load().type(FootprintLibrary.class).id(id).now();
	}

	public FootprintLibrary getLibraryByName(String name){
		return ObjectifyService.ofy().load().type(FootprintLibrary.class).filter("lowercasename =",name.toLowerCase()).first().now();
	}
	
	public String getLibrariesToXML(User user) {
		    List<FootprintLibrary> libraries=ObjectifyService.ofy().load().type(FootprintLibrary.class).order("name").list();
		   

			StringBuffer xml = new StringBuffer();
			xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><library>\r\n");
			for (FootprintLibrary library : libraries) {
				xml.append("<name>" + library.getName() + "</name>\r\n");
			}
			xml.append("</library>");
						
			return xml.toString();		
	}
	
	public String getFootprintsByCategoryNameToXML(String libraryName,String categoryName){
		FootprintLibrary library= this.getLibraryByName(libraryName);
		if(library==null){
			throw new IllegalAccessError("Library "+libraryName+" does not exist");
		}
		List<Footprint> footprints=new ArrayList<>();
		if(categoryName!=null){
			footprints.addAll(ObjectifyService.ofy().load().type(Footprint.class).filter("category =",categoryName).filter("library =",library.getKey()).list());
		}
			
		StringBuffer xml = new StringBuffer();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><units>\r\n");
	    for(Footprint file:footprints){
	    	 xml.append("<name fullname=\"" + file.getName() + "\" category=\"" + categoryName +"\"  library=\"" + library.getName() + "\">" + file.getName()+ "</name>\r\n");
	    }		
		xml.append("</units>");
		return xml.toString();

		
	}
	
	public String getCategoriesByLibraryNameToXML(String name) {
		FootprintLibrary library= ObjectifyService.ofy().load().type(FootprintLibrary.class).filter("name =",name).first().now();
		
		StringBuffer xml = new StringBuffer();
		if (library == null) {
			xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><category>\r\n");
			xml.append("</category>");
			return xml.toString();
		}
		//read free footprints without category
		Collection<Footprint> footprints= footprintRepository.getFootprintsByLibrary(library.getKey());

		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><category>\r\n");
		for (String category : library.getCategories()) {
			xml.append("<name library=\""+library.getName()+"\" category=\""+category+"\">"+category+"</name>\r\n");			
		}
		for(Footprint footprint:footprints){
			xml.append("<name library=\""+library.getName()+"\">"+footprint.getName()+"</name>\r\n");
		}
		xml.append("</category>");

		return xml.toString();
	}
}
