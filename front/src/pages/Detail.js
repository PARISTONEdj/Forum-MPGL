import React, { useContext, useEffect, useState } from 'react';
import "../styles/mespub.css";


import Navigation from '../components/Navigation';

import { UserContext } from "../components/UserProvider";
import { parseString } from 'xml2js';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const Detail = () => {

    const [author, setAuthor] = useState('');
    const [publications, setPublications] = useState([]);
    const [error, setError] = useState('');
    const { userId } = useContext(UserContext);
    const storedUserId = localStorage.getItem('userId');
    const { id } = useParams();
    const [fetchauteur, setFetcauteur] = useState('');



    useEffect(() => {
        handleSubmit();
      }, []);

      useEffect(() => {
  console.log("la data ++++ ", fetchauteur);
}, [fetchauteur]);


      const handleSubmit = async () =>  {
        
        const soapEnvelope = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service">
        <soapenv:Header/>
        <soapenv:Body>
           <ser:chercherPublication>
              <ser:id>${id}</ser:id>
           </ser:chercherPublication>
        </soapenv:Body>
     </soapenv:Envelope>
        `;
    
        axios
          .post('http://localhost:8081/WebService1/services/PublicationServiceImp', soapEnvelope, {
            headers: { 'Content-Type': 'text/xml', 'SOAPAction': '' },
          })
          .then((response) => {
            const xmlData = response.data;
            console.log(xmlData);
          parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'analyse de la réponse XML :', err);
            } else {
                const soapEnvelope = result['soapenv:Envelope'];
                const soapBody = soapEnvelope['soapenv:Body'];
                const chercherPublicationResponse = soapBody[0].chercherPublicationResponse;
               
                const publicationList =  chercherPublicationResponse[0].chercherPublicationReturn;

                setPublications(publicationList);

                publicationList.forEach(publication => {
                    const author = publication.auteur[0];
                    console.log('Auteur de la publication :', author);

                    axios.get(`http://localhost:8085/api/users/one/${author}`)
                    .then(response => {
                        const authorDetails = response.data;
                        console.log("la data",response.data);
                        setFetcauteur(response.data);


                        console.log(authorDetails);
                        console.log("la data ++++ ",fetchauteur);
                      })
                      .catch(error => {
                        console.error(error);
                        if (error.response && error.response.data && error.response.data.error) {
                          setError(error.response.data.error);
                        } else {
                          setError('Une erreur s\'est produite');
                        }
                      });
                    

                  });
                 
            }
            });
            
          })
          .catch((error) => {
            // Gérer les erreurs
            setError('Une erreur s\'est produite lors de la récupération des publications.');
            console.error(error);
          });
      };  
    return (
        <div>
                   <Navigation/>

            <div class="header">
  <h2>FORUM  MPGL 2023</h2>
  {error && <div>Erreur : {error}</div>}
</div>

<div class="row">
  <div class="leftcolumn">

    {publications.map(publication => (
    <div class="card" key={publication.id}>
      <h2>TITRE {publication.titre}</h2>
      <h5> Description, {publication.descriptions}</h5>
      <div class="imga" style={{height:'300px'}}>
        <img src={publication.image} className='im'/>
      </div>
      <p>Contenu :</p>
      <p>{publication.contenu}</p>
      <p>Date de publication : {publication.datespub}</p>
    </div>
    ))}
     </div>
  <div class="rightcolumn">

    <div class="card" >
      <h2>Auteur : </h2>
      <p>{fetchauteur && fetchauteur.username}</p>
      <div class="fakeimg" style={{height:"100px"}}>Image</div>
      <p></p>
    </div>
    <div class="card">
      <h3>Meilleur Post</h3>
      <div class="fakeimg">Image</div><br/>
      <div class="fakeimg">Image</div><br/>
      <div class="fakeimg">Image</div>
    </div>
    <div class="card">
      <h4>Mail : {fetchauteur && fetchauteur.email}</h4>
       <p>Biographie : </p>
      <p>{fetchauteur && fetchauteur.bio}</p>
    </div>
  </div>
</div>

<div class="footer">
  <h2>Footer</h2>
</div>

            
        </div>
    );
};

export default Detail;