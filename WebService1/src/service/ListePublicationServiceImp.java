package service;
import java.util.List;

import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.servlet.http.HttpServletResponse;

import dao.PublicationDao;
import models.Publication;

@WebService
public class ListePublicationServiceImp implements IlistePub{
	
	private PublicationDao dao = new PublicationDao();
	
	private HttpServletResponse response;
	
	@WebMethod
	
	public Publication[] listePublication() {
		
	    List<Publication> publications = dao.getAllPublications();
	    return publications.toArray(new Publication[publications.size()]);
	}

}
