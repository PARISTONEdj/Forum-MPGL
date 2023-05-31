import React, { useState }  from 'react';
import { NavLink } from 'react-router-dom';
import "../styles/auth.css";
import axios from 'axios';


const Register = () => {
    const [email, setEmail] = useState("");

    const [pass, setPass] = useState("");

    const [username, setUsername] = useState("");

    const [bio, setBio] = useState("");

    const [error, setError] = useState('');

    const [message, setMessage] = useState('');



    const hundlesubmit = (event) => {
      event.preventDefault();
      const registrationData = {
        email: email,
        username: username,
        password: pass,
        bio: bio
      };

      axios
      .post('http://localhost:8085/api/users/register/', registrationData)
      .then(response => {
      // Traitement de la réponse réussie
      console.log(response.data);
      console.log("Trouvé");
          //navigate("/home")
      })
      .catch(message => {
        if (message.response && message.response.data && message.response.data.massage) {
            setError(message.response.data.message);
        } else {
            setError('Une erreur s\'est produite');
        }
    
          });
    };
            
    return (
        <div className='content'>
            <div className='auth-form-container'>
                <h1>Creer Un compte</h1>
                {error && <div>Erreur : {error}</div>}
                {message && <div>message : {message}</div>}
                <form action="" method='POST' onSubmit={hundlesubmit} className='register-form'>
                    <label htmlFor="usename">Nom d'utilisateur</label>
                    <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value) } />
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder='votre email' value={email} onChange={(e) => setEmail(e.target.value) } />
                    <label htmlFor="password">Votre mot de passe</label>
                    <input type="password" placeholder='votre mot de passe' value={pass} onChange={(e) => setPass(e.target.value) } />
                    <label htmlFor="bio">Votre bio</label>
                    <input type="text" placeholder='votre bio' value={bio} onChange={(e) => setBio(e.target.value) } />
                    
                    <button type='submit'>Connexion</button>
                </form>
                <NavLink to="/" className="t">
                    <p>J'ai deja un Compte s' authentifier</p> 
                </NavLink>
            </div>
        </div>
    );
};

export default Register;