import { useRef, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import UploadPopup from "./UploadPopup";
import GuideLines from "./GuideLines";

const GRID_SIZE = 10;
const MIN_SIZE = { width: 70, height: 70 };

export default function Grid({
  frames,
  updateFramePosition,
  setSelectedFrameId,
  selectedFrameId,
}) {
  const gridRef = useRef(null);
  const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });
  const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });
  const [activeFrame, setActiveFrame] = useState(null);
  const [uploadingFrame, setUploadingFrame] = useState(null);

  useEffect(() => {
    const updateGridSize = () => {
      if (gridRef.current) {
        setGridDimensions({
          width: gridRef.current.offsetWidth,
          height: gridRef.current.offsetHeight,
        });
        setCenterOffset({
          x: gridRef.current.offsetWidth / 2,
          y: gridRef.current.offsetHeight / 2,
        });
      }
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  const handleFileChange = (e, frameId) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      updateFramePosition(
        frameId,
        undefined,
        undefined,
        undefined,
        undefined,
        imgUrl,
        file.name
      );
    }
    setUploadingFrame(null);
  };

  const isOverlapping = (newFrame, existingFrames) => {
    return existingFrames.some(
      (frame) =>
        frame.id !== newFrame.id &&
        newFrame.x <= frame.x + frame.width &&
        newFrame.x + newFrame.width >= frame.x &&
        newFrame.y <= frame.y + frame.height &&
        newFrame.y + newFrame.height >= frame.y
    );
  };

  const validatePosition = (x, y, width, height) => {
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
    const snappedWidth = Math.max(
      MIN_SIZE.width,
      Math.round(width / GRID_SIZE) * GRID_SIZE
    );
    const snappedHeight = Math.max(
      MIN_SIZE.height,
      Math.round(height / GRID_SIZE) * GRID_SIZE
    );

    return {
      x: Math.max(
        -centerOffset.x,
        Math.min(snappedX, gridDimensions.width - snappedWidth - centerOffset.x)
      ),
      y: Math.max(
        -centerOffset.y,
        Math.min(
          snappedY,
          gridDimensions.height - snappedHeight - centerOffset.y
        )
      ),
      width: snappedWidth,
      height: snappedHeight,
    };
  };

  return (
    <div
      ref={gridRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedFrameId(null);
        }
      }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "calc(100% - 60px)",
        height: "calc(100% - 20px)",
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        // backgroundImage: `
        //   linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        //   linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
        // `,
        boxSizing: "border-box",
      }}
    >
      {frames.map((frame) => (
        <Rnd
          key={frame.id}
          size={{ width: frame.width, height: frame.height }}
          position={{
            x:
              (activeFrame?.id === frame.id ? activeFrame.x : frame.x) +
              centerOffset.x,
            y:
              (activeFrame?.id === frame.id ? activeFrame.y : frame.y) +
              centerOffset.y,
          }}
          bounds="parent"
          minWidth={MIN_SIZE.width}
          minHeight={MIN_SIZE.height}
          grid={[GRID_SIZE, GRID_SIZE]}
          enableResizing={{
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
          resizeHandleStyles={{
            top: { height: "15px" },
            right: { width: "15px" },
            bottom: { height: "15px" },
            left: { width: "15px" },
            topRight: { width: "15px", height: "15px" },
            bottomRight: { width: "15px", height: "15px" },
            bottomLeft: { width: "15px", height: "15px" },
            topLeft: { width: "15px", height: "15px" },
          }}
          onDragStart={() => setActiveFrame(frame)}
          onDrag={(e, { x, y }) => {
            const adjustedX = x - centerOffset.x;
            const adjustedY = y - centerOffset.y;
            const validated = validatePosition(
              adjustedX,
              adjustedY,
              frame.width,
              frame.height
            );
            setActiveFrame({ id: frame.id, ...validated });
          }}
          onDragStop={(e, { x, y }) => {
            const adjustedX = x - centerOffset.x;
            const adjustedY = y - centerOffset.y;
            const validated = validatePosition(
              adjustedX,
              adjustedY,
              frame.width,
              frame.height
            );
            const updatedFrame = { ...frame, ...validated };

            if (!isOverlapping(updatedFrame, frames)) {
              updateFramePosition(
                frame.id,
                validated.x,
                validated.y,
                validated.width,
                validated.height
              );
            }
            setActiveFrame(null);
          }}
          onResizeStart={() => setActiveFrame(frame)}
          onResize={(e, direction, ref, delta, { x, y }) => {
            const newWidth = parseInt(ref.style.width);
            const newHeight = parseInt(ref.style.height);
            const adjustedX = x - centerOffset.x;
            const adjustedY = y - centerOffset.y;
            const validated = validatePosition(
              adjustedX,
              adjustedY,
              newWidth,
              newHeight
            );
            setActiveFrame({ id: frame.id, ...validated });
          }}
          onResizeStop={(e, direction, ref, delta, { x, y }) => {
            const newWidth = parseInt(ref.style.width);
            const newHeight = parseInt(ref.style.height);
            const adjustedX = x - centerOffset.x;
            const adjustedY = y - centerOffset.y;
            const validated = validatePosition(
              adjustedX,
              adjustedY,
              newWidth,
              newHeight
            );

            if (!isOverlapping({ ...frame, ...validated }, frames)) {
              updateFramePosition(
                frame.id,
                validated.x,
                validated.y,
                validated.width,
                validated.height
              );
            }
            setActiveFrame(null);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setSelectedFrameId(frame.id);
          }}
          style={{
            background: "white",
            outline:
              selectedFrameId === frame.id
                ? "3px solid var(--accent)"
                : "3px solid black",
            padding: "5px",
            overflow: "hidden",
            zIndex: activeFrame?.id === frame.id ? 10 : 1,
          }}
        >
          {frame.imageUrl ? (
            <div className="w-full h-full relative select-none">
              <img
                crossOrigin="anonymous"
                src={frame.imageUrl}
                alt="Uploaded poster"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
                draggable="false"
              />
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadingFrame(frame.id);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-600 transition-colors"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 7V1a1 1 0 0 0-2 0v6H1a1 1 0 0 0 0 2h5v6a1 1 0 0 0 2 0V9h5a1 1 0 0 0 0-2H8z" />
              </svg>
            </button>
          )}
        </Rnd>
      ))}

      {activeFrame && centerOffset && (
        <GuideLines frame={activeFrame} centerOffset={centerOffset} />
      )}

      {uploadingFrame && (
        <UploadPopup
          frameId={uploadingFrame}
          onFileChange={(e) => handleFileChange(e, uploadingFrame)}
          onClose={() => setUploadingFrame(null)}
        />
      )}
    </div>
  );
}
