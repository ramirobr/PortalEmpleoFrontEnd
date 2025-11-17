import Image from "next/image";

export default function Banner() {
  return (
    <div className="relative w-full h-32 md:h-40 lg:h-48 flex items-center justify-center mb-6">
      <Image
        src="/banner.png"
        alt="Banner background"
        fill
        priority
        className="object-cover absolute"
      />
      <div className="absolute inset-0 bg-black opacity-60 flex flex-col items-center justify-center z-0"></div>
      <div className="container z-10 text-center">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
          Banner
        </h1>
      </div>
    </div>
  );
}
