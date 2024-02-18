/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        // domains: ['res.cloudinary.com'],
        domains: ['127.0.0.1'],
    },
    // async headers() {
    //     return [
    //     {
    //         source: '/(.*)',
    //         headers: securityHeaders,
    //     },
    //     ];
    // },
};

export default nextConfig;
