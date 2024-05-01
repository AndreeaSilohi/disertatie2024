import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useState, useEffect } from 'react';
import './Curiosities.css';

const TypingEffect = ({ text, speed }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayText}</span>;
};

const CarouselComponent = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  //style={{ width: "60%",height:"40%",marginLeft:"100px" }}
  return (
    <div className="curiosities-container">
      <header className="header-curiosities">
        <div className="background-container-curiosities">
          <div className="overlay-text-curiosities">
            <h1 className="h1-title-curiosities">CURIOZITĂȚI</h1>
          </div>
        </div>
      </header>
      {/* <div className="carusel">
      
          <Slider {...settings}  autoPlay={true}>
            <div>
              <img
                src="https://images.pexels.com/photos/702931/pexels-photo-702931.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Slide 1"
                 style={{ width: "100%" }}
              />
            </div>
            <div>
              <img
                src="https://cdn.pixabay.com/photo/2022/12/02/16/34/western-honey-bee-7631244_640.jpg"
                alt="Slide 2"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <img
                src="https://cdn.pixabay.com/photo/2017/05/06/22/04/bees-pasture-2291125_640.jpg"
                alt="Slide 3"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <img
                src="https://cdn.pixabay.com/photo/2021/09/11/16/00/beehives-6615952_640.jpg"
                alt="Slide 4"
                style={{ width: "100%" }}
              />
            </div>
          </Slider>
      
      </div> */}
      <div className="text-effect-parent">
        <div className="text-effect">
          <TypingEffect text="Iată aici câteva curiozități despre albine" speed={80} />
        </div>
      </div>

      <div className="curiosity-one">
        <div className="image-curiosity-one">
          <img src="https://images.pexels.com/photos/2749847/pexels-photo-2749847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
        </div>
        <div className="text-curiosity-one">
          <p className="text-curiosity-one-title">
            Albinele sunt singurele care produc hrană comestibilă pentru oameni
          </p>
          <p className="text-curiosity-one-content">
            Mierea , precum și laptisorul de matcă sunt alimente pe care chiar
            și oamenii sunt capabili să le digere. Albinele sunt singurele
            animale care produc hrană comestibilă pentru oameni. De fapt, mierea
            este bogată în nutrienți care sunt foarte benefici pentru oameni .
          </p>
        </div>
      </div>

      <div className="curiosity-two">
        <div className="text-curiosity-two">
          <p className="text-curiosity-two-title">O viață dedicată muncii</p>
          <p className="text-curiosity-two-content">
            De-a lungul vieţii, albina munceşte în continuu, în funcţie de
            vârstă. În primele 20 de zile, albina lucrătoare execută tot felul
            de lucrări în stup, iar în ultimile 15 zile ale vieţii devine albină
            culegătoare. Chiar în ultimele zile de viaţă, albina de regulă
            rămâne în stup, ea muncind în continuare, până la ultima răsuflare.
          </p>
        </div>
        <div className="image-curiosity-two">
          <img src="https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRfS2w5anaI47eInFIcho49fd4SlVecTgBlDhxeS7Dehd84jUyC38OG6xUZcMkDUdi8" />
        </div>
      </div>

      <div className="curiosity-three">
        <div className="image-curiosity-three">
          <img src="https://images.pexels.com/photos/19776683/pexels-photo-19776683/free-photo-of-bee-on-flower.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
        </div>
        <div className="text-curiosity-three">
          <p className="text-curiosity-three-title">
            Soarele este folosit de albine ca busolă
          </p>
          <p className="text-curiosity-three-content">
            Albinele folosesc soarele ca metodă de orientare. Ei sunt capabili
            să vadă lumina polarizată și, prin urmare, pot identifica
            întotdeauna poziția soarelui, chiar și pe cerul înnorat.
          </p>
        </div>
      </div>

      <div className="curiosity-four">
        <div className="text-curiosity-four">
          <p className="text-curiosity-four-title">Albinele comunică dansând</p>
          <p className="text-curiosity-four-content">
            Albinele folosesc diferite tipuri de comunicare. Printre acestea
            regăsim și celebrul „dans al albinelor ”. Dar ce înțelegem mai exact
            prin dans? Albinele efectuează anumite zboruri circulare „opt”. Prin
            aceste dansuri, albinele sunt capabile să comunice cu restul roiului
            unde este sursa de hrană în care trebuie să își hrănească. Dansul
            albinelor comunica atat directia in care se merge cat si distanta
            locului fata de stup.
          </p>
        </div>
        <div className="image-curiosity-four">
          {/* <img src="https://images.unsplash.com/photo-1583673354352-9504815ae8e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" /> */}
          <img src="https://images.unsplash.com/photo-1626285094805-b7b084f70e1a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        </div>
      </div>

      <div className="final-text">
        Albinele sunt mai mult decât simple insecte; ele sunt gardienii
        ecosistemului nostru și partenerii esențiali în producția alimentară. De
        la polenizarea culturilor agricole la menținerea biodiversității
        naturale, contribuția lor este neprețuită.
      </div>

      {/* <div className="hexagon-container">
        <div class="hexagon">
          <img
            src="https://plus.unsplash.com/premium_photo-1663047719705-22009ac7b1d4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Your Photo"
          />
        </div>
        <div class="hexagon">
          <img
            src="https://images.unsplash.com/photo-1585326844796-f0b3ca5ca0b1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Your Photo"
          />
        </div>
        <div class="hexagon">
          <img
            src="https://plus.unsplash.com/premium_photo-1681506275565-bee309349726?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Your Photo"
          />
        </div>
        <div class="hexagon">
          <img
            src="https://images.unsplash.com/photo-1651282462432-2e33bec6b206?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Your Photo"
          />
        </div>

        <div class="hexagon">
          <img
            src="https://images.unsplash.com/photo-1586779161010-e38df9288a27?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Your Photo"
          />
        </div>

        <div class="hexagon">
          <img
            src="https://images.unsplash.com/photo-1647951165970-6089cc393ae2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Your Photo"
          />
        </div>

        <div class="hexagon">
          <img
            src="https://images.unsplash.com/photo-1586616780827-13166a8d449b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Your Photo"
          />
        </div>
      </div> */}
    </div>
  );
};

export default CarouselComponent;
