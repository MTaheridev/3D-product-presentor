import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import V3DApp from "./V3DApp";
import "./index.css";
import HomePage from "./home/home";

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  const [percentage, SetPercentage] = useState(0);

  const intervalId = setInterval(() => {
    const container = document.querySelector(".v3d-container");

    if (container) {
      const divElements = container.querySelectorAll("div");
      divElements.forEach((div) => {
        const anchorTag = div.querySelector("a");

        if (anchorTag) {
          anchorTag.style.right = "-200%";
          anchorTag.style.bottom = "-200%";
          clearInterval(intervalId);
        }
      });
    }
  }, 1);

  useEffect(() => {
    const container = document.querySelector(".v3d-simple-preloader-bar");
    const intervalLoadingId = setInterval(() => {
      if (container) {
        const percentageWidth = parseInt(
          container.style.width.replace("%", "")
        );
        SetPercentage(percentageWidth);
        if (percentageWidth >= 100) {
          clearInterval(intervalLoadingId);
        }
        console.log(container.style.width);
      }
    }, 10);
    return () => clearInterval(intervalLoadingId);
  }, []);


  return (
    <div className="relative w-full h-full">
      {/*MAMAD Attention: this is 3D Canvas*/}
      <V3DApp />

      <div className="relative pointer-events-none">
        {/*MAMAD Attention: write your code here*/}
        <HomePage percentage={percentage} />
      </div>
    </div>
  );
}

root.render(<App />);
