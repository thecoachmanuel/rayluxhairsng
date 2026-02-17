const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
let supabaseHost = "";
try {
	if (supabaseUrl) {
		supabaseHost = new URL(supabaseUrl).hostname;
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
			...(supabaseHost
				? [
						{
							protocol: "https",
							hostname: supabaseHost,
							pathname: "/storage/v1/object/public/**",
						},
				]
				: []),
		],
	},
};

export default nextConfig;
