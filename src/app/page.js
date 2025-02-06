"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ControlButtons from "./components/ControlButtons";
import Grid from "./components/Grid";
import ResetButton from "./components/ResetButton";
import HelpButton from "./components/HelpButton";
import DeviceWarning from "./components/DeviceWarning";

export default function Home() {
  const [frames, setFrames] = useState([]);
  const [selectedFrameId, setSelectedFrameId] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Load preset on component mount
  useEffect(() => {
    const loadInitialPreset = async () => {
      try {
        const response = await fetch("/presets/preset1.json");
        if (!response.ok) throw new Error("Failed to load preset");

        const presetData = await response.json();
        const presetFrames = presetData.frames.map((frame, index) => ({
          id: Date.now() + index,
          x: frame.x,
          y: frame.y,
          width: frame.width,
          height: frame.height,
          fileName: frame.fileName,
          imageUrl: `/presets/preset1/${frame.fileName}`,
        }));

        setFrames(presetFrames);
      } catch (error) {
        console.error("Preset loading error:", error);
      }
    };

    loadInitialPreset();
  }, []);

  const extractLayout = () => {
    const layout = {
      frames: frames.map((frame) => ({
        x: frame.x,
        y: frame.y,
        width: frame.width,
        height: frame.height,
        fileName: frame.fileName || null,
      })),
    };
    console.log("Clean Layout:", JSON.stringify(layout, null, 2));
    return layout;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace" && selectedFrameId !== null) {
        setFrames((prev) =>
          prev.filter((frame) => frame.id !== selectedFrameId)
        );
        setSelectedFrameId(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        extractLayout();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFrameId, frames]);

  const addFrame = () => {
    const defaultWidth = 100;
    const defaultHeight = 150;
    const centerX = 0;
    const centerY = 0;

    setFrames((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: centerX,
        y: centerY,
        width: defaultWidth,
        height: defaultHeight,
        fileName: null,
        imageUrl: null,
      },
    ]);
  };

  const updateFramePosition = (id, x, y, width, height, imageUrl, fileName) => {
    setFrames((prev) => {
      if (imageUrl) {
        return prev.map((frame) =>
          frame.id === id ? { ...frame, imageUrl, fileName } : frame
        );
      }

      const updatedFrame = {
        ...prev.find((f) => f.id === id),
        x,
        y,
        width,
        height,
      };

      return prev.map((frame) => (frame.id === id ? updatedFrame : frame));
    });
  };

  return (
    <>
      <DeviceWarning />
      <main className="min-h-screen relative">
        {showBanner ? (
          <div className="flex h-screen">
            {/* Left Banner */}
            <div className="w-1/5 ml-8 bg-accent flex flex-col justify-between">
              <div className="pt-20 px-8">
                <h1 className="text-4xl font-bold mb-2">Imagine your Wall,</h1>
                <h2 className="text-4xl font-bold">Create your Story</h2>
                <button
                  onClick={() => setShowBanner(false)}
                  className="bg-black text-white text-xl my-24 px-6 py-2 flex items-center gap-2"
                >
                  Explore Now
                  <Image
                    src="/arrow.svg"
                    width={20}
                    height={20}
                    alt="Arrow"
                    style={{ filter: "invert(1)" }}
                  />
                </button>
              </div>
              <div className="pb-12 px-8">
                <div className="mt-4 flex justify-center">
                  <Image
                    src="/couch_wall_logo.svg"
                    width={100}
                    height={50}
                    alt="Arrow"
                  />
                </div>
              </div>
            </div>

            {/* Right Preview */}
            <div className="w-4/5 r-8">
              <div className="relative h-full">
                <div className="absolute bottom-0 w-full h-[40vh] z-0">
                  <img
                    src="/couch.svg"
                    alt="Couch"
                    draggable="false"
                    style={{
                      padding: "20px",
                      position: "absolute",
                      bottom: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "1000px",
                      height: "auto",
                    }}
                  />
                </div>
                <div className="relative h-[60vh] w-full overflow-hidden z-1">
                  <Grid
                    frames={frames}
                    updateFramePosition={updateFramePosition}
                    setSelectedFrameId={setSelectedFrameId}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Full editor view after clicking "Explore Now"
          <div className="w-full">
            <div className="absolute top-4 left-4">
              <ControlButtons addFrame={addFrame} />
            </div>
            <div className="absolute top-4 right-4">
              <ResetButton setFrames={setFrames} />
              <HelpButton />
            </div>
            <div className="absolute bottom-0 w-full h-[40vh] z-0">
              <img
                src="/couch.svg"
                alt="Couch"
                draggable="false"
                style={{
                  padding: "20px",
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "1000px",
                  height: "auto",
                }}
              />
            </div>
            <div
              id="grid-container"
              className="relative h-[60vh] w-full overflow-hidden z-1"
            >
              <Grid
                frames={frames}
                updateFramePosition={updateFramePosition}
                setSelectedFrameId={setSelectedFrameId}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
