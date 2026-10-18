# Vạn Kiếp · Myriad Lives

Bản tái hiện và bản địa hóa tiếng Việt của trò chơi mô phỏng tu tiên và luân hồi kiếp sống [Vạn Kiếp · Myriad Lives](https://myriad-lives.celestialpath.workers.dev/).

---

## 1. Giới thiệu Dự án

**Vạn Kiếp · Myriad Lives** là ứng dụng web mô phỏng con đường tu tiên tuần hoàn (Cultivation & Reincarnation Roguelite Life Simulation). 

Mỗi phiên chơi là một kiếp nhân sinh độc lập với bối cảnh thế giới, xuất thân, linh căn, thể chất và chuỗi biến cố ngẫu nhiên đa dạng. Người chơi trải qua từng năm tuổi, tích lũy tu vi, phá bình cảnh, đối mặt thiên kiếp phi thăng, đưa ra các quyết định sinh tử và ghi dấu hành trình vào Bách Kiếp Lục (Lịch sử kiếp sống) cùng tính năng xuất thẻ số mệnh (Fate Card).

Trò chơi vận hành hoàn toàn độc lập phía client (SPA), không gửi bất kỳ dữ liệu hay request mạng nào ra máy chủ bên ngoài trong suốt runtime. Toàn bộ font chữ và tài nguyên tĩnh được bundle cục bộ, tiến trình được lưu trữ an toàn qua LocalStorage và IndexedDB trên trình duyệt của người dùng.

---

## 2. Công nghệ & Kiến trúc

- **Giao diện & Ứng dụng:** React 19 (`react` ^19.3.1, `react-dom` ^19.3.1) xây dựng trên nền tảng Vite 8 (`vite` ^8.3.4).
- **Định kiểu (Styling):** CSS tùy biến (`src/styles/main.css`) với thiết kế giao diện kép Sáng/Tối (Dark `#141d18` / Light `#f5f2e9`), phông chữ cổ điển (`Noto Serif`) và chữ nội dung hiện đại (`Be Vietnam Pro`) được nhúng trực tiếp qua `@font-face` local (giấy phép OFL 1.1), hiệu ứng đổ bóng mờ và hoạt cảnh CSS keyframes.
- **Định tuyến (Routing):** Hash routing phía client (`#/`, `#/cultivation`, `#/history`).
- **Lưu trữ trạng thái:**
  - `localStorage`: `myriad-lives-save` (dữ liệu kiếp sống hiện tại, lịch sử Bách Kiếp Lục, tốc độ mô phỏng, trạng thái tạm dừng, mã ngôn ngữ mặc định `'vi'`), `myriad-lives-theme` (`'dark'` / `'light'`).
  - `indexedDB`: `fate-cards` (bộ nhớ đệm cho các hình ảnh thẻ số mệnh đã xuất).
- **Xuất ảnh Thẻ số mệnh:** Kết xuất trực tiếp qua HTML5 Canvas 2D độ phân giải cao (`myriad-lives-{number}.png`) kết hợp nét vẽ thủy mặc, thư pháp, ấn triện và thông số thuộc tính nhân vật.

---

## 3. Cấu trúc Thư mục Dự án

```
cultivation/
├── index.html                   # Điểm vào ứng dụng (lang="vi", tiêu đề cố định)
├── package.json                 # Cấu hình dự án, scripts và dependencies
├── package-lock.json            # Khóa phiên bản dependencies
├── vite.config.js               # Cấu hình Vite SPA (cổng 3000, host 127.0.0.1)
├── .gitignore                   # Cấu hình tệp bỏ qua của Git
├── AGENTS.md                    # Hướng dẫn vận hành và tiêu chuẩn review cho Agent
├── README.md                    # Hướng dẫn kỹ thuật và mô tả dự án
├── public/                      # Tài nguyên tĩnh, tranh nền, icon SVG, favicon và fonts
├── src/
│   ├── main.js                  # Engine mô phỏng, React UI và kho dữ liệu 3.580 sự kiện
│   ├── styles/
│   │   └── main.css             # Stylesheet hoàn chỉnh của giao diện (@font-face local)
│   └── assets/                  # Tài nguyên ảnh cảnh giới, icon SVG và fonts local (OFL 1.1)
└── tests/
    ├── suite.js                 # 15 bài kiểm thử E2E giao diện & tương tác
    ├── test_migration.js        # 2 bài kiểm thử di trú dữ liệu lưu cũ
    └── test_utils.js            # Tiện ích phát hiện browser và quản lý preview server
```

---

## 4. Cài đặt và Khởi chạy

### Yêu cầu hệ thống
- **Node.js:** Phiên bản 18.0.0 trở lên (khuyên dùng Node 20 LTS hoặc mới hơn).
- **Trình duyệt phục vụ kiểm thử:** Google Chrome hoặc Chromium.
  - Tự động phát hiện trên các hệ điều hành phổ biến (macOS, Linux, Windows).
  - Có thể chỉ định đường dẫn tùy chỉnh bằng biến môi trường `PUPPETEER_EXECUTABLE_PATH` (ví dụ: `export PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome"`).

### Cài đặt thư viện phụ thuộc
```bash
npm install
# hoặc cài đặt chính xác theo package-lock.json:
npm ci
```

### Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Ứng dụng sẽ khả dụng tại địa chỉ `http://127.0.0.1:3000/`.

### Đóng gói ứng dụng (Production Build)
```bash
npm run build
```
Kết quả đóng gói được xuất ra thư mục `dist/` với các tài nguyên tĩnh được tối ưu hóa.

### Xem trước bản build (Preview)
```bash
npm run preview
```
Khởi chạy máy chủ cục bộ phục vụ thư mục `dist/` tại `http://127.0.0.1:3000/`.

### Chạy kiểm thử tự động (Testing)
```bash
npm test
```
Lệnh `npm test` sẽ tự động thực hiện đóng gói ứng dụng (`npm run build`) trước, sau đó lần lượt chạy hai bộ kiểm thử `tests/suite.js` và `tests/test_migration.js` mà không đòi hỏi phải thao tác build thủ công trước đó.

---

## 5. Tuyến đường Giao diện (Route Inventory)

| Tuyến đường | Màn hình | Mô tả chức năng |
|---|---|---|
| `#/` | Trang chủ (Home) | Giới thiệu bối cảnh tu tiên, các trụ cột lối chơi, tóm lược cẩm nang và nút khởi đầu kiếp sống. |
| `#/cultivation` | Tu tiên & Luân hồi (Cultivation) | Quá trình thức tỉnh thiên mệnh, dòng thời gian niên kỷ, nhật ký biến cố, lựa chọn nhánh sự kiện, thử thách đột phá cảnh giới và tổng kết kiếp sống. |
| `#/history` | Bách Kiếp Lục (History) | Lưu trữ các kiếp luân hồi đã qua, hỗ trợ lọc đa tiêu chí (cảnh giới, kết cục), tìm kiếm không dấu, sắp xếp và kết xuất thẻ số mệnh. |

---

## 6. Trạng thái Việt hóa

Dự án đã hoàn thiện giao diện thuần tiếng Việt và triển khai 3 Gate biên tập / sửa lỗi dữ liệu quan trọng:

1. **Giao diện thuần Tiếng Việt (Vietnamese Only):**
   - Loại bỏ hoàn toàn thanh chọn ngôn ngữ và các nút chuyển EN/ZH khỏi giao diện.
   - Thẻ `<html>` cố định `lang="vi"`, tiêu đề tài liệu cố định: `Vạn Kiếp · Myriad Lives`.
   - Các hàm hiển thị chuỗi trả trực tiếp văn bản tiếng Việt nguyên bản.
   - Cơ chế di trú tự động: Bản lưu cũ từ tiếng Anh (`en`) và tiếng Trung (`zh`) được tự động chuẩn hóa sang `'vi'` khi tải vào game mà không làm thất lạc lịch sử tu tiên.

2. **Ba Gate biên tập & sửa dữ liệu đã áp dụng:**
   - **Gate 1 — Chuẩn hóa thuật ngữ tài nguyên theo Chiến lược A:** Phân định rõ ràng giữa `linh tài` (dành cho bối cảnh tu tiên, linh khí, tông môn) và `vật tư` (dành cho bối cảnh phàm trần, sinh hoạt thường nhật). Xử lý riêng đề xuất `PROP-0091` theo dạng kết hợp `-5 linh tài · -2 thể trạng`. Đã áp dụng trên 45 gợi ý lựa chọn (hint).
   - **Gate 2 — Sửa logic và văn bản sự kiện kho thóc (`sparse_mortal_granary_raiders`):** Khắc phục lỗi tại `De[13]` khiến nhánh bị thương (`injury`) kết thúc kiếp sống sai lệch dù nhân vật vẫn còn sinh lực; chuẩn hóa câu kết thúc kiếp tử nạn thành `"Bị giặc sát hại tại kho thóc"`.
   - **Gate 3 — Chuẩn hóa lý do tử nạn do cấm chế:** Điều chỉnh 6 câu kết thúc kiếp sống do cấm chế bảo vệ (`Ee[83]`, `Ee[84]`, `Ee[90]`, `Ee[91]`, `Ee[97]`, `Ee[98]`) từ dạng "Thương tổn do cấm chế..." thành "Tử nạn vì cấm chế bảo vệ...".

Kho dữ liệu sự kiện gồm đúng **3.580 sự kiện với 3.580 ID duy nhất** (phân bổ qua 15 sub-pools: sự kiện phàm trần, tông môn, tán tu, kỳ ngộ, thiên kiếp...).

---

## 7. Kiểm thử & Đảm bảo Chất lượng

Bộ kiểm thử tự động sử dụng `puppeteer-core` để xác thực toàn diện giao diện và luồng xử lý:

- **`npm test` — 17/17 PASS:**
  - `tests/suite.js`: 15/15 bài kiểm tra E2E trình duyệt đạt PASS (tải trực tiếp hash route, back/forward, toggle theme sáng/tối, xác nhận giao diện thuần Việt không có nút EN/ZH, mở cẩm nang Codex, sinh nhân vật, điều khiển tốc độ/tạm dừng, phím tắt kiếp mới, bộ lọc lịch sử, responsive 4 kích thước màn hình: Mobile 390px, Tablet 768px, Laptop 1280px, Desktop 1440px).
  - `tests/test_migration.js`: 2/2 bài kiểm tra di trú dữ liệu đạt PASS (chuyển đổi bản lưu cũ từ `en` và `zh` sang `vi` an toàn, bảo toàn nguyên vẹn số kiếp và thông tin nhân vật).
- **`npm run build` — PASS:**
  - Đóng gói ứng dụng thành công trong khoảng 0.5 giây với Vite 8, xuất toàn bộ tài nguyên tĩnh và phông chữ đã tối ưu hóa ra thư mục `dist/`.
- **Quyền riêng tư & Network:**
  - Không có bất kỳ request mạng bên ngoài nào được thực hiện lúc runtime (kiểm tra bằng Puppeteer request interception: 0 external requests).

---

## 8. Hướng dẫn Phát triển & Lưu ý

- **Cấu trúc mã nguồn đơn khối:** Giao diện React, bộ máy mô phỏng luật chơi và toàn bộ 3.580 sự kiện hiện nằm trong tệp đơn khối `src/main.js`. Khi thực hiện tái cấu trúc trong tương lai (ví dụ: chia nhỏ module, bóc tách sự kiện ra tệp JSON riêng), cần bảo toàn hành vi của các hàm cốt lõi: `gt` (sinh hồ sơ & pity), `wt` (bước mô phỏng), `Ot` (đột phá cảnh giới), `we` (phản phệ thiên kiếp), `st` (hệ số tuổi thọ).
- **Quy trình bảo đảm an toàn:** Luôn chạy `npm test` trước và sau mỗi đợt chỉnh sửa để phát hiện sớm các hiện tượng gãy vỡ kịch bản mô phỏng hoặc suy giảm trải nghiệm người dùng.
- **Tiêu chuẩn đóng góp:** Tham khảo tài liệu [`AGENTS.md`](file:///Users/hoannk1511.home/Developments/cultivation/AGENTS.md) tại thư mục gốc để nắm rõ nguyên tắc làm việc và checklist đánh giá mã nguồn.
