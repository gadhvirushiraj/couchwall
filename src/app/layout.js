import "./globals.css";

export const metadata = {
  title: "CouchWall",
  description:
    "CouchWall is an intuitive drag-and-drop tool for perfect wall-art placements. Visualize, style, and perfect your wall with confidence before you hang!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
