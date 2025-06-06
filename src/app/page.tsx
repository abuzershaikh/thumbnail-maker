
import ContactHarvester from '@/components/contact-harvester';

export default function HomePage() {
  return (
    <main className="container mx-auto py-8 px-4 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-2xl">
        <ContactHarvester />
      </div>
    </main>
  );
}
