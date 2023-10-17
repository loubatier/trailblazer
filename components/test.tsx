import React, { useState } from "react";

const HoverMenuButton: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleButtonMouseEnter = () => {
    setMenuOpen(true);
  };

  const handleButtonMouseLeave = () => {
    setMenuOpen(false);
  };

  const handleMenuItemClick = (message: string) => {
    console.log(message);
  };

  return (
    <div>
      <button
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
        Hover to Open Menu
      </button>

      {isMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "30px", // Adjust the positioning as needed
            left: "0", // Adjust the positioning as needed
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
          }}
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
        >
          <button onClick={() => handleMenuItemClick("Clicked on Menu Item 1")}>
            Menu Item 1
          </button>
          <button onClick={() => handleMenuItemClick("Clicked on Menu Item 2")}>
            Menu Item 2
          </button>
        </div>
      )}
    </div>
  );
};

export default HoverMenuButton;
