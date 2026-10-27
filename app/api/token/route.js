import { getServerSession } from "next-auth";
import { AccessToken } from "livekit-server-sdk";
import { authOptions } from "@/lib/auth";
import { ROOM_NAME } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  // Chỉ người đã đăng nhập mới lấy được token vào phòng
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return Response.json({ error: "Thiếu cấu hình LiveKit" }, { status: 500 });
  }

  const identity = session.user.id || session.user.email || session.user.name;
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    name: session.user.name || session.user.email || "Ẩn danh", // tên hiển thị = tên MXH
  });
  at.addGrant({ roomJoin: true, room: ROOM_NAME, canPublish: true, canSubscribe: true });

  return Response.json({ token: await at.toJwt() });
}
