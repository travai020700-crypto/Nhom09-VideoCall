"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";

function initial(name) {
  const words = (name || "?").trim().split(/\s+/);
  return (words[words.length - 1][0] || "?").toUpperCase();
}

// Danh sách người trong phòng, hiển thị theo tên lấy từ tài khoản đăng nhập
function ParticipantList() {
  const participants = useParticipants();
  return (
    <aside className="side">
      <h2 className="side-title">Trong phòng</h2>
      <p className="side-count">{participants.length} người đang tham gia</p>
      <ul className="people">
        {participants.map((p) => {
          const name = p.name || p.identity;
          return (
            <li key={p.identity} className={p.isSpeaking ? "speaking" : ""}>
              <span className="person-avatar" aria-hidden="true">{initial(name)}</span>
              <span className="person-name">
                {name} {p.isLocal && <span className="person-me">(bạn)</span>}
              </span>
            </li>
          );
        })}
      </ul>
      <a className="link" href="/">Về trang chủ</a>
    </aside>
  );
}

export default function RoomClient({ serverUrl }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/token")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Không lấy được token");
        setToken(data.token);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="state-screen">
        <div>
          <p>Không vào được phòng: {error}</p>
          <a className="btn btn-soft" href="/">Về trang chủ</a>
        </div>
      </div>
    );
  }

  if (!token) return <div className="state-screen"><p>Đang kết nối…</p></div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      data-lk-theme="default"
      className="room"
      onDisconnected={() => (window.location.href = "/")}
    >
      <ParticipantList />
      <div className="main">
        <VideoConference />
      </div>
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}