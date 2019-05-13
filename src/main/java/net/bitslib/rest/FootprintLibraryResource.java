package net.bitslib.rest;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

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
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import net.bitslib.entity.FileObject;
import net.bitslib.entity.Footprint;
import net.bitslib.entity.FootprintLibrary;
import net.bitslib.repository.FootprintLibraryRepository;
import net.bitslib.repository.FootprintRepository;

@RestController
@RequestMapping("/rest/footprints")
public class FootprintLibraryResource {
	private static final Logger logger = Logger.getLogger(FootprintLibraryResource.class.getName());
	
	@Autowired
	private FootprintLibraryRepository footprintLibraryRepository;
	
	@Autowired
	private FootprintRepository footprintRepository;

	
	@RequestMapping(value = "/libraries", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getLibraries(){
		return ResponseEntity.ok(footprintLibraryRepository.getLibrariesToXML(null));
	}
	
	@RequestMapping(value = "/libraries/{libraryName}/categories", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getFootprints(@PathVariable("libraryName") String libraryName){
		FootprintLibrary library = footprintLibraryRepository.getLibraryByName(libraryName);
		if(library==null){
			return ResponseEntity.badRequest().body("No such library name");
		}
		return ResponseEntity.ok(footprintLibraryRepository.getCategoriesByLibraryNameToXML(libraryName));
	}	
	
	@RequestMapping(value = "/libraries/{libraryName}/categories/{categoryName}", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getFootprints(@PathVariable("libraryName") String libraryName,@PathVariable("categoryName") String categoryName){
		FootprintLibrary library = footprintLibraryRepository.getLibraryByName(libraryName);
		if(library==null){
			return ResponseEntity.badRequest().body("No such library");
		}
		return ResponseEntity.ok(footprintLibraryRepository.getFootprintsByCategoryNameToXML(libraryName, categoryName));
	}
	@RequestMapping(value = "/libraries/{libraryName}/categories/{categoryName}/{footprintName}", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getFootprint(@PathVariable("libraryName") String libraryName,@PathVariable("categoryName") String categoryName,@PathVariable("footprintName") String footprintName){
		FootprintLibrary library = footprintLibraryRepository.getLibraryByName(libraryName);
		if(library==null){
			return ResponseEntity.badRequest().body("No such library");
		}

		// read symbol
		Footprint footprint = footprintRepository.getFootprint(library.getKey(),categoryName.equalsIgnoreCase("null") ? null: categoryName, footprintName);
		FileObject xml=footprintRepository.getFileObjectById(footprint.getXml());
		String content=xml.toString();
		
		content = addNode(content, "library", libraryName);
		content = addNode(content,
						"category",categoryName.equalsIgnoreCase("null") ? null: categoryName);
		content = addNode(content, "filename", footprintName);
		
		return ResponseEntity.ok(content);
	}
	@RequestMapping(value = "/libraries/{libraryName}/categories/{categoryName}", method = RequestMethod.POST,produces={MediaType.APPLICATION_XML_VALUE})
	public ResponseEntity<String> saveFootprint(@RequestHeader("User-Agent") String userAgent,@PathVariable("libraryName") String libraryName,@PathVariable("categoryName") String categoryName,@RequestParam("footprintName") String footprintName,@RequestParam("overwrite")Boolean overwrite,@RequestBody String xml){		
		//if(!userAgent.equalsIgnoreCase("mynetpcb")){
		//	return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Anonymous access denied.");
		//}

		// fix category hack
		categoryName = categoryName.equalsIgnoreCase("null") ? null : categoryName;
		libraryName = libraryName.equalsIgnoreCase("null") ? null :libraryName;
		footprintName = footprintName.equalsIgnoreCase("null") ? null : footprintName;

		try {
			if (footprintName == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Footprint does not have name.");
			}
			if (libraryName == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Library does not have name.");			
			}
			// ****RECEIVING STAGE

			FootprintLibrary library = footprintLibraryRepository.getLibraryByName(libraryName);
			if (library == null) {
				library = new FootprintLibrary();
				library.setName(libraryName);
			}
			library.addCategory(categoryName);
			footprintLibraryRepository.createLibrary(library);

			Footprint footprint = footprintRepository.getFootprint(library.getKey(),categoryName, footprintName);
			if (footprint != null && overwrite == false) {
					return	ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Footprint '" + footprintName + "' already exists.");	
			}

			if (footprint == null) {
				footprint = new Footprint();
				footprint.setName(footprintName);
				footprint.setCategory(categoryName);				
				footprint.setLibrary(library.getKey());
				footprint.setShared(true);
				footprint.setUser(null);
				footprint.setContent(xml);
				footprintRepository.createFootprint(footprint);
			}else{				
				footprint.setName(footprintName);
				footprint.setCategory(categoryName);				
				footprint.setLibrary(library.getKey());
				footprint.setShared(true);
				footprint.setUser(null);
				footprint.setContent(xml);
				footprintRepository.updateFootprint(footprint);								
			}									

			return	ResponseEntity.ok("");

		} catch (Exception e) {
			logger.log(Level.SEVERE, "Exception saving representation", e);
			return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
		}
	    
	}
	
	/*
	 * Add xml node to content root node
	 */
	public static String addNode(String content, String nodeName, String nodeValue) {
		StreamResult result = null;
		try {
			DocumentBuilderFactory docFactory = DocumentBuilderFactory
					.newInstance();
			DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
			InputSource is = new InputSource();
			is.setCharacterStream(new StringReader(content));
			Document doc = docBuilder.parse(is);

			Node root = doc.getDocumentElement();

			Node newElement = doc.createElement(nodeName);
			newElement.setTextContent(nodeValue);
			root.appendChild(newElement);

			Transformer transformer = TransformerFactory.newInstance()
					.newTransformer();
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");

			result = new StreamResult(new StringWriter());
			DOMSource source = new DOMSource(doc);
			transformer.transform(source, result);
		} catch (ParserConfigurationException pce) {
			throw new IllegalStateException(pce);
		} catch (SAXException se) {
			throw new IllegalStateException(se);
		} catch (IOException ioe) {
			throw new IllegalStateException(ioe);
		} catch (TransformerConfigurationException tce) {
			throw new IllegalStateException(tce);
		} catch (TransformerException te) {
			throw new IllegalStateException(te);
		}

		return result.getWriter().toString();
	}	
}
