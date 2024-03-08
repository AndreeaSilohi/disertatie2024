import Navbar from "../navbar/Navbar";
import background from "../assets/background.jpg"


import React from "react";
function Contact(){
    return (
        <div className="container">
            <div className="navbar">
            <Navbar />
            </div>
         <img className="background" src={background}></img>
        </div>
    );
}

export default Contact;