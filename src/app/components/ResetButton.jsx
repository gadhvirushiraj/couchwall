"use client";
import Image from "next/image";

export default function ResetButton({ setFrames }) {
  return (
    <button
      onClick={() => setFrames([])}
      className="home-button"
      style={{ top: '2rem', right: '5rem' }}
      title="Reset Canvas"
    >
      <Image
      src="/reset.svg"
      width={20}
      height={20}
      alt="Reset"
    />
    </button>
  );
}
