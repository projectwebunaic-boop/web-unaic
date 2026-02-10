import HeroSection from "@/components/shared/HeroSection";
import ProgramCard from "@/components/faculty/ProgramCard";
import FacultyFeatures from "@/components/faculty/FacultyFeatures";
import DeanMessage from "@/components/faculty/DeanMessage";
import VisionMission from "@/components/faculty/VisionMission";
import FacilityHighlights from "@/components/faculty/FacilityHighlights";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
    params: { locale: string };
}

export default async function BusinessFacultyPage({ params }: Props) {
    const { locale } = await params;
    const isEn = locale === 'en';

    const faculty = await prisma.faculty.findUnique({
        where: { key: 'business' },
        include: {
            programs: true,
            facilities: { orderBy: { order: 'asc' } },
            dean: true
        }
    });

    if (!faculty) return notFound();

    // Parse missions (stored as JSON)
    const missionsRaw = isEn ? faculty.missionsEn : faculty.missions;
    let missions: string[] = [];
    if (missionsRaw) {
        try {
            const parsed = JSON.parse(missionsRaw);
            missions = Array.isArray(parsed) ? parsed : (typeof parsed === 'string' ? JSON.parse(parsed) : []);
        } catch (e) {
            console.error("Failed to parse missions", e);
        }
    }

    const facilities = faculty.facilities.map((f) => ({
        title: (isEn ? f.titleEn : f.title) || f.title || "",
        description: (isEn ? f.descriptionEn : f.description) || f.description || "",
        image: f.image || "/images/fasilitas/lab.jpg"
    }));

    return (
        <main className="bg-gray-50 pb-20">
            <HeroSection
                title={isEn ? (faculty.nameEn || faculty.name) : faculty.name}
                subtitle={(isEn ? faculty.deanMessageEn : faculty.deanMessage) || ""}
                backgroundImage={faculty.heroImage || "/images/hero/hero-business.jpg"}
            />

            <div className="container mx-auto px-4 md:px-8 -mt-10 relative z-20">
                <FacultyFeatures />
            </div>

            <DeanMessage
                facultyName={isEn ? (faculty.nameEn || faculty.name) : faculty.name}
                name={faculty.dean?.name || faculty.deanName || ""}
                title={(isEn ? faculty.deanTitleEn : faculty.deanTitle) || ""}
                message={(isEn ? faculty.deanMessageEn : faculty.deanMessage) || ""}
                image={faculty.dean?.image || faculty.deanImage || "/images/pimpinan/dekan3.png"}
            />

            <VisionMission
                vision={(isEn ? faculty.visionEn : faculty.vision) || ""}
                missions={missions}
            />

            <FacilityHighlights
                facilities={facilities}
            />

            <div className="container mx-auto px-4 md:px-8 py-12">
                {/* Programs Grid */}
                <section id="prodi">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-extrabold text-unaicNavy">
                                {isEn ? "Study Programs" : "Program Studi"}
                            </h2>
                            <p className="text-gray-500 font-medium max-w-2xl text-lg">
                                {isEn
                                    ? "Preparing professional and ethical business leaders to face the challenges of the global digital economy."
                                    : "Mempersiapkan pemimpin bisnis yang profesional dan beretika untuk menghadapi tantangan ekonomi digital global."
                                }
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="bg-unaicGold/20 text-unaicGold px-4 py-2 rounded-full font-bold text-sm border border-unaicGold/30">
                                {faculty.programs.length} {isEn ? "Programs" : "Program"}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {faculty.programs.map((program, idx: number) => (
                            <ProgramCard
                                key={program.id}
                                index={idx}
                                name={isEn ? (program.nameEn || program.name) : program.name}
                                slug={program.slug}
                                facultySlug={faculty.slug}
                                level={program.level || ""}
                                accreditation={program.accreditation || "Baik"}
                                description={isEn ? (program.descriptionEn || program.description) : program.description}
                                duration={isEn ? (program.durationEn || program.duration) : program.duration}
                                degree={isEn ? (program.degreeEn || program.degree) : program.degree}
                                iconName={program.icon}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
