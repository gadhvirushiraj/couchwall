import config from "../../../next.config.mjs";

export default function StaticGrid({ frames }) {
  return (
    <div className="relative w-[1440px] h-[800px] overflow-hidden bg-white">
      {/* Grid Container (top 60%) */}
      <div className="absolute top-0 left-0 w-full h-[60%] overflow-hidden z-0">
        {frames.map((frame, index) => {
          const left = frame.x + 720; // X: [-720 ↔ +720] → [0 ↔ 1440]
          const top = frame.y + 240; // Y: [-240 ↔ +240] → [0 ↔ 480] (60% of 800)

          return (
            <div
              key={index}
              className="absolute border-[5px] border-black bg-accent"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${frame.width}px`,
                height: `${frame.height}px`,
              }}
            />
          );
        })}
      </div>

      {/* Couch Container (bottom 40%) */}
      <div className="absolute bottom-0 w-full h-[40%] z-1">
        <img
          src={`${config.basePath}/couch.svg`}
          alt="Couch"
          draggable="false"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[1000px] h-auto"
        />
      </div>
    </div>
  );
}
