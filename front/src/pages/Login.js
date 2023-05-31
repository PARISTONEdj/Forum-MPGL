import React, { useEffect, useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "../styles/auth.css";
import axios from 'axios';
import $ from 'jquery';
import jQuery from "jquery";
import { UserContext } from "../components/UserProvider";


const Login = () => {

    const { setUserId } = useContext(UserContext);
    const [email, setEmail] = useState("");

    const [pass, setPass] = useState("");

    const navigate = useNavigate();

    const [error, setError] = useState('');

    const [errors, setErrors] = useState('');


    const [username, setUsername] = useState("");

    const [bio, setBio] = useState("");

    // const [userId, setUserId] = useState('');

    useEffect(() => {
        jQuery(document).ready(function($){
            var $form_modal = $('.user-modal'),
              $form_login = $form_modal.find('#login'),
              $form_signup = $form_modal.find('#signup'),
              $form_forgot_password = $form_modal.find('#reset-password'),
              $form_modal_tab = $('.switcher'),
              $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
              $tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
              $forgot_password_link = $form_login.find('.form-bottom-message a'),
              $back_to_login_link = $form_forgot_password.find('.form-bottom-message a'),
              $main_nav = $('.main-nav');
          
            //open modal
            $main_nav.on('click', function(event){
          
              if( $(event.target).is($main_nav) ) {
                // on mobile open the submenu
                $(this).children('ul').toggleClass('is-visible');
              } else {
                // on mobile close submenu
                $main_nav.children('ul').removeClass('is-visible');
                //show modal layer
                $form_modal.addClass('is-visible'); 
                //show the selected form
                ( $(event.target).is('.signup') ) ? signup_selected() : login_selected();
              }
          
            });
          
            //close modal
            $('.user-modal').on('click', function(event){
              if( $(event.target).is($form_modal) || $(event.target).is('.close-form') ) {
                $form_modal.removeClass('is-visible');
              } 
            });
            //close modal when clicking the esc keyboard button
            $(document).keyup(function(event){
                if(event.which=='27'){
                  $form_modal.removeClass('is-visible');
                }
              });
          
            //switch from a tab to another
            $form_modal_tab.on('click', function(event) {
              event.preventDefault();
              ( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();
            });
          
            //hide or show password
            $('.hide-password').on('click', function(){
              var $this= $(this),
                $password_field = $this.prev('input');
              
              ( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
              ( 'Show' == $this.text() ) ? $this.text('Hide') : $this.text('Show');
              //focus and move cursor to the end of input field
              $password_field.putCursorAtEnd();
            });
          
            //show forgot-password form 
            $forgot_password_link.on('click', function(event){
              event.preventDefault();
              forgot_password_selected();
            });
          
            //back to login from the forgot-password form
            $back_to_login_link.on('click', function(event){
              event.preventDefault();
              login_selected();
            });
          
            function login_selected(){
              $form_login.addClass('is-selected');
              $form_signup.removeClass('is-selected');
              $form_forgot_password.removeClass('is-selected');
              $tab_login.addClass('selected');
              $tab_signup.removeClass('selected');
            }
          
            function signup_selected(){
              $form_login.removeClass('is-selected');
              $form_signup.addClass('is-selected');
              $form_forgot_password.removeClass('is-selected');
              $tab_login.removeClass('selected');
              $tab_signup.addClass('selected');
            }
          
            function forgot_password_selected(){
              $form_login.removeClass('is-selected');
              $form_signup.removeClass('is-selected');
              $form_forgot_password.addClass('is-selected');
            }
          
            $form_login.find('input[type="submit"]').on('click', function(event){
              event.preventDefault();
              $form_login.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
            });
            $form_signup.find('input[type="submit"]').on('click', function(event){
              event.preventDefault();
              $form_signup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
            });
          
          
          });
          
          
          jQuery.fn.putCursorAtEnd = function() {
            return this.each(function() {
                if (this.setSelectionRange) {
                    var len = $(this).val().length * 2;
                    this.setSelectionRange(len, len);
                } else {
                    $(this).val($(this).val());
                }
            });
          };
      }, []);


    const hundlesubmit = (event)=>{
       
    event.preventDefault();


    const log = {
        email: email,
        password: pass,
      };
      
            axios
            .post('http://localhost:8085/api/users/login/', log)
            .then(response => {
            // Traitement de la réponse réussie
            console.log(response.data);
            const userId = response.data.userId;
            alert(userId );
            setUserId(userId);
            localStorage.setItem('userId', userId);
            console.log("Trouvé");
                navigate("/home");

            })
            .catch(error => {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('Une erreur s\'est produite');
            }
        });
    }


    const hundlesub = (event) => {
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
            navigate("/user/mail")
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.error) {
              setErrors(error.response.data.error);
          } else {
              setErrors('Une erreur s\'est produite');
          }
      
            });
      };

      const hundpass = (event) => {
        event.preventDefault();
        const regis = {
          email: email,
        };
  
        axios
        .post('http://localhost:8085/api/users/reset/', regis)
        .then(response => {
        // Traitement de la réponse réussie
        console.log(response.data);
        console.log("Trouvé");
            //navigate("/user/mail")
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
            <nav class="main-nav">
            <h1>Bienvennu sur le forum MPGL</h1>
                <ul>
                    <li><a class="signin" href="#0">Sign in</a></li>
                    <li><a class="signup" href="#0">Sign up</a></li>
                </ul>
            </nav>

<div class="user-modal">
		<div class="user-modal-container">
			<ul class="switcher">
				<li><a href="#0">Sign in</a></li>
				<li><a href="#0">New account</a></li>
			</ul>

			<div id="login">
				<form class="form" onSubmit={hundlesubmit} method='POST'>
                    {error && <div>Erreur : {error}</div>}
					<p class="fieldset">
						<label class="image-replace email" for="signin-email">E-mail</label>
						<input class="full-width has-padding has-border" id="signin-email" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value) }/>
						<span class="error-message">An account with this email address does not exist!</span>
					</p>

					<p class="fieldset">
						<label class="image-replace password" for="signin-password">Password</label>
						<input class="full-width has-padding has-border" id="signin-password" type="password"  placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value) }/>
						<a href="#0" class="hide-password">Show</a>
						<span class="error-message">Wrong password! Try again.</span>
					</p>

					<p class="fieldset">
						<input type="checkbox" id="remember-me" checked/>
						<label for="remember-me">Remember me</label>
					</p>

					<p class="fieldset">
                        <button className='b' type='submit' value="Login">Connexion</button>
						{/* <input class="full-width" type="submit" value="Login"/> */}
					</p>
				</form>
				
				<p class="form-bottom-message"><a href="#0">Forgot your password?</a></p>
				{/* <!-- <a href="#0" class="close-form">Close</a> --> */}
			</div>

			<div id="signup">
				<form class="form" method='POST' onSubmit={hundlesub}>
                    {errors && <div>Erreur : {errors}</div>}
					<p class="fieldset">
						<label class="image-replace username" for="signup-username">Username</label>
						<input class="full-width has-padding has-border" id="signup-username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value) }/>
						<span class="error-message">Your username can only contain numeric and alphabetic symbols!</span>
					</p>

					<p class="fieldset">
						<label class="image-replace email" for="signup-email">E-mail</label>
						<input class="full-width has-padding has-border" id="signup-email" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value) } />
						<span class="error-message">Enter a valid email address!</span>
					</p>

					<p class="fieldset">
						<label class="image-replace password" for="signup-password">Password</label>
						<input class="full-width has-padding has-border" id="signup-password" type="password"  placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value) }/>
						<a href="#0" class="hide-password">Show</a>
						<span class="error-message">Your password has to be at least 6 characters long!</span>
					</p>

					<p class="fieldset">
                        <label class="image-replace password" for="signup-password">Votre Bio</label>
						<input class="full-width has-padding has-border" id="signup-password" type="text"  placeholder="Votre Bio" value={bio} onChange={(e) => setBio(e.target.value) }/>
						{/* <input type="checkbox" id="accept-terms"/>
						<label for="accept-terms">I agree to the <a class="accept-terms" href="#0">Terms</a></label> */}
					</p>

					<p class="fieldset">
                         <button className='b' type='submit' value="Login">Creer Compte</button>

						{/* <input class="full-width has-padding" type="submit" value="Create account"/> */}
					</p>
				</form>

				{/* <!-- <a href="#0" class="cd-close-form">Close</a> --> */}
			</div>

			<div id="reset-password">
				<p class="form-message">Lost your password? Please enter your email address.<br/> You will receive a link to create a new password.</p>

				<form class="form" onSubmit={hundpass} method='POST'>
                    {errors && <div>Erreur : {errors}</div>}
					<p class="fieldset">
						<label class="image-replace email" for="reset-email">E-mail</label>
						<input class="full-width has-padding has-border" id="reset-email" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value) }/>
						<span class="error-message">An account with this email does not exist!</span>
					</p>

					<p class="fieldset">
						{/* <input class="full-width has-padding" type="submit" value="Reset password"/> */}
                        <button className='b' type='submit' value="Login">Reset le mot de passe</button>

					</p>
				</form>

				<p class="form-bottom-message"><a href="#0">Back to log-in</a></p>
			</div>
			<a href="#0" class="close-form">Close</a>
		</div>
	</div>
        </div>
    );
};

export default Login;