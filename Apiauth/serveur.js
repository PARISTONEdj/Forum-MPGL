var express = require("express");
var bodyparser = require("body-parser");
var server = express();
var apiRouter = require("./apiRooter");
const multer = require('multer');
const path = require('path');
const UserController = require("./routes/UserController");

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.use(bodyparser.urlencoded({ extended: true }));
server.use(bodyparser.json());

server.use("/api/", apiRouter);

server.get("/", function(req, res){
    res.setHeader("Content-Type", "text/html");
    res.status(200).send("<h1>ok debutons node js express</h1>");
});

server.use(loggerMiddleware);

server.listen(8085, function(){
    console.log("serveur demarer merci");
});

function loggerMiddleware(request, response, next) {
    console.log(`Received request: ${request.method} ${request.url}`);
    next();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Répertoire de destination pour enregistrer l'image
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nom du fichier avec timestamp pour éviter les doublons
    }
  });


  const upload = multer({ storage: storage });

server.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    const imageUrl = req.file.path; 
    const imageName = path.basename(imageUrl);
    res.json({ imageUrl: imageName });
  } else {
    res.status(400).json({ error: 'Aucune image téléchargée' });
  }
});

const uploadDir = path.join(__dirname, 'uploads');

server.use('/ru', express.static(uploadDir));

server.post('/users/updateone', UserController.updateme);

server.post('/users/updatepass', UserController.modifpass);

server.get('/users/liste', UserController.alluser);