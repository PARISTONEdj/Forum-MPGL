package service;

import java.util.List;

import dao.PublicationDao;
import models.Publication;

public class MesPubImp implements MesPub{
	
	private PublicationDao dao = new PublicationDao();

	@Override
	public Publication[] getPublicationsByAuthor(int author) {
		
	    List<Publication> publications = dao.getPublicationsByAuthor(author);
		return publications.toArray(new Publication[publications.size()]);
	}
	
	
}
