# Hướng Dẫn Vận Hành & Tiêu Chuẩn Đánh Giá Code Dành Cho Agent (AGENTS.md)
**Dự án:** Vạn Kiếp · Myriad Lives  
**Phạm vi áp dụng:** Toàn bộ AI coding agents và cộng tác viên tự động hóa làm việc trong repository này.

---

## 1. Nguyên Tắc Làm Việc Cốt Lõi

1. **Khảo sát trước khi hành động:** Đọc kỹ `README.md`, cấu trúc dự án và các tài liệu liên quan trong `docs/` trước khi tiến hành đánh giá hoặc chỉnh sửa mã nguồn.
2. **Bảo toàn trạng thái workspace:** Luôn kiểm tra trạng thái Git (`git status`) và diff hiện có trước khi bắt đầu. Tuyệt đối bảo toàn nguyên vẹn các chỉnh sửa chưa commit của người dùng.
3. **Không tự ý mở rộng phạm vi:** Không tự tiện tái cấu trúc (refactor), thay đổi luật gameplay, sửa dữ liệu sự kiện diện rộng, hoặc can thiệp cấu trúc lưu trữ save game trừ khi có yêu cầu rõ ràng và trực tiếp từ người dùng.
4. **Trung thực về kiểm thử:** Tuyệt đối không tuyên bố đã chạy test, đã kiểm thử trình duyệt hay xác minh runtime nếu chưa thực sự thực thi lệnh và quan sát kết quả output.
5. **Xử lý yêu cầu mơ hồ:** Nếu yêu cầu chưa rõ ràng nhưng có thể phân tách được phần an toàn, hãy thực hiện phần an toàn đó, đồng thời nêu rõ các giả định và dừng lại xin ý kiến người dùng cho phần chưa chắc chắn.
6. **Nguyên tắc bằng chứng:** Khi không có đủ bằng chứng mã nguồn hoặc dữ liệu thực tế, phải đánh dấu rõ `CHƯA XÁC MINH` hoặc `SUY LUẬN CÓ CĂN CỨ`, không được suy đoán để lấp khoảng trống.

---

## 2. Checklist Đánh Giá Code (Code Review Standards)

Khi được yêu cầu review code hoặc kiểm tra một thay đổi, agent phải kiểm tra diff hoặc phạm vi thay đổi dựa trên 6 khía cạnh chuyên sâu sau:

### 2.1. Tính Đúng Đắn (Correctness)
- [ ] Logic có thực hiện chính xác và đầy đủ yêu cầu không?
- [ ] Có xuất hiện sai lệch về điều kiện rẽ nhánh, thứ tự xử lý, giá trị mặc định hoặc xử lý ngoại lệ không?
- [ ] Có lỗi tiềm ẩn về chỉ số mảng (index out of bounds), trùng lặp ID, sai lệch kiểu dữ liệu hoặc vi phạm ranh giới toán học không?
- [ ] Thay đổi có gây tác động phụ làm biến đổi ngầm các hành vi hiện có của hệ thống không?

### 2.2. Gameplay & Tính Toàn Vẹn Dữ Liệu (Gameplay & Data Integrity)
- [ ] Luồng lựa chọn, trọng số (`weight`), cấu trúc `choices`, `outcomes` và `effects` có tuân thủ đúng schema không?
- [ ] Các điều kiện kích hoạt (`conditions`, `allowedRealms`, `minAge`, `cooldownYears`) có được bảo toàn chính xác không?
- [ ] Các chỉ số nhân vật (`cultivationProgress`, `health`, `resources`, `lifespanLimit`, `luck`) có bị thay đổi ngoài ý muốn không?
- [ ] Nhánh tử vong (`death: true`), chuỗi nguyên nhân kết thúc (`endingReason`) và cơ chế fallback khi `health <= 0` có được xử lý nhất quán không?
- [ ] Thay đổi có làm suy giảm tính chơi lại (replayability), phá vỡ tính tất định (determinism của RNG) hoặc gây lỗi dữ liệu save game không?

### 2.3. React & Giao Diện Người Dùng (React & UI)
- [ ] Trạng thái React (state/props/hooks) có được cập nhật đúng quy chuẩn immutability không?
- [ ] Có phát sinh lỗi render vòng lặp, lỗi điều hướng Hash routing, lỗi responsive trên các kích thước màn hình (Mobile 390px, Tablet 768px, Desktop 1440px) hoặc lỗi bất đồng bộ không?
- [ ] Dữ liệu hiển thị trên UI có đồng bộ chính xác 1:1 với trạng thái nội tại của simulation engine không?
- [ ] Tính năng sau khi sửa đổi có thể tương tác trơn tru bằng chuột/bàn phím và đáp ứng tiêu chuẩn accessibility tối thiểu không?

### 2.4. Lưu Trữ & Di Trú Dữ Liệu (Persistence & Migration)
- [ ] Có làm thay đổi schema lưu trữ `localStorage['myriad-lives-save']` hoặc khóa cache `indexedDB['myriad-lives-images']` không?
- [ ] Bản lưu cũ (tiếng Anh/tiếng Trung từ phiên bản trước) có tiếp tục được đọc và tự động di trú an toàn sang tiếng Việt (`language: 'vi'`) không?
- [ ] Đã kiểm tra các trường hợp biên của dữ liệu lưu (chỉ số âm, thiếu trường, dữ liệu lịch sử kiếp sống bị hỏng) chưa?

### 2.5. Quy Chuẩn Việt Hóa (Localization Standards)
- [ ] Thuật ngữ có nhất quán với quy chuẩn Việt hóa nội bộ (`docs/LOCALIZATION_STYLE_GUIDE.md`) không (ví dụ: phân định rõ `đồng đạo` vs `đạo lữ`, `linh tài` vs `vật tư`, `thể trạng` vs "máu")?
- [ ] Các biến nội suy (`${o}`, `${i}`, `${r}`, `${t.name}`) và ký hiệu định dạng (`·`, `✦`, `±`) có được bảo toàn nguyên vẹn không?
- [ ] Các chuỗi ghép nối giao diện có giữ đúng khoảng trắng đầu chuỗi và quy tắc chữ hoa/thường (đặc biệt là 4 dương tính giả `It[192]`, `It[260]`, `It[302]`, `It[306]`) không?
- [ ] Có xảy ra nhầm lẫn giữa ID nội bộ (`snake_case`) và văn bản hiển thị giao diện không?
- [ ] Có trường hợp chỉnh sửa câu chữ làm thay đổi ngoài ý muốn các khóa logic gameplay không?

### 2.6. Khả Năng Kiểm Thử & Bảo Trì (Testing & Maintainability)
- [ ] Bộ test hiện có (`tests/suite.js` và `tests/test_migration.js`) có bao phủ đầy đủ các đường đi quan trọng bị ảnh hưởng không?
- [ ] Test có thực sự kiểm tra hành vi thực tế hay chỉ kiểm tra dữ liệu giả định/mock?
- [ ] Có cần bổ sung kiểm thử cho các tình huống biên (edge cases) vừa sửa đổi không?
- [ ] Mã nguồn mới có tạo ra sự phụ thuộc chéo, side effect khó kiểm soát hoặc làm giảm khả năng truy vết của hệ thống không?

---

## 3. Phân Loại Mức Độ Nghiêm Trọng Của Phát Hiện (Severity Classification)

Mọi phát hiện (findings) trong quá trình review phải được phân loại khách quan, tuyệt đối không nâng hạng nghiêm trọng giả tạo:

- **P0 — Critical (Khẩn cấp):** Lỗi làm sập ứng dụng (crash), hỏng toàn bộ quy trình khởi chạy/mô phỏng, mất dữ liệu người dùng diện rộng, hoặc vi phạm nghiêm trọng tính toàn vẹn của mã nguồn.
- **P1 — High (Nghiêm trọng):** Lỗi logic lớn làm sai lệch tiến trình tu tiên, hỏng nhánh kết cục/thiên kiếp, vỡ điều hướng route chính, hoặc làm gãy vỡ khả năng tương thích ngược của save game.
- **P2 — Medium (Trung bình):** Sai lệch có phạm vi giới hạn nhưng ảnh hưởng trực tiếp đến trải nghiệm (lỗi hiển thị chỉ số, nhầm lẫn thuật ngữ ở một số sự kiện, thiếu `endingReason` dự phòng khi chấn thương nặng, giao diện tràn ngang nhẹ trên mobile).
- **P3 — Low (Thấp):** Vấn đề nhỏ, lỗi chính tả câu chữ không ảnh hưởng logic, tình huống biên cực kỳ hiếm gặp hoặc khuyến nghị tối ưu hóa nhỏ.

*Lưu ý:* Nếu không phát hiện lỗi nào đáng kể trong phạm vi review, agent phải báo cáo rõ ràng là **không có findings** trong phạm vi được kiểm tra, đi kèm danh sách giới hạn của đợt review.

---

## 4. Định Dạng Báo Cáo Code Review Chuẩn

Mỗi phát hiện cần tuân thủ cấu trúc 6 phần bắt buộc:

```markdown
### [P1] Lệch nhánh tử vong khi thể trạng tụt về 0 trong sự kiện kho thóc

- **Vị trí:** `src/main.js` (tìm kiếm: `sparse_mortal_granary_raiders` hoặc chỉ số `De[13]`).
- **Mô tả lỗi:** Nhánh bị thương (`injury`) chứa trường `endingReason` mô tả cái chết do bị đâm tại kho thóc, gây xung đột tự sự khi nhân vật đã thoát về dưỡng thương nhưng kiếp sống kết thúc sau đó.
- **Điều kiện kích hoạt & Tác động:** Xảy ra khi người chơi chọn nhánh chống cự, nhận sát thương -18 thể trạng khiến thể trạng tụt về 0. Thẻ Mệnh hiển thị sai lệch bối cảnh tử vong.
- **Bằng chứng:** Khảo sát logic `Ct(e, t)` tại dòng 10115074 (`St(e, t.endingReason || ...)`).
- **Đề xuất sửa đổi tối thiểu:** Xóa bỏ trường `endingReason` khỏi object `outcomes[1]` của sự kiện `De[13]`.
```

---

## 5. Quy Tắc Đối Với Source Bundle Đơn Khối (`src/main.js`)

Do `src/main.js` hiện là tệp bundle gộp đơn khối lớn (~12.6MB, 8 dòng):

1. **Định vị bằng chuỗi ổn định:** Tuyệt đối không dựa duy nhất vào số offset ký tự tuyệt đối (vì offset sẽ trượt sau mỗi lần sửa). Hãy sử dụng chuỗi định vị ngữ cảnh ổn định (ví dụ: tên hàm, ID sự kiện, tên biến `m=[[\`mortal\``, `He=[...Ee`).
2. **Phân định ranh giới mã nguồn:** Phân biệt rõ dữ liệu JSON tĩnh (`Ee`, `De`, `D`, `Oe`, `E`), dữ liệu mảng sinh động (`d.map`, `Ne`, `Be`, `he`, `Ve`), hàm toán học mô phỏng (`gt`, `wt`, `Ot`, `we`), logic lưu trữ (`Sn`, `Cn`) và các component JSX hiển thị.
3. **Thay đổi vi mô (Surgical Edits):** Ưu tiên các can thiệp nhỏ nhất có thể, đúng mục tiêu, kiểm tra kỹ cú pháp đóng/mở ngoặc của JSON và JavaScript trước khi lưu.
4. **Không refactor tự tiện:** Không tự ý bóc tách file hoặc làm đẹp (format/prettify) toàn bộ file nếu không có yêu cầu cụ thể, vì việc này làm thay đổi hàng triệu dòng diff và gây rủi ro xung đột git khổng lồ.

---

## 6. Quy Tắc Kiểm Thử & Xác Minh (Testing Protocol)

1. **Lệnh hợp lệ:** Sử dụng đúng các lệnh được định nghĩa trong `package.json`:
   - `npm test`: Thực thi 15 bài kiểm thử E2E trình duyệt và 2 bài kiểm thử di trú save game (yêu cầu Google Chrome).
   - `npm run build`: Đóng gói ứng dụng để kiểm tra lỗi cú pháp và tính toàn vẹn bundle.
   - `npm run dev`: Chạy môi trường phát triển cục bộ.
2. **CẢNH BÁO MÔI TRƯỜNG NODE.JS:** Tuyệt đối không chạy lệnh `node -e 'import("./src/main.js")'` vì `src/main.js` phụ thuộc vào các đối tượng trình duyệt (`window`, `document`) và sẽ gây lỗi crash `ReferenceError: document is not defined`.
3. **Hiểu rõ hợp đồng kiểm định dữ liệu:** Script `node scripts/verify_data_integrity.cjs` đối chiếu mã nguồn với cột `current_text` của baseline ban đầu. Hiện tại báo 53 sai lệch là **`EXPECTED DRIFT`** do 3 Gate đã được cố ý áp dụng trong code. Không được sửa script để che giấu sai lệch.

---

## 7. Quy Tắc Khi Chỉnh Sửa Mã Nguồn

Khi được người dùng cho phép sửa mã nguồn:
1. Xác định ranh giới file được phép sửa.
2. Kiểm tra hiện trạng, giữ nguyên các thay đổi chưa commit của người dùng.
3. Thực hiện sửa đổi nhỏ nhất đáp ứng yêu cầu.
4. Chạy `npm test` và `npm run build` để kiểm chứng.
5. Báo cáo trung thực kết quả kiểm thử.
6. Tuyệt đối không tự động chạy lệnh Git ghi (`git add`, `git commit`, `git reset`, `git checkout`).

---

## 8. Cập Nhật Tài Liệu Đồng Bộ

Khi có sự thay đổi về schema dữ liệu, công thức gameplay hoặc quy chuẩn Việt hóa:
- Cập nhật đồng bộ các tài liệu kỹ thuật tương ứng trong thư mục `docs/`.
- Không để tài liệu khẳng định quy tắc cũ vẫn đúng khi mã nguồn đã thay đổi.
- Phân biệt rõ giữa quyết định đã duyệt và đề xuất đang chờ review.

---

## 9. Ranh Giới Quyền Hạn (Scope Boundaries)

Tài liệu `AGENTS.md` này quy định tiêu chuẩn kỹ thuật nội bộ, **hoàn toàn không trao thêm quyền hạn** cho agent vượt quá phạm vi của từng nhiệm vụ do người dùng giao. Khi một nhiệm vụ được yêu cầu là "Chỉ đọc" (Read-Only), agent chỉ sử dụng các hướng dẫn trên để phân tích và lập báo cáo, tuyệt đối không tự ý can thiệp mã nguồn.
