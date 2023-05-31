import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import "../styles/auth.css";
import axios from 'axios';

const Changepass = () => {


    const [pass, setPass] = useState("");

    const navigate = useNavigate();


    const [errors, setErrors] = useState('');

    const { id, email } = useParams();

    const hundlesub = (event) => {
        event.preventDefault();
        const registrationData = {
          email: email,
          password: pass,
        };
  
        axios
        .post('http://localhost:8085/api/users/update/', registrationData)
        .then(response => {
        // Traitement de la réponse réussie
        console.log(response.data);
        console.log("Trouvé");
           navigate("/home")
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.error) {
              setErrors(error.response.data.error);
          } else {
              setErrors('Une erreur s\'est produite');
          }
      
            });
      };
    return (
        <div>
            <h1>Changer le mot de passe</h1>
            <div>
				<form class="form" method='POST' onSubmit={hundlesub}>
                    {errors && <div>Erreur : {errors}</div>}

					<p class="fieldset">
						<label class="image-replace email" for="signup-email">E-mail</label>
						<input class="full-width has-padding has-border" id="signup-email" type="hiden" placeholder="E-mail" value={email}  />
						<span class="error-message">Enter a valid email address!</span>
					</p>

					<p class="fieldset">
						<label class="image-replace password" for="signup-password">Password</label>
						<input class="full-width has-padding has-border" id="signup-password" type="password"  placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value) }/>
						<a href="#0" class="hide-password">Show</a>
						<span class="error-message">Your password has to be at least 6 characters long!</span>
					</p>

					

					<p class="fieldset">
                         <button className='b' type='submit' value="Login">Modifier password</button>

						{/* <input class="full-width has-padding" type="submit" value="Create account"/> */}
					</p>
				</form>

				{/* <!-- <a href="#0" class="cd-close-form">Close</a> --> */}
			</div>
        </div>
    );
};

export default Changepass;