import React from "react";
import { Box } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../navbar/Navbar";

import "./Curiosities.css";
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

  return (
    <div className="curiosities-container">
      <div>
        <Navbar />
      </div>
      <div className="carusel">
        <Box width="100%">
          <Slider {...settings} style={{ width: "100%" }} autoPlay={true}>
            <div>
              {/* Your content for the first slide */}
              <img
                src="https://cdn.pixabay.com/photo/2021/09/11/16/00/beehives-6615952_640.jpg"
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
        </Box>
      </div>

      <div className="curiosity-one">
        <div className="image-curiosity-one">
          <img src="https://apicultura-online.com/wp-content/uploads/2016/01/albina-conservata-in-chihlimbar.jpg"></img>
        </div>
        <div className="text-curiosity-one">
          <h1>
            Cea mai „batrana” albina cunoscuta de cercetatori are 100 de
            milioane de ani. Este conservata in chihlimbar si a fost descoperita
            in Myanmar (Birmania).
          </h1>
        </div>
      </div>

      <div className="curiosity-two">
        <div className="image-curiosity-two">
          <img className="img-curiosity-two"src="https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRfS2w5anaI47eInFIcho49fd4SlVecTgBlDhxeS7Dehd84jUyC38OG6xUZcMkDUdi8"></img>
        </div>
        <div className="text-curiosity-two">
          <h1>
            După ce matca depune un ou într-o alveolă, durează 21 de zile ca să
            se nască albina. În aceste 21 de zile albina are trei stadii de
            dezvoltare : ou , larvă şi nimfă. D
          </h1>
          <h1>De-a lungul vieţii, albina
            munceşte în continuu, în funcţie de vârstă. În primele 20 de zile,
            albina lucrătoare execută tot felul de lucrări în stup, iar în
            ultimile 15 zile ale vieţii devine albină culegătoare. Chiar în
            ultimele zile de viaţă, albina de regulă rămâne în stup, ea muncind
            în continuare, până la ultima răsuflare.</h1>
        </div>
      </div>
    </div>
  );
};

export default CarouselComponent;
