import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Post</h1>
      </div>
    </nav>
  );
};

export default Navbar;
