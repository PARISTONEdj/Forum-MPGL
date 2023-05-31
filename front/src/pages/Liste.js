import React, {useEffect, useState} from 'react';
import "../styles/liste.css";
import Navigation from '../components/Navigation';
import axios from 'axios';



const Liste = () => {
    const [error, setError] = useState('');
    const [user, setUser] = useState([]);


    useEffect(() => {
        // Appel de la fonction de vérification avec userId et uniqueString
        axios.get(`http://localhost:8085/users/liste/`)
          .then(response => {
                setUser(response.data.user);
                console.log(user);
          })
          .catch(error => {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('Une erreur s\'est produite');
            }
          });
      }, []);
    return (
        <div>
                     <Navigation/>

            <table id="customers">
        <tr>
            <th>Identifiant</th>
            <th>email</th>
            <th>Nom d utilisateur</th>
            <th>Bio</th>

        </tr>
   
        {user.map(users => (           
  <tr key={users.id}>
    <td>{users.id}</td>
    <td>{users.email}</td>
    <td>{users.username}</td>
    <td>{users.bio}</td>

  </tr>
   ))}
 
  
 
 
  
</table>

<footer>
      <div class = "social-links">
        <a href = "#"><i class = "fab fa-facebook-f"></i></a>
        <a href = "#"><i class = "fab fa-twitter"></i></a>
        <a href = "#"><i class = "fab fa-instagram"></i></a>
        <a href = "#"><i class = "fab fa-pinterest"></i></a>
      </div>
      <span>Art.Design Blog Page</span>
    </footer>
            
        </div>
    );
};

export default Liste;