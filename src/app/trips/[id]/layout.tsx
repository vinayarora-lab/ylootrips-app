import type { Metadata } from "next";

const API_URL = "https://trip-backend-65232427280.asia-south1.run.app/api";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/trips/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("not found");
    const trip = await res.json();
    const title: string = trip.title || trip.name || `Tour Package ${id}`;
    const nights: number = trip.nights || 0;
    const durationStr = nights ? `${nights}N/${nights + 1}D` : (trip.duration || "");
    const priceNum = trip.price ? Number(trip.price) : 0;
    const priceStr = priceNum ? `₹${priceNum.toLocaleString("en-IN")}` : "";
    const destination: string = trip.destination || trip.location || "";
    const rawDesc: string = trip.description
      ? String(trip.description).replace(/<[^>]+>/g, "").substring(0, 158)
      : `Book ${title} with YlooTrips — expert-guided tour${priceStr ? `, starting ${priceStr}/person` : ""}. 4.9 rated.`;
    const image: string = trip.imageUrl || trip.image || "https://www.ylootrips.com/og-image.jpg";
    const parts = [title, durationStr && durationStr, priceStr && `Starting ${priceStr}`, "YlooTrips"];
    const metaTitle = parts.filter(Boolean).join(" — ");
    return {
      title: metaTitle,
      description: rawDesc,
      keywords: [title, destination && `${destination} tour package`, "YlooTrips", "India tour packages"].filter(Boolean).join(", "),
      openGraph: {
        title: metaTitle, description: rawDesc,
        url: `https://www.ylootrips.com/trips/${id}`,
        type: "website",
        images: [{ url: image, width: 1200, height: 630, alt: title }],
      },
      twitter: { card: "summary_large_image", title: metaTitle, description: rawDesc, images: [image] },
      alternates: { canonical: `https://www.ylootrips.com/trips/${id}` },
    };
  } catch {
    return {
      title: "Tour Package | YlooTrips",
      description: "Book expert-guided tour packages with YlooTrips. 4.9 rated by 25,000+ happy travelers.",
      alternates: { canonical: `https://www.ylootrips.com/trips/${id}` },
    };
  }
}

export default function TripLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
