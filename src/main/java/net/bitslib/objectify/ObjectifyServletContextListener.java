package net.bitslib.objectify;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.google.cloud.datastore.DatastoreOptions;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;

import net.bitslib.entity.Board;
import net.bitslib.entity.BoardWorkspace;
import net.bitslib.entity.Circuit;
import net.bitslib.entity.CircuitWorkspace;
import net.bitslib.entity.FileObject;
import net.bitslib.entity.Footprint;
import net.bitslib.entity.FootprintLibrary;
import net.bitslib.entity.Symbol;
import net.bitslib.entity.SymbolLibrary;
import net.bitslib.entity.User;
import net.bitslib.entity.UserRole;


public class ObjectifyServletContextListener implements ServletContextListener{

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		//cloud_datastore_emulator.cmd start --host=localhost --port=8884 --store_on_disk=True --consistency=0.9 "C:\Users\Sergey Iliev\AppData\Roaming\gcloud\emulators\datastore"
		//gcloud beta emulators datastore start --host-port=localhost:<yourpreferredport>		
/*DEBUG*/		
        ObjectifyService.init(new ObjectifyFactory(
                DatastoreOptions.newBuilder().setHost("http://localhost:8884")
                    .setProjectId("bitslib")
                    .build().getService(),
                new AppEngineMemcacheClientService()
            ));
        
        
         ObjectifyService.register(Symbol.class);
         ObjectifyService.register(SymbolLibrary.class);
		 ObjectifyService.register(User.class);
		 ObjectifyService.register(FileObject.class);
		 ObjectifyService.register(Footprint.class);
		 ObjectifyService.register(FootprintLibrary.class);
		 ObjectifyService.register(BoardWorkspace.class);
		 ObjectifyService.register(Board.class);
		 ObjectifyService.register(CircuitWorkspace.class);
		 ObjectifyService.register(Circuit.class);
		 ObjectifyService.register(UserRole.class);

	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		
	}

}
