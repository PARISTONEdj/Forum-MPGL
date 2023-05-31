import React, { useContext, useEffect, useState } from 'react';
import "../styles/mespub.css";
import Navigation from '../components/Navigation';

import { UserContext } from "../components/UserProvider";
import {  useNavigate } from 'react-router-dom';

import { parseString } from 'xml2js';
import axios from 'axios';

const Mespublications = () => {

    const [author, setAuthor] = useState('');
    const [publications, setPublications] = useState([]);
    const [error, setError] = useState('');
    const { userId } = useContext(UserContext);
    const storedUserId = localStorage.getItem('userId');
    
    const navigate = useNavigate();


    useEffect(() => {
        handleSubmit();
      }, []);


      const handleSubmit = async () =>  {
    
        // Construction de l'enveloppe SOAP
        const soapEnvelope = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service">
            <soapenv:Header/>
            <soapenv:Body>
              <ser:getPublicationsByAuthor>
                <ser:author>${storedUserId}</ser:author>
              </ser:getPublicationsByAuthor>
            </soapenv:Body>
          </soapenv:Envelope>
        `;
    
        axios
          .post('http://localhost:8081/WebService1/services/MesPubImp?wsdl', soapEnvelope, {
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
                const getPublicationsByAuthorResponse = soapBody[0].getPublicationsByAuthorResponse;
                //const parameters = getPublicationsByAuthorResponse[0].parameters;
                //console.log(parameters);
                const publicationList =  getPublicationsByAuthorResponse[0].getPublicationsByAuthorReturn;
                setPublications(publicationList);
                 
            }
            });
            
          })
          .catch((error) => {
            // Gérer les erreurs
            setError('Une erreur s\'est produite lors de la récupération des publications.');
            console.error(error);
          });
      };  

      const handleClick = (id) => {
        navigate(`/detail/${encodeURIComponent(id)}`);

      };
  
    return (
        <div className='mes'>
                   <Navigation/>

            <div class="header">
  <h2>FORUM  MPGL 2023</h2>
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
      <p>Date de publication : {publication.datespub}</p>
      <button onClick={() => handleClick(publication.id)}>Voire plus</button>
    </div>
    ))}
     </div>
  <div class="rightcolumn">
    <div class="card">
      <h2>About Me</h2>
      <div class="fakeimg" style={{height:"100px"}}>Image</div>
      <p>Some text about me in culpa qui officia deserunt mollit anim..</p>
    </div>
    <div class="card">
      <h3>Popular Post</h3>
      <div class="fakeimg">Image</div><br/>
      <div class="fakeimg">Image</div><br/>
      <div class="fakeimg">Image</div>
    </div>
    <div class="card">
      <h3>Follow Me</h3>
      <p>Some text..</p>
    </div>
  </div>
</div>

<div class="footer">
  <h2>Footer</h2>
</div>

            
        </div>
    );
};

export default Mespublications;