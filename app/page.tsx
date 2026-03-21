import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
      <main>
        <Link href="/movie/search">Search Movies</Link>
      </main>
  );
}
