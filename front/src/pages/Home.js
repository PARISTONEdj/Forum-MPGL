import React , { useContext, useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import "../styles/home.css";
import { UserContext } from "../components/UserProvider";
import { parseString } from 'xml2js';
import axios from 'axios';

require('timers-browserify');

const Home = () => {
    const { userId } = useContext(UserContext);

    const [publicationList, setPublicationList] = useState([]);

    useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
        try {
          const response = await axios.post(
            'http://localhost:8081/WebService1/services/ListePublicationServiceImp?wsdl',
            `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service">
            <soapenv:Header/>
            <soapenv:Body>
               <ser:listePublication/>
            </soapenv:Body>
            </soapenv:Envelope>`,
            {
              headers: { 
                'Content-Type': 'text/xml',
                'SOAPAction': ''
             },
            }
          );
    
          const xmlData = response.data;
          console.log(xmlData);
          parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'analyse de la réponse XML :', err);
            } else {
                const soapEnvelope = result['soapenv:Envelope'];
                const soapBody = soapEnvelope['soapenv:Body'];
                const listePublicationResponse = soapBody[0].listePublicationResponse;
                const publicationList = listePublicationResponse[0].listePublicationReturn;
                setPublicationList(publicationList);
            }
            });
        } catch (error) {
          console.error('Erreur lors de la récupération des données de l\'API SOAP:', error);
        }
      };

     
    
    return (
        <div>
            <Navigation/>
            <h1>Home : {userId} ok</h1>

           
           {/* ici xa commence  */}

          
    
    <section class = "design" id = "design">
      <div class = "container">
        <div class = "title">
          <h2>Recent Discution & Blog</h2>
          <p>les dernieres publications sur la plateforme</p>
        </div>

        <div class = "design-content">

        
          <div class = "design-item" >
            <div class = "design-img">
              <img src = "images/art-design-1.jpg" alt = ""/>
              <span><i class = "far fa-heart"></i> 22</span>
              <span>Discution & Blog</span>
            </div>
            <div class = "design-title">
              <a href = "#">publier vos avis et travaux pour partager vos connaissances</a>
            </div>
          </div>
           
          
          <div class = "design-item">
            <div class = "design-img">
              <img src = "images/art-design-2.jpg" alt = ""/>
              <span><i class = "far fa-heart"></i> 22</span>
              <span>Art & Design</span>
            </div>
            <div class = "design-title">
              <a href = "#">make an awesome art portfolio for college or university</a>
            </div>
          </div>
          
          <div class = "design-item">
            <div class = "design-img">
              <img src = "images/art-design-3.jpg" alt = ""/>
              <span><i class = "far fa-heart"></i> 22</span>
              <span>Art & Design</span>
            </div>
            <div class = "design-title">
              <a href = "#">make an awesome art portfolio for college or university</a>
            </div>
          </div>
          
         
          
          <div class = "design-item">
            <div class = "design-img">
              <img src = "images/art-design-5.jpg" alt = ""/>
              <span><i class = "far fa-heart"></i> 22</span>
              <span>Art & Design</span>
            </div>
            <div class = "design-title">
              <a href = "#">make an awesome art portfolio for college or university</a>
            </div>
          </div>
          
          <div class = "design-item">
            <div class = "design-img">
              <img src = "images/art-design-6.jpg" alt = ""/>
              <span><i class = "far fa-heart"></i> 22</span>
              <span>Art & Design</span>
            </div>
            <div class = "design-title">
              <a href = "#">make an awesome art portfolio for college or university</a>
            </div>
          </div>
        </div>
      </div>
    </section>


    <section class = "blog" id = "blog">
      <div class = "container">
        <div class = "title">
          <h2>Les dernieres publications</h2>
          <p>les dernieres publications sur forum MPGL</p>
        </div>
        <div class = "blog-content">
            {publicationList.map(publication => (
          <div class = "blog-item" key={publication.id}>
            <div class = "blog-img">
              <img src = {publication.image} alt = ""/>
              <span><i class = "far fa-heart"></i></span>
            </div>
            <div class = "blog-text">
              <span> {publication.datespub}</span>
              <h2>Titre : {publication.titre}</h2>
              <p>Description: {publication.descriptions}</p>
              <a href = {`/detail/${encodeURIComponent(publication.id)}`}>Voire plus</a>
            </div>
          </div>
          ))}
         
         
          
        </div>
      </div>
    </section>

    <section class = "about" id = "about">
      <div class = "container">
        <div class = "about-content">
          <div>
            <img src = "images/about-bg.jpg" alt = ""/>
          </div>
          <div class = "about-text">
            <div class = "title">
              <h2>Catherine Doe</h2>
              <p>art & design is my passion</p>
            </div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id totam voluptatem saepe eius ipsum nam provident sapiente, natus et vel eligendi laboriosam odit eos temporibus impedit veritatis ut, illo deserunt illum voluptate quis beatae quod. Necessitatibus provident dicta consectetur labore!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam corrupti natus, eos quia recusandae voluptatem veniam modi officiis minima provident rem sint porro fuga quos tempora ea suscipit vero velit sed laudantium eaque necessitatibus maxime!</p>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <div class = "social-links">
        <a href = "#"><i class = "fab fa-facebook-f"></i></a>
        <a href = "#"><i class = "fab fa-twitter"></i></a>
        <a href = "#"><i class = "fab fa-instagram"></i></a>
        <a href = "#"><i class = "fab fa-pinterest"></i></a>
      </div>
      <span>Art.Design Blog Page</span>
    </footer>
    

               


                

           {/* ici la fin */}
           
           
         </div>

    );
};

export default Home;