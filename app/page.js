"use client";

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { GROUP_NAME, MEMBERS } from "@/lib/config";

function initial(name) {
  const words = (name || "?").trim().split(/\s+/);
  return (words[words.length - 1][0] || "?").toUpperCase();
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="page">
      <h1 className="title">{GROUP_NAME}</h1>
      <p className="lede">
        Phòng gọi video của nhóm. Đăng nhập bằng tài khoản mạng xã hội để tham gia.
      </p>

      <section className="panel" aria-labelledby="members-title">
        <h2 id="members-title">Thành viên</h2>
        <ul className="members">
          {MEMBERS.map((m) => (
            <li key={m.mssv}>
              <span className="avatar" aria-hidden="true">{initial(m.name)}</span>
              <div>
                <div className="member-name">{m.name}</div>
                <div className="member-id">{m.mssv}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel" aria-live="polite">
        {status === "loading" && <p className="quiet-text">Đang tải…</p>}

        {status === "unauthenticated" && (
          <>
            <h2>Đăng nhập để vào phòng</h2>
            <p className="hint">Tên hiển thị trong cuộc gọi sẽ lấy từ tài khoản bạn chọn.</p>
            <div className="actions">
              <button className="btn btn-soft" onClick={() => signIn("google", { callbackUrl: "/room" })}>
                <GoogleIcon /> Tiếp tục với Google
              </button>
              <button className="btn btn-soft" onClick={() => signIn("github", { callbackUrl: "/room" })}>
                <GithubIcon /> Tiếp tục với GitHub
              </button>
            </div>
          </>
        )}

        {status === "authenticated" && (
          <>
            <div className="me">
              {session.user.image && <img src={session.user.image} alt="" />}
              <div>
                <div className="me-name">{session.user.name}</div>
                <div className="me-mail">{session.user.email}</div>
              </div>
            </div>
            <div className="actions">
              <a className="btn btn-primary" href="/room">Vào phòng</a>
              <button className="btn btn-quiet" onClick={() => signOut()}>Đăng xuất</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
}