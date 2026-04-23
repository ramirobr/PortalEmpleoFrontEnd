import Image from "next/image";

type UserAvatarProps = {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string; // Allow additional classes for container
  imageClassName?: string; // Allow additional classes for image if needed
};

export default function UserAvatar({
  src,
  alt = "Profile",
  size = 120,
  className = "",
  imageClassName = "",
}: UserAvatarProps) {
  // Use a default image if src is missing or empty
  const imageSrc = src || "/profile.jpg";

  return (
    <div
      className={`rounded-full bg-gray-200 overflow-hidden flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={size}
        height={size}
        className={`object-cover w-full h-full ${imageClassName}`}
      />
    </div>
  );
}
