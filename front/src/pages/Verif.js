import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const Verif = () => {

    const [error, setError] = useState('');

    const { id, uniqueString } = useParams();
    console.log(id, uniqueString);
    useEffect(() => {
        // Appel de la fonction de vérification avec userId et uniqueString
        axios.get(`http://localhost:8085/api/users/verif/${id}/${uniqueString}`)
          .then(response => {
            alert("donner supprimer Compte Activer");
          })
          .catch(error => {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('Une erreur s\'est produite');
            }
          });
      }, [id, uniqueString]);


    return (
        <div>

        <h1>Page de vérification du compte</h1>
        <p>ID : {id}</p>
        <p>Unique String : {uniqueString}</p>
        {/* Affichez les résultats de la vérification du compte ou effectuez des redirections en fonction du résultat */}
             {error && <div>Erreur : {error}</div>}
        </div>
    );
};

export default Verif;