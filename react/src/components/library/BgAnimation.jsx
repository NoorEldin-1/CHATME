import { useMemo } from "react";

const BgAnimation = () => {
  // Memoize box shadows to prevent recalculation on every render
  const starsBoxShadow = useMemo(() => generateBoxShadows(700, 1), []);
  const stars2BoxShadow = useMemo(() => generateBoxShadows(200, 2), []);
  const stars3BoxShadow = useMemo(() => generateBoxShadows(100, 3), []);

  return (
    <div className="absolute w-full h-screen overflow-hidden bg-gradient-to-b from-blue-950 to-black/75">
      {/* Single star elements with pre-calculated shadows */}
      <div
        className="absolute h-[1px] w-[1px] animate-star-movement bg-transparent"
        style={{ boxShadow: starsBoxShadow }}
      ></div>
      <div
        className="absolute h-[2px] w-[2px] animate-star-movement-medium bg-transparent"
        style={{ boxShadow: stars2BoxShadow }}
      ></div>
      <div
        className="absolute h-[3px] w-[3px] animate-star-movement-slow bg-transparent"
        style={{ boxShadow: stars3BoxShadow }}
      ></div>
    </div>
  );
};

// Optimized box shadow generation
function generateBoxShadows(n) {
  const shadows = [];
  const limit = 2000; // Viewport limit

  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * limit);
    const y = Math.floor(Math.random() * limit);
    shadows.push(`${x}px ${y}px #FFF`);
  }

  return shadows.join(", ");
}

export default BgAnimation;
