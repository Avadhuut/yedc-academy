import React from "react";
import Image from "next/image";

interface AvatarProps {
  fullName: string;
  profileImage?: string | null;
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({
  fullName,
  profileImage,
  size = "md",
}) => {
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const initials = getInitials(fullName);

  const sizeClasses = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-14 h-14 text-sm",
  };

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center font-extrabold select-none border border-gold/20 bg-gold/10 text-gold font-heading ${sizeClasses[size]}`}
    >
      {profileImage ? (
        <Image
          src={profileImage}
          alt={fullName}
          width={100}
          height={100}
          className="w-full h-full object-cover"
          unoptimized
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
export default Avatar;
