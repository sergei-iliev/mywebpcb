package net.bitslib.objectify;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.google.cloud.datastore.DatastoreOptions;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;

import net.bitslib.entity.FileObject;
import net.bitslib.entity.Footprint;
import net.bitslib.entity.FootprintLibrary;
import net.bitslib.entity.User;


public class ProductionObjectifyServletContextListener implements ServletContextListener{

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		//cloud_datastore_emulator.cmd start --host=localhost --port=8884 --store_on_disk=True --consistency=0.9 "C:\Users\Sergey Iliev\AppData\Roaming\gcloud\emulators\datastore"
		//gcloud beta emulators datastore start --host-port=localhost:<yourpreferredport>		

        
/*PRODUCTION*/		
//		 ObjectifyService.init(new ObjectifyFactory(
//		            DatastoreOptions.getDefaultInstance().getService(),
//		            new AppEngineMemcacheClientService()
//		        ));

       	 ObjectifyService.init();

		 ObjectifyService.register(User.class);
		 ObjectifyService.register(FileObject.class);
		 ObjectifyService.register(Footprint.class);
		 ObjectifyService.register(FootprintLibrary.class);

	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		
	}

}
