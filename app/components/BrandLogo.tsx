import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  priority?: boolean;
  onDark?: boolean;
  className?: string;
}

/**
 * The supplied PNG is transparent with navy text, so it needs a light backing
 * wherever the surface is dark: always in the footer (onDark), and in dark theme
 * elsewhere via the .brand-logo rule in globals.css.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  priority = false,
  onDark = false,
  className = "",
}) => {
  return (
    <span
      className={`brand-logo inline-flex items-center rounded-lg shrink-0 ${
        onDark ? "bg-[#F8FAF7] px-2 py-1" : ""
      } ${className}`}
    >
      <Image
        src="/brand/vowsync-logo.png"
        alt="VowSync SalingPaham"
        width={114}
        height={40}
        priority={priority}
        className="h-9 w-auto"
      />
    </span>
  );
};
