var bcrypt = require("bcrypt");
var jwtutils = require("../utils/jwt.utils");
var models = require("../models")

const nodemailer = require("nodemailer");

const UserVerification = models.userverification;

const {v4: uuidv4} = require("uuid");
const userverification = require("../models/userverification");


let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user : "forummpgl@gmail.com",
        pass : "obcipqwudzurpeya",
    }
})


transporter.verify((error, sucess) =>{
    if(error){
        console.log(error);
    }
    else{
        console.log("ready for message");
        console.log(sucess);
    }
})

const sendVerificationEmail = ({ id, email }, res) => {
    console.log(id);
    console.log(email);
  
    const curenturl = "http://localhost:3000/";
    const uniqueString = uuidv4() + id;
    const mailoption = {
      from: "forummpgl@gmail.com",
      to: email,
      subject: "verification de votre email",
      html: `<p>verification de votre email pour valider votre compte</p> <p>Ce lien expire dans <b>6 heures</b></p><p>press: <a href=${curenturl + 'user/verify/' + id + '/' + uniqueString}> here</a> </p>`
    };
  
    console.log("Étape d'envoi");
    const saltrounds = 10;
    bcrypt
      .hash(uniqueString, saltrounds)
      .then((hashedUniqueString) => {
        console.log(hashedUniqueString);
        var newverification = models.UserVerification.create({
          userId: id,
          uniqueString: hashedUniqueString,
          createdAt: Date.now(),
          expireAt: Date.now() + 21600000,
        })
          .then(() => {
            console.log("Envoi de l'email");
            transporter
              .sendMail(mailoption)
              .then(() => {
                console.log('Email envoyé');
                /*return res.status(200).json({
                  status: "PENDING",
                  message: "Email envoyé"
                });*/
              })
              .catch((error) => {
                console.log("Erreur lors de l'envoi de l'email: " + error);
                return res.status(500).json({
                  status: "FAILED",
                  message: "L'e-mail n'a pas été envoyé"
                });
              });
          })
          .catch((error) => {
            console.log("Erreur lors de la sauvegarde de la vérification: " + error);
            return res.status(500).json({
              status: "FAILED",
              message: "La sauvegarde de la vérification n'a pas été effectuée"
            });
          });
      })
      .catch((error) => {
        console.log("Erreur lors du hachage de la chaîne unique: " + error);
        return res.status(500).json({
          status: "FAILED",
          message: "Erreur dans la transmission de l'e-mail"
        });
      });
  };


  const sendpass = (user, res) => {
    console.log(user.password);
    console.log(user.email);
    var email = user.email;
    var id = user.id;
    const curenturl = "http://localhost:3000/";
    const uniqueString = uuidv4() + user.id;
    const mailOptions = {
      from: "forummpgl@gmail.com",
      to: user.email,
      subject: "Votre mot de passe",
      html: `<p>pour modifier votre mot de passe veillez cliquez sur ce lien</p> <p>Ce lien expire dans <b>6 heures</b></p><p>Cliquez <a href="${curenturl + 'user/change/' + id + '/' + email}">ici</a> pour accéder au site.</p>`
    };
  
    console.log("Étape d'envoi");
  
    console.log("Envoi de l'email");
    transporter
      .sendMail(mailOptions)
      .then(() => {
        console.log('Email envoyé');
        res.status(200).json({
          status: "SUCCESS",
          message: "L'e-mail a été envoyé"
        });
      })
      .catch((error) => {
        console.log("Erreur lors de l'envoi de l'email: " + error);
        return res.status(500).json({
          status: "FAILED",
          message: "L'e-mail n'a pas été envoyé"
        });
      });
  };



module.exports = {

    register: function(req, res){
        var email    = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio = req.body.bio;
   
        console.log("email: ", email);
        console.log("username: ", username);
        console.log("password: ", password);
        console.log("ma bio: ", bio);


        if (email === "" || username === "" || password === "") {
            return res.status(400).json({ 'error': 'Veuillez renseigner tous les champs' });
        }

        models.User.findOne({
            attributes: ["email"],
            where : {email : email}
        })
        .then(function(userFound){
            if(!userFound){
                bcrypt.hash(password, 5, function(err, bcryptedPassword){
                    var newUser = models.User.create({
                        email : email,
                        username : username,
                        password : bcryptedPassword,
                        bio : bio,
                        isadmin : 0,
                        verified: false,
                    })
                    .then(function(newUser){
                        sendVerificationEmail(newUser, res);
                        return res.status(201).json({"userId" : newUser.id});
                    })
                    .catch(function(err){
                        return res.status(500).json({ "error" : "utilisateur non ajouter"})
                    })
                })
            }
            else{
                return res.status(409).json({"error" : "l'utilisateur existe deja"})
            }
        })
        .catch(function(err){
            return res.status(500).json({"error" : "enable to veify user"})
        })
    },



    login: function(req, res){
        var email    = req.body.email;
        var password = req.body.password;

        console.log("email: ", email);
        console.log("password: ", password);

        if (email === "" ||  password == "") {
        return res.status(400).json({ 'error': 'Renseigner tous les champs' });
        }

        models.User.findOne({
            where : {email : email}
        })
        .then(function(userFound){
            if(userFound){
                if(userFound.verified == false){
                    return res.status(403).json({"error" : "Votre compte n'est pas Activer"})
                }
                else{
                    bcrypt.compare(password, userFound.password, function(errBycrypt, resBcrypte){

                        if(resBcrypte){
                            return res.status(200).json({
                                "userId" : userFound.id,
                                "token" : jwtutils.generateTokenUser(userFound)
                            })
                        }
                        else{
                            return res.status(403).json({"error" : "Mot de passe incorrect"})
                        }   
                })
                }
                }
            else{
                return res.status(409).json({"error" : "l'utilisateur n existe pas"})
            }
        })
        .catch(function(err){
            return res.status(500).json({"error" : "enable to veify user"})
        })

        
    },

    updateme: function (req, res) {
      var username = req.body.username;
      var bio = req.body.bio;
      var profile = req.body.profile;
      var id = req.body.id;

      console.log("user", username);
      console.log(bio);
      console.log(id);
      console.log(profile);
    
      models.User.findOne({
        where: { id: id },
      })
        .then(function (user) {
          if (user) {
            models.User.update(
              {
                username: username,
                profile: profile,
                bio: bio,
              },
              { where: { id: id } }
            )
              .then(() => {
                return res
                  .status(200)
                  .json({ message: "Mise à jour du mot de passe effectuée" });
              })
              .catch((error) => {
                console.log(error);
                return res
                  .status(500)
                  .json({ error: "Échec de la mise à jour" });
              });
          } else {
            res.status(404).json({ error: "Utilisateur non trouvé" });
          }
        })
        .catch(function (err) {
          res
            .status(500)
            .json({ error: "Une erreur s'est produite lors de la recherche de l'utilisateur" });
        });
    },

    

    verif: function(req, res) {
        let { userId, uniqueString } = req.params;
        models.UserVerification
          .findOne({
            where: { userId: userId }
          })
          .then((result) => {
            if (result) {
              const { expireAt, uniqueString: hashedUniqueString } = result;
      
              if (expireAt < Date.now()) {
                models.UserVerification
                  .destroy({ where: { userId: userId } })
                  .then(() => {
                    models.User
                      .destroy({ where: { id: userId } })
                      .then(() => {
                        return res.status(200).json({ message: "Vérification échouée" });
                      })
                      .catch((error) => {
                        console.log(error);
                        return res.status(500).json({ error: "Échec de la suppression de l'utilisateur" });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    return res.status(500).json({ error: "Échec de la suppression de la vérification" });
                  });
              } else {
                bcrypt.compare(uniqueString, hashedUniqueString)
                  .then((result) => {
                    if (result) {
                      models.User
                        .update({ verified: true }, { where: { id: userId } })
                        .then(() => {
                          models.UserVerification
                            .destroy({ where: { userId: userId } })
                            .then(() => {
                              return res.status(200).json({ message: "Mise à jour effectuée" });
                            })
                            .catch((error) => {
                              console.log(error);
                              return res.status(500).json({ error: "Échec de la suppression de la vérification" });
                            });
                        })
                        .catch((error) => {
                          console.log(error);
                          return res.status(500).json({ error: "Échec de la mise à jour de l'utilisateur" });
                        });
                    } else {
                      return res.status(400).json({ error: "Chaîne unique invalide" });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    return res.status(500).json({ error: "Échec de la comparaison des chaînes" });
                  });
              }
            } else {
              return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({ error: "Échec de la recherche de la vérification" });
          });
      },

    mdp: function(req, res){
        var email    = req.body.email;
        console.log("email : "+email);
        if (email === "") {
            return res.status(400).json({ 'error': 'Renseigner tous les champs' });
        }
        else{
            models.User
                .findOne({
                     where : {email : email}
                })
                .then(function(userFound){
                    if(userFound){
                        console.log('trouver');
                        if(userFound.verified == false){
                            return res.status(403).json({"error" : "Votre n'est pas Activer"})
                        }
                        else{
                                console.log('trouver le bcrypte');
                                sendpass(userFound, res);
                                console.log("envoyer")
                        }
                        }
                    else{
                        return res.status(409).json({"error" : "l'utilisateur n existe pas"})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({"error" : "enable to veify user"})
                })
        }
    
           
    },

    modif: function(req, res){
        var email    = req.body.email;
        var password = req.body.password;
        console.log("email : "+email);
        console.log("password : "+password);

        if (email === "" || password ==="") {
            return res.status(400).json({ 'error': 'Renseigner tous les champs' });
        }
        else{
            models.User
                .findOne({
                     where : {email : email}
                })
                .then(function(userFound){
                    if(userFound){
                        console.log('trouver');
                        if(userFound.verified == false){
                            return res.status(403).json({"error" : "Votre n'est pas Activer"})
                        }
                        else{
                            bcrypt.hash(password, 5, function(err, bcryptedPassword){
                                models.User
                                    .update({ password : bcryptedPassword }, { where: { email: email } })
                                    .then(() => {
                                        return res.status(200).json({ error: "Mise à jour mot de passe effectuée" });
                                    })
                                    .catch((error) => {
                                    console.log(error);
                                    return res.status(500).json({ error: "Échec de la mise à jour du mot de passe" });
                                    });
                            });
                            
                        }
                        }
                    else{
                        return res.status(409).json({"error" : "l'utilisateur n existe pas"})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({"error" : "enable to veify user"})
                })
        }
    
           
    },

    oneuser : function(req, res) {
      var id = req.params.id;  
    
      models.User.findOne({
          where: { id: id }
        })
        .then(function(user) {
          if (user) {
            res.json(user);
          } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
          }
        })
        .catch(function(err) {
          res.status(500).json({ error: 'Une erreur s\'est produite lors de la recherche de l\'utilisateur' });
        });
    },

    modifpass : function(req, rs){
      var id = req.body.id;
      var password = req.body.password;
      var newpass = req.body.newpass;

      console.log("id", id, "password", password, "new pass", newpass);

      models.User.findOne({
        where: { id: id }
      })
        .then(function(userfound){
          if(userfound){
            bcrypt.compare(password, userfound.password, function(errBycrypt, resBcrypte){

              if(resBcrypte){
                bcrypt.hash(newpass, 5, function(err, bcryptedPassword){
                models.User.update(
                  {
                    password: bcryptedPassword,
                  },
                  { where: { id: id } })
                  .then()
                  .catch(function(err){
                    return res.status(500).json({"error" : "enable to veify user"})
                })
                });
              }
              else{
                  return res.status(403).json({"error" : "Mot de passe incorrect"})
              }   
      })

          }
          else{
            res.json("utilisateur introuvable");
          }
        })
    },

    alluser : function(req, res){
      models.User.findAll()
      .then((function(user){
        res.json({
          "user" : user
        })
      }))
    }

    
}
