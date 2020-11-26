package net.bitslib.rest;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.bitslib.entity.FileObject;
import net.bitslib.entity.Symbol;
import net.bitslib.entity.SymbolLibrary;
import net.bitslib.repository.SymbolLibraryRepository;
import net.bitslib.repository.SymbolRepository;

@RestController
@RequestMapping("/rest/symbols")
public class SymbolLibraryResource extends AbstractResource{
	private static final Logger logger = Logger.getLogger(SymbolLibraryResource.class.getName());
	
	@Autowired
	private SymbolLibraryRepository symbolLibraryRepository; 
	
	@Autowired
	private SymbolRepository symbolRepository;

	
	@RequestMapping(value = "/libraries", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getLibraries(){
		return ResponseEntity.ok(symbolLibraryRepository.getLibrariesToXML(null));
	}
	
	@RequestMapping(value = "/libraries/{libraryName}/categories", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getCategories(@PathVariable("libraryName") String libraryName){
		SymbolLibrary library = symbolLibraryRepository.getLibraryByName(libraryName);
		if(library==null){
			return ResponseEntity.badRequest().body("No such library name");
		}
		return ResponseEntity.ok(symbolLibraryRepository.getCategoriesByLibraryNameToXML(libraryName));
	}	
	
	@RequestMapping(value = "/libraries/{libraryName}/categories/{categoryName}", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getSymbols(@PathVariable("libraryName") String libraryName,@PathVariable("categoryName") String categoryName){
		SymbolLibrary library = symbolLibraryRepository.getLibraryByName(libraryName);
		if(library==null){
			return ResponseEntity.badRequest().body("No such library");
		}
		return ResponseEntity.ok(symbolLibraryRepository.getSymbolsByCategoryNameToXML(libraryName, categoryName));
	}
	@RequestMapping(value = "/libraries/{libraryName}/categories/{categoryName}/{symbolName}", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getFootprint(@PathVariable("libraryName") String libraryName,@PathVariable("categoryName") String categoryName,@PathVariable("symbolName") String symbolName){
		SymbolLibrary library = symbolLibraryRepository.getLibraryByName(libraryName);
		if(library==null){
			return ResponseEntity.badRequest().body("No such library");
		}

		// read symbol
		Symbol symbol = symbolRepository.getSymbol(library.getKey(),categoryName.equalsIgnoreCase("null") ? null: categoryName, symbolName);
		FileObject xml=symbolRepository.getFileObjectById(symbol.getXml());
		String content=xml.toString();
		
		content = addNode(content, "library", libraryName);
		content = addNode(content,
						"category",categoryName.equalsIgnoreCase("null") ? null: categoryName);
		content = addNode(content, "filename", symbolName);
		
		return ResponseEntity.ok(content);
	}
	@RequestMapping(value = "/libraries/{libraryName}/categories/{categoryName}", method = RequestMethod.POST,produces={MediaType.APPLICATION_XML_VALUE})
	public ResponseEntity<String> saveSymbol(@RequestHeader("User-Agent") String userAgent,@PathVariable("libraryName") String libraryName,@PathVariable("categoryName") String categoryName,@RequestParam("symbolName") String symbolName,@RequestParam("overwrite")Boolean overwrite,@RequestBody String xml){		
		//if(!userAgent.equalsIgnoreCase("mynetpcb")){
		//	return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Anonymous access denied.");
		//}

		// fix category hack
		categoryName = categoryName.equalsIgnoreCase("null") ? null : categoryName;
		libraryName = libraryName.equalsIgnoreCase("null") ? null :libraryName;
		symbolName = symbolName.equalsIgnoreCase("null") ? null : symbolName;

		try {
			if (symbolName == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Symbol does not have name.");
			}
			if (libraryName == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Library does not have name.");			
			}
			// ****RECEIVING STAGE

			SymbolLibrary library = symbolLibraryRepository.getLibraryByName(libraryName);
			if (library == null) {
				library = new SymbolLibrary();
				library.setName(libraryName);
			}
			library.addCategory(categoryName);
			symbolLibraryRepository.createLibrary(library);

			Symbol symbol = symbolRepository.getSymbol(library.getKey(),categoryName, symbolName);
			if (symbol != null && overwrite == false) {
					return	ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Symbol '" + symbolName + "' already exists.");	
			}

			if (symbol == null) {
				symbol = new Symbol();
				symbol.setName(symbolName);
				symbol.setCategory(categoryName);				
				symbol.setLibrary(library.getKey());
				symbol.setShared(true);
				symbol.setUser(null);
				symbol.setContent(xml);
				symbolRepository.createSymbol(symbol);
			}else{				
				symbol.setName(symbolName);
				symbol.setCategory(categoryName);				
				symbol.setLibrary(library.getKey());
				symbol.setShared(true);
				symbol.setUser(null);
				symbol.setContent(xml);
				symbolRepository.updateSymbol(symbol);								
			}									

			return	ResponseEntity.ok("");

		} catch (Exception e) {
			logger.log(Level.SEVERE, "Exception saving representation", e);
			return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
		}
	    
	}
	
}
