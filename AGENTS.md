# Hướng Dẫn Vận Hành & Tiêu Chuẩn Đánh Giá Code Dành Cho Agent (AGENTS.md)
**Dự án:** Vạn Kiếp · Myriad Lives  
**Phạm vi áp dụng:** Toàn bộ AI coding agents và cộng tác viên tự động hóa làm việc trong repository này.

---

## 1. Nguyên Tắc Làm Việc Cốt Lõi

1. **Khảo sát trước khi hành động:** Đọc kỹ `README.md`, cấu trúc dự án và tài liệu hướng dẫn liên quan trước khi tiến hành đánh giá hoặc chỉnh sửa mã nguồn.
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
- [ ] Thuật ngữ có nhất quán với quy chuẩn Việt hóa nội bộ (ví dụ: phân định rõ `đồng đạo` vs `đạo lữ`, `linh tài` vs `vật tư`, `thể trạng` vs "máu")?
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

Mỗi phát hiện (finding) phải có ID ổn định duy nhất xuyên suốt các vòng review và tuân thủ cấu trúc thông tin chuẩn gồm 8 trường bắt buộc:

1. **Finding ID & Mức độ ưu tiên:** ID ổn định (ví dụ: `FINDING-001`, `FINDING-002`) kèm phân loại nghiêm trọng `[P0]`, `[P1]`, `[P2]`, hoặc `[P3]`.
2. **Trạng thái vòng lặp (Status):**
   - `NEW`: Phát hiện mới ở vòng hiện tại.
   - `RESOLVED`: Đã sửa và đã được kiểm chứng bằng test/bằng chứng trực tiếp (không báo lại như bug mới).
   - `UNRESOLVED`: Chưa được sửa từ vòng trước, giữ nguyên ID và tiếp tục theo dõi (không tạo bản sao).
   - `REGRESSION` / `REOPENED`: Lỗi từng được xác nhận sửa nhưng tái xuất hiện ở vòng sau; phải dẫn chiếu finding gốc và kèm bằng chứng mới.
3. **Vị trí & Điểm neo ổn định:** Tệp và khoảng dòng (`file:line-range`) theo commit đang review. Đối với bundle đơn khối `src/main.js`, bắt buộc cung cấp vị trí định danh ổn định (tên hàm, ID sự kiện, object/property, hoặc đoạn code neo).
4. **SHA căn cứ:** Commit SHA cụ thể được dùng làm phạm vi rà soát (Base diff ở Vòng 1; commit sửa lỗi `<fix_commit>` ở các vòng sau).
5. **Điều kiện kích hoạt & Bằng chứng trực tiếp:** Tình huống tái hiện lỗi và bằng chứng thực tế (trích dẫn dòng mã, biến, logic hoặc output lệnh/test).
6. **Nguyên nhân gốc & Tác động:** Bản chất khiếm khuyết ở cấp nguyên nhân gốc và tác động tới gameplay, UI, state, persistence, migration hoặc dữ liệu liên quan.
7. **Các vị trí liên quan (Same-pattern Locations):** Các caller/callee, nhánh điều kiện, flow phụ thuộc hoặc các vị trí có cùng pattern/logic cần rà soát đồng bộ; không chỉ sửa vị trí gây lỗi mà bỏ qua flow phụ thuộc.
8. **Phương án sửa gốc & Test hồi quy đề xuất:** Giải pháp khắc phục triệt để ở cấp nguyên nhân gốc (không vá hời hợt) và các ca kiểm thử hồi quy cần bổ sung.

Mẫu báo cáo finding chuẩn:

```markdown
### [P1] FINDING-001: Lệch nhánh tử vong khi thể trạng tụt về 0 trong sự kiện kho thóc

- **Trạng thái:** `NEW` (Vòng 1)
- **Vị trí:** `src/main.js` (Điểm neo ổn định: sự kiện `sparse_mortal_granary_raiders` hoặc chỉ số `De[13]`, nhánh `outcomes[1]`).
- **SHA căn cứ:** `c15057c835a269c8f90dfeb2ee7acb1a34f1bfe1`
- **Điều kiện kích hoạt & Bằng chứng:** Xảy ra khi người chơi chọn nhánh chống cự, nhận sát thương -18 thể trạng khiến thể trạng tụt về 0. Khảo sát logic `Ct(e, t)` tại dòng 10115074 (`St(e, t.endingReason || ...)`): nhánh bị thương chứa trường `endingReason` mô tả cái chết do bị đâm tại kho thóc.
- **Nguyên nhân gốc & Tác động:** Khai báo nhầm trường `endingReason` vào nhánh sống sót (`injury`), gây xung đột tự sự nghiêm trọng khi nhân vật đã thoát về dưỡng thương nhưng kiếp sống kết thúc sau đó lại hiển thị chết do bị đâm tại kho thóc.
- **Các vị trí liên quan cần kiểm tra:** Quét toàn bộ các sự kiện thuộc nhóm nguy cơ (`danger_*`, `sparse_*`) có nhánh `injury` nhận sát thương âm để đảm bảo không bị gán nhầm `endingReason`.
- **Phương án sửa gốc & Test hồi quy:** Xóa bỏ trường `endingReason` khỏi object `outcomes[1]` của `De[13]`. Bổ sung test kiểm tra sự kiện `De[13]` khi thể trạng tụt về 0 để xác nhận fallback về `"Trọng thương không qua khỏi"` thay vì thông điệp mâu thuẫn.
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
3. **Hiểu rõ hợp đồng kiểm định dữ liệu:** Khi sử dụng script kiểm định đối chiếu mã nguồn với baseline ban đầu (nếu có trong môi trường kiểm toán nội bộ), hiện tại báo 53 sai lệch là **`EXPECTED DRIFT`** do 3 Gate đã được cố ý áp dụng trong code. Không được sửa script hay mã nguồn để che giấu sai lệch.

---

## 7. Quy Tắc Sửa Lỗi & Chu Trình Review Lặp (Review-Fix Protocol)

Nhằm đảm bảo chất lượng kỹ thuật, tính hội tụ và tránh vòng lặp vô tận, mọi hoạt động review và sửa lỗi trong repository phải tuân thủ nghiêm ngặt 5 quy tắc chu trình sau:

### 7.1. Giới Hạn Tối Đa 3 Vòng Cho Mỗi PR (3-Round Review/Fix Limit)
- **Định nghĩa một vòng:** Một chu kỳ hoàn chỉnh gồm: *Review → Báo cáo finding → Sửa lỗi (Fix) → Review xác nhận*. Các thao tác đọc file hoặc chạy test phục vụ cùng một vòng không tính là các vòng riêng biệt.
- **Vòng 1:** Bắt buộc sử dụng `/teamwork-preview` để review toàn bộ diff của PR khi tính năng khả dụng. Nếu tính năng không khả dụng trong môi trường runtime hiện tại, phải ghi rõ lý do kỹ thuật trong báo cáo và sử dụng quy trình thay thế được cho phép (rà soát toàn diện diff qua công cụ cục bộ). Tuyệt đối không tuyên bố đã sử dụng công cụ nếu chưa thực sự thực thi. Ghi nhận base SHA, head SHA và danh sách finding với ID ổn định.
- **Vòng 2 & Vòng 3:** Chỉ review các thay đổi mới phát sinh từ commit sửa lỗi, cùng phạm vi code liên quan cần thiết.
- **Truy vết lịch sử vòng và finding:** Trước mỗi vòng, bắt buộc đọc báo cáo review gần nhất hoặc finding ledger đáng tin cậy để xác định chính xác số vòng hiện tại, danh sách Finding ID, trạng thái từng finding (`NEW`, `RESOLVED`, `UNRESOLVED`, `REGRESSION`/`REOPENED`) và các commit SHA đã review. Nếu không có lịch sử đủ tin cậy, agent phải báo rõ tình trạng thiếu thông tin và dừng lại xin người dùng xác nhận trước khi bắt đầu vòng tiếp theo; tuyệt đối không tự ý đặt lại bộ đếm vòng hoặc tạo finding trùng lặp.
- **Dừng tự động sau Vòng 3:** Khi kết thúc Vòng 3 mà vẫn còn lỗi chưa xử lý, lỗi cũ tái xuất hiện (`REGRESSION`), hoặc test thất bại:
  - **BẮT BUỘC DỪNG** quá trình patch tự động.
  - Lập báo cáo phân tích nguyên nhân gốc (Root Cause Analysis), giải thích rõ vì sao các vòng trước chưa giải quyết triệt để vấn đề.
  - Đề xuất tối đa **2 hướng xử lý** khả thi để người dùng lựa chọn.
- **Không tự mở Vòng 4:** Tuyệt đối không tự ý tiến hành vòng thứ 4 nếu chưa có sự phê duyệt trực tiếp và rõ ràng từ người dùng.
- **Báo cáo rủi ro khẩn cấp:** Nếu phát hiện rủi ro nghiêm trọng mới (P0/P1), phải báo ngay cho người dùng; nghiêm cấm dùng giới hạn vòng để che giấu hoặc bỏ qua lỗi.

### 7.2. Chỉ Review Diff Mới Sau Vòng Đầu (Incremental Diff Review)
- Ở Vòng 1, review toàn bộ diff giữa base ref và head ref của PR.
- Từ Vòng 2 trở đi, phạm vi review mặc định **bắt buộc phải là commit sửa lỗi cụ thể**, sử dụng cú pháp:
  ```bash
  git diff <fix_commit>^ <fix_commit>
  ```
- **Không dùng lại toàn bộ diff từ base** của PR làm phạm vi review mặc định ở các vòng sau.
- **Verdict tích lũy (Cumulative Verdict):** Dù Vòng 2 và 3 chỉ review diff của commit sửa lỗi cùng phạm vi liên quan cần thiết, verdict cuối cùng của đợt review bắt buộc phải được tính từ trạng thái tích lũy của toàn bộ finding các vòng trước, kết quả test hồi quy thực tế và các finding mới phát sinh. Tuyệt đối không được bỏ sót bất kỳ finding cũ chưa giải quyết (`UNRESOLVED`) chỉ vì nó nằm ngoài diff mới.
- **Quyền đọc mở rộng có kiểm soát:** Được phép đọc code ngoài diff mới khi cần kiểm tra caller/callee, luồng dữ liệu (data flow), trạng thái (state), nhánh sự kiện hoặc rủi ro hồi quy. Bắt buộc phải ghi rõ phạm vi mở rộng và lý do kỹ thuật trong báo cáo.
- **Không suy đoán commit SHA:** Nếu không thể xác định chính xác commit sửa lỗi mới cần review, agent phải báo thiếu thông tin và dừng lại; tuyệt đối không tự đoán SHA.

### 7.3. Gom Finding Theo Loại & Sửa Triệt Để Cấp Nguyên Nhân Gốc (Root-Cause Fix)
- **Kiểm tra tác động liên đới trước khi sửa:** Trước khi đề xuất hoặc thực hiện patch, bắt buộc kiểm tra ảnh hưởng của logic liên quan, các caller/callee, các nhánh điều kiện rẽ nhánh, dữ liệu lưu (`localStorage`, `indexedDB`), thứ tự xử lý và những vị trí có pattern tương tự. Tuyệt đối không chỉ vá hời hợt vị trí đang gây lỗi mà bỏ qua các flow phụ thuộc.
- **Gom lỗi có chung nguyên nhân:** Nhóm các lỗi có cùng nguyên nhân gốc thành một finding hoặc một nhóm giải pháp có hệ thống; không áp dụng thay đổi hàng loạt nếu chưa xác minh rằng các trường hợp có cùng ngữ nghĩa.
- **Định vị ổn định trên bundle đơn khối:** Đối với `src/main.js`, bên cạnh tệp và dòng, bắt buộc phải cung cấp vị trí định danh ổn định như tên hàm, event ID, object/property hoặc đoạn code neo.

### 7.4. Quản Lý Trạng Thái Finding & Chống Trùng Lặp (No Duplicate Reporting)
- **Duy trì ID ổn định:** Mỗi finding phải giữ nguyên ID duy nhất xuyên suốt toàn bộ các vòng review (ví dụ: `FINDING-001`, `FINDING-002`).
- **Phân loại trạng thái chuẩn:**
  - Finding đã sửa và được kiểm chứng: Đánh dấu `RESOLVED`, không báo lại như bug mới.
  - Finding chưa được sửa: Giữ nguyên trạng thái `UNRESOLVED`, không tạo bản sao; liệt kê trong bảng tổng hợp tồn đọng.
  - Finding tái xuất hiện: Đánh dấu `REGRESSION` hoặc `REOPENED`, dẫn chiếu finding gốc và cung cấp bằng chứng mới.
  - Cùng nguyên nhân gốc gây lỗi ở vị trí mới: Cập nhật finding cũ hoặc tạo finding liên quan với lý do rõ ràng.
- **Không bỏ qua lỗi cũ:** Tuyệt đối không được bỏ qua hoặc xóa lỗi chưa giải quyết chỉ vì lỗi đó đã từng xuất hiện ở vòng trước.

### 7.5. Điều Kiện Hoàn Tất Sửa Đổi (Completion Criteria)
Khi được người dùng cho phép sửa mã nguồn:
1. Không còn finding P0/P1/P2 chưa xử lý (tính trên toàn bộ trạng thái tích lũy qua các vòng) nếu tuyên bố code đã sẵn sàng merge.
2. Xác định đúng ranh giới file được phép sửa; giữ nguyên các thay đổi chưa commit của người dùng.
3. Thực hiện sửa đổi nhỏ nhất ở cấp nguyên nhân gốc đáp ứng yêu cầu.
4. Chạy các lệnh kiểm thử thực tế (`npm test`, `npm run build`) và ghi nhận kết quả thực tế; tuyệt đối không coi kết quả test cũ là lần chạy hiện tại.
5. Không có finding trùng lặp; mọi finding chưa xử lý và giới hạn kiểm chứng đều được nêu rõ ràng.
6. Nếu kết thúc 3 vòng mà chưa giải quyết xong, verdict phải phản ánh đúng thực tế và agent phải dừng patch để người dùng quyết định hướng xử lý.
7. Tuyệt đối không tự động chạy lệnh Git ghi (`git add`, `git commit`, `git reset`, `git checkout`).

---

## 8. Cập Nhật Tài Liệu Đồng Bộ

Khi có sự thay đổi về schema dữ liệu, công thức gameplay hoặc quy chuẩn Việt hóa:
- Cập nhật đồng bộ các tài liệu kỹ thuật tương ứng (nếu có).
- Không để tài liệu khẳng định quy tắc cũ vẫn đúng khi mã nguồn đã thay đổi.
- Phân biệt rõ giữa quyết định đã duyệt và đề xuất đang chờ review.

---

## 9. Ranh Giới Quyền Hạn (Scope Boundaries)

Tài liệu `AGENTS.md` này quy định tiêu chuẩn kỹ thuật nội bộ, **hoàn toàn không trao thêm quyền hạn** cho agent vượt quá phạm vi của từng nhiệm vụ do người dùng giao. Khi một nhiệm vụ được yêu cầu là "Chỉ đọc" (Read-Only), agent chỉ sử dụng các hướng dẫn trên để phân tích và lập báo cáo, tuyệt đối không tự ý can thiệp mã nguồn.

---

## 10. Kỹ Năng & Quy Trình Rà Soát Cục Bộ (Local Agent Skills)

Dự án trang bị sẵn các Agent Skills cục bộ tại `.agents/skills/` nhằm chuẩn hóa quy trình kiểm thử và rà soát code nội bộ:

1. **Kỹ năng Xác minh Hoàn thành (`cultivation-verify`):**
   - Vị trí: [`.agents/skills/cultivation-verify/SKILL.md`](.agents/skills/cultivation-verify/SKILL.md)
   - Nguyên tắc: Thực thi triệt để nguyên tắc bằng chứng (Iron Law of Verification). Tuyệt đối không tuyên bố hoàn thành công việc nếu chưa chạy kiểm thử thực tế và ghi nhận output thành công.
2. **Kỹ năng Rà soát Pull Request (`cultivation-pr-review`):**
   - Vị trí: [`.agents/skills/cultivation-pr-review/SKILL.md`](.agents/skills/cultivation-pr-review/SKILL.md)
   - Nguyên tắc: Chế độ hoàn toàn Chỉ Đọc (Strictly Read-Only). Rà soát diff thực tế của PR dựa trên 7 vùng rủi ro trọng tâm và tuân thủ định dạng báo cáo finding chuẩn tại Mục 4.
3. **Tài liệu quy trình chi tiết:** Tham khảo [`docs/DEVELOPMENT_WORKFLOW.md`](docs/DEVELOPMENT_WORKFLOW.md) để nắm rõ chu trình 8 giai đoạn từ lập kế hoạch đến human merge.
