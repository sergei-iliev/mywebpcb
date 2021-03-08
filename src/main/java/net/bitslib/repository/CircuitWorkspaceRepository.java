package net.bitslib.repository;

import java.util.Collection;
import java.util.List;
import java.util.logging.Logger;

import org.springframework.stereotype.Repository;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;

import net.bitslib.entity.Circuit;
import net.bitslib.entity.CircuitWorkspace;
import net.bitslib.entity.User;

@Repository
public class CircuitWorkspaceRepository {
	private static final Logger logger = Logger.getLogger(CircuitWorkspaceRepository.class.getName());
	
	public Key<CircuitWorkspace> createWorkspace(CircuitWorkspace workspace) {
	  return ObjectifyService.ofy().save().entity(workspace).now();	
	}

	public String getWorkspacesToXML(Key<User> user) {
		Collection<CircuitWorkspace> workspaces= getWorkspacesByUser(user);

		StringBuffer xml = new StringBuffer();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><workspace>\r\n");
		for (CircuitWorkspace workspace : workspaces) {
			xml.append("<name>" + workspace.getName() + "</name>\r\n");
		}
		xml.append("</workspace>");
					
		return xml.toString();	
	}
	public String getCircuitsToXML(Key<CircuitWorkspace> workspace){		
		Collection<Circuit> circuits=ObjectifyService.ofy().load().type(Circuit.class).filter("workspace",workspace).list();		
		StringBuffer xml = new StringBuffer();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><circuits>\r\n");

		for (Circuit circuit : circuits) {
			xml.append("<name fullname=\"" + circuit.getName() + "\" project=\""+circuit.getName()+"\">"
					+ circuit.getName() + "</name> \r\n");
		}		
		xml.append("</circuits>");
		return xml.toString();
	}
	
	public CircuitWorkspace getWorkspaceByName(String name) {
		  return ObjectifyService.ofy().load().type(CircuitWorkspace.class).filter("lowercasename =",name.toLowerCase()).first().now();	
	}
	
	public Collection<CircuitWorkspace> getWorkspacesByUser(Key<User> user) {
		List<CircuitWorkspace> workspaces;
		if(user!=null){
	      workspaces=ObjectifyService.ofy().load().type(CircuitWorkspace.class).filter("user",user).order("name").list();
		}else{
		  workspaces=ObjectifyService.ofy().load().type(CircuitWorkspace.class).order("name").list();	
		}
		return workspaces;
	}
}
