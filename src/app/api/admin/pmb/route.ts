import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        let pmb = await prisma.pmbConfig.findUnique({
            where: { id: "singleton" },
        });

        if (!pmb) {
            pmb = await prisma.pmbConfig.create({
                data: { id: "singleton" },
            });
        }

        return NextResponse.json(pmb);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch PMB configuration" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Remove id and updatedAt if present to avoid errors
        delete data.id;
        delete data.updatedAt;

        const pmb = await prisma.pmbConfig.upsert({
            where: { id: "singleton" },
            update: data,
            create: { id: "singleton", ...data },
        });

        return NextResponse.json(pmb);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update PMB configuration" },
            { status: 500 }
        );
    }
}
