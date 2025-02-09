import domtoimage from "dom-to-image";

export const downloadGridLayout = async () => {
  const element = document.getElementById("grid-container");

  // Check if grid container exists and has content
  if (!element) {
    alert("Nothing to download! Please add items to the grid first.");
    return;
  }

  try {
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1.0,
      bgcolor: "#ffffff",
      width: element.offsetWidth, // Ensure the width is set properly
      height: element.offsetHeight, // Ensure the height is set properly
    });

    const image = new Image();
    image.src = dataUrl;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size to exactly match the image size
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Draw the full image onto the canvas (no cropping)
      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

      ctx.font = "30px Times";
      ctx.fillStyle = "#FFA500";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const watermarkText = "Made with CouchWall";
      const x = (5 * canvas.width) / 6;
      const y = canvas.height - 30;

      ctx.fillText(watermarkText, x, y);

      const finalDataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = "couch_wall.png";
      link.href = finalDataUrl;
      link.click();
    };
  } catch (error) {
    console.error("Error capturing image:", error);
  }
};
