import connectDB from "@/lib/db";
import Gig from "@/lib/models/Gig";

export async function getRecentGigs() {
  try {
    await connectDB();
    const gigs = await Gig.find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return gigs.map((gig: any) => ({
      ...gig,
      _id: gig._id.toString(),
    }));
  } catch {
    return [];
  }
}
