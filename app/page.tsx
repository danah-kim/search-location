'use client';
import dynamic from 'next/dynamic';
const DynamicMapComponent = dynamic(() => import('@/components/map-component'), { ssr: false });

export default function Home() {
  return (
    <main>
      <DynamicMapComponent />
    </main>
  );
}
