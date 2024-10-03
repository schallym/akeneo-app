import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image src="/CodingIllustration.svg" alt="dev in progress" width={500} height={500} className="mx-auto" />
      <p className="text-center">Dev in progress ...</p>
    </div>
  );
}
