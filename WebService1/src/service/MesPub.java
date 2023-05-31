package service;

import java.util.List;

import javax.jws.WebParam;

import models.Publication;

public interface MesPub {
	
	//public List<Publication> getPublicationsByAuthor(int author);
	
    public Publication[] getPublicationsByAuthor(int author);

		  

}
