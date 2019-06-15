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

import net.bitslib.entity.Board;
import net.bitslib.entity.BoardWorkspace;
import net.bitslib.entity.FileObject;
import net.bitslib.entity.Footprint;
import net.bitslib.entity.FootprintLibrary;
import net.bitslib.repository.BoardRepository;
import net.bitslib.repository.BoardWorkspaceRepository;

@RestController
@RequestMapping("/rest/boards")
public class BoardWorkspaceResource {
	private static final Logger logger = Logger.getLogger(BoardWorkspaceResource.class.getName());

	@Autowired
	private BoardWorkspaceRepository boardWorkspaceRepository;
	
	@Autowired
	private BoardRepository boardRepository;
	
	@RequestMapping(value = "/workspaces", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getWorkspaces(){
		return ResponseEntity.ok(boardWorkspaceRepository.getWorkspacesToXML(null));
	}
	@RequestMapping(value = "/workspaces/{workspaceName}", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE})
	public ResponseEntity<String> getBoards(@PathVariable("workspaceName") String workspaceName){
		BoardWorkspace workspace = boardWorkspaceRepository.getWorkspaceByName(workspaceName);
		if (workspace == null) {
			logger.log(Level.SEVERE, "Unable to find workspace with name: "+ workspaceName);
			return ResponseEntity.badRequest().body("No such workspace");
		}
		return ResponseEntity.ok(boardWorkspaceRepository.getBoardsToXML(workspace.getKey()));
	}	
	
	@RequestMapping(value = "/workspaces/{workspaceName}/{projectName}", method = RequestMethod.GET,produces={MediaType.APPLICATION_XML_VALUE},headers = "Accept=application/xml")
	public ResponseEntity<String> getBoard(@PathVariable("workspaceName") String workspaceName,@PathVariable("projectName") String projectName){
		BoardWorkspace workspace = boardWorkspaceRepository.getWorkspaceByName(workspaceName);
		if(workspace==null){
			logger.log(Level.SEVERE, "Unable to find workspace with name: "+ workspace);
			return ResponseEntity.badRequest().body("No such workspace");
		}

		// read symbol
		Board board = boardRepository.getBoard(workspace.getKey(), projectName);
		FileObject xml=boardRepository.getFileObjectById(board.getXml());
		
		String content=xml.toString();
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
		
		BoardWorkspace workspace = boardWorkspaceRepository.getWorkspaceByName(workspaceName);
		if(workspace==null){
			workspace=new BoardWorkspace();
			workspace.setName(workspaceName);
			boardWorkspaceRepository.createWorkspace(workspace);
		}
		
		Board board = boardRepository.getBoard(workspace.getKey(), projectName);
		if (board != null && overwrite == false) {
			return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("Board '" + projectName + "' already exists.");
		}
		
		if (board == null) {
			board = new Board(workspace.getKey());
			board.setName(projectName);		
			board.setContent(xml);			
			boardRepository.createBoard(board);
		}else{
			board.setName(projectName);		
			board.setContent(xml);
			boardRepository.updateBoard(board);
		}
		return	ResponseEntity.ok("");
	}
}
