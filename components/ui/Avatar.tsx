interface AvatarProps {
  name: string;
}

export default function Avatar({
  name,
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
      {initials}
    </div>
  );
}