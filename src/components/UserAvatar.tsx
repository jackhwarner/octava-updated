
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  name?: string | null;
  src?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8 text-base",
  md: "w-10 h-10 text-xl",
  lg: "w-28 h-28 text-2xl",
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  const words = name.trim().split(" ").filter(Boolean);
  if (words.length === 1) {
    // Use first 2 chars for single-word names
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const UserAvatar = ({ name, src, className = "", size = "md" }: UserAvatarProps) => (
  <Avatar className={`${sizeClasses[size]} flex-shrink-0 ${className}`}>
    {src ? (
      <AvatarImage src={src} alt={name ?? "User"} />
    ) : null}
    <AvatarFallback className="bg-gray-300 text-gray-700 font-semibold flex items-center justify-center">
      {getInitials(name)}
    </AvatarFallback>
  </Avatar>
);

export default UserAvatar;
