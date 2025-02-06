"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import config from "../../../next.config.mjs"

export default function DeviceWarning() {
  const [warningType, setWarningType] = useState(null);

  // Screen size and orientation check
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width < 1000 && height < 1000) {
        setWarningType("smallScreen");
      } else if (width < 1000 && height > 1000) {
        setWarningType("rotate");
      } else {
        setWarningType(null);
      }
    };

    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (warningType === "smallScreen") {
    return (
      <div className="flex items-center justify-center min-h-screen text-black bg-accent text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Oops!</h1>
          <p className="text-xl px-10">
            This experience is best viewed on a larger screen. <br />
            Please switch to a bigger device to enjoy it fully!
          </p>
          <div className="mt-10 flex justify-center">
            <Image
              src={`${config.basePath}/couch_wall_logo.svg`}
              width={100}
              height={50}
              alt="Logo"
            />
          </div>
        </div>
      </div>
    );
  }

  if (warningType === "rotate") {
    return (
      <div className="flex items-center justify-center min-h-screen text-black bg-accent text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Rotate Your Device!</h1>
          <p className="text-2xl px-10">
            For the best experience, please rotate your device to landscape mode.
          </p>
          <div className="mt-10 flex justify-center">
            <Image
              src={`${config.basePath}/rotate.svg`}
              width={100}
              height={100}
              alt="Rotate Icon"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
