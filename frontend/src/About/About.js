import React, { useState, useEffect } from 'react';
import { FacebookLogo, InstagramLogo, TiktokLogo } from 'phosphor-react';
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

      <div className="content-div">
        <div className="content-left">
          {/* <p>WHAT ARE HONEYBEES 15 BEEKEEPING RULES</p> */}
          <img
            className="img-left"
            src="https://i.postimg.cc/vmVQWP1L/h2-img-3.jpg"
            alt="Your Photo"
          />
        </div>
        <div className="content-right">
          <p className="p-right">
            După o experiență de peste 20 de ani în creșterea albinelor și
            folosirea produselor stupului în scopul prevenirii sau tratării unor
            afecțiuni medicale, ne punem la dispoziția dumneavoastră pentru a
            profita de cunoștințele acumulate în acest interval de timp.
          </p>

          <p className="p-right">
            Magazinul nostru online ofera o gamă variată de produse, cum ar fi
            mierea de albine și propolisul. Mierea este disponibilă în diferite
            variante, cum ar fi mierea de tei, de salcâm, polifloră și de
            rapiță.
          </p>
          <div className="div-images-right">
            <img
              className="img-right"
              src="https://images.unsplash.com/photo-1586779161535-6f013a68389f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Your Photo"
            />
            <img
              className="img-right"
              src="https://images.unsplash.com/photo-1619457632358-702e130ceecc?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Your Photo"
            />
          </div>
        </div>
      </div>

      <div className="about-us-grid-item">
        <p>
          Apicultorii care se ocupa de prepararea mierii si a produselor
          derivate au o experienta de aproximativ 20 de ani cu albinele si in
          prepararea mierii. Daca interesul dumneavoastra pentru produsele
          apicole a fost starnit, va invitam si pe canalele noastre de Facebook,
          TikTok si Instagram pentru a ne urmari activitatea.
        </p>
        <div className="social-media">
          <div>
            <FacebookLogo size={40} style={{color:"#FFA500"}}/>
          </div>
          <div>
            <InstagramLogo size={40} style={{color:"#FFA500"}} />
          </div>
          <div>
            <TiktokLogo size={40}  style={{color:"#FFA500"}}/>
          </div>
        </div>
      </div>

      <div className="hexagon-container">
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
      </div>
    </div>
  );
}

export default About;
