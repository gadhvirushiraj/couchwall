"use client";
import { useState } from "react";
import Image from "next/image";
import config from "../../../next.config.mjs"

export default function HelpButton() {
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts = [
    { key: "Delete/Backspace", action: "Remove selected frame" },
    { key: "Click + Drag", action: "Move frame" },
    { key: "Corner Drag", action: "Resize frame" },
    { key: "Click", action: "Select frame" },
  ];

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className="home-button"
        style={{ top: '2rem', right: '2rem' }}
        title="Show Help"
      >
        <Image
          src={`${config.basePath}/help.svg`}
          width={20}
          height={20}
          alt="Help"
        />
      </button>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black border border-gray-800 p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Keyboard Shortcuts</h2>
            <div className="space-y-4">
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center text-lg text-white py-2 border-b border-gray-800 last:border-0"
                >
                  <span className="font-medium">{shortcut.action}</span>
                  <kbd className="px-4 py-1.5 bg-gray-800 text-accent shadow-inner font-mono text-sm">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
