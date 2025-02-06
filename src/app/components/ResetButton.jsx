"use client";
import Image from "next/image";
import config from "../../../next.config.mjs";

export default function ResetButton({ setFrames }) {
  return (
    <button
      onClick={() => setFrames([])}
      className="home-button"
      style={{ top: '2rem', right: '5rem' }}
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
