package service;

import java.util.List;

import javax.jws.WebMethod;
import javax.jws.WebService;

import dao.PublicationDao;
import models.Publication;

@WebService
public class PublicationServiceImp implements IpublicationService{
	
	private PublicationDao dao = new PublicationDao();
	
	@WebMethod
	@Override
	public Publication chercherPublication(int id) {
		// TODO Auto-generated method stub
		return dao.getById(id);
	}
	
	

}
