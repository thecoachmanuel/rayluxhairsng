/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHostname;
try {
	if (supabaseUrl) {
		const url = new URL(supabaseUrl);
		supabaseHostname = url.hostname;
	}
} catch (_error) {}

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
				pathname: "**",
			},
			...(supabaseHostname
				? [
						{
							protocol: "https",
							hostname: supabaseHostname,
							pathname: "/storage/**",
						},
				]
				: []),
		],
	},
};

export default nextConfig;
