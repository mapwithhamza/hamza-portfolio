import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import CoordinateHUD from "@/components/CoordinateHUD";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";
import ScrollProgress from "@/components/ScrollProgress";
import { siteConfig } from "@/data/site";
import "../styles/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-display",
  weight: "100 900",
});

const geistBody = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-body",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mhamzakhan.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Hamza Khan - Software Developer",
    template: "%s | Muhammad Hamza Khan",
  },
  description:
    "Muhammad Hamza Khan is a software developer working across full-stack apps, GIS tools, remote sensing, spatial dashboards, and AI-assisted systems.",
  keywords: [
    "Muhammad Hamza Khan",
    "software developer",
    "full-stack developer",
    "GIS developer",
    "React developer",
    "Next.js developer",
    "PostGIS",
    "Mapbox",
    "QGIS",
    "ArcGIS Pro",
    "remote sensing",
    "satellite imagery",
    "Google Earth Engine",
    "ERDAS Imagine",
    "LULC classification",
    "flood mapping",
    "Islamabad developer",
  ],
  authors: [{ name: "Muhammad Hamza Khan", url: siteUrl }],
  creator: "Muhammad Hamza Khan",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Muhammad Hamza Khan - Software Developer",
    description: "Full-stack apps, GIS tools, remote sensing, spatial dashboards, and AI-assisted systems.",
    url: siteUrl,
    siteName: "Muhammad Hamza Khan Portfolio",
    images: [
      {
        url: "/images/hamza-portrait-cropped.jpeg",
        width: 600,
        height: 750,
        alt: "Muhammad Hamza Khan",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Hamza Khan - Software Developer",
    description: "Full-stack apps, GIS tools, remote sensing, spatial dashboards, and AI-assisted systems.",
    images: ["/images/hamza-portrait-cropped.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: "Software Developer",
  email: `mailto:${siteConfig.email}`,
  url: siteUrl,
  image: `${siteUrl}/images/hamza-portrait-cropped.jpeg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Islamabad",
    addressCountry: "PK",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "NUST IGIS",
  },
  knowsAbout: [
    "Full-stack development",
    "GIS",
    "Spatial dashboards",
    "React",
    "Next.js",
    "Python",
    "PostGIS",
    "Mapbox",
    "QGIS",
    "ArcGIS Pro",
    "ERDAS Imagine",
    "Google Earth Engine",
    "Remote sensing",
    "Satellite imagery",
    "LULC classification",
    "Flood mapping",
    "AI-assisted systems",
  ],
  sameAs: [siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.upwork],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistBody.variable}`}
    >
      <body className="min-h-screen bg-[var(--bg-core)] text-[var(--text-main)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Nav />
        <ScrollProgress />
        <CoordinateHUD />
        <CustomCursor />
        <main id="top">{children}</main>
      </body>
    </html>
  );
}
