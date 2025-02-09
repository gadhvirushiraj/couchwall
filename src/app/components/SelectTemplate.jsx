"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import config from "../../../next.config.mjs";
import StaticGrid from "./StaticGrid";

export default function SelectTemplate({ onTemplateSelect }) {
  const [showTemplates, setShowTemplate] = useState(false);
  const [showApplyTemplate, setApplyTemplate] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Number of Frame (All)");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [filteredConfigs, setFilteredConfigs] = useState([]);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.basePath}/api/template_data`);
        const data = await response.json();
        setTemplates(data);
        setFilteredConfigs(processTemplates(data, selectedOption));
      } catch (error) {
        console.error("Error loading templates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplates();
  }, []);

  const processTemplates = (templates, selected) => {
    if (selected === "Number of Frame (All)") {
      const allConfigs = templates.flatMap((t) => t.configs);
      return shuffleArray([...allConfigs]);
    }
    return templates.find((t) => t.template === selected)?.configs || [];
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setFilteredConfigs(processTemplates(templates, option));
    setDropdownOpen(false);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplateData) {
      onTemplateSelect(selectedTemplateData);
      setShowTemplate(false);
      setSelectedTemplateData(null);
      setApplyTemplate(false);
    }
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <>
      <button
        onClick={() => setShowTemplate(true)}
        className="grid-button flex items-center space-x-2"
      >
        <span>Select a Template</span>
        <Image
          src={`${config.basePath}/arrow.svg`}
          width={20}
          height={20}
          alt="Arrow"
        />
      </button>
      {showTemplates && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-20 backdrop-blur-sm p-20 flex justify-center items-center z-[1050]">
          <div className="bg-black p-8 w-[70vw] relative shadow-2xl">
            {/* Filter Section */}
            <div className="flex gap-4 justify-start relative text-lg">
              {/* Dropdown Container */}
              <div className="relative w-[270px] ">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full border border-white text-left"
                >
                  <div className="flex justify-between items-center px-6 py-2">
                    <span className="text-white truncate">
                      {selectedOption}
                    </span>
                    <Image
                      src={`${config.basePath}/arrow.svg`}
                      width={25}
                      height={25}
                      alt="Arrow"
                      className={`transition-transform ${
                        dropdownOpen ? "" : "rotate-180"
                      }`}
                      style={{ filter: "invert(1)" }}
                    />
                  </div>
                </button>

                {/* Dropdown Options */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-black border border-white mt-2 shadow-lg max-h-[200px] text-white overflow-y-auto z-30">
                    <div
                      key="all"
                      onClick={() =>
                        handleOptionChange("Number of Frame (All)")
                      }
                      className="cursor-pointer hover:bg-accent hover:text-black px-4 py-2"
                    >
                      Number of Frame (All)
                    </div>
                    {templates.map((template, index) => (
                      <div
                        key={index}
                        onClick={() => handleOptionChange(template.template)}
                        className="cursor-pointer hover:bg-accent hover:text-black px-4 py-2"
                      >
                        {template.template}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {showApplyTemplate && (
                <button
                  className={`bg-accent px-4 text-black gap-2 ${
                    !selectedTemplateData ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleApplyTemplate}
                  disabled={!selectedTemplateData}
                >
                  Apply Template
                </button>
              )}
            </div>
            {/* Close Button */}
            <button
              onClick={() => setShowTemplate(false)}
              className="absolute top-4 right-4"
            >
              <Image
                src={`${config.basePath}/cross.svg`}
                width={30}
                height={30}
                alt="Close"
              />
            </button>

            {/* {isLoading && (
              <div className="p-4 text-center">Loading template...</div>
            )} */}

            {/* Scrollable Grid */}
            <div className="mt-2 overflow-y-auto h-[55vh] z-0">
              <div className="grid grid-cols-3 gap-2 mt-4">
                {filteredConfigs.map((config) => (
                  <div
                    key={config.id}
                    className={`cursor-pointer flex items-center justify-center ${
                      selectedTemplateData?.id === config.id
                        ? "border-2 border-accent hover:scale-0"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedTemplateData(config), setApplyTemplate(true);
                    }}
                  >
                    <div className="max-w-[300px] max-h-[180px] overflow-hidden flex items-center justify-center hover:scale-105">
                      <div className="transform scale-[0.2]">
                        <StaticGrid frames={config.frames} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
