import React from "react";
import "../styles/HomePage.css";
import Card from "./Card";
import "../styles/Card.css";


const HomePage = () => {
  return (
    <div className="home-container">
      <Card
        title={"Welcome to Our Restaurant!"}
        description={
          "this is some filler inforamtion about the website to test the layout and more."
        }
      ></Card>
      <Card
        title={"This is where an image will go!"}
        description={"this is some more filler to see"}
      ></Card>
    </div>
  );
};

export default HomePage;
