const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* MongoDB connect */
mongoose.connect("mongodb+srv://anikaakter8755_db_user:1YWFsFd32lCQEWl5@cluster0.g1x9kfa.mongodb.net/social?retryWrites=true&w=majority");

/* Models */
const User = require("./models/User");
const Post = require("./models/Post");

/* Register */
app.post("/register", async (req, res) => {

const hash = await bcrypt.hash(req.body.password, 10);

await User.create({

username: req.body.username,
password: hash

});

res.send("Registered");

});

/* Login */
app.post("/login", async (req, res) => {

const user = await User.findOne({
username: req.body.username
});

if (!user) return res.send("User not found");

const valid = await bcrypt.compare(
req.body.password,
user.password
);

if (!valid) return res.send("Wrong password");

const token = jwt.sign(
{ username: user.username },
"secret"
);

res.send(token);

});

/* Image Upload */

const storage = multer.diskStorage({

destination: "uploads",

filename: (req, file, cb) => {

cb(null, Date.now() + ".png");

}

});

const upload = multer({ storage });

/* Create Post */

app.post("/post", upload.single("image"), async (req, res) => {

await Post.create({

user: req.body.user,

text: req.body.text,

image: req.file.filename,

likes: 0

});

res.send("Post created");

});

/* Get Posts */

app.get("/posts", async (req, res) => {

const posts = await Post.find().sort({ _id: -1 });

res.send(posts);

});

/* Like */

app.post("/like", async (req, res) => {

await Post.updateOne(

{ _id: req.body.id },

{ $inc: { likes: 1 } }

);

res.send("Liked");

});

/* Chat */

io.on("connection", (socket) => {

socket.on("chat", (msg) => {

io.emit("chat", msg);

});

});

server.listen(3000, () => {

console.log("Server running");

});