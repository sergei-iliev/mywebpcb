package net.bitslib.entity;

import java.io.Closeable;
import java.util.Arrays;
import java.util.Collection;
import java.util.SortedSet;
import java.util.TreeSet;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.cloud.datastore.DatastoreOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;

import net.bitslib.objectify.AppEngineMemcacheClientService;
import net.bitslib.repository.BoardRepository;
import net.bitslib.repository.BoardWorkspaceRepository;
import net.bitslib.repository.FootprintLibraryRepository;
import net.bitslib.repository.FootprintRepository;
import net.bitslib.repository.UserRepository;

@RunWith(SpringRunner.class)
public class BoardTest{
	private Closeable session;
	
	private final LocalServiceTestHelper helper =
	            new LocalServiceTestHelper(
	                    new LocalMemcacheServiceTestConfig()); //memcache

	 
	@TestConfiguration
    static class RepositoryImplTestContextConfiguration {
  
        @Bean
        public BoardWorkspaceRepository getBoardWorkspaceRepository() {
            return new BoardWorkspaceRepository();
        }
        
        @Bean
        public BoardRepository getBoardRepository() {
            return new BoardRepository();
        }
        
        @Bean
        public UserRepository getUserRepository() {
            return new UserRepository();
        }
    }
	
	@Before
	public void initialize(){
		helper.setUp();
        ObjectifyService.init(new ObjectifyFactory(
                DatastoreOptions.newBuilder().setHost("http://localhost:8884")
                    .setProjectId("bitlib")
                    .build().getService(),
                    new AppEngineMemcacheClientService()
            ));
                
		 ObjectifyService.register(User.class);
		 ObjectifyService.register(FileObject.class);
		 ObjectifyService.register(Footprint.class);		
		 ObjectifyService.register(Board.class);
		 ObjectifyService.register(BoardWorkspace.class);
		 ObjectifyService.register(FootprintLibrary.class);
	      session=ObjectifyService.begin();
	}
	@After
	public void release()throws Exception{
		session.close();
		helper.tearDown();
	}
	@Autowired
	private BoardRepository boardRepository;
	@Autowired
	private BoardWorkspaceRepository boardWorkspaceRepository;
	@Autowired
	private UserRepository userRepository; 
	@Test
	public void createWorkspace(){
	  BoardWorkspace workspace=new BoardWorkspace();
	  workspace.setName("Starter");
	  Key<BoardWorkspace> w= boardWorkspaceRepository.createWorkspace(workspace);
	  Assert.assertTrue(w!=null);
	  
	}
	
	@Test
	public void testGetWorkspaceList(){
//	  User user=new User();
//	  user.setFirstName("Gregor");
//	  user.setEmail("g@g.com");
//	  userRepository.createUser(user);
//	  
//	  
//	  BoardsWorkspace workspace=new BoardsWorkspace();
//	  workspace.setName("Starter");
//	  workspace.setUser(user.getKey());
//	  Key<BoardsWorkspace> w= boardWorkspaceRepository.createWorkspaces(workspace);
//
//	  workspace=new BoardsWorkspace();
//	  workspace.setName("All in one");
//	  workspace.setUser(user.getKey());
//	  w= boardWorkspaceRepository.createWorkspaces(workspace);
//
//	  workspace=new BoardsWorkspace();
//	  workspace.setName("All for one");
//	  workspace.setUser(user.getKey());
//	  w= boardWorkspaceRepository.createWorkspaces(workspace);
//
//	  Assert.assertTrue(w!=null);
		Key<User> u = Key.create(User.class, 1);
	  Collection<BoardWorkspace> ws= boardWorkspaceRepository.getWorkspacesByUser(u);
	  ws.forEach(e->System.out.println(e.getName()+"::"+e.getUser()));	  
	  
	  
	  
	}
	
	
	
}
