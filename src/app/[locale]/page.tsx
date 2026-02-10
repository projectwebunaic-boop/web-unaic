import Hero from "@/components/home/Hero";
import ServicesBar from "@/components/home/ServicesBar";
import About from "@/components/home/About";
import Faculty from "@/components/home/Faculty";
import Stats from "@/components/home/Stats";
import Gallery from "@/components/home/Gallery";
import Testimonials from "@/components/home/Testimonials";
import Partners from "@/components/home/Partners";
import News from "@/components/home/News";
import Contact from "@/components/home/Contact";
import JoinUs from "@/components/home/JoinUs";
import fs from "fs";
import path from "path";

import prisma from "@/lib/prisma";

// Function to get data (Server Side)
async function getHomepageData() {
  try {
    const dataDir = path.join(process.cwd(), 'src', 'data');

    // Helper to read JSON safely
    const readJson = (file: string) => {
      const p = path.join(dataDir, file);
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'));
      return null;
    };

    const homepage = readJson('homepage.json') || {};
    const alumni = readJson('alumni.json') || {};
    const partners = readJson('partners.json') || {};
    const news = readJson('news.json') || [];

    // Also fetch faculties from DB
    const dbFaculties = await prisma.faculty.findMany({
      include: {
        programs: true
      },
      orderBy: { name: 'asc' }
    });

    return {
      homepage,
      alumni,
      partners,
      news,
      dbFaculties
    };
  } catch (e) {
    console.error("Failed to load homepage data", e);
  }
  return null;
}

interface Props {
  params: { locale: string };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const data = await getHomepageData();
  const hp = data?.homepage || {};
  const faculties = data?.dbFaculties || [];

  return (
    <>
      <Hero data={hp.hero} />
      <ServicesBar data={hp.services} />
      <About data={hp.about} />
      <Faculty data={hp.faculty} dbFaculties={faculties} />
      <Stats data={hp.stats} />
      <Gallery data={hp.gallery} />
      <Testimonials data={hp.testimonials} items={data?.alumni?.featured || []} />
      <Partners data={hp.partners} items={data?.partners?.items || []} />
      <News data={hp.news} newsItems={data?.news || []} />
      <JoinUs data={hp.joinUs} />
      <Contact />
    </>
  )
}
