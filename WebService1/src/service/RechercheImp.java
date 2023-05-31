package service;

import java.util.List;

import dao.PublicationDao;
import models.Publication;

public class RechercheImp implements RechercheInterface{
	
	private PublicationDao dao = new PublicationDao();


	@Override
	public Publication[] getPublicationsRecherche(String rech) {
		List<Publication> publications = dao.getPublicationsByTitre(rech);
		return publications.toArray(new Publication[publications.size()]);
	}

}
