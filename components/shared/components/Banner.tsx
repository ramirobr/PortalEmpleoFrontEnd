import Image from "next/image";

type BannerProps = {
  title?: string;
  source?: string;
  alt?: string;
};

export default function Banner({ title, source, alt }: BannerProps) {
  return (
    <div className="relative w-full h-32 lg:h-50 lg:h-65 flex items-center justify-center">
      <Image
        src={source || "/banner.png"}
        alt={alt || "Banner background"}
        fill
        priority
        className="object-cover absolute"
      />
      <div className="absolute inset-0 bg-zinc-950 opacity-60 flex flex-col items-center justify-center z-0"></div>
      <div className="container z-10 text-center">
        {title && (
          <h1 className="text-white text-3xl lg:text-4xl font-semibold mb-2">
            {title}
          </h1>
        )}
      </div>
    </div>
  );
}
