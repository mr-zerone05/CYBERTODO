import React from "react";

export const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* logo from public folder - served at root in Vite */}
      <a href="/" className="inline-flex items-center">
        <img
          src="/CYBER_logo.png"
          alt="CYBERTODO"
          className="h-20 sm:h-24 md:h-32 lg:h-36 object-contain"
        />
      </a>

      <p className="text-muted-foreground text-center">
        Không có việc gì khó, chỉ sợ mình không làm !
      </p>
    </div>
  );
};

export default Header;