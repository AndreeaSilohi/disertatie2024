import './Home.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Animation from '../Animation/Animation';
import React from 'react';
import { Divider } from '@mui/material';
import imgStup from '../assets/imgStup.jpg';
import sides from '../assets/sides.png';

const imageArray = [
  'https://gardenbio.ro/wp-content/uploads/2016/12/rama-plina-albine-1-1-of-1-e1484691569330.jpg',
  'https://tacataca.prosport.ro/wp-content/uploads/2019/10/Stup-de-albine-1-696x406.jpg',
  'https://storage0.dms.mpinteractiv.ro/media/1/1481/21335/19445258/1/8crescator-albine.jpg',
  'https://www.lumeasatului.ro/images/articole/2018/09.septembrie_2018/luna-de-miere/luna-miere_3.jpg',
  'https://cdn.pixabay.com/photo/2014/04/17/09/45/bees-326337_640.jpg',
  'https://cdn.pixabay.com/photo/2023/05/16/06/08/bees-7996596_640.jpg',
  'https://cultivaprofitabil.ro/wp-content/uploads/2018/11/Stuparitul-696x418.jpg',
  'https://cdn.pixabay.com/photo/2014/04/17/09/33/honey-bees-326334_640.jpg',
  'https://images.unsplash.com/photo-1631330627544-c9415dc39cbd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1621011989641-043d3ade8112?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1661935325683-b300835a3f88?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1661851293346-dfd1f54773bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHN1bm55JTIwZmllbGQlMjB3aXRoJTIwYmVlc3xlbnwwfDB8MHx8fDA%3D',
];
function HomePage() {
  return (
    <div className="container-home">
      <header>
        <div className="background-container">
          <div className="overlay-text">
            Din pasiune pentru natură și sănătate
          </div>
        </div>
      </header>

      <div className="about-products">
        <div className="grid-container">
          <div className="grid-item">
            Stupul este un adevărat depozit de medicamente naturale. Produsele apicole sunt esențiale
            pentru menținerea sănătății umane, pentru a preveni bolile, dar și
            pentru stimularea metabolismului, aducând vitalitate și prospețime.
          </div>
        </div>
        {/* <Animation /> */}
      </div>
      <div className="about-products">
        <div className="left-side">
          <div className="grid-item-img">
            <img alt="home" src={imgStup}></img>
          </div>
          <div className="left-side-text">
            <h2>Misiunea noastră</h2>
            <Divider style={{ marginTop: '10px' }} />
            <p>
              Misiunea noastră este să aducem produse de înaltă calitate în
              casele cât mai multor oameni posibil. Ne-am asumat acest scop
              deoarece credem cu tărie că fiecare persoană merită acces la
              produse care să îmbunătățească calitatea vieții lor și să le aducă
              bucurie și confort în fiecare zi.
            </p>
          </div>
        </div>
        <div className="grid-item-text">
          <img alt="home" src={sides}></img>
          <div className="inside-text">
            <h4>Noutăți</h4>
            <h6>5 august 2024</h6>
            <h5>Propolis crud in curand disponibil</h5>
            <p>
              Propolisul crud va fi disponibil incepand cu data de 5 august
              2024!{' '}
            </p>
            <hr style={{marginTop:"20px"}}></hr>
            <h6>20 septembrie 2024</h6>
            <h5>Crema cu lăptișor de matcă va fi disponibilă</h5>
            <p>
              Din această toamnă va fi introdus un produs mult așteptat! Crema
              cu lăptișor de matcă va face parte din gama noastră de produse.
            </p>

            <hr style={{marginTop:"20px"}}></hr>
            <h6>10 decembrie 2024</h6>
            <h5>Oțetul de mere cu miere va fi introdus</h5>
            <p>
              Oțetul de mere cu miere va fi disponibil începând cu această iarnă
              la cererea voastră!
            </p>
            <p>
              Pentru a vedea ce produse noi sunt pe cale sa ajunga in magazinul
              nostru acest an, te invitam sa ne urmaresti si pe pagina noastra
              de Facebook.{' '}
            </p>
          </div>
        </div>
      </div>

      {/* <div className="new-products">
        <div className="grid-container-img">
          <div className="grid-item-text">
            În curând un produs nou va fi disponibil în magazinul nostru!
            <div className="text-new-product">
              Propolisul crud va fi disponibil incepand cu data de 5 august
              2024! Pentru a vedea ce produse noi sunt pe cale sa ajunga in
              magazinul nostru acest an, te invitam sa ne urmaresti si pe pagina
              noastra de Facebook.{' '}
            </div>
          </div>

          <div className="grid-item-img">
            <img
              alt="text"
              src="https://www.apiland.ro/img/ybc_blog/post/194.jpg"
            ></img>
          </div>
        </div>
      </div> */}
      <div className="carousel">
        <div className="text-photos">
          Comanzi des de la noi pentru un restaurant sau un hotel?
          <Link to="/contact-form">
            <Button
              className="contact"
              variant="contained"
              sx={{
                marginLeft: '10px',
                backgroundColor: '#064420',
                '&:hover': {
                  backgroundColor: '#52616B',
                },
              }}
            >
              CONTACTEAZĂ-NE
            </Button>
          </Link>
        </div>
        <div className="photos">
          {imageArray.map((imageUrl, index) => (
            <img key={index} className="image" alt="text" src={imageUrl} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
