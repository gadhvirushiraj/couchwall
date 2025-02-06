"use client";
import React from "react";

const UploadPopup = ({ frameId, onFileChange, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-[1050]"
      onClick={onClose} 
    >
      <div
        className="bg-black border border-gray-800 p-8 max-w-md w-full mx-4 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Upload Poster Image</h2>

        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e, frameId)}
            className="block w-full text-lg text-white
            file:mr-4 file:py-2 file:px-4 
            file:border-0 
            file:text-black file:font-medium 
            file:bg-accent
            file:transition-colors file:duration-200"
          />
        </div>
      </div>
    </div>
  );
}

export default UploadPopup;
