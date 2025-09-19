const BgAnimation = () => {
  return (
    <div className="absolute w-full h-screen overflow-hidden bg-gradient-to-b from-blue-950 to-black/75">
      <div
        id="stars"
        className="absolute h-[1px] w-[1px] animate-star-movement bg-transparent"
      ></div>
      <div
        id="stars2"
        className="absolute h-[2px] w-[2px] animate-star-movement-medium bg-transparent"
      ></div>
      <div
        id="stars3"
        className="absolute h-[3px] w-[3px] animate-star-movement-slow bg-transparent"
      ></div>

      <style>{`
        #stars {
          box-shadow: ${generateBoxShadows(700, 1)};
          animation-duration: 50s;
        }

        #stars:after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${generateBoxShadows(700, 1)};
        }

        #stars2 {
          box-shadow: ${generateBoxShadows(200, 2)};
          animation-duration: 100s;
        }

        #stars2:after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: ${generateBoxShadows(200, 2)};
        }

        #stars3 {
          box-shadow: ${generateBoxShadows(100, 3)};
          animation-duration: 150s;
        }

        #stars3:after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: ${generateBoxShadows(100, 3)};
        }

        @keyframes starMovement {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-2000px);
          }
        }

        .animate-star-movement {
          animation: starMovement 50s linear infinite;
        }

        .animate-star-movement-medium {
          animation: starMovement 100s linear infinite;
        }

        .animate-star-movement-slow {
          animation: starMovement 150s linear infinite;
        }
      `}</style>
    </div>
  );
};

function generateBoxShadows(n) {
  let value = "";
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    value += `${x}px ${y}px #FFF${i < n - 1 ? ", " : ""}`;
  }
  return value;
}

export default BgAnimation;
