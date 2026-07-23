import { Resend } from "resend";
import { siteConfig } from "@/data/site";

type ContactPayload = {
	name?: string;
	email?: string;
	subject?: string;
	message?: string;
	website?: string;
};

const CONTACT_TO = siteConfig.email;
const CONTACT_FROM = process.env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 120;
const MAX_SUBJECT_LENGTH = 140;
const MAX_MESSAGE_LENGTH = 4000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 4;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
	return typeof value === "string" ? value.trim() : "";
}

function limit(value: string, maxLength: number) {
	return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function getClientKey(request: Request) {
	const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	const realIp = request.headers.get("x-real-ip")?.trim();

	return forwardedFor || realIp || "unknown";
}

function isRateLimited(key: string) {
	const now = Date.now();
	const current = rateLimit.get(key);

	if (!current || current.resetAt <= now) {
		rateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return false;
	}

	current.count += 1;
	rateLimit.set(key, current);

	return current.count > RATE_LIMIT_MAX;
}

function buildTextEmail({
	name,
	email,
	subject,
	message,
}: {
	name: string;
	email: string;
	subject: string;
	message: string;
}) {
	return [
		"New portfolio contact message",
		"",
		`Name: ${name}`,
		`Email: ${email}`,
		`Subject: ${subject}`,
		"",
		message,
	].join("\n");
}

function buildHtmlEmail({
	name,
	email,
	subject,
	message,
}: {
	name: string;
	email: string;
	subject: string;
	message: string;
}) {
	const safeName = escapeHtml(name);
	const safeEmail = escapeHtml(email);
	const safeSubject = escapeHtml(subject);
	const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

	return `<!doctype html>
<html>
	<body style="margin:0;background:#0b0b0b;padding:32px;font-family:Arial,sans-serif;color:#f4f1ea;">
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);border-radius:18px;background:#151515;">
			<tr>
				<td style="padding:28px 28px 18px;border-bottom:1px solid rgba(255,255,255,0.1);">
					<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c5a059;">Portfolio Contact</div>
					<h1 style="margin:10px 0 0;font-size:26px;line-height:1.15;color:#ffffff;">${safeSubject}</h1>
				</td>
			</tr>
			<tr>
				<td style="padding:24px 28px;">
					<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
						<tr>
							<td style="padding:0 0 12px;color:#9a9a9a;font-size:12px;text-transform:uppercase;letter-spacing:1.4px;">Name</td>
							<td style="padding:0 0 12px;text-align:right;color:#ffffff;font-size:14px;">${safeName}</td>
						</tr>
						<tr>
							<td style="padding:0 0 20px;color:#9a9a9a;font-size:12px;text-transform:uppercase;letter-spacing:1.4px;">Email</td>
							<td style="padding:0 0 20px;text-align:right;font-size:14px;"><a href="mailto:${safeEmail}" style="color:#c5a059;text-decoration:none;">${safeEmail}</a></td>
						</tr>
					</table>
					<div style="padding:18px 0 0;border-top:1px solid rgba(255,255,255,0.1);font-size:15px;line-height:1.7;color:#f4f1ea;">${safeMessage}</div>
				</td>
			</tr>
		</table>
	</body>
</html>`;
}

export async function GET() {
	return Response.json({ ok: true, route: "contact" });
}

export async function POST(request: Request) {
	let payload: ContactPayload;

	try {
		payload = (await request.json()) as ContactPayload;
	} catch {
		return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
	}

	const website = clean(payload.website);
	if (website) {
		return Response.json({ ok: true });
	}

	const name = limit(clean(payload.name), MAX_NAME_LENGTH);
	const email = limit(clean(payload.email).toLowerCase(), MAX_EMAIL_LENGTH);
	const subject = limit(clean(payload.subject), MAX_SUBJECT_LENGTH);
	const message = limit(clean(payload.message), MAX_MESSAGE_LENGTH);

	if (!name || !email || !subject || !message) {
		return Response.json({ error: "Missing required fields" }, { status: 400 });
	}

	if (!emailPattern.test(email)) {
		return Response.json({ error: "Invalid email address" }, { status: 400 });
	}

	if (isRateLimited(getClientKey(request))) {
		return Response.json({ error: "Too many messages. Please try again later." }, { status: 429 });
	}

	if (!process.env.RESEND_API_KEY) {
		return Response.json({ error: "Email service is not configured" }, { status: 503 });
	}

	const resend = new Resend(process.env.RESEND_API_KEY);

	try {
		const result = await resend.emails.send({
			from: CONTACT_FROM,
			to: CONTACT_TO,
			replyTo: email,
			subject: `Portfolio contact: ${subject}`,
			text: buildTextEmail({ name, email, subject, message }),
			html: buildHtmlEmail({ name, email, subject, message }),
		});

		console.info("Portfolio contact email sent", {
			to: CONTACT_TO,
			subject,
			result,
		});

		return Response.json({ ok: true });
	} catch {
		return Response.json({ error: "Email send failed" }, { status: 500 });
	}
}
