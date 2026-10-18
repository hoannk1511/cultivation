---
name: cultivation-pr-review
description: Comprehensive, strictly read-only local code review skill for pull requests and git diffs in Vạn Kiếp · Myriad Lives. Analyzes changes across 7 critical risk areas following AGENTS.md standards without modifying code or communicating externally.
---

# Kỹ Năng Rà Soát Pull Request Cục Bộ (cultivation-pr-review)

Kỹ năng này cung cấp quy trình rà soát mã nguồn tự động, chuyên sâu và có tính tái lập cao cho dự án **Vạn Kiếp · Myriad Lives**. Kỹ năng được thiết kế để chạy cục bộ trên môi trường của nhà phát triển hoặc qua Antigravity agent, thay thế sự phụ thuộc vào các bot review bên thứ ba.

---

## 1. Nguyên Tắc Hoạt Động Cốt Lõi

1. **Chế độ hoàn toàn Chỉ Đọc (Strictly Read-Only):**
   - Kỹ năng này **TUYỆT ĐỐI KHÔNG** chỉnh sửa mã nguồn, không tự ý sửa lỗi, không tạo commit, không push code, không đăng comment lên GitHub, không resolve conversation và không thực hiện thao tác merge.
   - Nhiệm vụ duy nhất là phân tích, kiểm tra tính toàn vẹn và lập báo cáo rà soát khách quan cho người dùng.
2. **Nguyên tắc Bằng Chứng Thực Tế (Evidence-Based Findings):**
   - Mọi phát hiện (finding) bắt buộc phải có trích dẫn dòng code, chuỗi định vị ngữ cảnh, hoặc dữ liệu kiểm thử cụ thể chứng minh lỗi có thể xảy ra.
   - Tuyệt đối không suy diễn, không tạo lỗi giả định để lấp khoảng trống. Khi không đủ dữ liệu để khẳng định, phải ghi nhận rõ `CHƯA XÁC MINH` hoặc `SUY LUẬN CÓ CĂN CỨ`.
3. **Tôn trọng Ranh Giới Dự Án:**
   - Tuân thủ toàn diện các nguyên tắc vận hành trong [`AGENTS.md`](../../../AGENTS.md), đặc biệt là quy tắc can thiệp vi mô đối với source bundle đơn khối `src/main.js` và tính bất biến của dữ liệu lưu (`localStorage`).
4. **Nguyên Tắc Giới Hạn Bằng Chứng (Strict Evidence Scoping):**
   - Kết luận về mock, secret, external requests, responsive, migration và tính đúng đắn của logic phải giới hạn nghiêm ngặt theo nội dung thực sự đã đọc hoặc kịch bản thực sự đã chạy.
   - Tuyệt đối không chuyển kết quả của một vài ca test hoặc một vài tệp cấu hình thành tuyên bố bao phủ toàn hệ thống:
     - *External requests:* Chỉ tuyên bố không có external requests trong phạm vi các kịch bản test đã chạy; không khẳng định toàn bộ ứng dụng không có external requests ở các nhánh sự kiện chưa kích hoạt.
     - *Responsive:* Chỉ tuyên bố không tràn ngang trên các viewport cụ thể đã chạy kiểm thử (ví dụ: 390px, 768px, 1280px, 1440px); không suy rộng ra mọi thiết bị.
     - *Secrets:* Chỉ tuyên bố không phát hiện secret trong tên tệp và các tệp cấu hình đã đọc; không tuyên bố toàn bộ mã nguồn không có secret nếu chưa quét tĩnh toàn diện.
     - *Mock:* Chỉ tuyên bố không có mock sau khi đã đọc mã nguồn của chính tệp test đó.
     - *Migration:* Chỉ tuyên bố di trú thành công đối với các mẫu payload cụ thể đã chạy test.
     - *Gameplay & Events:* Không suy rộng từ smoke test ban đầu sang toàn bộ công thức toán học cảnh giới sâu hoặc toàn bộ thư viện sự kiện.
5. **Quy Trình Giới Hạn Vòng Lặp & Review Theo Diff Mới (Theo [`AGENTS.md`](../../../AGENTS.md) Mục 7):**
   - **Giới hạn 3 vòng:** Tối đa 3 vòng review/fix cho mỗi PR. Định nghĩa một vòng: *Review → Báo cáo finding → Sửa lỗi → Review xác nhận*.
   - **Vòng 1:** Bắt buộc sử dụng `/teamwork-preview` trên toàn bộ diff PR khi tính năng khả dụng. Nếu không khả dụng, ghi rõ lý do kỹ thuật và sử dụng quy trình thay thế được cho phép (rà soát toàn diện diff qua công cụ cục bộ); tuyệt đối không tuyên bố đã dùng nếu chưa thực sự chạy. Ghi lại base SHA, head SHA và danh sách finding có ID ổn định.
   - **Vòng 2 & Vòng 3:** Chỉ review diff phát sinh từ commit sửa lỗi (`git diff <fix_commit>^ <fix_commit>`). Không dùng lại toàn bộ diff từ base làm phạm vi mặc định.
   - **Dừng tự động sau Vòng 3:** Nếu kết thúc Vòng 3 mà vẫn còn lỗi tồn đọng (`UNRESOLVED`), lỗi cũ tái xuất hiện (`REGRESSION`), hoặc test thất bại: bắt buộc dừng patch tự động, lập báo cáo phân tích nguyên nhân gốc và đề xuất tối đa 2 hướng xử lý cho người dùng. Tuyệt đối không tự ý mở Vòng 4.
   - **Báo cáo khẩn cấp:** Báo ngay cho người dùng nếu phát hiện rủi ro nghiêm trọng mới (P0/P1); không dùng giới hạn vòng để che giấu lỗi.

---

## 2. Quy Trình Rà Soát 6 Bước (Review Protocol)

Khi được kích hoạt để rà soát một PR hoặc diff, agent phải thực hiện tuần tự 6 bước sau:

### Bước 1: Xác định Số Vòng Review, Lịch Sử Finding, Nhánh Cơ Sở (Base Ref), Nhánh PR (Head Ref) và Kiểm Tra Workspace
- **Xác định số vòng và truy vết lịch sử finding:**
  - Trước mỗi vòng, bắt buộc đọc báo cáo review gần nhất hoặc finding ledger đáng tin cậy để xác định chính xác: số vòng hiện tại (**Vòng 1**, **Vòng 2**, hoặc **Vòng 3**), danh sách Finding ID, trạng thái từng finding (`NEW`, `RESOLVED`, `UNRESOLVED`, `REGRESSION`/`REOPENED`) và commit SHA đã review.
  - *Xử lý khi thiếu lịch sử đáng tin cậy:* Nếu không có lịch sử đủ tin cậy, agent phải báo rõ tình trạng thiếu thông tin và dừng lại xin người dùng xác nhận số vòng và phạm vi tiếp theo; tuyệt đối không tự ý đặt lại bộ đếm vòng về 1 hoặc tạo finding trùng lặp.
  - *Đối chiếu trạng thái finding vòng trước (ở Vòng 2 & 3):* Liệt kê các finding đã xử lý (`RESOLVED`), các finding còn tồn đọng (`UNRESOLVED`), và kiểm tra xem có finding nào từng sửa nay bị tái xuất hiện (`REGRESSION` / `REOPENED`) không.
- **Xác định điểm rẽ nhánh, HEAD hiện tại và commit thực tế của base ref:**
  ```bash
  git rev-parse HEAD
  git merge-base origin/main HEAD
  git rev-parse origin/main
  ```
- **Quy tắc về Base Freshness và Phạm vi Review:**
  - *Phân biệt giữa thiếu freshness và mất phạm vi review:* Nhánh remote-tracking `origin/main` cục bộ có thể đã cũ (stale ref) nếu chưa được `git fetch` gần đây. Tuy nhiên, việc thiếu freshness đơn thuần **không tự động biến review thành `BLOCKED`** nếu vẫn xác định được diff rõ ràng đối chiếu với commit SHA cụ thể của `origin/main`. Agent ghi nhận rõ giới hạn này và commit SHA thực tế đã dùng làm căn cứ.
  - *Khi nào bị BLOCKED do Base Ref:* Chỉ chuyển sang trạng thái `REVIEW BLOCKED` khi không thể xác lập một phạm vi review đáng tin cậy (ví dụ: merge-base không tồn tại, ref bị lỗi hoặc xung đột không thể tách diff).
  - *Yêu cầu Fetch từ Remote:* Nếu người dùng hoặc quy trình bắt buộc phải phản ánh trạng thái PR mới nhất trên GitHub remote, agent **phải xin phép rõ ràng trước khi chạy `git fetch`**, tuyệt đối không tự ý fetch ngầm.
- **Kiểm Tra Trạng Thái Workspace Bằng Lệnh Tường Minh:**
  - Khi kiểm tra workspace trước và sau review, luôn chạy:
    ```bash
    git status --short --untracked-files=all
    ```
    (hoặc `git status -s -uall`) để liệt kê chi tiết từng tệp untracked cụ thể bên dưới các thư mục con.
  - **Tuyệt đối không tuyên bố** mọi nội dung untracked được bảo toàn chỉ dựa vào việc thư mục cấp cao vẫn hiển thị dấu `??`. Nếu không có bảng băm ban đầu, chỉ kết luận danh sách đường dẫn không thay đổi, không tuyên bố bảo toàn cấp độ byte.

### Bước 2: Trích xuất và Đo lường Diff Thực Tế (Phân Định Theo Vòng)
- **Vòng 1 — Toàn bộ Diff PR:**
  - Bắt buộc sử dụng `/teamwork-preview` để review toàn bộ diff của PR khi tính năng khả dụng. Nếu tính năng không khả dụng trong môi trường runtime hiện tại, phải ghi rõ lý do kỹ thuật trong báo cáo và sử dụng quy trình thay thế được cho phép (rà soát toàn diện diff qua công cụ cục bộ). Tuyệt đối không tuyên bố đã sử dụng nếu chưa thực sự chạy.
  - Trích xuất toàn bộ diff giữa base ref và head ref:
    ```bash
    git diff --stat origin/main...HEAD
    git diff origin/main...HEAD
    ```
  - Ghi lại base SHA, head SHA và danh sách finding có ID ổn định.
- **Vòng 2 & Vòng 3 — Chỉ Review Commit Sửa Lỗi (Incremental Diff):**
  - Bắt buộc sử dụng chính xác SHA của commit sửa lỗi làm phạm vi review:
    ```bash
    git diff <fix_commit>^ <fix_commit>
    ```
  - **Không dùng lại toàn bộ diff từ base** của PR làm phạm vi review mặc định ở các vòng tiếp theo.
  - *Không đoán SHA:* Nếu không thể xác định commit sửa lỗi mới cần review, agent phải báo thiếu thông tin và dừng lại để xin ý kiến; tuyệt đối không tự đoán SHA.
- **Quyền đọc mở rộng ngữ cảnh:**
  - Được phép đọc mã nguồn ngoài phạm vi diff mới khi cần kiểm tra caller/callee, luồng dữ liệu (data flow), trạng thái (state), nhánh sự kiện hoặc tác động hồi quy.
  - Bắt buộc phải ghi rõ phần mở rộng và lý do kỹ thuật trong báo cáo.

### Bước 3: Đọc Ngữ Cảnh Chuyên Sâu (Context Inspection)
- Đọc các hàm bao ngoài, component liên quan hoặc dữ liệu sự kiện liền kề trong `src/main.js` (dùng chuỗi định vị ổn định thay vì số ký tự tuyệt đối).
- Kiểm tra các tệp asset liên quan (`public/`, `fonts/`), cấu hình (`package.json`, `vite.config.js`) hoặc các tệp test (`tests/suite.js`, `tests/test_migration.js`).

### Bước 4: Đối Chiếu 7 Vùng Rủi Ro Trọng Tâm (7 Risk Areas Checklist)
Rà soát diff dựa trên 7 vùng rủi ro (chi tiết tại Mục 3). Lưu ý: 7 vùng này là bảng kiểm tra định hướng; **không bắt buộc** phải cố tạo ra lỗi ở mọi vùng nếu mã nguồn không có vấn đề.

### Bước 5: Lập Báo Cáo Theo Cấu Trúc Finding Chuẩn Của AGENTS.md
Mọi khiếm khuyết phát hiện được phải được trình bày chính xác theo cấu trúc chuẩn gồm 8 trường thông tin bắt buộc quy định tại Mục 4 của [`AGENTS.md`](../../../AGENTS.md). Gom các lỗi có cùng nguyên nhân gốc thành một nhóm, định vị ổn định trong bundle `src/main.js`, và kiểm tra toàn diện các flow phụ thuộc.

### Bước 6: Đưa Ra Kết Luận Đánh Giá (Final Verdict) & Điều Kiện Hoàn Tất
Xác định một trong 4 trạng thái nghiệm thu:
- **`READY`**: Không phát hiện lỗi P0/P1/P2; 100% vùng rủi ro áp dụng đạt trạng thái `VERIFIED` và có đầy đủ bằng chứng trực tiếp để khuyến nghị người dùng xem xét merge. Các ghi chú `Architectural Observation` (nếu có) không ngăn cản verdict này.
- **`READY WITH NON-BLOCKING NOTES`**: Không phát hiện lỗi P0/P1/P2; toàn bộ các vùng rủi ro trọng yếu đạt `VERIFIED`; chỉ có các lưu ý nhỏ (P3), khuyến nghị tối ưu hoặc ghi chú tài liệu không ảnh hưởng đến runtime và gameplay.
- **`CHANGES REQUIRED`**: Phát hiện ít nhất một lỗi P0, P1 hoặc P2 có bằng chứng cụ thể cần được khắc phục trước khi merge.
- **`REVIEW BLOCKED — INSUFFICIENT EVIDENCE`**: Không thể xác lập phạm vi review đáng tin cậy (ví dụ: merge-base không tồn tại hoặc lỗi tách diff), thiếu môi trường kiểm thử cần thiết, hoặc có vùng rủi ro trọng yếu rơi vào trạng thái `NOT VERIFIED` hoặc `PARTIALLY VERIFIED`. (Lưu ý: Thiếu tính mới của `origin/main` đơn thuần không phải lý do độc lập để BLOCKED nếu diff và commit SHA cơ sở vẫn xác định đáng tin cậy; đây là trạng thái thiếu bằng chứng để xác nhận mức độ sẵn sàng merge, không đồng nghĩa với việc kết luận PR chắc chắn có lỗi).

**Điều Kiện Hoàn Tất & Giới Hạn Nghiệm Thu:**
1. **Không còn lỗi P0/P1/P2:** Tuyệt đối không đưa ra verdict `READY` hoặc `READY WITH NON-BLOCKING NOTES` nếu còn bất kỳ finding P0/P1/P2 nào chưa xử lý (`UNRESOLVED`), tính trên toàn bộ trạng thái tích lũy qua các vòng.
2. **Tính toán Verdict tích lũy (Cumulative Verdict):** Dù Vòng 2 và Vòng 3 chỉ review diff của commit sửa lỗi cùng phạm vi liên quan cần thiết, verdict cuối cùng của đợt review bắt buộc phải được tính từ trạng thái tích lũy của **toàn bộ finding từ các vòng trước**, kết quả test hồi quy thực tế và các finding mới phát sinh. Tuyệt đối không được bỏ sót bất kỳ finding cũ chưa giải quyết (`UNRESOLVED`) chỉ vì vị trí đó nằm ngoài diff mới.
3. **Kiểm thử thực tế vòng hiện tại:** Test phù hợp (`npm test`) phải được chạy thực tế trong vòng hiện tại và ghi nhận output thực tế; không coi kết quả test cũ là lần chạy hiện tại.
4. **Không trùng lặp finding:** Mọi finding phải có ID duy nhất; các finding chưa xử lý và giới hạn kiểm chứng phải được liệt kê minh bạch.
5. **Dừng tự động sau Vòng 3:** Khi kết thúc Vòng 3 mà vẫn còn lỗi chưa xử lý, lỗi cũ tái xuất hiện (`REGRESSION`), hoặc test thất bại:
   - Bắt buộc dừng quá trình patch tự động.
   - Verdict phải phản ánh đúng tình trạng thực tế (`CHANGES REQUIRED` hoặc `REVIEW BLOCKED — INSUFFICIENT EVIDENCE`).
   - Lập báo cáo phân tích nguyên nhân gốc sau Vòng 3, giải thích vì sao các vòng trước chưa giải quyết được và đề xuất tối đa 2 hướng xử lý để người dùng lựa chọn.
   - Không tự mở Vòng 4 nếu chưa có chấp thuận rõ ràng của người dùng.

**Quy Tắc Ưu Tiên Verdict (Verdict Precedence Rule):**
1. **Lỗi cụ thể ưu tiên hơn thiếu bằng chứng:** Khi phát hiện hoặc còn tồn đọng ít nhất một defect cụ thể thuộc cấp P0, P1 hoặc P2 (tính trên toàn bộ trạng thái tích lũy qua các vòng), verdict bắt buộc phải là **`CHANGES REQUIRED`** (ngay cả khi một số vùng rủi ro khác chưa đủ bằng chứng), nhằm cung cấp thông tin hành động rõ ràng cho tác giả sửa lỗi trước. Báo cáo phải đồng thời liệt kê các vùng còn thiếu bằng chứng.
2. **Không được chọn `READY` khi thiếu bằng chứng:** Tuyệt đối không được đưa ra verdict `READY` hoặc `READY WITH NON-BLOCKING NOTES` nếu còn bất kỳ vùng rủi ro trọng yếu nào chưa được xác minh đầy đủ (đang ở trạng thái `NOT VERIFIED` hoặc `PARTIALLY VERIFIED`). Trong trường hợp này, nếu không có lỗi P0/P1/P2, verdict bắt buộc phải là **`REVIEW BLOCKED — INSUFFICIENT EVIDENCE`**.
3. **Ghi nhận Architectural Observation:** Các ghi chú kiến trúc thuần túy không được coi là defect, không làm hạ verdict xuống `CHANGES REQUIRED`, và không được gán nhãn là lỗi P3.

---

## 3. Checklist 7 Vùng Rủi Ro Trọng Tâm

### 3.1. Gameplay & Tính Toán Mô Phỏng (Gameplay Formulas & Progression)
- [ ] Công thức tính xác suất đột phá cảnh giới, tiêu hao tài nguyên và tăng giảm chỉ số (`cultivationProgress`, `health`, `lifespanLimit`, `luck`) có đúng thiết kế không?
- [ ] Tính tất định của bộ sinh số ngẫu nhiên (RNG) có bị phá vỡ không?
- [ ] Có xuất hiện lỗi vi phạm ranh giới toán học (chia cho 0, chỉ số âm ngoài ý muốn, tràn số, NaN) không?

### 3.2. Tính Toàn Vẹn Dữ Liệu Sự Kiện & Nhánh Tử Vong (Data Integrity & Events)
- [ ] Cấu trúc sự kiện (`choices`, `outcomes`, `effects`, `weight`) có tuân thủ đúng schema không?
- [ ] ID sự kiện mới có duy nhất không (không trùng lặp với `De` hay `Ee`)?
- [ ] Điều kiện kích hoạt (`conditions`, `allowedRealms`, `minAge`, `cooldownYears`) có đầy đủ không?
- [ ] Xử lý nhánh tử vong (`death: true`), chuỗi nguyên nhân kết thúc (`endingReason`) và cơ chế fallback khi `health <= 0` có nhất quán không? (Tránh lỗi gán nhầm `endingReason` vào nhánh thoát chết như tại sự kiện kho thóc).

### 3.3. Lưu Trữ & Di Trú Dữ Liệu (Persistence & Migration)
- [ ] Có làm thay đổi khóa hoặc schema của `localStorage['myriad-lives-save']` và `indexedDB['myriad-lives-images']` không?
- [ ] Bản lưu từ các phiên bản cũ có tiếp tục được đọc và tự động di trú an toàn sang định dạng mới không?
- [ ] Đã kiểm tra các trường hợp biên của dữ liệu lưu (chỉ số âm, thiếu trường dữ liệu, dữ liệu lịch sử kiếp sống bị hỏng) chưa?

### 3.4. Giao Diện & Vận Hành Offline (UI & Offline-first Asset Integrity)
- [ ] Giao diện có responsive tốt trên các kích thước màn hình chuẩn: Mobile (390px), Tablet (768px), Desktop (1440px) không?
- [ ] Font chữ có sử dụng font OFL nội bộ từ `/fonts/` không?
- [ ] **Quy chuẩn Zero Runtime External Requests:** Tuyệt đối không gọi tài nguyên mạng ngoài runtime (không CDN, không Google Fonts, không external API).
- [ ] Trạng thái React (state/props/hooks) có cập nhật đúng nguyên tắc bất biến (immutability), không gây render vô tận không?

### 3.5. Chất Lượng Kiểm Thử (Test Quality & Completeness)
- [ ] Các thay đổi mới có được bảo vệ bởi kiểm thử tương ứng không?
- [ ] Test có thực sự kiểm tra hành vi thực tế trên trình duyệt thật (như `tests/suite.js`) hay chỉ mock giả lập?
- [ ] Bộ test có thể chạy thành công từ một bản sao sạch (clean clone) mà không cần cấu hình ẩn không?

### 3.6. Vệ Sinh Repository & An Toàn Bảo Mật (Repo Hygiene & Security)
- [ ] Có lộ lọt bí mật (API keys, tokens, mật khẩu, private paths) trong diff không?
- [ ] Có vô tình đưa các tệp tạm thời, tệp rác hệ thống (`.DS_Store`), tệp bundle build (`dist/`), hay các tệp CSV/báo cáo nháp nội bộ vào Git không?
- [ ] Các tệp phụ thuộc mới trong `package.json` có cần thiết và an toàn không?

### 3.7. Chuẩn Mực Việt Hóa & Đồng Bộ Tài Liệu (Localization & Docs Sync)
- [ ] Thuật ngữ có nhất quán với quy chuẩn nội bộ (phân định rõ `đồng đạo` vs `đạo lữ`, `linh tài` vs `vật tư`, `thể trạng` vs "máu")?
- [ ] Các biến nội suy (`${o}`, `${i}`, `${r}`, `${t.name}`) và ký hiệu định dạng (`·`, `✦`, `±`) có được bảo toàn nguyên vẹn không?
- [ ] Giữ đúng khoảng trắng đầu chuỗi tại các chuỗi ghép nối giao diện?
- [ ] Tài liệu kỹ thuật (`README.md`, `AGENTS.md`) có được cập nhật đồng bộ nếu có thay đổi về quy trình hoặc schema không?

---

## 4. Phân Loại Mức Độ Nghiêm Trọng (Severity Classification)

- **P0 — Critical (Khẩn cấp):** Lỗi gây sập ứng dụng (crash), hỏng quy trình khởi chạy/mô phỏng, mất dữ liệu lưu diện rộng, vi phạm an toàn mã nguồn nghiêm trọng, hoặc phát sinh request ra mạng ngoài.
- **P1 — High (Nghiêm trọng):** Lỗi logic làm sai lệch tiến trình tu tiên, hỏng nhánh kết cục/thiên kiếp, vỡ điều hướng route chính, hỏng tương thích ngược của save game, hoặc vi phạm nghiêm trọng tính bất biến của state.
- **P2 — Medium (Trung bình):** Sai lệch có phạm vi giới hạn ảnh hưởng trực tiếp đến trải nghiệm (lỗi hiển thị chỉ số, nhầm lẫn thuật ngữ ở một số sự kiện, thiếu `endingReason` dự phòng khi chấn thương nặng, lỗi responsive nhẹ trên mobile).
- **P3 — Low (Thấp):** Vấn đề nhỏ, lỗi chính tả câu chữ không ảnh hưởng logic, tình huống biên cực kỳ hiếm gặp hoặc khuyến nghị cải thiện khả năng đọc mã nguồn.

*Lưu ý về Ghi Chú Kiến Trúc (Architectural Observations):* Các cảnh báo từ công cụ đóng gói (ví dụ: kích thước chunk bundle của Vite) đối với kiến trúc đơn khối đã được định trước trong [`AGENTS.md`](../../../AGENTS.md) Mục 5, nếu không có lỗi/khiếm khuyết cụ thể cần sửa, phải được phân loại thành **Architectural Observation** chứ không tính là lỗi P3. Các ghi chú này không làm hạ thấp verdict thành `CHANGES REQUIRED` và được trình bày trong một mục riêng biệt của báo cáo.

*Lưu ý về Ý Nghĩa Của `0 FINDINGS`:* Khi báo cáo ghi nhận `0 FINDINGS`, điều này **chỉ có nghĩa là không phát hiện khiếm khuyết P0–P3 trong phạm vi các tệp và kịch bản thực sự đã được kiểm tra**. Nó **tuyệt đối không phải là chứng minh toàn bộ mã nguồn không có lỗi**, đặc biệt đối với các khu vực chưa được kiểm tra hoặc chỉ mới kiểm tra một phần (PARTIALLY VERIFIED / NOT VERIFIED).

---

## 5. Cấu Trúc Báo Cáo Finding Chuẩn (Theo AGENTS.md Mục 4)

Mọi phát hiện bắt buộc phải có ID ổn định duy nhất xuyên suốt các vòng review và tuân thủ đúng 8 trường thông tin theo quy chuẩn Mục 4 của [`AGENTS.md`](../../../AGENTS.md):

```markdown
### [Mức độ P0/P1/P2/P3] FINDING-XXX: Tiêu đề phát hiện ngắn gọn, rõ nghĩa

- **Trạng thái:** `NEW` | `RESOLVED` | `UNRESOLVED` | `REGRESSION` / `REOPENED`
- **Vị trí:** Đường dẫn tệp và khoảng dòng (`file:line-range`). Đối với bundle đơn khối `src/main.js`, bắt buộc có điểm neo ổn định (tên hàm, ID sự kiện, object/property, hoặc đoạn code neo).
- **SHA căn cứ:** Commit SHA cụ thể làm phạm vi rà soát (Base diff ở Vòng 1; commit sửa lỗi `<fix_commit>` ở các vòng sau).
- **Điều kiện kích hoạt & Bằng chứng trực tiếp:** Tình huống xảy ra lỗi và trích dẫn dòng code, biến, logic hoặc output kiểm thử thực tế.
- **Nguyên nhân gốc & Tác động:** Bản chất khiếm khuyết ở cấp nguyên nhân gốc và hệ quả trực tiếp đối với gameplay, runtime, dữ liệu hoặc khả năng bảo trì.
- **Các vị trí liên quan (Same-pattern Locations):** Các caller/callee, nhánh rẽ điều kiện, flow phụ thuộc hoặc các vị trí có cùng pattern cần kiểm tra đồng bộ.
- **Phương án sửa gốc & Test hồi quy đề xuất:** Phương án khắc phục triệt để ở cấp nguyên nhân gốc và các ca kiểm thử hồi quy cần bổ sung.
```

---

## 6. Mẫu Báo Cáo Rà Soát Tổng Hợp (Review Report Template)

Khi hoàn tất rà soát, agent trình bày kết quả theo mẫu sau:

```markdown
# Báo Cáo Rà Soát PR Cục Bộ: [Tên PR hoặc Nhánh]

- **Số vòng review:** [Vòng 1 / Vòng 2 / Vòng 3]
- **Nhánh cơ sở (Base ref):** `origin/main` (`<commit-sha>`)
- **Nhánh rà soát (Head ref):** `<branch-name>` (`<commit-sha>`)
- **Commit sửa lỗi căn cứ (từ Vòng 2):** `<fix_commit>` (`git diff <fix_commit>^ <fix_commit>`)
- **Phạm vi thay đổi:** `<N> files changed, +<X> / -<Y> lines`
- **Thời điểm rà soát:** `<YYYY-MM-DD HH:mm>`
- **Tình trạng tính mới Base ref:** [Xác nhận mới nhất qua fetch / Chưa fetch - cục bộ tracking ref]
- **Tổng hợp trạng thái finding:** `<X> RESOLVED, <Y> UNRESOLVED, <Z> REGRESSION, <W> NEW`

## Tóm Tắt Đánh Giá (Executive Summary)
[Tóm tắt ngắn gọn 2-3 câu về chất lượng tổng thể của diff, các điểm sáng và các rủi ro chính được phát hiện]

## Chi Tiết Các Phát Hiện (Findings)
[Nếu không có lỗi: "Không phát hiện lỗi P0-P3 trong phạm vi rà soát."]
[Nếu có lỗi: Liệt kê từng finding tuân thủ nghiêm ngặt cấu trúc chuẩn 8 trường ở Mục 5, gom theo nhóm nguyên nhân gốc]

## Ghi Chú Kiến Trúc (Architectural Observations - nếu có)
[Các ghi chú về đặc tính thiết kế, cảnh báo bundler không phải là defect]

## Bảng Kiểm 7 Vùng Rủi Ro (Risk Checklist Status)
*Phân loại rõ: VERIFIED (đã kiểm chứng trực tiếp), PARTIALLY VERIFIED (kiểm chứng một phần), NOT VERIFIED (chưa kiểm chứng), NOT APPLICABLE (không áp dụng).*
- 1. Gameplay Formulas & Progression: [VERIFIED / PARTIALLY VERIFIED / NOT VERIFIED] - [Bằng chứng cụ thể hoặc phần còn thiếu]
- 2. Data Integrity & Events: [VERIFIED / PARTIALLY VERIFIED / NOT VERIFIED] - [Bằng chứng cụ thể hoặc phần còn thiếu]
- 3. Persistence & Migration: [VERIFIED / PARTIALLY VERIFIED / NOT VERIFIED] - [Bằng chứng cụ thể hoặc phần còn thiếu]
- 4. UI & Offline-first Asset Integrity: [VERIFIED / PARTIALLY VERIFIED / NOT VERIFIED] - [Bằng chứng cụ thể hoặc phần còn thiếu]
- 5. Test Quality & Completeness: [VERIFIED / PARTIALLY VERIFIED / NOT VERIFIED] - [Bằng chứng cụ thể hoặc phần còn thiếu]
- 6. Repo Hygiene & Security: [VERIFIED / PARTIALLY VERIFIED / NOT VERIFIED] - [Bằng chứng cụ thể hoặc phần còn thiếu]
- 7. Localization & Docs Sync: [VERIFIED / PARTIALLY VERIFIED / NOT VERIFIED] - [Bằng chứng cụ thể hoặc phần còn thiếu]

## Kết Luận & Khuyến Nghị (Verdict & Next Steps)
- **Kết luận:** [READY | READY WITH NON-BLOCKING NOTES | CHANGES REQUIRED | REVIEW BLOCKED — INSUFFICIENT EVIDENCE]
- **Khuyến nghị tiếp theo cho người dùng:** [Khuyến nghị hành động tiếp theo, phân biệt rõ giữa việc code có lỗi hay chỉ thiếu bằng chứng kiểm chứng]

## Phân Tích Nguyên Nhân Gốc Sau Vòng 3 (Chỉ áp dụng nếu kết thúc Vòng 3 vẫn còn lỗi)
- **Bối cảnh dừng tự động:** Kết thúc 3 vòng review/fix nhưng vẫn còn lỗi tồn đọng (`UNRESOLVED`) hoặc test thất bại. Agent dừng tự động patch theo Mục 7 [`AGENTS.md`](../../../AGENTS.md).
- **Phân tích nguyên nhân gốc:** [Giải thích sâu vì sao các vòng trước chưa giải quyết được triệt để vấn đề]
- **Đề xuất tối đa 2 hướng xử lý:**
  - Hướng 1: [Mô tả giải pháp kiến trúc / tái thiết kế kèm ưu nhược điểm]
  - Hướng 2: [Mô tả giải pháp thay thế / thu hẹp phạm vi kèm ưu nhược điểm]
```

