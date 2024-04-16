import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import './About.css';

function About() {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  const handleScroll = () => {
    const scrollOffset = window.scrollY;
    const opacity = Math.max(0, 1 - scrollOffset / 900); // Adjust the value (400) based on when you want the image to disappear
    setScrollOpacity(opacity);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <header className="header-about">
        <div className="container-about">
          <div className="div-photo">
            <h1 className="h1-title-about">Despre noi</h1>
          </div>
        </div>
      </header>

      <div className="about-us">
        <div className="text-title">
          <div className="about-us-grid-item">
            După o experiență de peste 30 de ani în creșterea albinelor și
            folosirea produselor stupului în scopul prevenirii sau tratării unor
            afecțiuni medicale, ne punem la dispoziția dumneavoastră pentru a
            profita de cunoștințele acumulate în acest interval de timp.
          </div>
        </div>

        <div className="about-us-grid-container-left">
          <div className="about-us-grid-item-left">
            Magazinul nostru online ofera o gama variata de produse, cum ar fi
            mierea de albine, siropuri pentru raceala si gripa, dar si pentru
            imunitate. Mierea este disponibila in diferite varietati, cum ar fi
            mierea de tei, de salcam, poliflora si de rapita.
          </div>
          <div className="grid-item-img-left">
            <img
              alt="text"
              src="https://cdn.pixabay.com/photo/2013/11/07/08/05/honey-206907_640.jpg"
            ></img>
          </div>
        </div>

        <div className="about-us-grid-container-right">
          <div className="grid-item-img-right">
            <img
              alt="text"
              src="https://cdn.pixabay.com/photo/2015/09/15/20/05/beekeeper-941688_640.jpg"
            ></img>
          </div>
          <div className="about-us-grid-item-right">
            Apicultorii care se ocupa de prepararea mierii si a produselor
            derivate au o experienta de aproximativ 20 de ani cu albinele si in
            prepararea mierii. Daca interesul dumneavoastra pentru produsele
            apicole a fost starnit, va invitam si pe canalele noastre de
            Facebook, TikTok si Instagram pentru a ne urmari activitatea.
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
}

export default About;
