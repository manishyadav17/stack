 //import express from "express";
// import express from 'express';

//const conversationRoute = express.Router();
//const messageRoute = express.Router();

import express from 'express';

// import messageRoute from './routes/messages.js';  // Ensure the path is correct

// const app = express();

import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
// const path =require("path");





//import conversationRoutes from "./routes/conversations.js";

// import messageRoutes from "./routes/messages.js";

import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";



/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });



// Middleware for handling JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Endpoint for updating user profile
app.put('/users/:userId', upload.single('image'), (req, res) => {
  const userId = req.params.userId;
  const { firstName, lastName, email, location, occupation } = req.body;

  // Update user profile in the database
  // Example: User.update({ _id: userId }, { firstName, lastName, email, location, occupation })

  // Handle file upload if an image is provided
  if (req.file) {
    const image = req.file;
    const imagePath = path.join(__dirname, 'uploads', image.filename);

    // Save image to disk or cloud storage
    // Example: fs.renameSync(image.path, imagePath)
  }

  // Send back the updated user object
  res.json({
    id: userId,
    firstName,
    lastName,
    email,
    location,
    occupation,
    // Add other fields as needed
  });
});




/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// -------deploymet-----
const __dirname1=path.resolve();
if(process.env.NODE_ENV === 'production'){
   app.use(express.static(path.join(__dirname1,"/client/build")));
   
   app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"client","build","index.html"))
   });




}else{
  app.get("/",(req,res)=>{
    res.send("API is runnig successfuly");
  });
}

// -------deployment------







/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));


    // if (process.env.NODE_ENV = "production"){
    //   index.use(express.static("client/build"));
    // }




    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));


