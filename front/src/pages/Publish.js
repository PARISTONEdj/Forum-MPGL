import React, { useContext, useEffect, useState }  from 'react';
import "../styles/publish.css";
import Navigation from '../components/Navigation';
import { UserContext } from "../components/UserProvider";
import { parseString } from 'xml2js';
import axios from 'axios';



const Publish = () => {

  const { userId } = useContext(UserContext);


  const [auteur, setAuteur] = useState('');
  const [categorie, setCategorie] = useState('');
  const [contenu, setContenu] = useState('');
  const [descriptions, setDescriptions] = useState('');
  const [image, setImage] = useState('');
  const [titre, setTitre] = useState('');
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const storedUserId = localStorage.getItem('userId');



  const handleImageChange = event => {
    const file = event.target.files[0];
    setImage(file);
  };
 
  const handleSubmit = event => {
    event.preventDefault();

    if (!image) {
      console.error('Aucun fichier sélectionné');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      axios
      .post('http://localhost:8085/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(response => {
          console.log('Réponse du serveur:', response.data);
          setImageUrl(response.data.imageUrl);


          if(contenu ==="" || contenu ==="" || descriptions ==="" || titre ==="" ){
            setError('Renseigner tous les champs');
      
          }
          else{
              if (image) {
              const soapEnvelope = `
              <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service" xmlns:mod="http://models">
                <soapenv:Header/>
                <soapenv:Body>
                  <ser:creerPublication>
                    <ser:publication>
                      <mod:auteur>${storedUserId}</mod:auteur>
                      <mod:categorie>${categorie}</mod:categorie>
                      <mod:contenu>${contenu}</mod:contenu>
                      <mod:descriptions>${descriptions}</mod:descriptions>
                      <mod:image>${'http://localhost:8085/ru/'+response.data.imageUrl}</mod:image>
                      <mod:titre>${titre}</mod:titre>
                    </ser:publication>
                  </ser:creerPublication>
                </soapenv:Body>
              </soapenv:Envelope>
            `;
        
            axios.post('http://localhost:8081/WebService1/services/CreerPublicationServiceImp?wsdl', soapEnvelope, {
              headers: { 'Content-Type': 'text/xml', 'SOAPAction': '' },
            })
            .then(response => {
              // Traiter la réponse ici
              console.log('Résultat de la requête SOAP :', response.data);
              setError('publier '+ response.data);
            })
            .catch(error => {
              console.error('Erreur lors de l\'appel du service SOAP :', error);
              setError('Erreur lors de l\'appel du service SOAP : '+ error);
        
            });
      
           } else {
            setError('Aucun fichier sélectionné.');
          }
            
           
          }

        })

    } catch (error) {
      alert("non effectuer");
      console.error('Erreur lors de l\'envoi de l\'image:', error);
    }
    
   

  };
    return (
        <div>
            <Navigation/>
            <div class="container">
  <form action="" method='POST' onSubmit={handleSubmit}>
  {error && <div>Erreur : {error}</div>}
    <div class="row">
      <div class="col-25">
        <label for="fname">Titre de la publication</label>
      </div>
      <div class="col-75">
        <input type="text" id="fname" name="firstname" placeholder="Titre de la publication.."  value={titre} onChange={e => setTitre(e.target.value)}/>
      </div>
    </div>
    <div class="row">
      <div class="col-25">
        <label for="lname">Description</label>
      </div>
      <div class="col-75">
        <input type="text" id="lname" name="lastname" placeholder="Description.." value={descriptions} onChange={e => setDescriptions(e.target.value)}/>
      </div>
    </div>
    <div class="row">
      <div class="col-25">
        <label for="country">Categorie</label>
      </div>
      <div class="col-75">
        <select id="country" value={categorie} onChange={(e) => setCategorie(e.target.value)} >
        <option value="">Selectionner une categorie</option>
          <option value="Sport">Sport</option>
          <option value="Science">Science</option>
          <option value="Politique">Politique</option>
          <option value="Economie">Economie</option>
          <option value="Culture">Culture</option>
          <option value="Divertissement">Divertissement</option>

        </select>
      </div>
    </div>
    <div class="row">
      <div class="col-25">
        <label for="subject">Contenu</label>
      </div>
      <div class="col-75">
        <textarea id="subject" name="subject" placeholder="Contenu.." style={{height:"200px"}} value={contenu} onChange={e => setContenu(e.target.value)}></textarea>
      </div>
    </div>
    <div class="row">
      <div class="col-25">
        <label for="lname">Image</label>
      </div>
      <div class="col-75">
        {/* <input type="file" id="lname" name="lastname" placeholder="image.." onChange={e => setImage(e.target.files[0])}/> */}
        <input type="file" id="lname" name="lastname" placeholder="image.." onChange={handleImageChange} />
      </div>
    </div>
    <div class="row">
      <button type="submit" value="Submit">Ajouter</button>
    </div>
  </form>
</div>
            
        </div>
    );
};

export default Publish;