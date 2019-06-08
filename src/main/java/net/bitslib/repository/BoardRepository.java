package net.bitslib.repository;

import org.springframework.stereotype.Repository;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;

import net.bitslib.entity.Board;
import net.bitslib.entity.BoardWorkspace;
import net.bitslib.entity.FileObject;

@Repository
public class BoardRepository {

	public void updateBoard(Board board){
		if(board.getXml()!=null){
			FileObject xml=ObjectifyService.ofy().load().type(FileObject.class).id(board.getXml().getId()).now();	
			xml.setContent(board.getContent());			
			ObjectifyService.ofy().save().entity(xml).now();		
			board.setXml(xml.getKey());	
		}else{
			FileObject xml=new FileObject(board.getContent());
			ObjectifyService.ofy().save().entity(xml).now();		
			board.setXml(xml.getKey());				
		}		
		ObjectifyService.ofy().save().entity(board).now();		
	}
	
	public Key<Board> createBoard(Board board){
		FileObject xml=new FileObject(board.getContent());		
		ObjectifyService.ofy().save().entity(xml).now();		
		board.setXml(xml.getKey());			
		
		return ObjectifyService.ofy().save().entity(board).now();	
	}	
	public Board getBoard(Key<BoardWorkspace> owner, String name) {
		  return ObjectifyService.ofy().load().type(Board.class).filter("workspace",owner).filter("lowercasename =",name.toLowerCase()).first().now();	
	}
	
	public FileObject getFileObjectById(Key<FileObject> key){
		return ObjectifyService.ofy().load().type(FileObject.class).id(key.getId()).now();		
	}	
}
