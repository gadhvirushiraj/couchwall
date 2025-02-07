export default function GuideLines({ frame, centerOffset }) {
    
  if (!frame || !centerOffset) return null;

  const borderWidth = 3
  const guideWidth = 2

  const left = frame.x + centerOffset.x - borderWidth - guideWidth;
  const top = frame.y + centerOffset.y - borderWidth - guideWidth;
  const right = left + frame.width + 2*(borderWidth + guideWidth);
  const bottom = top + frame.height + 2*(borderWidth + guideWidth);

  return (
    <>
      <div // Left line
        className="guide-line left-0 top-0 w-[2px] h-full"
        style={{
          left: left - 1,
        }}
      />
      <div // Right line
        className="guide-line left-0 top-0 w-[2px] h-full"
        style={{
          left: right - 1,
        }}
      />
      <div // Top line
        className="guide-line top-0 left-0 w-full h-[2px]"
        style={{
          top: top - 1,
        }}
      />
      <div // Bottom line
        className="guide-line top-0 left-0 w-full h-[2px]"
        style={{
          top: bottom - 1,
        }}
      />
    </>
  );
}
