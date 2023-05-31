package dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;

import models.Publication;

public class PublicationDao {
	
	private EntityManager entityManager;

	public EntityManager getEntityManager() {
		if(entityManager == null) {
			EntityManagerFactory emf = Persistence.createEntityManagerFactory("WebService1");
			entityManager=emf.createEntityManager();
		}
		return entityManager;
	}

	
	
	public Publication getById(int id) {
		return getEntityManager().find(Publication.class, id);
	}
	
	 public List<Publication> getAllPublications() {
	        String jpql = "SELECT p FROM Publication p";
	        TypedQuery<Publication> query =  getEntityManager().createQuery(jpql, Publication.class);
	        return query.getResultList();
	    }
	 
	 public void creer(Publication publication) {
		 EntityTransaction transaction = null;
		 try {
		        transaction = getEntityManager().getTransaction();
		        transaction.begin();
		        publication.setDatespub(new Date());

		        entityManager.persist(publication); 
		        transaction.commit();
		    } catch (Exception e) {
		        if (transaction != null) {
		            transaction.rollback();
		        }
		        e.printStackTrace();
		    } finally {
		        entityManager.close();
		    }
	 }
	 
	 public List<Publication> getPublicationsByAuthor(int author) {
		    
		    TypedQuery<Publication> query = getEntityManager().createQuery("SELECT p FROM Publication p WHERE p.auteur = :author", Publication.class);
		    query.setParameter("author", author);
		    
		    List<Publication> publications = query.getResultList();
		    
		    return publications;
		}
	 
	 public List<Publication> getPublicationsByTitre(String rech) {
		 
		    TypedQuery<Publication> query = getEntityManager().createQuery("SELECT p FROM Publication p WHERE p.titre like '%:rech%' or p.descriptions like '%:rech+%'" , Publication.class);
		    query.setParameter("rech", rech);

		    List<Publication> publications = query.getResultList();
		    
		    return publications;
		}
	
		
}
