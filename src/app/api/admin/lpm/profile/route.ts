import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const profile = await prisma.lpmProfile.findFirst();

        if (!profile) {
            return NextResponse.json({
                about: "", aboutEn: "",
                vision: "", visionEn: "",
                mission: [], missionEn: [],
                mainDuties: "", mainDutiesEn: "",
                activityCycle: "[]", activityCycleEn: "[]"
            });
        }

        // Parse mission string to array for frontend
        let mission = [];
        let missionEn = [];
        try {
            if (typeof profile.mission === 'string') mission = JSON.parse(profile.mission);
            else if (Array.isArray(profile.mission)) mission = profile.mission;
        } catch (e) { mission = []; }

        try {
            if (typeof profile.missionEn === 'string') missionEn = JSON.parse(profile.missionEn);
            else if (Array.isArray(profile.missionEn)) missionEn = profile.missionEn;
        } catch (e) { missionEn = []; }

        return NextResponse.json({
            ...profile,
            mission,
            missionEn
        });
    } catch (error) {
        console.error("GET LPM Profile Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Explicitly map fields to avoid "Extra fields" error in Prisma
        const dataToSave = {
            about: body.about,
            aboutEn: body.aboutEn,
            vision: body.vision,
            visionEn: body.visionEn,
            mission: Array.isArray(body.mission) ? JSON.stringify(body.mission) : (body.mission || '[]'),
            missionEn: Array.isArray(body.missionEn) ? JSON.stringify(body.missionEn) : (body.missionEn || '[]'),
            mainDuties: body.mainDuties,
            mainDutiesEn: body.mainDutiesEn,
            activityCycle: body.activityCycle,
            activityCycleEn: body.activityCycleEn,
        };

        // Upsert (since singleton)
        const updated = await prisma.lpmProfile.upsert({
            where: { id: 1 },
            update: dataToSave,
            create: { id: 1, ...dataToSave }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("POST LPM Profile Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
