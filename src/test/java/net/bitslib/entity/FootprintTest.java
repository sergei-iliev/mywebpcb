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
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;

import net.bitslib.objectify.AppEngineMemcacheClientService;
import net.bitslib.repository.FootprintLibraryRepository;
import net.bitslib.repository.FootprintRepository;

@RunWith(SpringRunner.class)
public class FootprintTest{
	private Closeable session;
	
	private final LocalServiceTestHelper helper =
	            new LocalServiceTestHelper(
	                    new LocalMemcacheServiceTestConfig()); //memcache

	 
	@TestConfiguration
    static class RepositoryImplTestContextConfiguration {
  
        @Bean
        public FootprintRepository getFootprintRepository() {
            return new FootprintRepository();
        }
        
        @Bean
        public FootprintLibraryRepository getFootprintLibraryRepository() {
            return new FootprintLibraryRepository();
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
		 ObjectifyService.register(FootprintLibrary.class);
	      session=ObjectifyService.begin();
	}
	@After
	public void release()throws Exception{
		session.close();
		helper.tearDown();
	}
	@Autowired
	private FootprintRepository footprintRepository;
	@Autowired
	private FootprintLibraryRepository footprintLibraryRepository;
	
	@Test
	public void createFootprintLibrary(){
		
	}
	
	@Test
	public void testCreateFootprint(){
		FootprintLibrary library= footprintLibraryRepository.getLibraryByName("Atmel");
		
		final Footprint footprint=new Footprint();
		footprint.setContent("<node>Footprint element</node>");
        footprint.setCategory("Veryzon");
        footprint.setName("Atiny2313");
        footprint.setLibrary(library.getKey());
		
        ObjectifyService.ofy().transact(()->{
           footprintRepository.createFootprint(footprint);
		});
		

		
//		ObjectifyService.ofy().transact(()->{
//			FileObject xml=new FileObject("<w>Mercator</w>");
//			ObjectifyService.ofy().save().entity(xml).now();		
//			footprint.setName("Georgio");
//			footprint.setXml(xml.getKey());
//			ObjectifyService.ofy().save().entity(footprint).now();
//			
//			xml=new FileObject("<w>Board me out</w>");
//			ObjectifyService.ofy().save().entity(xml).now();		
//			
//			board.setName("Georgio capone");
//			board.setXml(xml.getKey());
//			ObjectifyService.ofy().save().entity(board).now();			
//			
//		});		
		
	
		
		
		
	}
	
	@Test
	public void testFootprintList(){ 
        Collection<Footprint> footprints=footprintRepository.getFootprintList();
		footprints.forEach(f->{
						   	
			   System.out.println(f.getName()+"::"+f.getCategory());
			
		});

	}
	
	@Test
	public void testFindFootprintByNameCategory(){

        Footprint footprint2=footprintRepository.getFootprint(null,null,"Core8");
        Assert.assertNotNull(footprint2); 
		Assert.assertTrue(footprint2.getCategory().equals("Veryzon"));
		Assert.assertTrue(footprint2.getName().equals("Core8"));
		
		Footprint footprint3=footprintRepository.getFootprint(null,"Veryzon","Core8");
        Assert.assertNotNull(footprint3); 
		Assert.assertTrue(footprint3.getCategory().equals("Veryzon"));
		Assert.assertTrue(footprint3.getName().equals("Core8"));
		
		FileObject xml=footprintRepository.getFileObjectById(footprint3.getXml());		
		Assert.assertTrue(xml.toString().length()>1); 
	}
	
	@Test
	public void testCreateFootprintLibrary(){
	   FootprintLibrary library=new FootprintLibrary();
	   library.setName("Microchip");
	   
	   SortedSet<String> set=new TreeSet<>();
	   set.addAll(Arrays.asList("Creo bans","USB","Memory"));
	   library.setCategories(set);
	   
	   footprintLibraryRepository.createLibrary(library);
	   
	   
	   Assert.assertTrue(footprintLibraryRepository.getLibraryById(library.getId()).getCategories().size()==3);
	   
	
	}
	
	@Test
	public void testFootprintLibraryList(){
	  for(int i=0;i<1000;i++){
	   FootprintLibrary library=new FootprintLibrary();
	   library.setName("Atmel-"+i);
	   
	   SortedSet<String> set=new TreeSet<>();
	   set.addAll(Arrays.asList("CPU","USB","Memory"));
	   library.setCategories(set);
	   
	   footprintLibraryRepository.createLibrary(library);
	  }
	   System.out.println(footprintLibraryRepository.getLibrariesToXML(null));
	   	
	}
	
	@Test
	public void testCategoryList(){  
	   FootprintLibrary library=footprintLibraryRepository.getLibraryByName("Atmel");
	   Collection<Footprint> f= footprintRepository.getFootprintsByLibrary(library.getKey());
	   f.forEach(s->{
		   System.out.println(s.getName()+"::"+ s.getCategory());
	   });
	   
	   	
	}
	
	@Test
	public void testFootprintListToXML(){
       
	   String xml=footprintLibraryRepository.getFootprintsByCategoryNameToXML("Microchip",null);
       
	   System.out.println(xml);
	   	
	}	
}
