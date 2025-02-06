export default function GuideLines({ frame, centerOffset }) {
    
    if (!frame || !centerOffset) return null;

    const left = frame.x + centerOffset.x;
    const top = frame.y + centerOffset.y;
    const right = left + frame.width;
    const bottom = top + frame.height;

    return (
      <>
        <div // Left line
          style={{
            position: "absolute",
            left: left - 1,
            top: 0,
            width: 1,
            height: "100%",
            backgroundColor: "orange",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
        <div // Right line
          style={{
            position: "absolute",
            left: right - 1,
            top: 0,
            width: 1,
            height: "100%",
            backgroundColor: "orange",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
        <div // Top line
          style={{
            position: "absolute",
            left: 0,
            top: top - 1,
            width: "100%",
            height: 1,
            backgroundColor: "orange",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
        <div // Bottom line
          style={{
            position: "absolute",
            left: 0,
            top: bottom - 1,
            width: "100%",
            height: 1,
            backgroundColor: "orange",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
      </>
    );
  };