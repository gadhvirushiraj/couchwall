"use client";

import { useState } from "react";
import Image from "next/image";
import { downloadGridLayout } from "../utils/downloader";
import config from "../../../next.config.mjs";

export default function ControlButtons({ addFrame }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to handle button clicks
  const handleButtonClick = (action) => {
    // First execute the action
    action();
    // Then close the menu
    setIsExpanded(false);
  };

  return (
    <>
      {/* Main Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="home-button"
        style={{ top: "2rem", left: "2rem" }}
      >
        <Image
          src={`${config.basePath}/arrow.svg`}
          width={20}
          height={20}
          alt={isExpanded ? "Close" : "Expand"}
          style={{ filter: "invert(1)" }}
          className={`${isExpanded ? "rotate-180" : ""} transition-transform`}
        />
      </button>

      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mt-4 w-full flex flex-col gap-4 fixed top-[5rem] left-[2rem] z-50">
          {/* Add Frame Button */}
          <button
            type="button"
            onClick={() => handleButtonClick(addFrame)}
            className="exp-button"
          >
            Add Frame
          </button>

          {/* Download Layout Button */}
          <button
            type="button"
            onClick={() => handleButtonClick(() => downloadGridLayout())}
            className="exp-button"
          >
            Download Layout
          </button>

          {/* Buy Me a Coffee Button */}
          <div className="max-w-[220px] hover:scale-105 transition-transform">
            <a href="https://www.buymeacoffee.com/gadhvirushiraj">
              <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=gadhvirushiraj&button_colour=FFA500&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
