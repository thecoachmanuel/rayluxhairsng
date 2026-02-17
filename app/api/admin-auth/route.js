import { NextResponse } from "next/server";

export async function POST(request) {
	let body = null;
	try {
		body = await request.json();
	} catch (_error) {
	}
	const password = body && typeof body.password === "string" ? body.password : "";
	const expected = process.env.ADMIN_PANEL_PASSWORD;
	if (!expected) {
		return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 500 });
	}
	if (password && password === expected) {
		return NextResponse.json({ ok: true }, { status: 200 });
	}
	return NextResponse.json({ ok: false }, { status: 401 });
}

