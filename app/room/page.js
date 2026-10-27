import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import RoomClient from "./RoomClient";

export const dynamic = "force-dynamic";

export default async function RoomPage() {
  // Bắt buộc đăng nhập trước khi join
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  return <RoomClient serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} />;
}
