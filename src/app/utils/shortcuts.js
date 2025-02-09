export const setupKeyboardShortcuts = ({
  selectedFrameId,
  frames,
  copiedFrame,
  setFrames,
  setSelectedFrameId,
  setCopiedFrame,
  extractLayout,
}) => {
  const handler = (e) => {
    // Delete handling
    if (e.key === "Backspace" && selectedFrameId !== null) {
      handleDeleteFrame(e);
    }

    // Layout extraction
    if ((e.ctrlKey || e.metaKey) && e.key === "j") {
      e.preventDefault();
      extractLayout();
    }

    // Copy frame (Ctrl+C)
    if ((e.ctrlKey || e.metaKey) && e.key === "c") {
      handleCopyFrame(e);
    }

    // Paste frame (Ctrl+V)
    if ((e.ctrlKey || e.metaKey) && e.key === "v") {
      handlePasteFrame(e);
    }
  };

  const handleDeleteFrame = (e) => {
    const selectedFrame = frames.find((f) => f.id === selectedFrameId);
    if (!selectedFrame) return;

    if (selectedFrame.imageUrl) {
      setFrames((prev) =>
        prev.map((frame) =>
          frame.id === selectedFrameId
            ? { ...frame, imageUrl: null, fileName: null }
            : frame
        )
      );
    } else {
      setFrames((prev) => prev.filter((f) => f.id !== selectedFrameId));
      setSelectedFrameId(null);
    }
  };

  const handleCopyFrame = (e) => {
    e.preventDefault();
    if (selectedFrameId) {
      const frameToCopy = frames.find((f) => f.id === selectedFrameId);
      if (frameToCopy) {
        const { imageUrl, fileName, ...frameConfig } = frameToCopy;
        setCopiedFrame(frameConfig);
      }
    }
  };

  const handlePasteFrame = (e) => {
    e.preventDefault();
    if (copiedFrame) {
      const newFrame = {
        ...copiedFrame,
        id: Date.now(),
        x: copiedFrame.x + 10,
        y: copiedFrame.y + 10,
        imageUrl: null,
        fileName: null,
      };

      setFrames((prev) => [...prev, newFrame]);
      setSelectedFrameId(newFrame.id);
    }
  };

  // Add event listener and return cleanup
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
};
