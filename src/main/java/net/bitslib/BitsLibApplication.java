package net.bitslib;

import javax.servlet.ServletContextListener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import com.googlecode.objectify.ObjectifyFilter;

import net.bitslib.objectify.ObjectifyServletContextListener;
import net.bitslib.objectify.ProductionObjectifyServletContextListener;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class BitsLibApplication {
//	 @Autowired
//	    Environment environment;
	 
	public static void main(String[] args) {
		SpringApplication.run(BitsLibApplication.class, args);


	}
	
//	@Bean
//    CommandLineRunner execute() {
//       
//		return args -> {
//			 for (final String profileName : environment.getActiveProfiles()) {
//		            System.out.println("Currently active profile - " + profileName);
//		        }   
//			 System.out.println("--------------------------------333333333");  
//		    };
//		
//    }
	
	@Bean
	public FilterRegistrationBean objectifyFilterRegistration() {
	    final FilterRegistrationBean registration = new FilterRegistrationBean();
	    registration.setFilter(new ObjectifyFilter());
	    registration.addUrlPatterns("/*");
	    registration.setOrder(1);
	    return registration;
	}
	  
	@Bean
	@Profile("dev")
	public ServletListenerRegistrationBean<ServletContextListener> listenerRegistrationBean() {
		ServletListenerRegistrationBean<ServletContextListener> bean = 
	        new ServletListenerRegistrationBean<>();
	    bean.setListener(new ObjectifyServletContextListener());
	    return bean;
	}
	
	@Bean
	@Profile("prod")
	public ServletListenerRegistrationBean<ServletContextListener> productionListenerRegistrationBean() {
	    ServletListenerRegistrationBean<ServletContextListener> bean = 
	        new ServletListenerRegistrationBean<>();
	    bean.setListener(new ProductionObjectifyServletContextListener());
	    return bean;
	}	
}
