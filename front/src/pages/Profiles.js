import React, { useContext, useEffect, useState } from 'react';
import "../styles/profile.css";
import Navigation from '../components/Navigation';
import axios from 'axios';

const Profiles = () => {

    const [fetchauteur, setFetcauteur] = useState('');
    const [error, setError] = useState('');
    const storedUserId = localStorage.getItem('userId');
    const [imageUrl, setImageUrl] = useState('');
    const [image, setImage] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [password, setPassword] = useState('');
    const [newpass, setNewpass] = useState('');
    const [confirmpass, setConfirmpass] = useState('');


    const handleImageChange = event => {
        const file = event.target.files[0];
        setImage(file);
      };

    useEffect(() => {

        axios.get(`http://localhost:8085/api/users/one/${storedUserId}`)
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

      }, []);

      const changephoto = event=>{

        event.preventDefault();

        if (!image) {
            setError('Aucun fichier sélectionné');
        }

        const formData = new FormData();
        formData.append('image', image);
        alert(formData);

        try {
            axios
            .post('http://localhost:8085/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                console.log('Réponse du serveur:', response.data);
                setImageUrl(response.data.imageUrl);
                alert(response.data.imageUrl);
                if(response.data.imageUrl){
                        setError("aucune url d image");
                        setError(imageUrl);
                        const Data = {
                        id : storedUserId,
                        username : username,
                        bio : bio,
                        profile : 'http://localhost:8085/ru/'+response.data.imageUrl
                        };

                    alert(Data);
                    console.log(Data);
                    axios
                    .post('http://localhost:8085/users/updateone/', Data)
                    .then(response => {})
                    .catch(error => {
                        console.error(error);
                        if (error.response && error.response.data && error.response.data.error) {
                        setError(error.response.data.error);
                        } else {
                        setError('Une erreur s\'est produite');
                        }
                    });
                }
                else{
                    alert("pas d image");
                }
                
            })

        } catch (error) {
          alert("non effectuer");
          console.error('Erreur lors de l\'envoi de l\'image:', error);
        }    

      }

      const pass = event=>{

        event.preventDefault();

        const datapass = {
            password : password,
            newpass : newpass,
            id : storedUserId
        }

        if(password ==="" || newpass ==="" || confirmpass ===""){
            setError("renseigner tous les champs");
        }

        if(confirmpass != newpass){
            setError("mot de passe different");
        }

        else{
            axios
            .post('http://localhost:8085/users/updatepass/', datapass)
            .then(response => {
                alert("mot de passe modifier");
            })
            .catch(error => {
                console.error(error);
                if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
                } else {
                setError('Une erreur s\'est produite');
                }
            });

        }
    
    }


    return (
        <div>
         <Navigation/>

         <section class="py-5 my-5">
		<div class="container">
			<h1 class="mb-5">Parametre du Compte</h1>
			<div class="bg-white shadow rounded-lg d-block d-sm-flex">
				<div class="profile-tab-nav border-right">
					<div class="p-4">
						<div class="img-circle text-center mb-3">
							<img src={fetchauteur && fetchauteur.profile} alt="Image" class="shadow"/>
						</div>
						<h4 class="text-center">{fetchauteur && fetchauteur.email}</h4>
					</div>
					<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
						<a class="nav-link active" id="account-tab" data-toggle="pill" href="#account" role="tab" aria-controls="account" aria-selected="true">
							<i class="fa fa-home text-center mr-1"></i> 
							Account
						</a>
						<a class="nav-link" id="password-tab" data-toggle="pill" href="#password" role="tab" aria-controls="password" aria-selected="false">
							<i class="fa fa-key text-center mr-1"></i> 
							Password
						</a>
						<a class="nav-link" id="security-tab" data-toggle="pill" href="#security" role="tab" aria-controls="security" aria-selected="false">
							<i class="fa fa-user text-center mr-1"></i> 
							Security
						</a>
						<a class="nav-link" id="application-tab" data-toggle="pill" href="#application" role="tab" aria-controls="application" aria-selected="false">
							<i class="fa fa-tv text-center mr-1"></i> 
							Application
						</a>
						<a class="nav-link" id="notification-tab" data-toggle="pill" href="#notification" role="tab" aria-controls="notification" aria-selected="false">
							<i class="fa fa-bell text-center mr-1"></i> 
							Notification
						</a>
					</div>
				</div>
				<div class="tab-content p-4 p-md-5" id="v-pills-tabContent">
                
					<div class="tab-pane fade show active" id="account" role="tabpanel" aria-labelledby="account-tab">
						<h3 class="mb-4">Account Settings</h3>
                        <form method='POST' onSubmit={changephoto}>
                        {error && <div>Erreur : {error}</div>}
						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
								  	<label>Nom d'utilisateur : {fetchauteur && fetchauteur.username} </label>
								  	<input type="text" placeholder={fetchauteur && fetchauteur.username} class="form-control" value={username} onChange={(e) => setUsername(e.target.value) }/>
								</div>
							</div>
		
							<div class="col-md-6">
								<div class="form-group">
								  	<label>Email</label>
								  	<input type="text" class="form-control" value={fetchauteur && fetchauteur.email}/>
								</div>
							</div>
			
							<div class="col-md-12">
								<div class="form-group">
								  	<label>Bio : {fetchauteur && fetchauteur.bio}</label>
                                      <input type="text" placeholder={fetchauteur && fetchauteur.bio} class="form-control" value={bio} onChange={(e) => setBio(e.target.value) }/>

								</div>
							</div>
                            <div class="col-md-12">
								<div class="form-group">
								  	<label>Photo</label>
                                      <input type="file" class="form-control" onChange={handleImageChange}/>

								</div>
							</div>
						</div>
						<div>
							<button class="btn btn-primary" className='b1'>Update</button>
							<button class="btn btn-light" className='b1'>Annuler</button>
						</div>
                        </form>
					</div>
                    <form onSubmit={pass} method='POST'>
					<div class="tab-pane fade" id="password" role="tabpanel" aria-labelledby="password-tab">
						<h3 class="mb-4">Password Settings</h3>
                        {error && <div>Erreur : {error}</div>}
						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
								  	<label>Ancient mot de passe : </label>
								  	<input placeholder='old pass' type="password" class="form-control" value={password} onChange={(e) => setPassword(e.target.value) }/>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
								  	<label>Nouveau mot de passe : </label>
								  	<input placeholder='new pass' type="password" class="form-control" value={newpass} onChange={(e) => setNewpass(e.target.value) }/>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group">
								  	<label>Confirmer le Mot de Passe : </label>
								  	<input placeholder='confirm pass' type="password" class="form-control" value={confirmpass} onChange={(e) => setConfirmpass(e.target.value) }/>
								</div>
							</div>
                        

                            <div>
							<button class="b1">Update</button>
							<button class="b1">Annuler</button>
						</div>
						</div>
						
					</div>
                    </form>
					
					
					
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
      <span>Forum.MPGL Blog Page</span>
    </footer>

    
    
            
        </div>
    );
};

export default Profiles;