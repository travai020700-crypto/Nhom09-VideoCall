# Video Call nhóm (Next.js + NextAuth + LiveKit)

Chức năng:
- Đăng nhập bằng Google / GitHub (NextAuth) trước khi vào phòng
- Phòng gọi video LiveKit, bắt buộc đăng nhập mới lấy được token
- Sidebar hiển thị danh sách người trong phòng theo tên tài khoản MXH
- Trang chủ hiển thị tên nhóm + danh sách thành viên (sửa trong `lib/config.js`)

## 1. Sửa tên nhóm / thành viên
Mở `lib/config.js`, sửa `GROUP_NAME` và `MEMBERS`.

## 2. Lấy khóa LiveKit
1. Vào https://cloud.livekit.io, tạo project (miễn phí)
2. Settings -> Keys -> tạo key
3. Lấy `URL` (wss://...), `API Key`, `API Secret`

## 3. Tạo OAuth app
**GitHub:** https://github.com/settings/developers -> New OAuth App
- Homepage URL: `https://<domain-cua-ban>`
- Callback URL: `https://<domain-cua-ban>/api/auth/callback/github`

**Google:** https://console.cloud.google.com/apis/credentials -> Create OAuth client ID (Web)
- Authorized redirect URI: `https://<domain-cua-ban>/api/auth/callback/google`

(Chạy local thì thêm callback với `http://localhost:3000`.)
Chỉ cần làm 1 trong 2 cũng chạy được; nút của provider chưa cấu hình sẽ báo lỗi khi bấm.

## 4. Chạy local
```bash
cp .env.example .env.local   # điền các giá trị
npm install
npm run dev                  # http://localhost:3000
```

## 5. Deploy lên Vercel (nhanh nhất)
1. Đẩy code lên GitHub
2. https://vercel.com -> Add New Project -> chọn repo
3. Thêm toàn bộ biến trong `.env.example` vào Environment Variables
   - `NEXTAUTH_URL` = `https://<ten-project>.vercel.app`
   - `NEXTAUTH_SECRET` = chuỗi ngẫu nhiên (`openssl rand -base64 32`)
4. Deploy, rồi cập nhật callback URL của Google/GitHub theo domain Vercel
5. Gửi link vào group

Lưu ý: trình duyệt chỉ cho bật camera/mic trên HTTPS (Vercel đã có sẵn).
