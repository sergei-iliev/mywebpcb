package net.bitslib.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;

import net.bitslib.entity.Board;
import net.bitslib.entity.BoardWorkspace;
import net.bitslib.entity.User;

@Repository
public class CircuitWorkspaceRepository {

	public Key<BoardWorkspace> createWorkspace(BoardWorkspace workspace) {
	  return ObjectifyService.ofy().save().entity(workspace).now();	
	}

//	public String getWorkspacesToXML(Key<User> user) {
//		Collection<BoardWorkspace> workspaces= getWorkspacesByUser(user);
//
//		StringBuffer xml = new StringBuffer();
//		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><workspace>\r\n");
//		for (BoardWorkspace workspace : workspaces) {
//			xml.append("<name>" + workspace.getName() + "</name>\r\n");
//		}
//		xml.append("</workspace>");
//					
//		return xml.toString();	
//	}
//	public String getBoardsToXML(Key<BoardWorkspace> workspace){
//
//		Collection<Board> boards=ObjectifyService.ofy().load().type(Board.class).filter("workspace",workspace).order("name").list();
//		
//		StringBuffer xml = new StringBuffer();
//		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><boards>\r\n");
//
//		for (Board board : boards) {
//			xml.append("<name fullname=\"" + board.getName() + "\" project=\""+board.getName()+"\">"
//					+ board.getName() + "</name> \r\n");
//		}
//		xml.append("</boards>");
//		return xml.toString();
//	}
//	
//	public BoardWorkspace getWorkspaceByName(String name) {
//		  return ObjectifyService.ofy().load().type(BoardWorkspace.class).filter("lowercasename =",name.toLowerCase()).first().now();	
//	}
//	
//	public Collection<BoardWorkspace> getWorkspacesByUser(Key<User> user) {
//		List<BoardWorkspace> workspaces;
//		if(user!=null){
//	      workspaces=ObjectifyService.ofy().load().type(BoardWorkspace.class).filter("user",user).order("name").list();
//		}else{
//		  workspaces=ObjectifyService.ofy().load().type(BoardWorkspace.class).order("name").list();	
//		}
//		return workspaces;
//	}
}
