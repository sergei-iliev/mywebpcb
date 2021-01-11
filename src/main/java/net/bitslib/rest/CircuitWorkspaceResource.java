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

import net.bitslib.entity.Circuit;
import net.bitslib.entity.CircuitWorkspace;
import net.bitslib.entity.FileObject;
import net.bitslib.repository.CircuitRepository;
import net.bitslib.repository.CircuitWorkspaceRepository;

@RestController
@RequestMapping("/rest/circuits")
public class CircuitWorkspaceResource extends AbstractResource{
	private static final Logger logger = Logger.getLogger(CircuitWorkspaceResource.class.getName());

	@Autowired
	private CircuitWorkspaceRepository circuitWorkspaceRepository;
	
	@Autowired
	private CircuitRepository circuitRepository;
	
	@RequestMapping(value = "/workspaces", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getWorkspaces(){
		return ResponseEntity.ok(circuitWorkspaceRepository.getWorkspacesToXML(null));
	}
	@RequestMapping(value = "/workspaces/{workspaceName}", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE})
	public ResponseEntity<String> getBoards(@PathVariable("workspaceName") String workspaceName){
		CircuitWorkspace workspace = circuitWorkspaceRepository.getWorkspaceByName(workspaceName);
		if (workspace == null) {
			logger.log(Level.SEVERE, "Unable to find workspace with name: "+ workspaceName);
			return ResponseEntity.badRequest().body("No such workspace");
		}
		return ResponseEntity.ok(circuitWorkspaceRepository.getBoardsToXML(workspace.getKey()));
	}	
	
	@RequestMapping(value = "/workspaces/{workspaceName}/{projectName}", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getBoard(@PathVariable("workspaceName") String workspaceName,@PathVariable("projectName") String projectName){
		CircuitWorkspace workspace = circuitWorkspaceRepository.getWorkspaceByName(workspaceName);
		if(workspace==null){
			logger.log(Level.SEVERE, "Unable to find workspace with name: "+ workspace);
			return ResponseEntity.badRequest().body("No such workspace");
		}

		// read symbol
		Circuit circuit = circuitRepository.getCircuit(workspace.getKey(), projectName);
		FileObject xml=circuitRepository.getFileObjectById(circuit.getXml());
		
		String content=xml.toString();
		
		content = this.addNode(content, "workspaceName", workspaceName);
		content = this.addNode(content, "projectName", projectName);
		return ResponseEntity.ok(content);
	}	
	@RequestMapping(value = "/workspaces/{workspaceName}", method = RequestMethod.POST,produces={MediaType.APPLICATION_XML_VALUE})
	public ResponseEntity<String> saveFootprint(@RequestHeader("User-Agent") String userAgent,@PathVariable("workspaceName") String workspaceName,@RequestParam("projectName") String projectName,@RequestParam("overwrite")Boolean overwrite,@RequestBody String xml){		
		workspaceName = workspaceName.equalsIgnoreCase("null") ? null : workspaceName;   
		if(projectName==null){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Project does not have name.");	
		}
		if (workspaceName == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Workspace does not have name.");
		}
		
		CircuitWorkspace workspace = circuitWorkspaceRepository.getWorkspaceByName(workspaceName);
		if(workspace==null){
			workspace=new CircuitWorkspace();
			workspace.setName(workspaceName);
			circuitWorkspaceRepository.createWorkspace(workspace);
		}
		
		Circuit circuit = circuitRepository.getCircuit(workspace.getKey(), projectName);
		if (circuit != null && overwrite == false) {
			return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("Circuit '" + projectName + "' already exists.");
		}
		
		if (circuit == null) {
			circuit = new Circuit(workspace.getKey());
			circuit.setName(projectName);		
			circuit.setContent(xml);			
			circuitRepository.createCircuit(circuit);
		}else{
			circuit.setName(projectName);		
			circuit.setContent(xml);
			circuitRepository.updateCircuit(circuit);
		}
		return	ResponseEntity.ok("");
	}
	
}
