package service;

import javax.jws.WebService;
import javax.servlet.http.HttpServletResponse;

import dao.PublicationDao;
import models.Publication;

@WebService
public class CreerPublicationServiceImp implements IcreerPublication {
	
private PublicationDao dao = new PublicationDao();
	
	private HttpServletResponse response;
	
	public void creerPublication(Publication publication) {
		dao.creer(publication);
	}

}
