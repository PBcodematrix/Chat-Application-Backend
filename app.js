const express=require("express");

const morgan=require("morgan");

const rateLimit=require("express-rate-limit");

const helmet=require("helmet");

const mongosanitize=require("express-mongo-sanitize");

const bodyParser=require("body-parser");

const xss=require("xss");

const cors=require("cors");

const app=express();

const routes=require("./routes/index");

app.use(mongosanitize());

// app.use(xss());

app.use(cors({
    origin:"*",
    methods:["GET","PATCH","POST","DELETE","PUT"],
    credentials:true,
}));

app.use(express.json({limit:"10kb"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(helmet());

if (process.env.NODE_ENV === "production") {
    //set static folder
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`server started on port ${PORT}`));

const limiter=rateLimit({
    max:3000,
    windowMs:60*60*1000,
    message:"Too many request from this IP,Please try again in an hour"
})

app.use("/tawk",limiter);

app.use(express.urlencoded({
    extended:true,
}));

app.use(routes);


module.exports=app; 