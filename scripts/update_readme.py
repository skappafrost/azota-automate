import os

path = os.path.expanduser('~/azota-god-mode/README.md')
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Read {len(content)} chars")

# Find insertion point
marker = '\n---\n\n## 🇬🇧 ENGLISH'
idx = content.find(marker)
print(f"Marker at idx={idx}")

before = content[:idx]
after = content[idx:]  # keep the marker itself

new_section = """---

## ❓ CÂU HỎI THƯỜNG GẶP (Q&A)

### 1. Script có hoạt động trên tất cả các trang của azota.vn không?
Script hoạt động trên tất cả các trang thuộc domain `*.azota.vn`. Tuy nhiên, script chỉ hiển thị menu và hoạt động đầy đủ trên các trang **bài kiểm tra** (exam) và **trang kết quả** (result page). Trên các trang khác như trang chủ, trang thông báo, menu vẫn có thể mở được nhưng không có câu hỏi để xử lý.

### 2. Tại sao script không thấy câu hỏi dù đã vào trang kiểm tra?
Đây là vấn đề thường gặp nhất. Nguyên nhân là do **azota.vn dùng cơ chế lazy-load** — câu hỏi chỉ được tải khi bạn cuộn chuột đến gần chúng.

**Giải pháp**: Trước khi bấm 🧠 LEARN hoặc 🎯 REVIEW, bạn **PHẢI cuộn chuột từ đầu đến cuối trang** để trình duyệt tải toàn bộ DOM (Document Object Model) của bài kiểm tra. Chỉ khi tất cả câu hỏi đã hiển thị trên màn hình, script mới có thể quét và phát hiện được chúng.

Các bước cụ thể:
1. Mở bài kiểm tra
2. **Cuộn chuột từ trên xuống dưới cùng** của trang, đảm bảo bạn đã thấy câu hỏi cuối cùng
3. Cuộn ngược lại lên đầu trang
4. Lúc này mới bấm ` (backtick) để mở menu
5. Bấm 🧠 LEARN hoặc 🎯 REVIEW

> **\u26a0\ufe0f Lưu ý quan trọng**: Nếu bạn chỉ ở đầu trang và bấm LEARN, script chỉ học được những câu hỏi hiện có trên màn hình. Các câu hỏi ở phía dưới chưa được tải vào DOM nên script không thể nhìn thấy chúng. Hãy luôn cuộn hết trang trước khi sử dụng bất kỳ chức năng nào của script.

### 3. Làm sao để biết script đã hoạt động?
Khi script hoạt động, bạn sẽ thấy:
- Một menu nổi màu xanh đen ở góc phải màn hình (sau khi bấm phím ` (backtick) — phím bên trên phím Tab)
- Menu có tiêu đề **\u26a1SKAPPA v15.3**
- Dòng trạng thái ở cuối menu hiển thị thông báo
- Các nút bấm có hiệu ứng hover (đổi màu, phát sáng)

### 4. Tại sao bấm nút LEARN không thấy tăng số lượng câu đã học?
Có thể do:
- **Chưa cuộn trang để tải hết DOM** (xem câu 2 ở trên)
- **Chưa chọn đáp án nào** — LEARN trên trang kiểm tra chỉ học những câu bạn đã chọn đáp án
- **Đang ở trang không có câu hỏi** — script không tìm thấy element câu hỏi nào
- **azota.vn đã thay đổi cấu trúc HTML** — các selector cũ không còn hoạt động

### 5. LEARN trên trang kết quả (result page) khác gì LEARN trên trang kiểm tra?
- **Trên trang kiểm tra**: LEARN sẽ học **đáp án bạn đã chọn** (có thể đúng hoặc sai)
- **Trên trang kết quả**: LEARN sẽ trích xuất **đáp án đúng** từ đáp án của giáo viên. Hỗ trợ trắc nghiệm, Đúng/Sai và Tự luận

Script tự động phát hiện loại trang và điều chỉnh hành vi phù hợp. Khi ở trang kết quả, tiêu đề menu sẽ đổi thành **\u26a1SKAPPA RESULT**.

### 6. Tại sao Pilot (Auto Pilot) không hoạt động trên trang kết quả?
Pilot được thiết kế **chỉ hoạt động trên trang kiểm tra**. Trên trang kết quả, nút Pilot sẽ hiển thị thông báo "Pilot not available on result page!" vì không có câu hỏi nào để điền.

### 7. Dữ liệu đã học có bị mất khi tắt trình duyệt không?
**Không.** Dữ liệu được lưu trong **localStorage** của trình duyệt — nó tồn tại ngay cả khi bạn:
- Tắt trình duyệt
- Khởi động lại máy tính
- Đóng tab azota.vn

Dữ liệu chỉ bị mất nếu bạn:
- Xóa lịch sử trình duyệt (chọn "Xóa dữ liệu trang web")
- Bấm nút **\U0001f5d1 CLEAR** trong menu
- Vào DevTools (F12) \u2192 Application \u2192 Clear Storage

### 8. Làm sao để chuyển dữ liệu đã học sang máy tính khác?
Sử dụng tính năng Xuất/Nhập:
1. Trên máy A: Bấm **\u2b07 EXPORT** \u2192 tải file `skappa_azota_backup.json`
2. Gửi file đó sang máy B (email, USB, cloud...)
3. Trên máy B (đã cài script): Bấm **\u2b06 IMPORT** \u2192 chọn file \u2192 dữ liệu được gộp vào

### 9. Script có ảnh hưởng đến tốc độ trang web không?
Script rất nhẹ — chỉ khoảng 50KB sau khi nén. Nó không gọi API bên ngoài, không gửi dữ liệu đi đâu, và chỉ chạy khi bạn tương tác với menu hoặc bấm nút. Bạn sẽ không thấy bất kỳ sự khác biệt nào về tốc độ tải trang.

### 10. Tôi có thể đóng góp ý kiến hoặc báo lỗi ở đâu?
Bạn có thể:
- Mở [GitHub Issue](https://github.com/skappafrost/azota-god-mode/issues) để báo lỗi hoặc đề xuất tính năng
- Xem mã nguồn tại `src/azota-god-mode.user.js`
- Đọc hướng dẫn đóng góp tại [CONTRIBUTING.md](CONTRIBUTING.md)

### 11. Script có hoạt động trên điện thoại không?
Có, nhưng chỉ trên **Kiwi Browser** (Android) vì nó hỗ trợ extension Tampermonkey. Trên iOS (Safari) không hỗ trợ Tampermonkey nên script không hoạt động.

### 12. Tôi có thể tuỳ chỉnh giao diện menu không?
Hiện tại chưa có tính năng tuỳ chỉnh giao diện. Tuy nhiên, bạn có thể **kéo thả menu** đến bất kỳ vị trí nào trên màn hình — vị trí sẽ được lưu lại sau khi reload trang.

### 13. Làm sao để tắt script tạm thời?
Có 2 cách:
- **Cách 1 (nhanh)**: Click icon Tampermonkey \U0001f3ad trên thanh toolbar \u2192 Toggle switch để tắt script
- **Cách 2 (tạm thời)**: Bấm phím ` (backtick) để ẩn menu — script vẫn chạy ngầm nhưng không gây khó chịu

### 14. Script có thể bị phát hiện không?
Script chạy hoàn toàn trong trình duyệt của bạn, không gửi dữ liệu đi đâu, không thay đổi URL, không gọi API lạ. Nó tương tác với trang web giống hệt như một người dùng bình thường — click chuột, điền text, chọn đáp án. Vì vậy **rất khó bị phát hiện** từ phía máy chủ.

> **Lưu ý**: Dù khó bị phát hiện, việc sử dụng script vẫn có thể vi phạm quy chế thi của trường bạn. Hãy đảm bảo bạn đã được sự cho phép của giáo viên.

---

## \U0001f4d6 HƯỚNG DẪN CHI TIẾT (TIẾNG VIỆT)

Hướng dẫn từ A đến Z cho người mới bắt đầu. Làm theo từng bước để sử dụng script thành công.

---

### Phần 1: Cài đặt Môi Trường

#### Bước 1.1 — Kiểm tra trình duyệt
Script này yêu cầu trình duyệt có hỗ trợ cài extension. Các trình duyệt được khuyến nghị:
- \u2705 **Google Chrome** (bản 100+)
- \u2705 **Microsoft Edge** (bản 100+)
- \u2705 **Brave Browser**
- \u2705 **Firefox** (bản 100+)
- \u2705 **Opera**
- \u26a0\ufe0f **Kiwi Browser** (Android) — có hỗ trợ nhưng giao diện nhỏ

#### Bước 1.2 — Cài đặt Tampermonkey

**Trên Chrome / Edge / Brave:**
1. Mở Chrome Web Store: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
2. Bấm **"Thêm vào Chrome"** (Add to Chrome)
3. Bấm **"Thêm extension"** trong cửa sổ pop-up
4. Sau khi cài xong, bạn sẽ thấy icon Tampermonkey (\U0001f3ad) xuất hiện trên thanh toolbar (góc phải trên cùng)
5. Nếu không thấy icon, bấm icon puzzle (\U0001f9e9) \u2192 ghim Tampermonkey lên toolbar

**Trên Firefox:**
1. Mở Firefox Add-ons: https://addons.mozilla.org/vi/firefox/addon/tampermonkey/
2. Bấm **"Thêm vào Firefox"**
3. Bấm **"Thêm"** trong cửa sổ pop-up

**Trên Android (Kiwi Browser):**
1. Cài [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) từ Google Play
2. Mở Chrome Web Store ngay trong Kiwi Browser
3. Cài Tampermonkey như trên Chrome

#### Bước 1.3 — Kiểm tra Tampermonkey đã hoạt động
1. Bấm icon \U0001f3ad trên toolbar
2. Bạn sẽ thấy bảng điều khiển (Dashboard) với danh sách script đã cài
3. Nếu là lần đầu, danh sách sẽ trống

---

### Phần 2: Cài đặt Script

#### Cách A — Cài từ GitHub (khuyến nghị)
1. Mở link này trong trình duyệt: `https://github.com/skappafrost/azota-god-mode`
2. Vào thư mục `src/`
3. Bấm vào file `azota-god-mode.user.js`
4. Bấm nút **"Raw"** (góc phải trên cùng của mã nguồn)
5. Tampermonkey sẽ tự động nhận diện và hiển thị trang cài đặt
6. Bấm **"Install"** (Cài đặt)

#### Cách B — Cài từ URL
1. Bấm icon \U0001f3ad \u2192 **"Dashboard"**
2. Bấm tab **"Utilities"** (Tiện ích)
3. Trong ô "Install from URL", dán link:
   ```
   https://raw.githubusercontent.com/skappafrost/azota-god-mode/main/src/azota-god-mode.user.js
   ```
4. Bấm **"Install"**
5. Xác nhận cài đặt

#### Cách C — Copy-Paste thủ công
1. Bấm icon \U0001f3ad \u2192 **"Dashboard"**
2. Bấm **"Create a new script"** (Tạo script mới)
3. Xoá toàn bộ code mẫu có sẵn
4. Mở file `azota-god-mode.user.js` từ GitHub và copy toàn bộ nội dung
5. Dán vào ô soạn thảo
6. Bấm **Ctrl+S** (hoặc **Cmd+S** trên Mac) để lưu
7. Đặt tên cho script (tuỳ chọn), ví dụ: "Azota God Mode"

---

### Phần 3: Kích Hoạt Script

#### Bước 3.1 — Kiểm tra script đã được bật
1. Bấm icon \U0001f3ad \u2192 **"Dashboard"**
2. Tìm script "Azota God Mode" trong danh sách
3. Đảm bảo công tắc bên cạnh tên script ở trạng thái **ON** (màu xanh)
4. Nếu là OFF (màu xám), bấm vào công tắc để bật

#### Bước 3.2 — Vào trang azota.vn
1. Mở tab mới và điều hướng đến `https://azota.vn`
2. Đăng nhập vào tài khoản của bạn
3. Vào bài kiểm tra bất kỳ

#### Bước 3.3 — Mở menu script
1. Trên trang bài kiểm tra, bấm phím ` (backtick)
   - Phím này nằm **bên trên phím Tab**, bên trái phím số 1
   - Trên bàn phím tiếng Việt, nó thường là phím **`** (dấu huyền)
2. Menu script sẽ hiện ra ở **góc phải trên cùng** của màn hình
3. Nếu menu không hiện, thử **bấm phím ` nhiều lần** hoặc **reload trang**

---

### Phần 4: Sử Dụng Cơ Bản

#### Bước 4.1 — Tải toàn bộ câu hỏi (rất quan trọng)

> **\u26a0\ufe0f BẮT BUỘC: Phải cuộn hết trang trước khi sử dụng script!**

Azota.vn sử dụng kỹ thuật **lazy-load** — câu hỏi chỉ được tải vào DOM khi bạn cuộn đến gần chúng. Nếu bạn không cuộn trang, script chỉ nhìn thấy 5-10 câu đầu tiên.

**Cách thực hiện:**
1. Mở bài kiểm tra
2. **Cuộn chuột chậm từ trên xuống dưới cùng** của trang
3. Đảm bảo bạn đã nhìn thấy câu hỏi cuối cùng
4. **Cuộn ngược lại lên đầu trang** (để tiện theo dõi)
5. Bấm phím ` để mở menu script
6. Lúc này mới bắt đầu sử dụng các tính năng

**Kiểm tra đã tải hết chưa:**
- Bấm **\U0001f4cb LOG** trong menu
- Mở Console (F12) \u2192 xem số lượng key trong database
- Nếu số lượng ít hơn số câu hỏi thực tế, bạn chưa cuộn đủ

#### Bước 4.2 — Học đáp án từ trang kết quả (quan trọng nhất)

**Tình huống:** Bạn vừa nộp bài và thấy điểm. Trang kết quả hiển thị đáp án đúng.

**Các bước:**
1. Đảm bảo bạn đang ở trang kết quả (URL có `/answer-test/` hoặc có chữ "Kết quả")
2. **Cuộn hết trang** để tải toàn bộ câu hỏi và đáp án vào DOM
3. Bấm phím ` để mở menu — tiêu đề sẽ hiện **\u26a1SKAPPA RESULT**
4. Bấm **\U0001f9e0 LEARN**
5. Quan sát dòng trạng thái: "Learned X answers from result page!"
6. Số X là số câu hỏi đã được học thành công

**Giải thích:** Script quét từng câu hỏi trên trang kết quả, tìm đáp án đúng (multiple choice: chữ cái A-D, Đúng/Sai: từng mục a-b-c-d, Tự luận: nội dung trong dấu ngoặc), và lưu vào localStorage.

#### Bước 4.3 — Tự động điền đáp án đã học

**Tình huống:** Bạn đã học từ trang kết quả (bước 4.2), bây giờ mở bài kiểm tra mới có cùng câu hỏi.

**Các bước:**
1. Mở bài kiểm tra mới
2. **Cuộn hết trang** để tải toàn bộ câu hỏi
3. Bấm phím ` mở menu
4. Bấm **\U0001f3af REVIEW**
5. Các câu đã có đáp án trong bộ nhớ sẽ được **tự động chọn** và **tô màu xanh lá**
6. Dòng trạng thái: "Auto-filled X matches!"

**Lưu ý:** Script so khớp câu hỏi dựa trên nội dung (có sử dụng fuzzy matching). Nếu câu hỏi giống nhau 60% trở lên, script sẽ tự động điền.

#### Bước 4.4 — Điền đáp án nhanh (khi chưa có bộ nhớ)

**Chọn đáp án theo chữ cái:**
1. Bấm nút **A**, **B**, **C**, hoặc **D** trong phần "Quick Fill"
2. Tất cả câu trắc nghiệm sẽ được chọn đáp án tương ứng
3. Câu Đúng/Sai và Tự luận sẽ được bỏ qua

**Chọn ngẫu nhiên:**
1. Bấm nút **\U0001f3b2 RANDOM**
2. Mỗi câu hỏi sẽ được chọn một đáp án ngẫu nhiên (A/B/C/D)
3. Câu Đúng/Sai: random Đúng hoặc Sai
4. Câu Tự luận: điền số ngẫu nhiên

**Điền theo mẫu (Pattern):**
1. Nhập mẫu vào ô Pattern, ví dụ: `ABCD`
2. Bấm **\u25b6 RUN** (hoặc bấm Pattern Run)
3. Câu 1\u2192A, Câu 2\u2192B, Câu 3\u2192C, Câu 4\u2192D, Câu 5\u2192A...

#### Bước 4.5 — Điền Đúng/Sai nhanh

1. Bấm **\u2713 DUNG** \u2192 tất cả câu Đúng/Sai được chọn "Đúng"
2. Bấm **\u2717 SAI** \u2192 tất cả câu Đúng/Sai được chọn "Sai"
3. Bấm **TF PTN** \u2192 điền theo mẫu Pattern (A/C = Đúng, B/D = Sai)
4. Bấm **ESSAY** \u2192 điền số ngẫu nhiên vào các câu tự luận

---

### Phần 5: Sử Dụng Auto Pilot (Nâng Cao)

#### Bước 5.1 — Chuẩn bị
1. Đảm bảo bạn đã học đáp án (\U0001f9e0 LEARN) ít nhất một lần
2. Mở bài kiểm tra cần làm
3. **Cuộn hết trang** để tải toàn bộ câu hỏi
4. Mở menu script

#### Bước 5.2 — Cấu hình Pilot
Nhập chuỗi cấu hình vào ô input ở hàng "Autopilot". Định dạng:

```
<thời_gian>,<phần_trăm>,<tự_động_nộp>,<công_thức_tf>
```

**Ví dụ cụ thể:**
- `0` — không giới hạn thời gian, điền tất cả đúng (mặc định)
- `30` — mỗi câu 30 giây, tổng thời gian = số câu x 30s
- `3m43` — tổng thời gian 3 phút 43 giây
- `3m43,50` — 3m43, mục tiêu đạt 50% số điểm
- `30,80,1,equal` — 30s/câu, 80%, tự động nộp, công thức TF đều

#### Bước 5.3 — Chạy Pilot
1. Sau khi nhập cấu hình, bấm **\u25b6 PILOT**
2. Nút sẽ đổi thành **\u25a0 PILOT** và chuyển màu đỏ
3. Menu sẽ có viền đỏ — dấu hiệu Pilot đang chạy
4. Quan sát dòng trạng thái để theo dõi tiến trình:
   - "Fill 5/20 (25%) 2m30s left" — đang điền câu đúng
   - "Flip 3/15 (20%) 1m45s left" — đang đổi sang đáp án sai (nếu có mục tiêu %)

#### Bước 5.4 — Tạm dừng và Tiếp tục
- Bấm **\u25a0 PILOT** lần nữa \u2192 Pilot tạm dừng, lưu trạng thái
- Bấm **\u25b6 PILOT** \u2192 Pilot tiếp tục từ vị trí đã dừng
- **Lưu ý**: Tính năng Pause/Resume chỉ hoạt động khi bạn đã đặt mục tiêu % (vì cần lưu trạng thái trung gian)

#### Bước 5.5 — Kết thúc
- Khi hết thời gian hoặc hoàn thành, Pilot sẽ dừng
- Nếu bạn đặt `autoSubmit=1`, script sẽ tự động bấm nút "Nộp bài"
- Script có cơ chế an toàn: nếu dưới 50% câu hỏi được trả lời, nó sẽ hỏi bạn xác nhận trước khi nộp

---

### Phần 6: Quản Lý Dữ Liệu

#### Bước 6.1 — Xuất dữ liệu
1. Bấm **\u2b07 EXPORT**
2. File `skappa_azota_backup.json` sẽ được tải về
3. File này chứa toàn bộ đáp án đã học

#### Bước 6.2 — Nhập dữ liệu
1. Trên máy khác, bấm **\u2b06 IMPORT**
2. Chọn file `.json` đã xuất
3. Dữ liệu sẽ được **gộp** vào bộ nhớ hiện tại (không ghi đè)
4. Thông báo: "Đồng bộ file thành công! Đã nạp X câu hỏi."

#### Bước 6.3 — Xem dữ liệu
1. Bấm **\U0001f4cb LOG**
2. Mở Console (F12)
3. Bạn sẽ thấy toàn bộ database dưới dạng Object
4. Cấu trúc: `{ "question_id": "normalized_answer", ... }`

#### Bước 6.4 — Xoá dữ liệu
1. Bấm **\U0001f5d1 CLEAR**
2. Xác nhận "Xóa toàn bộ đáp án đã học?"
3. Toàn bộ dữ liệu bị xoá vĩnh viễn

---

### Phần 7: Phím Tắt

| Phím tắt | Hành động | Ghi chú |
|----------|-----------|---------|
| ` (Backtick) | Mở/Ẩn menu | Phím trên Tab, bên trái số 1 |
| **Alt + L** | Học đáp án | LEARN |
| **Alt + R** | Xem lại/Tô màu | REVIEW |
| **Alt + P** | Bật/Tắt Pilot | TOGGLE PILOT |
| **Alt + S** | Nộp bài | SUBMIT |

**Mẹo**: Kết hợp **Alt + L** sau đó **Alt + R** là cách nhanh nhất để học và điền lại.

---

### Phần 8: Xử Lý Sự Cố

#### Vấn đề 1: Menu không hiện
Nguyên nhân: Chưa bấm phím tắt, hoặc script chưa được bật
Cách xử lý:
1. Bấm phím ` (backtick) nhiều lần
2. Click icon \U0001f3ad \u2192 Dashboard \u2192 kiểm tra script đã bật
3. Reload trang F5
4. Vào Console F12 \u2192 xem có lỗi gì không

#### Vấn đề 2: LEARN học được 0 câu
Nguyên nhân: Chưa cuộn trang, hoặc không có đáp án nào được chọn
Cách xử lý:
1. Cuộn từ đầu đến cuối trang
2. Đảm bảo bạn đã chọn ít nhất một đáp án
3. Nếu ở trang kết quả: đảm bảo đáp án đúng đã hiển thị
4. Thử bấm LEARN nhiều lần

#### Vấn đề 3: REVIEW không điền được câu nào
Nguyên nhân: Bộ nhớ trống, hoặc không có câu hỏi trùng khớp
Cách xử lý:
1. Kiểm tra đã LEARN từ trang kết quả chưa (bấm \U0001f4cb LOG)
2. Đảm bảo câu hỏi có nội dung tương tự
3. Cuộn hết trang trước khi REVIEW

#### Vấn đề 4: Pilot báo "No answerable questions found"
Nguyên nhân: Chưa học đáp án nào
Cách xử lý:
1. Học đáp án từ trang kết quả trước (\U0001f9e0 LEARN)
2. Kiểm tra bộ nhớ (\U0001f4cb LOG)
3. Thử REVIEW trước khi chạy Pilot

#### Vấn đề 5: Nút "Nộp bài" không tìm thấy
Nguyên nhân: Azota.vn có thể đã đổi tên nút
Cách xử lý:
1. Bấm nộp bài thủ công
2. Báo lỗi qua GitHub Issues

#### Vấn đề 6: Script không chạy trên trang azota.vn
Nguyên nhân: Extension Tampermonkey chưa được cấp quyền
Cách xử lý:
1. Click icon \U0001f3ad \u2192 Dashboard
2. Kiểm tra script có trong danh sách không
3. Kiểm tra cột "Enabled" — phải có dấu \u2713
4. Vào tab "Settings" \u2192 "Includes/Excludes" \u2192 đảm bảo `*.azota.vn` nằm trong danh sách

#### Vấn đề 7: Bị treo trình duyệt khi dùng Pilot
Nguyên nhân: Số câu hỏi quá lớn hoặc cấu hình thời gian không hợp lý
Cách xử lý:
1. Reload trang
2. Giảm số lượng câu hỏi (nếu có thể)
3. Tăng khoảng thời gian giữa các câu
4. Nếu vẫn treo, tắt script và báo lỗi

---

### Phần 9: Các Lưu Ý Quan Trọng

#### Về kỹ thuật
- Script chạy hoàn toàn trên trình duyệt — **không ảnh hưởng đến máy chủ azota.vn**
- Dữ liệu lưu trong **localStorage** — dung lượng tối đa khoảng 5-10MB, đủ cho hàng nghìn câu hỏi
- Script sử dụng **setInterval** để phát hiện thay đổi DOM
- Các thao tác click được thực hiện qua **synthetic MouseEvent** — giống hệt click thật

#### Về bảo mật
- **Không gửi dữ liệu đi đâu** — không có API call, không có tracking
- **Không thu thập thông tin cá nhân** — không đọc cookie, không đọc session
- **Mã nguồn mở** — bạn có thể kiểm tra toàn bộ code
- **Chạy trong sandbox của Tampermonkey** — không thể truy cập file hệ thống

#### Về phiên bản tương lai
Phiên bản tiếp theo (v16.0) sẽ có:
- **Auto-Learning**: Tự động làm lại bài, thu thập đáp án, tích luỹ bộ nhớ đến khi đạt 100%
- **Smart Pattern Detection**: Phát hiện mẫu đáp án từ dữ liệu lịch sử
- **Multi-exam Support**: Quản lý nhiều bài kiểm tra cùng lúc
- **Cloud Sync**: Đồng bộ dữ liệu qua nhiều thiết bị (tuỳ chọn, không bắt buộc)
- **UI Themes**: Nhiều giao diện màu sắc hơn

---
"""

new_content = before + new_section + after

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Written! New length: {len(new_content)} chars")

# Verify
vn_qa = new_content.count('CÂU HỎI THƯỜNG GẶP')
vn_guide = new_content.count('HƯỚNG DẪN CHI TIẾT')
eng_section = new_content.count('\U0001f1ec\U0001f1e7 ENGLISH')
print(f"Q&A sections: {vn_qa}")
print(f"Guide sections: {vn_guide}")
print(f"English headers: {eng_section}")
