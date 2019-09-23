package net.bitslib.controller;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PublicController {
	
	private final Logger logger = Logger.getLogger(PublicController.class.getName());



	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String start(HttpServletResponse response,HttpServletRequest request) throws IOException {
			return "index";
		
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String login(HttpServletResponse response,HttpServletRequest request) throws IOException {
			return "login";
		
	}
/*	
	@RequestMapping(value = "/login/authenticate", method = RequestMethod.POST)
	public String authenticate(@RequestParam(name="email") String email,@RequestParam(name="password") String password ) throws IOException {
		System.out.println(email+"::"+password);	
		return "redirect:/index";
		
	}
*/	
}
