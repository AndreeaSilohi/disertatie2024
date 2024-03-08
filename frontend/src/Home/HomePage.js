import Navbar from "../navbar/Navbar";
import background from "../assets/background.jpg";
import "./Home.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Animation from "../Animation/Animation";
import React from "react";
function HomePage() {
  return (
    <div className="container-home">
      <div className="navbarHome">
        <Navbar />
      </div>
      <header>
        <div className="background-container">
          <div className="overlay-text">
            <h1 className="h1-title">Din pasiune pentru natura si sanatate!</h1>
          </div>
        </div>
      </header>

      <div className="white-background">
        <h4>Cele mai apreciate produse</h4>
        <row className="cards">
          <Card
            sx={{
              maxWidth: 500,
              backgroundColor: "#edcea8",
              border: "2px solid #ccc",
            }}
          >
            <CardActionArea>
              <CardMedia
                className="card-media"
                component="img"
                image="https://edesia.ro/wp-content/uploads/2021/01/edesia.ro-miere-de-albine-flori-tei-borcan-500g.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Miere de tei
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pret: 40 de lei
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              maxWidth: 500,
              backgroundColor: "#edcea8",
              border: "2px solid #ccc",
            }}
          >
            <CardActionArea>
              <CardMedia
                className="card-media"
                component="img"
                image="https://edesia.ro/wp-content/uploads/2021/01/edesia.ro-miere-de-albine-poliflora-borcan-500g-1.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Miere poliflora
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pret: 35 de lei
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              maxWidth: 500,
              backgroundColor: "#edcea8",
              border: "2px solid #ccc",
            }}
          >
            <CardActionArea>
              <CardMedia
                className="card-media"
                component="img"
                image="https://edesia.ro/wp-content/uploads/2021/01/edesia.ro-miere-de-albine-flori-salcam-borcan-500g.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Miere de salcam
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pret: 40 de lei
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </row>
        <row className="cards">
          <Card
            sx={{
              maxWidth: 500,
              backgroundColor: "#edcea8",
              border: "2px solid #ccc",
            }}
          >
            <CardActionArea>
              <CardMedia
                className="card-media"
                component="img"
                image="https://edesia.ro/wp-content/uploads/2021/01/edesia.ro-miere-de-albine-poliflora-borcan-tava-980gx4-1-768x768.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Miere poliflora 4 borcane
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pret: 150 de lei
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              maxWidth: 500,
              backgroundColor: "#edcea8",
              border: "2px solid #ccc",
            }}
          >
            <CardActionArea>
              <CardMedia
                className="card-media"
                component="img"
                image="https://edesia.ro/wp-content/uploads/2021/01/edesia.ro-miere-de-albine-flori-salcam-borcan-tava-980gx4-768x768.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Miere salcam 4 borcane
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pret: 135 de lei
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              maxWidth: 500,
              backgroundColor: "#edcea8",
              border: "2px solid #ccc",
            }}
          >
            <CardActionArea>
              <CardMedia
                className="card-media"
                component="img"
                image="https://tainavie.ro/wp-content/uploads/2022/03/miere-cu-fagure-430x430.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Miere cu fagure
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pret: 40 de lei
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </row>
      </div>
      <div className="about-products">
        <h4>Despre produsele noastre</h4>
        <div className="grid-container">
          <div className="grid-item">
            Stupul este o intreaga farmacie. Produsele apicole sunt necesare
            pentru oameni menține sănătatea, pentru a preveni bolile, dar și
            pentru a aduce metabolismul la un vârf de prospețime și vitalizare.
          </div>
        </div>
        <Animation/>
        <div className="grid-container-img">
          <div className="grid-item-text">
            Stupul este o intreaga farmacie. Produsele apicole sunt necesare
            pentru oameni menține sănătatea, pentru a preveni bolile, dar și
            pentru a aduce metabolismul la un vârf de prospețime și vitalizare.
          </div>

          <div className="grid-item-img">
            <img
              alt="text"
              src="https://preparateapicole.ro/wp-content/uploads/2019/10/preparate-apicole-products.jpg"
            ></img>
          </div>
        </div>
      </div>

      <div className="new-products">
        <div className="grid-container-img">
          <div className="grid-item-text">
            În curând un produs nou va fi disponibil în magazinul nostru!
            <div className="text-new-product">
              Propolisul crud va fi disponibil incepand cu data de 5 august
              2024! Pentru a vedea ce produse noi sunt pe cale sa ajunga in
              magazinul nostru acest an, te invitam sa ne urmaresti si pe pagina
              noastra de Facebook.{" "}
            </div>
          </div>

          <div className="grid-item-img">
            <img
              alt="text"
              src="https://www.apiland.ro/img/ybc_blog/post/194.jpg"
            ></img>
          </div>
        </div>
      </div>
      <div className="carousel">
        <div className="text-photos">
          Comanzi des de la noi pentru un restaurant sau un hotel?
          Contacteaza-ne!
          <Link to="/contact-form">
            <Button
              variant="contained"
              sx={{
                borderColor: "black",
                backgroundColor: "#064420",
                "&:hover": {
                  backgroundColor: "#52616B",
                },
              }}
            >
              CONTACTEAZA-NE
            </Button>
          </Link>
        </div>
        <div className="photos">
          <img
            className="image"
            alt="text"
            src="https://gardenbio.ro/wp-content/uploads/2016/12/rama-plina-albine-1-1-of-1-e1484691569330.jpg"
          ></img>
          <img
            className="image"
            alt="text"
            src="https://tacataca.prosport.ro/wp-content/uploads/2019/10/Stup-de-albine-1-696x406.jpg"
          ></img>
          <img
            className="image"
            alt="text"
            src="https://storage0.dms.mpinteractiv.ro/media/1/1481/21335/19445258/1/8crescator-albine.jpg"
          ></img>
          <img
            className="image"
            alt="text"
            src="https://www.lumeasatului.ro/images/articole/2018/09.septembrie_2018/luna-de-miere/luna-miere_3.jpg"
          ></img>
          <img
            className="image"
            alt="text"
            src="https://cdn.pixabay.com/photo/2014/04/17/09/45/bees-326337_640.jpg"
          ></img>

          <img
            className="image"
            alt="text"
            src="https://cdn.pixabay.com/photo/2023/05/16/06/08/bees-7996596_640.jpg"
          ></img>

          <img
            className="image"
            alt="text"
            src="https://cultivaprofitabil.ro/wp-content/uploads/2018/11/Stuparitul-696x418.jpg"
          ></img>

          <img
            className="image"
            alt="text"
            src="https://cdn.pixabay.com/photo/2014/04/17/09/33/honey-bees-326334_640.jpg"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
