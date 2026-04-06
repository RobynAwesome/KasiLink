import Gig from "@/lib/models/Gig";
import User from "@/lib/models/User";
import connectDB from "@/lib/db";
import { distanceKm } from "@/lib/geo";

export class RouteError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ListGigsInput = {
  searchParams: URLSearchParams;
  currentUserId?: string | null;
};

export async function listGigs({ searchParams, currentUserId }: ListGigsInput) {
  await connectDB();

  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const radius = parseFloat(searchParams.get("radius") ?? "10");
  const category = searchParams.get("category");
  const suburb = searchParams.get("suburb")?.trim();
  const city = searchParams.get("city")?.trim();
  const providerIdParam = searchParams.get("providerId");
  const status = searchParams.get("status");
  const q = searchParams.get("q");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};

  if (status) {
    filter.status = status;
  } else if (!providerIdParam) {
    filter.status = "open";
  }

  if (category) filter.category = category;
  if (suburb) filter["location.suburb"] = new RegExp(`^${suburb}$`, "i");
  if (city) filter["location.city"] = new RegExp(`^${city}$`, "i");

  if (providerIdParam) {
    if (providerIdParam === "me") {
      if (!currentUserId) {
        throw new RouteError(401, "Unauthorised");
      }
      filter.providerId = currentUserId;
    } else {
      filter.providerId = providerIdParam;
    }
  }

  if (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  ) {
    filter.location = {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: radius * 1000,
      },
    };
  }

  if (q && q.trim()) {
    filter.$text = { $search: q.trim() };
  }

  filter.$or = [
    { expiresAt: { $exists: false } },
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } },
  ];

  const [gigs, total] = await Promise.all([
    Gig.find(filter)
      .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Gig.countDocuments(filter),
  ]);

  const gigsWithDistance = gigs.map((gig) => {
    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      Array.isArray(gig.location?.coordinates) &&
      gig.location.coordinates.length === 2
    ) {
      const [gigLng, gigLat] = gig.location.coordinates;
      return { ...gig, distance: distanceKm(lat, lng, gigLat, gigLng) };
    }
    return gig;
  });

  return {
    gigs: gigsWithDistance,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function createGig({
  userId,
  body,
}: {
  userId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
}) {
  await connectDB();

  const provider = await User.findOne({ clerkId: userId });
  if (!provider) {
    throw new RouteError(
      404,
      "Profile not found. Please complete your profile first.",
    );
  }

  const required = ["title", "description", "category", "payDisplay", "location"];
  for (const field of required) {
    if (!body[field]) {
      throw new RouteError(400, `Missing required field: ${field}`);
    }
  }

  if (
    !body.location.coordinates ||
    !Array.isArray(body.location.coordinates) ||
    body.location.coordinates.length !== 2
  ) {
    throw new RouteError(400, "location.coordinates must be [longitude, latitude]");
  }

  const gig = await Gig.create({
    title: body.title.trim(),
    description: body.description.trim(),
    category: body.category,
    status: "open",
    providerId: userId,
    providerName: provider.displayName,
    providerPhone: provider.phone,
    isProviderVerified: provider.isVerified,
    location: {
      type: "Point",
      coordinates: body.location.coordinates,
      address: body.location.address,
      suburb: body.location.suburb ?? provider.location.suburb ?? "Johannesburg",
      city: body.location.city ?? provider.location.city ?? "Johannesburg",
    },
    payType: body.payType ?? "negotiable",
    payAmount: body.payAmount,
    payDisplay: body.payDisplay.trim(),
    startDate: body.startDate ? new Date(body.startDate) : undefined,
    endDate: body.endDate ? new Date(body.endDate) : undefined,
    isFlexible: body.isFlexible ?? true,
    requirements: body.requirements ?? [],
    slots: body.slots ?? 1,
    loadshedding: {
      aware: body.loadshedding?.aware ?? false,
      stage: body.loadshedding?.stage,
    },
    isUrgent: body.isUrgent ?? false,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
  });

  return gig;
}
