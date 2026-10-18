# Vạn Kiếp · Myriad Lives

Bản tái hiện và bản địa hóa tiếng Việt của trò chơi mô phỏng tu tiên và luân hồi kiếp sống [Vạn Kiếp · Myriad Lives](https://myriad-lives.celestialpath.workers.dev/).

---

## 1. Giới thiệu Dự án

**Vạn Kiếp · Myriad Lives** là ứng dụng web mô phỏng con đường tu tiên tuần hoàn (Cultivation & Reincarnation Roguelite Life Simulation). 

Mỗi phiên chơi là một kiếp nhân sinh độc lập với bối cảnh thế giới, xuất thân, linh căn, thể chất và chuỗi biến cố ngẫu nhiên đa dạng. Người chơi trải qua từng năm tuổi, tích lũy tu vi, phá bình cảnh, đối mặt thiên kiếp phi thăng, đưa ra các quyết định sinh tử và ghi dấu hành trình vào Bách Kiếp Lục (Lịch sử kiếp sống) cùng tính năng xuất thẻ số mệnh (Fate Card).

Trò chơi vận hành hoàn toàn độc lập phía client (SPA), không gửi dữ liệu ra máy chủ bên ngoài và lưu trữ tiến trình qua LocalStorage và IndexedDB.

---

## 2. Công nghệ & Kiến trúc

- **Giao diện & Ứng dụng:** React 19 (`react` ^19.3.1, `react-dom` ^19.3.1) xây dựng trên nền tảng Vite 8 (`vite` ^8.3.4).
- **Định kiểu (Styling):** CSS tùy biến (`src/styles/main.css`) với thiết kế giao diện kép Sáng/Tối (Dark `#141d18` / Light `#f5f2e9`), phông chữ cổ điển (`Noto Serif`) và chữ nội dung hiện đại (`Be Vietnam Pro`), hiệu ứng đổ bóng mờ và hoạt cảnh CSS keyframes.
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
├── vite.config.js               # Cấu hình Vite SPA (cổng 3000, host 127.0.0.1)
├── PHASE_0_75_5_DECISIONS.csv   # Hồ sơ canonical theo dõi 102 đề xuất biên tập
├── BASELINE_README.md           # Hướng dẫn kỹ thuật bản baseline tiếng Việt ban đầu
├── SOURCE_OF_TRUTH_AUDIT.md     # Báo cáo đối chiếu nguồn sự thật
├── CLEANUP_AUDIT.md             # Báo cáo dọn dẹp hệ thống đa ngôn ngữ cũ
├── docs/                        # Tài liệu đặc tả giao diện, tuyến đường và đối chiếu
├── public/                      # Tài nguyên tĩnh, tranh nền, icon SVG và favicon
├── src/
│   ├── main.js                  # Engine mô phỏng, React UI và kho dữ liệu sự kiện
│   ├── styles/
│   │   └── main.css             # Stylesheet hoàn chỉnh của giao diện
│   └── assets/                  # Tài nguyên ảnh cảnh giới và icon SVG
├── tests/
│   ├── suite.js                 # 15 bài kiểm thử E2E giao diện & tương tác
│   └── test_migration.js        # 2 bài kiểm thử di trú dữ liệu lưu cũ
└── scripts/
    └── verify_data_integrity.cjs# Script kiểm định sai lệch dữ liệu so với baseline
```

---

## 4. Cài đặt và Khởi chạy

### Yêu cầu hệ thống
- **Node.js:** Phiên bản 18.0.0 trở lên (khuyên dùng Node 20 LTS hoặc mới hơn).
- **Trình duyệt phục vụ kiểm thử:** Google Chrome hoặc Chromium (được Puppeteer sử dụng trong bộ test tự động).

### Cài đặt thư viện phụ thuộc
```bash
npm install
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
Lệnh trên thực thi đồng thời hai bộ kiểm thử: `tests/suite.js` và `tests/test_migration.js`.

---

## 5. Tuyến đường Giao diện (Route Inventory)

| Tuyến đường | Màn hình | Mô tả chức năng |
|---|---|---|
| `#/` | Trang chủ (Home) | Giới thiệu bối cảnh tu tiên, các trụ cột lối chơi, tóm lược cẩm nang và nút khởi đầu kiếp sống. |
| `#/cultivation` | Tu tiên & Luân hồi (Cultivation) | Quá trình thức tỉnh thiên mệnh, dòng thời gian niên kỷ, nhật ký biến cố, lựa chọn nhánh sự kiện, thử thách đột phá cảnh giới và tổng kết kiếp sống. |
| `#/history` | Bách Kiếp Lục (History) | Lưu trữ các kiếp luân hồi đã qua, hỗ trợ lọc đa tiêu chí (cảnh giới, kết cục), tìm kiếm không dấu, sắp xếp và kết xuất thẻ số mệnh. |

---

## 6. Trạng thái Việt hóa

Dự án hiện đã hoàn thiện giao diện thuần tiếng Việt và triển khai 3 Gate biên tập / sửa lỗi dữ liệu quan trọng:

1. **Giao diện thuần Tiếng Việt (Vietnamese Only):**
   - Loại bỏ hoàn toàn thanh chọn ngôn ngữ và các nút chuyển EN/ZH khỏi giao diện.
   - Thẻ `<html>` cố định `lang="vi"`, tiêu đề tài liệu cố định: `Vạn Kiếp · Myriad Lives`.
   - Các hàm hiển thị chuỗi trả trực tiếp văn bản tiếng Việt nguyên bản.
   - Cơ chế di trú tự động: Bản lưu cũ từ tiếng Anh (`en`) và tiếng Trung (`zh`) được tự động chuẩn hóa sang `'vi'` khi tải vào game mà không làm thất lạc lịch sử tu tiên.

2. **Ba Gate biên tập & sửa dữ liệu đã áp dụng:**
   - **Gate 1 — Chuẩn hóa thuật ngữ tài nguyên theo Chiến lược A:** Phân định rõ ràng giữa `linh tài` (dành cho bối cảnh tu tiên, linh khí, tông môn) và `vật tư` (dành cho bối cảnh phàm trần, sinh hoạt thường nhật). Xử lý riêng đề xuất `PROP-0091` theo dạng kết hợp `-5 linh tài · -2 thể trạng`. Đã áp dụng trên 45 gợi ý lựa chọn (hint).
   - **Gate 2 — Sửa logic và văn bản sự kiện kho thóc (`sparse_mortal_granary_raiders`):** Khắc phục lỗi tại `De[13]` khiến nhánh bị thương (`injury`) kết thúc kiếp sống sai lệch dù nhân vật vẫn còn sinh lực; chuẩn hóa câu kết thúc kiếp tử nạn thành `"Bị giặc sát hại tại kho thóc"`.
   - **Gate 3 — Chuẩn hóa lý do tử nạn do cấm chế:** Điều chỉnh 6 câu kết thúc kiếp sống do cấm chế bảo vệ (`Ee[83]`, `Ee[84]`, `Ee[90]`, `Ee[91]`, `Ee[97]`, `Ee[98]`) từ dạng "Thương tổn do cấm chế..." thành "Tử nạn vì cấm chế bảo vệ...".

*Lưu ý:* Dự án tập trung kiểm soát chất lượng giao diện và các nhóm dữ liệu trọng yếu đã qua kiểm định. Hiện chưa có tuyên bố rằng toàn bộ hơn 3.500 sự kiện trong kho dữ liệu đã được rà soát hoàn hảo.

---

## 7. Kiểm thử & Đảm bảo Chất lượng

### Kết quả kiểm thử chính thức
- **`npm test` — PASS:**
  - `tests/suite.js`: 15/15 bài kiểm tra E2E trình duyệt đạt PASS (tải trực tiếp hash route, back/forward, toggle theme sáng/tối, xác nhận giao diện thuần Việt không có nút EN/ZH, mở cẩm nang Codex, sinh nhân vật, điều khiển tốc độ/tạm dừng, phím tắt kiếp mới, bộ lọc lịch sử, responsive 4 kích thước màn hình: Mobile 390px, Tablet 768px, Laptop 1280px, Desktop 1440px).
  - `tests/test_migration.js`: 2/2 bài kiểm tra di trú dữ liệu đạt PASS (chuyển đổi bản lưu cũ từ `en` và `zh` sang `vi` an toàn, bảo toàn nguyên vẹn số kiếp và thông tin nhân vật).
- **`npm run build` — PASS:**
  - Đóng gói ứng dụng thành công trong khoảng 0.5 giây với Vite, xuất toàn bộ tài nguyên tĩnh đã tối ưu hóa ra thư mục `dist/`.

### Kiểm định toàn vẹn dữ liệu (`verify_data_integrity.cjs`)
Lệnh kiểm định dữ liệu:
```bash
node scripts/verify_data_integrity.cjs
```
- **Mã thoát (Exit Code):** `1` (FAILED).
- **Số lượng cảnh báo / sai lệch:** 53 sai lệch.
- **Giải trình kỹ thuật:** Script này thực hiện đối chiếu mã nguồn `src/main.js` với trường dữ liệu gốc `current_text` trong tệp `PHASE_0_75_5_DECISIONS.csv`. 53 sai lệch được báo cáo chính là 53 vị trí đã được cố ý thay đổi khi triển khai ba Gate (45 gợi ý Gate 1, 2 nhánh Gate 2, 6 kết cục Gate 3). Toàn bộ 53 sai lệch này đã được xác minh và phân loại là **`EXPECTED DRIFT`** (sai lệch dự kiến) so với baseline ban đầu.

---

## 8. Tài liệu & Hồ sơ Quyết định

- `PHASE_0_75_5_DECISIONS.csv`: Tệp CSV canonical ghi nhận 102 đề xuất biên tập, trạng thái thẩm định và khuyến nghị văn bản đích.
- `BASELINE_README.md`: Hồ sơ kỹ thuật của bản baseline tiếng Việt ban đầu.
- `SOURCE_OF_TRUTH_AUDIT.md` & `CLEANUP_AUDIT.md`: Hồ sơ đối chiếu nguồn sự thật và kiểm toán dọn dẹp hệ thống đa ngôn ngữ cũ.
- Các tài liệu kiểm toán chi tiết trong thư mục gốc ghi nhận lịch sử kiểm định qua các Phase 0.75.x và 0.76.x.

---

## 9. Giới hạn Hiện tại & Lưu ý Phát triển

- **Cấu trúc mã nguồn đơn khối:** Giao diện React, bộ máy mô phỏng luật chơi và toàn bộ 3.573 sự kiện hiện nằm trong tệp đơn khối `src/main.js`. Khi thực hiện tái cấu trúc trong tương lai (ví dụ: chia nhỏ module, bóc tách sự kiện ra tệp JSON riêng), cần bảo toàn hành vi của các hàm cốt lõi: `gt` (sinh hồ sơ & pity), `wt` (bước mô phỏng), `Ot` (đột phá cảnh giới), `we` (phản phệ thiên kiếp), `st` (hệ số tuổi thọ).
- **Trạng thái Git:** Repository đang ở giai đoạn chuẩn bị tạo commit baseline đầu tiên.
- **Quy trình bảo đảm an toàn:** Luôn chạy `npm test` trước và sau mỗi đợt chỉnh sửa để phát hiện sớm các hiện tượng gãy vỡ kịch bản mô phỏng hoặc suy giảm trải nghiệm người dùng.
