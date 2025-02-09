"use client";
import Image from "next/image";
import config from "../../../next.config.mjs";

export default function ResetButton({ setShowEditor }) {
  return (
    <button
      onClick={() => setShowEditor(false)}
      className="home-button"
      style={{ top: "2rem", right: "5rem" }}
      title="Reset Canvas"
    >
      <Image
        src={`${config.basePath}/reset.svg`}
        width={20}
        height={20}
        alt="Reset"
      />
    </button>
  );
}
