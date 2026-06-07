# HoaLang Frontend Development Log & Persistent Memory

> File này lưu trữ lịch sử thay đổi giao diện, cấu trúc Components, Routing, Zustand Stores, Middleware, và i18n của Frontend.

---

## 1. Bản đồ Cấu trúc Hiện tại (Current Frontend Structure)

Dự án Frontend được xây dựng trên nền tảng **Next.js 14 (App Router)** và **TypeScript** với các thư mục chính:

* **`app/[locale]/`** (Định tuyến đa ngôn ngữ & Đa chi nhánh):
  - `tenant/`: Điểm đích của các subdomain (Ví dụ: `battrang.hoalang.site` sẽ được middleware rewrite ngầm về đây).
  - `onboarding/`: Phân hệ đăng ký mở chi nhánh làng nghề mới cho các nghệ nhân/chủ hộ.
  - `auth/`: Đăng nhập, đăng ký thống nhất cho các vai trò Super Admin, Village Owner và Traveler.
  - `admin/`: Bảng kiểm soát trung tâm của Super Admin hệ thống.
  - `dashboard/`: Bảng quản trị chuyên biệt của từng chủ chi nhánh để quản lý sản phẩm, đơn hàng và nghệ nhân.
  - `shop/`: Giao diện cửa hàng e-commerce trưng bày sản phẩm thủ công truyền thống.
  - `map/`: Bản đồ tương tác vị trí địa lý của các làng nghề cổ xưa.
  - `itinerary/`: Trình lập kế hoạch lịch trình tham quan, khám phá làng nghề.
* **`components/`** (Thành phần giao diện tái sử dụng):
  - `shared/`: Gồm các component nghệ thuật tinh xảo dùng chung (`MapboxMap`, `SectionLabel`, `OrnamentDivider`, `VillageCard`, `CraftCard`, `CheckoutDrawer`, `AddressAutocomplete`, `VnAddressSelect`).
  - `layout/`: Thanh điều hướng phía trên (Navigation) và Footer hỗ trợ song ngữ.
  - `ui/`: Các nút, thẻ, trường nhập liệu cơ bản tuân thủ chặt chẽ design tokens của HoaLang.
* **`middleware.ts`**: Trái tim điều phối routing của hệ thống Multi-Tenant. Nhận diện các subdomain và định tuyến ngầm (URL rewrite) sang thư mục `/tenant` tương ứng mà không làm thay đổi URL trên trình duyệt.
* **`messages/`**: Nơi lưu giữ các tệp JSON dịch thuật song ngữ (`vi.json` và `en.json`).
* **`tailwind.config.ts`**: Khai báo bảng màu sơn mài/giấy dó tiêu chuẩn và font chữ Cormorant Garamond / Be Vietnam Pro.

### [2026-06-04] Restricted Merchant Dashboard to Authorized Subdomain URLs

#### Tác vụ hoàn thành
- **Cô lập và bảo vệ Bảng quản trị (Merchant Dashboard) theo Subdomain**:
  - Cập nhật cơ chế phân quyền truy cập tại thành phần [DashboardSidebar.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/dashboard/DashboardSidebar.tsx) bao quanh toàn bộ các trang con của phân hệ `/dashboard`.
  - Phân tích cú pháp (parse) tên miền phụ (subdomain) hiện tại từ trình duyệt (`window.location.hostname`).
  - Nếu người dùng truy cập Bảng quản trị thông qua tên miền gốc chính thức (ví dụ: `localhost:3000/vi/dashboard` hoặc `hoalang.site/vi/dashboard` mà không có subdomain), hệ thống sẽ nhận diện và tự động chuyển hướng họ sang tên miền phụ tương ứng của cửa hàng mà họ quản lý (ví dụ: `http://vuive.localhost:3000/vi/dashboard`).
  - Thiết lập kiểm tra bảo mật chéo (Cross-Tenant Security Validation): Nếu một chủ cửa hàng đang truy cập vào URL Bảng quản trị của một tên miền phụ khác mà họ không sở hữu (ví dụ: chủ làng `bat-trang` cố tình truy cập `vuive.localhost:3000/vi/dashboard`), hệ thống sẽ từ chối quyền truy cập ngay lập tức, đưa ra thông báo cảnh báo và tự động điều hướng họ trở về đúng subdomain của cửa hàng mình.

#### Chi tiết kỹ thuật & File thay đổi
1. **Dashboard Sidebar Guard**:
   - Chỉnh sửa logic trong [DashboardSidebar.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/dashboard/DashboardSidebar.tsx) để thực hiện nhận diện subdomain, xác thực chéo quyền quản lý của user đối với slug hiện tại và tự động chuyển hướng sử dụng token SSO qua `getTenantUrl`.

---

### [2026-06-04] CSS Global Path Reference Normalization & ts(2882) Resolution

#### Tác vụ hoàn thành
- **Chuẩn hóa đường dẫn Import CSS toàn cục (globals.css) & Giải quyết cảnh báo kiểu dữ liệu**:
  - Cải tiến import từ đường dẫn tương đối `import '../globals.css';` sang đường dẫn tuyệt đối dạng alias `import '@/app/globals.css';` trong tệp [layout.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/layout.tsx).
  - Khai báo kiểu tệp CSS wildcard (`declare module '*.css';`) tại tệp [global.d.ts](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/global.d.ts) ở thư mục gốc của frontend.
  - Sự kết hợp này giải quyết triệt để cảnh báo/lỗi biên dịch nghiêm trọng của TypeScript Compiler hoặc IDE Linter: `"Cannot find module or type declarations for side-effect import of '@/app/globals.css'.ts(2882)"`.

#### Chi tiết kỹ thuật & File thay đổi
1. **Root Layout Config**:
   - Sửa đổi [layout.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/layout.tsx): Thay đổi đường dẫn globals.css sang `@/app/globals.css`.
2. **Type Declarations**:
   - Tạo mới [global.d.ts](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/global.d.ts): Wildcard module declaration cho CSS.

---

### [2026-06-04] Fixed Dynamic Tenant Subdomain Resolution & Login Redirection

#### Tác vụ hoàn thành
- **Hỗ trợ phân giải tên miền phụ Tenant động & Chống trùng lặp định tuyến (Double-Rewrite Guard)**:
  - Loại bỏ danh sách whitelisted cứng `TENANT_SLUGS = ['bat-trang', 'van-phuc', 'non-nuoc']` trong [middleware.ts](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/middleware.ts). Giờ đây, middleware sẽ thực hiện định tuyến ngầm (URL rewrite) cho **mọi tên miền phụ hợp lệ** (như `vuive.localhost:3000` của các tenant mới đăng ký) tới `/tenant/[slug]`.
  - Khai thác tối đa luồng xử lý động: nếu tên miền phụ không tồn tại trong MongoDB, hàm tải cấu hình ở Client Page (`page.tsx`) sẽ tự động trả về `null` và hiển thị trang lỗi 404 `"Không tìm thấy làng nghề"` vô cùng thân thiện.
  - Tích hợp bộ bảo vệ chống ghi đè trùng lặp URL (Double-Rewrite Guard): phát hiện các request trên subdomain đã có tiền tố `/tenant/[slug]` (ví dụ khi click nút Visual Builder dẫn tới `/vi/tenant/vuive/builder`) để bỏ qua việc viết lại URL lần thứ 2. Điều này khắc phục lỗi crash giao diện Next.js `"Missing required html tags. The following tags are missing in the Root Layout: <html>, <body>"`.
- **Sửa lỗi định tuyến đăng nhập (Login Redirection Bug) trong Onboarding Guard**:
  - Khắc phục lỗi khi Super Admin phê duyệt tenant, nút đăng nhập trong cửa sổ thông báo tự động kiểm tra trạng thái (`OnboardingStatusCheck.tsx`) dẫn người dùng tới địa chỉ lỗi `http://vuive.localhost:3000/vi/auth/login`. Lý do là phân hệ frontend quy định toàn bộ quy trình xác thực (Auth/Login/Register) và Bảng quản trị (Dashboard) đều được xử lý tập trung trên **Tên miền chính (Main Domain)** (`localhost:3000` hoặc `hoalang.site`).
  - Sửa đổi hàm `handleLogin` trong [OnboardingStatusCheck.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/OnboardingStatusCheck.tsx) để chuyển hướng đúng về trang đăng nhập của tên miền chính kèm tham số email của tenant mới (`http://localhost:3000/vi/auth/login?email=...`). Sau khi đăng nhập thành công, hệ thống sẽ đưa họ vào Bảng quản trị `/vi/dashboard` để quản trị website làng nghề của mình.

#### Chi tiết kỹ thuật & File thay đổi
1. **Routing Middleware**:
   - Sửa đổi [middleware.ts](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/middleware.ts): Xóa whitelist cứng `TENANT_SLUGS`, bổ sung kiểm tra `pathAfterLocale.startsWith('/tenant/' + slug)`.
2. **Onboarding Status Watcher**:
   - Sửa đổi [OnboardingStatusCheck.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/OnboardingStatusCheck.tsx): Import `useLocale` và viết lại hàm điều hướng đăng nhập trỏ về main domain.

---

### [2026-06-04] Tenant Approval Action Loading State & i18n Updates

#### Tác vụ hoàn thành
- **Thêm trạng thái tải (Loading State) và vô hiệu hóa nút (Disabled State) khi phê duyệt tenant**:
  - Tích hợp trạng thái `loadingAction` vào nút **Phê duyệt** (btnApprove) tại bảng điều khiển Super Admin `/admin`. Khi Super Admin nhấn duyệt một hồ sơ đăng ký, nút sẽ hiển thị biểu tượng quay tròn `RefreshCw` cùng hiệu ứng xoay `animate-spin` thay thế cho biểu tượng `ShieldCheck` mặc định.
  - Văn bản trên nút chuyển đổi sang chuỗi dịch thuật `btnApproveLoading` (ví dụ: "Đang Phê Duyệt & Khởi Tạo..." ở Tiếng Việt).
  - Vô hiệu hóa cả hai nút **Phê Duyệt** và **Từ Chối** của hồ sơ đăng ký khi có tiến trình phê duyệt/khởi tạo đang chạy ngầm, tránh việc click đúp hoặc gửi yêu cầu đồng thời (concurrency issues) làm quá tải tiến trình provision ở server.
- **Cập nhật i18n đa ngôn ngữ cho loading state**:
  - Khai báo thêm khóa dịch thuật mới `"btnApproveLoading"` vào 5 tệp JSON localization: `vi.json`, `en.json`, `ja.json`, `ko.json`, và `zh.json` trong thư mục `messages/`.

#### Chi tiết kỹ thuật & File thay đổi
1. **Admin Dashboard Controller UI**:
   - Sửa đổi [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/page.tsx) để bind logic trạng thái `loadingAction` và các class Tailwind CSS tương ứng.
2. **Translation Dictionaries**:
   - Cập nhật [vi.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/vi.json)
   - Cập nhật [en.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/en.json)
   - Cập nhật [ja.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/ja.json)
   - Cập nhật [ko.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/ko.json)
   - Cập nhật [zh.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/zh.json)

---

### [2026-06-04] CJK Font Fallbacks Integration & Complete i18n Refactoring for Auth & Onboarding

#### Tác vụ hoàn thành
- **Tích hợp Fallback CJK nâng cao**: Cấu hình bổ sung danh sách font hệ thống và font CJK (PingFang SC, Hiragino Sans, Microsoft YaHei, Malgun Gothic, Noto Sans/Serif CJK, v.v.) vào tailwind.config.ts nhằm đảm bảo nét chữ tiếng Trung, Nhật, Hàn hiển thị thanh lịch, sang trọng và chuẩn xác, không bị lỗi font hoặc sử dụng font serif mặc định xấu của hệ điều hành.
- **Hoàn thiện i18n đa ngôn ngữ cho toàn bộ phân hệ Auth và Onboarding**:
  - Dịch hóa 100% các trang đăng nhập (`auth/login`), đăng ký (`auth/register`), quên mật khẩu (`auth/forgot-password`), thiết lập lại mật khẩu (`auth/reset-password`), và xác thực tài khoản (`auth/verify-account`).
  - Dịch hóa hoàn chỉnh trang đăng ký mở chi nhánh làng nghề (`onboarding`).
  - Đưa toàn bộ các chuỗi văn bản, tiêu đề, mô tả, nút bấm, thông báo toast, danh sách stats, quote văn học và placeholder vào 5 tệp JSON localization: `vi.json`, `en.json`, `ja.json`, `ko.json`, và `zh.json`.
- **Sửa đổi TypeScript & ESLint Lints**:
  - Loại bỏ các import không sử dụng và các annotation `@ts-ignore` thừa.
  - Sửa lỗi ép kiểu an toàn trong admin/page.tsx và các block catch error mà không dùng `any`.
  - Biên dịch thành công dự án Next.js (production build) với zero errors/warnings.

#### Chi tiết kỹ thuật & File thay đổi
1. **Config & Localization Files**:
   - Sửa đổi [tailwind.config.ts](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/tailwind.config.ts)
   - Cập nhật [vi.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/vi.json), [en.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/en.json), [ja.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/ja.json), [ko.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/ko.json), và [zh.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/zh.json)
2. **Refactored Pages**:
   - [onboarding/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/onboarding/page.tsx)
   - [auth/login/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/auth/login/page.tsx)
   - [auth/register/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/auth/register/page.tsx)
   - [auth/forgot-password/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/auth/forgot-password/page.tsx)
   - [auth/reset-password/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/auth/reset-password/page.tsx)
   - [auth/verify-account/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/auth/verify-account/page.tsx)

---

### [2026-06-04] Moved Super Admin Navigation to Desktop Sidebar & Restructured UX

#### Tác vụ hoàn thành
- Tái cấu trúc giao diện quản trị Super Admin Portal (`/admin`): di chuyển toàn bộ hệ thống chuyển đổi tab điều khiển (Quản lý đối tác, Doanh thu hệ thống, Bản thiết kế mẫu, Nhật ký vận hành) từ thanh ngang ở màn hình nội dung chính sang thành **Thành điều hướng dọc ở Sidebar bên trái (Desktop Sidebar Navigation)**. Điều này giúp tối ưu hóa không gian hiển thị, tránh việc Sidebar bị trống trải và nâng tầm thẩm mỹ chuyên nghiệp (editorial SaaS portal).
- Tích hợp các bộ đếm số lượng thời gian thực trực quan (badges) cho từng nút chuyển tab tại Sidebar (ví dụ: Tổng số đối tác + đăng ký mới hiển thị trực tiếp bên cạnh nút Quản lý đối tác; Tổng doanh thu commission VNĐ hiển thị cạnh nút Doanh thu hệ thống).
- Tối ưu hóa tính năng thích ứng (Mobile Responsiveness):
  - Ẩn Sidebar điều hướng dọc trên thiết bị di động (`hidden md:flex`) để bảo toàn không gian.
  - Tự động hiển thị thanh tab cuộn ngang nguyên bản trên màn hình nhỏ (`md:hidden`) để người dùng di động vẫn thao tác chuyển đổi phân hệ quản lý dễ dàng.
- Loại bỏ Sidebar tĩnh, dư thừa trong [layout.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/layout.tsx), biến tệp này thành bộ bao bọc xác thực và kích thước màn hình sạch sẽ.

#### Chi tiết kỹ thuật & File thay đổi
1. **Layout Simplification**:
   - Sửa đổi [layout.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/layout.tsx).
2. **Interactive Sidebar Navigation**:
   - Sửa đổi [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/page.tsx).

---

### [2026-06-04] Removed Testing Accounts List from Login Page

#### Tác vụ hoàn thành
- Loại bỏ hoàn toàn khối hộp cảnh báo tài khoản thử nghiệm ("Tài khoản thử nghiệm hệ thống") trên trang đăng nhập hệ thống (`/auth/login`) để chuẩn bị môi trường chạy thật.
- Dọn dẹp các import không sử dụng (`Sparkles` từ `lucide-react`) trong tệp giao diện đăng nhập để đảm bảo mã nguồn tuân thủ nguyên tắc không cảnh báo.

#### Chi tiết kỹ thuật & File thay đổi
1. **Login Interface**:
   - Sửa đổi [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/auth/login/page.tsx) để xóa giao diện hộp tài khoản mẫu và dọn dẹp import.

---

### [2026-06-04] Super Admin Dashboard Real-Data Integration & Form Submissions

#### Tác vụ hoàn thành
- Loại bỏ hoàn toàn danh sách giả lập (mock data) cho `transactions` và `logs` trong Trang Quản Trị Hệ thống `/admin` của Super Admin.
- Tích hợp hàm gọi API `/tenant/admin-dashboard-data` để tải dữ liệu đơn hàng và lịch đặt thực tế từ các database chi nhánh biệt lập, đồng thời tải nhật ký vận hành thực từ backend.
- Cấu hình tự động tổng hợp chỉ số tài chính (Doanh số GMV toàn sàn, Phí trích 5% hệ thống thu về) dựa trên dữ liệu giao dịch thực tế lấy được từ API.
- Liên kết lại tính năng thanh trượt thay đổi tỷ lệ phí hệ thống và nút "Cưỡng chế làm mới" nhật ký để cập nhật dữ liệu trực quan thời gian thực.
- Cải tiến popup "Đăng ký Làng Nghề Mới" (trong dashboard admin) để gửi biểu mẫu trực tiếp tới endpoint backend `POST /tenant/onboarding`:
  - Khai báo thêm trường nhập **"Email liên hệ"** bắt buộc để tự sinh tài khoản Village Owner.
  - Ánh xạ chuẩn thiết kế mẫu UI sang template ID tương thích với backend.
  - Tự động tải lại yêu cầu đăng ký và nhật ký sau khi tạo đơn thành công.

#### Chi tiết kỹ thuật & File thay đổi
1. **Admin Portal UI Integration**:
   - Sửa đổi [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/page.tsx) để thay thế mock data, thêm các hook tải dữ liệu, trường email và xử lý biểu mẫu đăng ký thật qua Axios API layer.

---

### [2026-06-04] Onboarding Form Fields Enforced Validation & Asterisks

#### Tác vụ hoàn thành
- Cập nhật hàm kiểm tra bước 1 `handleNextStep` trong `onboarding/page.tsx` để bắt buộc nhập đầy đủ tất cả các trường thông tin chính (bao gồm Tên nghệ nhân, Số điện thoại, Địa chỉ chi tiết, Tỉnh/thành phố và Phường/xã). Các trường ảnh biểu trưng, ảnh bìa và trường Giới thiệu ngắn (description) vẫn được phép bỏ qua (optional).
- Tích hợp dấu chỉ thị bắt buộc màu đỏ sơn mài `*` vào giao diện nhãn của tất cả các input bắt buộc, bao gồm Tên làng nghề, Tên miền phụ, Email, Lĩnh vực, Tên nghệ nhân, Số điện thoại, Địa chỉ thực địa, Tỉnh/Thành phố và Phường/Xã/Quận/Huyện. Trường Mô tả (description) được tháo bỏ chỉ thị bắt buộc.
- Cấu hình lại giao diện bộ chọn khu vực hành chính `VnAddressSelect.tsx` chuyển từ dạng hàng ngang (2 cột) sang dạng xếp chồng dọc (1 cột) để tránh hiện tượng tràn chữ, làm nhãn Phường/Xã/Quận/Huyện bị rớt dòng và vỡ bố cục trên màn hình nhỏ.
- Điều chỉnh tiêu đề kết quả thành công ở bước 3 từ `"Không Gian Đã Sẵn Sàng!"` thành `"Gửi Đơn Thành Công!"` để phản ánh đúng thực tế hồ sơ đang nằm ở danh sách chờ duyệt chứ chưa khởi tạo xong.
- Tích hợp cơ chế **truy vấn trạng thái thời gian thực (Real-time Polling)** vào component `OnboardingStatusCheck`: tự động kiểm tra lại trạng thái hồ sơ mỗi 5 giây bằng `setInterval` khi người dùng đang lướt web. Ngay khi Super Admin phê duyệt (hoặc từ chối), thông báo sẽ tự động bật mở tức thì mà không yêu cầu người dùng phải reload trang thủ công. Dọn dẹp bộ nhớ (cleanup interval) an toàn khi unmount hoặc khi trạng thái đã được giải quyết.
- Thêm nút **"Trở về Trang chủ / Back to Home"** ở bên trái chân trang ở Bước 1 của Onboarding wizard, giúp người dùng dễ dàng thoát ra và quay lại trang chính khi không muốn tiếp tục gửi đơn đăng ký.
- Bổ sung kiểm tra định dạng số điện thoại liên hệ (9-11 chữ số) trước khi chuyển sang bước tiếp theo để tránh nhập thông tin sai lệch.

#### Chi tiết kỹ thuật & File thay đổi
1. **Onboarding Form Validation**:
   - Sửa đổi [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/onboarding/page.tsx) tích hợp kiểm tra dữ liệu đầu vào đầy đủ ở client-side và thêm các thẻ `span className="text-lacquer">*` vào nhãn form.
2. **Shared Input Indicators**:
   - Sửa đổi [AddressAutocomplete.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/AddressAutocomplete.tsx) và [VnAddressSelect.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/VnAddressSelect.tsx) bổ sung dấu chỉ thị bắt buộc.

---

### [2026-06-04] Tenant Approval Revisit Notification Modal & i18n Translations

#### Tác vụ hoàn thành
- Phát triển component kiểm tra trạng thái toàn cục `OnboardingStatusCheck.tsx` tự động chạy ngầm khi tải trang để truy vấn API trạng thái yêu cầu của tenant qua email lưu trữ trong `localStorage`.
- Thiết kế giao diện hộp thoại thông báo duyệt/từ chối độc bản (Congratulations/Rejection Modal) theo đúng tiêu chuẩn **HoaLang UI Rule v1.0** (nền `bg-parchment`, font `font-heading` Cormorant Garamond, font `font-sans` Be Vietnam Pro, viền `border-stone`, nút primary `bg-lacquer`).
- Tích hợp điều hướng trực tiếp tới trang đăng nhập tên miền phụ tương ứng sử dụng helper `getTenantUrl`.
- Đồng bộ hóa các chuỗi văn bản UI đa ngôn ngữ bằng cách bổ sung namespace `"onboardingCheck"` trong tệp ngôn ngữ quốc tế `messages/vi.json` và `messages/en.json`, tránh tuyệt đối việc hardcode ký tự hiển thị.
- Đăng ký và kết nối component `OnboardingStatusCheck` vào tệp giao diện chung `layout.tsx` lồng trong thẻ `<Suspense>` để đảm bảo hoạt động liền mạch trên toàn hệ thống.

#### Chi tiết kỹ thuật & File thay đổi
1. **Status Watcher Component**:
   - Tạo mới [OnboardingStatusCheck.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/OnboardingStatusCheck.tsx).
   - Tải trạng thái và cấu hình từ API `GET /api/v1/tenant/requests/check?email=...`, kết xuất dữ liệu và xóa khóa khỏi `localStorage` khi người dùng nhấn "Đóng" hoặc "Đăng nhập".
2. **Global Component Export**:
   - Cập nhật [index.ts](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/index.ts) để export `OnboardingStatusCheck`.
3. **Layout Rendering**:
   - Sửa đổi [layout.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/layout.tsx) để import và đặt `<OnboardingStatusCheck />` bên trong `<Suspense>` của Next.js layout.
4. **Bilingual Translations Addition**:
   - Cập nhật [vi.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/vi.json) và [en.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/en.json) để khai báo namespace `"onboardingCheck"`.

---

### [2026-06-04] Template Selection Matching & Visual Builder Navigation Redirect Fix

#### Tác vụ hoàn thành
- Khắc phục lỗi điều hướng và liên kết trong Visual Builder Shortcut ở Header của Landing Page. Lấy trực tiếp tham số `slug` từ `useParams()` thay vì dùng lô-gíc phỏng đoán màu hoặc logo.
- Đồng bộ Visual Builder link hướng tới đúng thư mục builder tương ứng với chi nhánh hiện tại (`/[locale]/tenant/[slug]/builder`).

#### Chi tiết kỹ thuật & File thay đổi
1. **Header Navigation & Visual Builder Route Fix**:
   - Sửa đổi trong [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/tenant/[slug]/page.tsx).
   - Sử dụng hook `useParams` từ `next/navigation` để lấy thông tin slug chính xác của Tenant hiện hành.
   - Sửa URL thuộc tính `href` của nút Visual Builder thành `/${locale}/tenant/${slug}/builder`.

---

### [2026-06-04] GeekBrain Chatbot UI Optimization & Bilingual Preset hints

#### Tác vụ hoàn thành
- Tối ưu hóa giao diện Thư viện Câu hỏi và Khung tương tác chat để giảm bớt số lượng câu hỏi mẫu (từ 12 nút xuống còn 8 nút), trình bày gọn gàng dưới dạng song ngữ (Tiếng Anh 🇬🇧 & Tiếng Việt 🇻🇳).
- Thêm hộp thông tin hướng dẫn chi tiết ngay phía trên danh sách gợi ý để nhấn mạnh tính năng nhập tay thủ công bằng cả hai ngôn ngữ của hệ thống.
- Cải thiện trải nghiệm gõ phím trực tiếp bằng cách làm nổi bật trường nhập liệu và bổ sung mô tả gợi ý trong khung chat.

#### Chi tiết kỹ thuật & File thay đổi
1. **Bilingual Hint UI & Clutter Reduction**:
   - Sửa đổi trong [index.html](file:///C:/Project%20Web/xbrain-learners/w4-geekbrain/index.html).
   - Thiết kế lại container cuộn `flex-1 overflow-y-auto` của Presets, bổ sung một hộp card `bg-parchment/40 p-3 border border-stone/50 rounded-sm mb-2` chứa hướng dẫn Tiếng Việt.
   - Giảm tải các câu hỏi RAG/SQL trùng lặp và cung cấp các câu hỏi tương đương dịch nghĩa bằng Tiếng Việt cho từng Cấp độ kiểm thử (Level 1, Level 2, Level 3, Level 4).

---

### [2026-06-03] Starter Design Template Themed Galleries & Font Normalization

#### Tác vụ hoàn thành
- Bổ sung các khu vực trưng bày hình ảnh di sản (Visual Galleries) riêng biệt cho cả 3 mẫu thiết kế Starter (`TemplatePicker.tsx`) để tạo điểm nhấn nghệ thuật và cân bằng mức độ chi tiết giữa các mẫu, đảm bảo không mẫu nào trông kém thu hút (lép vế):
  1. **Gốm Sứ (Bát Tràng)**: Thiết kế thư viện ảnh bất đối xứng (Heritage Gallery) gồm 4 ảnh gốm sứ xen kẽ tỉ lệ khung hình 4:3 và 3:4 sử dụng lưới 12 cột.
  2. **Dệt Lụa (Vạn Phúc)**: Thiết kế thư viện ảnh tạp chí dệt lụa (Visual Journal) gồm 3 ảnh tơ tằm xếp cạnh nhau với ảnh giữa được dịch chuyển xuống dưới (`translate-y-3`) tạo độ lệch nhịp nhàng tinh tế.
  3. **Tranh Điệp (Đông Hồ)**: Thiết kế thư viện ảnh tối giản (Minimal Journal) gồm 3 bức ảnh đen trắng (grayscale) tự động chuyển màu sắc tự nhiên khi di chuột qua (hover transition).
- Khắc phục lỗi hình ảnh bị hỏng (status 404) và các hình ảnh không phù hợp trong bản xem trước của mẫu Gốm Sứ và Dệt Lụa:
  - Loại bỏ hình ảnh sân tennis (`photo-1595435934249-5df7ed86e1c0`) ở phần Gallery Gốm Sứ, thay thế bằng hình ảnh bình gốm tinh xảo dạt dào cảm xúc.
  - Thay thế các hình ảnh chai nước hoa thương hiệu (`photo-1590736704728-f4730bb30770`) ở mục Sản phẩm và Thư viện Dệt Lụa bằng hình ảnh áo gấm, dải khăn lụa Hà Đông dệt tay óng ả.
  - Thay thế hình ảnh tờ tiền in Mahatma Gandhi (`photo-1601921004897-b7d582836990`) ở Thư viện Dệt Lụa bằng dải lụa mềm mại màu sơn mài đan xen sắc hoàng gia.
  - Sửa đổi các link ảnh bị chết (404) ở cả hai mẫu Gốm Sứ và Dệt Lụa thành các hình ảnh gốm sứ và tơ lụa thô đã được xác minh active 100%.
- Chuẩn hóa phông chữ hiển thị cho giao diện xem trước Dệt Lụa (Silk Template Preview): chuyển đổi từ phông chưa đăng ký cấu hình `Playfair Display` sang phông chữ chính thức `Cormorant Garamond` theo đúng tinh thần và điều lệ của HoaLang UI Rule v1.0, ngăn ngừa các lỗi hiển thị phông chữ hệ thống.
- Thực hiện kiểm tra, escape ký tự chuỗi JSX và xác minh biên dịch thành công 100% không cảnh báo lỗi nghiêm trọng.

#### Chi tiết kỹ thuật & File thay đổi
1. **Themed Image Galleries & Font Fixes**:
   - Sửa đổi trong [TemplatePicker.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/onboarding/TemplatePicker.tsx).
   - Cập nhật các hàm `PotteryTemplatePreview`, `SilkTemplatePreview`, và `MinimalTemplatePreview` để chèn các cấu trúc gallery HTML5/Tailwind phù hợp, thay đổi `fontFamily` trong object `vars` của Silk, và sửa đổi toàn bộ các đường dẫn ảnh Unsplash sang ảnh mới đã test active 200.
2. **Build pipeline validation**:
   - Chạy `npm run build` thành công, tạo ra các trang tĩnh tối ưu hóa.

---

### [2026-06-03] Starter Design Template Fullscreen Preview & Distinct Layouts

#### Tác vụ hoàn thành
- Tái cấu trúc bộ chọn mẫu thiết kế Starter (`TemplatePicker.tsx`), thiết kế **3 cấu trúc bố cục (layouts) và cách dàn trang hoàn toàn khác biệt rõ rệt** cho 3 Starter Templates để giúp chủ xưởng dễ dàng so sánh và đưa ra lựa chọn:
  1. **Gốm Sứ (Bát Tràng)**: Bố cục Asymmetric Grid Split độc đáo (Hero chia đôi màn hình bất đối xứng), sản phẩm phân bổ so le nghệ thuật kiểu tạp chí và các hộp trải nghiệm đánh số `01`, `02` nổi bật.
  2. **Dệt Lụa (Vạn Phúc)**: Bố cục Magazine cao cấp sang trọng với Hero căn giữa có khung viền vàng óng ánh trên nền phủ mờ, danh sách sản phẩm dàn hàng đan xen (alternating rows) và menu các lớp học di sản kiểu thẻ bảng giá tinh tế.
  3. **Tranh Điệp (Đông Hồ - Dó)**: Bố cục tối giản (Zen Minimalist typography-first) với Hero thuần phông chữ trên nền giấy dó mịn màng không sử dụng ảnh nền, kể chuyện dạng cột văn bản dọc tập trung và hộp nhận tin gọn gàng với nét kẻ dưới chân.
- Phát triển tùy chọn xem thử toàn màn hình (Fullscreen Toggle) trong hộp thoại xem trước (Modal Preview). Cho phép phóng to khung trình duyệt mô phỏng chiếm trọn toàn bộ viewport (screen width và height) giúp quan sát giao diện mẫu chi tiết nhất.
- Khắc phục lỗi bảo mật ESLint về ký tự ngoặc kép chưa escape bằng cách chuyển đổi `"..."` thành các thực thể JSX `&quot;...&quot;`.

#### Chi tiết kỹ thuật & File thay đổi
1. **Multi-Layout Live Previews Development**:
   - Sửa đổi trong [TemplatePicker.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/onboarding/TemplatePicker.tsx).
   - Tạo mới các sub-components độc lập: `PotteryTemplatePreview`, `SilkTemplatePreview`, và `MinimalTemplatePreview`.
   - Mỗi component tự định nghĩa cấu trúc JSX riêng, font chữ tương ứng và cách chia lưới Tailwind CSS hoàn toàn độc bản.
2. **Template Selection Modal Fullscreen Toggle**:
   - Thêm trạng thái `isFullscreen` kiểu boolean và tích hợp các biểu tượng điều hướng.
   - Cải tiến bố cục flexbox của modal và chiều cao tự co giãn (`flex-grow` và `max-h-none` thay thế giới hạn `max-h-[45vh]`) để tự động mở rộng theo kích thước khung hình.

---

### [2026-06-03] Map Pin Drag-and-Drop Coordinates Selector

#### Tác vụ hoàn thành
- Bổ sung chức năng tự động lấy tọa độ vĩ độ/kinh độ từ kết quả geocoding của gợi ý địa chỉ khi chọn trong `AddressAutocomplete` để đồng bộ tọa độ của lò/xưởng di sản.
- Phát triển giao diện bản đồ di sản tương tác trong trang Thiết Lập Cấu Hình Làng Nghề (`dashboard/settings/page.tsx`) với một Mapbox Map và một ghim màu đỏ (draggable marker).
- Hỗ trợ cơ chế Kéo thả ghim (Drag-and-Drop) hoặc Click trực tiếp trên bản đồ để vi chỉnh tọa độ hiển thị một cách trực quan (Phương án B nâng cấp).
- Liên kết đồng bộ hai chiều (bi-directional sync) giữa ô nhập liệu vĩ độ/kinh độ bằng số và ghim trên bản đồ. Thay đổi ô số sẽ di chuyển ghim và ngược lại.
- Bổ sung Huy hiệu trạng thái độ chính xác (Accuracy Status Badge): hiển thị "Tự động / Automatic" (OSM Geocoded) khi dùng địa chỉ chuẩn, và chuyển sang "Thủ công / Manual" (Map Pinned) khi người dùng tự kéo ghim/sửa tọa độ.
- Tích hợp đa ngôn ngữ (i18n) hoàn toàn cho phân hệ cấu hình qua namespace `dashboardSettings` trong `messages/vi.json` và `messages/en.json`.
- Thiết kế giao diện fallback ngoại tuyến (offline fallback banner) thân thiện nếu biến `NEXT_PUBLIC_MAPBOX_TOKEN` chưa được thiết lập, đảm bảo trang thiết lập hoạt động bình thường, các trường nhập liệu số vẫn chỉnh sửa được.
- Khắc phục lỗi kích chọn địa chỉ gợi ý hai lần (Double-click Suggestion Selection Bug): khi click chọn địa chỉ, dropdown menu tự động mở lại do `query` cập nhật kích hoạt hàm tìm kiếm debounced. Đã giải quyết bằng cờ hiệu `isSelectingRef` và kiểm tra tiêu điểm `document.activeElement === inputRef.current`.

#### Chi tiết kỹ thuật & File thay đổi
1. **Autocomplete Coordinates & Interaction Refinement**:
   - Sửa đổi trong [AddressAutocomplete.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/AddressAutocomplete.tsx).
   - Mở rộng kiểu dữ liệu `PlaceSuggestion` hỗ trợ thêm vĩ độ `lat` và kinh độ `lng`.
   - Bổ sung sự kiện callback `onCoordinatesSelect` trong props của component.
   - Trả ra tọa độ lấy từ Nominatim API và preset tọa độ thực cho các gợi ý làng nghề mặc định trong hệ thống.
   - Thêm `inputRef` và `isSelectingRef` để kiểm soát hành vi mở dropdown và gửi API fetch chỉ khi người dùng thực sự tập trung gõ (active typing) thay vì khi tự động cập nhật hoặc sau khi click lựa chọn.
2. **Dashboard Settings Map Selector**:
   - Thay đổi trong [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/dashboard/settings/page.tsx).
   - Xây dựng component `SettingsPanel` quản lý trạng thái địa chỉ đầy đủ bao gồm `address`, `province`, `districtWard`, `latitude`, `longitude` và `isCoordinatesManual`.
   - Khởi tạo Mapbox GL Map trên đối tượng DOM container, hiển thị `mapboxgl.Marker` draggable với animation hiệu ứng ping sơn mài đỏ.
   - Đồng bộ vị trí ghim và tâm bản đồ khi các state coordinates thay đổi hoặc khi người dùng thao tác trực tiếp trên bản đồ.
   - Thêm nút chuyển đổi kiểu bản đồ hiển thị (Địa hình, Vệ tinh, Cổ điển).
3. **Multi-language Translations**:
   - Thêm dịch thuật namespace `dashboardSettings` trong [vi.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/vi.json) và [en.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/en.json).

---

### [2026-06-03] Geocoding Autocomplete Mapper Crash Fix

#### Tác vụ hoàn thành
- Khắc phục lỗi crash vòng lặp map địa chỉ: khi người dùng tìm kiếm địa điểm, Nominatim API trả về một danh sách kết quả, trong đó một số kết quả có thể không có đối tượng `address` chi tiết. Trong code cũ, việc truy cập trực tiếp các thuộc tính của `item.address` (ví dụ `item.address.state`) gây ra lỗi TypeError làm sập toàn bộ luồng xử lý và trả về mảng kết quả rỗng.
- Bổ sung toán tử optional chaining (`?.`) cho toàn bộ các thuộc tính của `item.address` để bỏ qua các kết quả bị khuyết thông tin địa chỉ một cách an toàn mà không làm hỏng trải nghiệm gợi ý chung (tương tự như RestX).

#### Chi tiết kỹ thuật & File thay đổi
1. **Optional Chaining in Geocoding Mapper**:
   - Sửa đổi trong [AddressAutocomplete.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/AddressAutocomplete.tsx).
   - Thay đổi các thuộc tính `item.address.state`, `item.address.city`, `item.address.suburb`, `item.address.city_district`... thành `item.address?.state`, `item.address?.city`, `item.address?.suburb`, `item.address?.city_district`...

---

### [2026-06-03] OpenStreetMap Address Geocoding Attribution Update

#### Tác vụ hoàn thành
- Khắc phục nhầm lẫn về nguồn cấp dữ liệu geocoding: thay đổi toàn bộ nhãn hiển thị và thương hiệu trong footer của dropdown từ "Google Places API" thành "OpenStreetMap" để phản ánh chính xác API Nominatim (OSM) đang hoạt động ngầm.
- Loại bỏ logo Google Maps giả lập, thay thế bằng nhãn OpenStreetMap tinh tế.

#### Chi tiết kỹ thuật & File thay đổi
1. **Attribution Strings & Brand Elements Update**:
   - Sửa đổi trong [AddressAutocomplete.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/AddressAutocomplete.tsx).
   - Đổi khóa `poweredByGoogle` thành `poweredByOSM` với nội dung tiếng Việt `"Dữ liệu địa chỉ OpenStreetMap"` và tiếng Anh `"OpenStreetMap Address Data"`.
   - Cập nhật JSX footer để render chữ "OpenStreetMap" trang nhã theo tông màu thiết kế `ash/60` của HoaLang thay cho các ký tự màu của thương hiệu Google.

---

### [2026-06-03] Onboarding Slug Dynamic Synchronization Bug Fix

#### Tác vụ hoàn thành
- Khắc phục lỗi stuck slug khi nhập tên làng nghề: trước đó logic `if (name && !slug)` chỉ kích hoạt sinh slug ở ký tự đầu tiên được gõ (ví dụ chữ "L" trong "Làng Gốm Bát Tràng" sinh ra slug "l") và dừng hoạt động ngay lập tức vì điều kiện `!slug` không còn thỏa mãn.
- Bổ sung biến trạng thái kiểm soát `isSlugManual` để theo dõi khi nào người dùng tự thay đổi slug thủ công.
- Cho phép slug cập nhật động theo từng ký tự gõ ở tên làng nghề và tự động xóa sạch slug khi người dùng xóa trống tên làng nghề (trừ khi họ đã tự chỉnh sửa slug thủ công).

#### Chi tiết kỹ thuật & File thay đổi
1. **Onboarding Slug Generator Refactoring**:
   - Sửa đổi trong [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/onboarding/page.tsx).
   - Thêm state `isSlugManual` khởi tạo bằng `false`.
   - Cải tiến hook `useEffect` phụ thuộc vào `[name, isSlugManual]` để sinh slug đầy đủ theo thời gian thực và dọn dẹp khi tên trống.
   - Thêm hàm `setIsSlugManual(true)` tại trình lắng nghe `onChange` của ô nhập liệu slug.

---

### [2026-06-03] Onboarding Address Autocomplete & Administrative Division Sync Fixes

#### Tác vụ hoàn thành
- Khắc phục lỗi geocoding API trên trình duyệt do thiết lập header forbidden `User-Agent` của Nominatim API khiến fetch bị lỗi TypeError.
- Bổ sung nút lựa chọn linh hoạt "Sử dụng địa chỉ đã nhập / Use entered address" ở đầu dropdown danh sách gợi ý địa chỉ, giúp người dùng không bị tắc nghẽn nếu nhập các địa điểm tùy chỉnh/ngoài hệ thống hoặc API gặp sự cố.
- Thiết lập cơ chế chuẩn hóa và đồng bộ hai chiều (bi-directional sync/normalization) tự động khớp các thông tin địa chỉ từ autocomplete vào hai ô chọn Tỉnh/Thành phố và Phường/Xã/Quận/Huyện tương ứng trong `VnAddressSelect` (loại bỏ các tiền tố hành chính khác biệt để highlight đúng giá trị trong danh sách dropdown).
- Khắc phục hoàn toàn lỗi biên dịch ESLint liên quan đến unescaped double quotes (`"`) trong JSX.

#### Chi tiết kỹ thuật & File thay đổi
1. **Live Geocoding & Dropdown Option**:
   - Sửa đổi trong [AddressAutocomplete.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/AddressAutocomplete.tsx).
   - Gỡ bỏ header `User-Agent` để Nominatim fetch hoạt động chuẩn xác trên client-side.
   - Thêm nút lựa chọn `Sử dụng địa chỉ đã nhập` hiển thị query hiện tại giúp người dùng chọn trực tiếp.
   - Cập nhật thông tin thông báo khi không tìm thấy kết quả từ "địa điểm di sản" thành "địa chỉ".
2. **Catalog Dropdowns Selection Normalization**:
   - Sửa đổi trong [VnAddressSelect.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/VnAddressSelect.tsx).
   - Khi có dữ liệu `cityValue` hoặc `districtWardValue` do autocomplete đẩy về, tiến hành so khớp chuẩn hóa bằng cách loại bỏ các tiền tố "Tỉnh", "Thành phố", "Phường", "Xã", "Quận", "Huyện"... và cập nhật lại trạng thái cha khớp với tên chính thức trong dropdown để được highlight chính xác.
   - Khai báo đầy đủ các dependencies (`onCityChange`, `onDistrictWardChange`) để đạt chuẩn 100% Zero Warnings của ESLint.

---

### [2026-06-03] Starter Design Template Previews Enhancement

#### Tác vụ hoàn thành
- Khắc phục các ảnh demo Unsplash mang tính minh họa chung chung: thay bằng các ảnh chụp màn hình/bản phác thảo giao diện (Live Mockups) thực tế của các Làng nghề.
- Hỗ trợ xem trước (Preview) tự động: khi nhấn vào thẻ bất kỳ của Bản thiết kế Starter sẽ đồng thời tự động kích hoạt hộp thoại xem trước.
- Nâng cấp trải nghiệm xem trước cao cấp: mô phỏng màn hình trình duyệt (Desktop Browser Mockup) kèm theo thanh cuộn dọc (scrollable viewport) cho phép chủ làng nghề cuộn xem chi tiết bố cục, phần đầu/chân trang, font chữ và màu sắc của toàn bộ Landing Page trước khi quyết định áp dụng.

#### Chi tiết kỹ thuật & File thay đổi
1. **Template Selection Options**:
   - Sửa đổi trong [TemplatePicker.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/onboarding/TemplatePicker.tsx).
   - Đổi các thuộc tính `mockImage` và `previewUrl` của Bát Tràng, Vạn Phúc và Đông Hồ sang đường dẫn ảnh thực tế tại local `/images/village-bat-trang.png`, `/images/village-van-phuc.png`, và `/images/village-dong-ho.png`.
2. **Interactive Preview Logic**:
   - Thay đổi hàm `onClick` của `motion.div` thẻ card để kích hoạt đồng thời `onSelect(tpl.id)` và `setPreviewTemplate(tpl)`.
3. **Browser Frame Preview & Scrollable Viewport**:
   - Nâng cấp cấu trúc JSX của hộp thoại xem trước (Modal) sử dụng giao diện trình duyệt bao gồm Mock Address Bar (`https://*.hoalang.site`) và một khung chứa ảnh cuộn tự do (`max-h-[45vh] overflow-y-auto`) mang lại cảm giác trải nghiệm thực tế sinh động.

---

### [2026-06-03] Update Domain Suffix from .vn to .site in Pages and Footer

#### Tác vụ hoàn thành
- Khắc phục sự bất nhất về tên miền phụ của các Làng nghề: thay thế toàn bộ hậu tố `.hoalang.vn` bằng `.hoalang.site` trên các trang thiết lập và đăng ký mở chi nhánh mới.
- Đồng bộ thông tin liên hệ email của hệ thống thành `contact@hoalang.site`.

#### Chi tiết kỹ thuật & File thay đổi
1. **Onboarding Page Subdomain Preview**:
   - Sửa đổi trong [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/onboarding/page.tsx).
   - Đổi nhãn hiển thị đuôi tên miền từ `.hoalang.vn` thành `.hoalang.site` tại dòng 255 để người dùng xem chính xác địa chỉ website của họ khi tạo chi nhánh mới.
2. **Dashboard Settings Domain Resolution**:
   - Sửa đổi trong [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/dashboard/settings/page.tsx).
   - Đổi email mặc định và cấu hình domain hiển thị trong panel cài đặt sử dụng hậu tố `.hoalang.site` thay vì `.hoalang.vn`.
3. **Footer Contact Email**:
   - Sửa đổi trong [Footer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/layout/Footer.tsx).
   - Thay đổi email liên hệ của nền tảng thành `contact@hoalang.site` ở phần liên hệ cuối trang.

---

### [2026-06-03] Fix Broken Image Links in Heritage Villages Curation Gallery

#### Tác vụ hoàn thành
- Khắc phục lỗi hiển thị ảnh bị hỏng (broken image 404) trên trang chi tiết Làng nghề Bát Tràng (`/villages/bat-trang`).
- Khắc phục lỗi hiển thị ảnh bìa bị hỏng (broken cover image 404) trên trang chi tiết Làng đá Non Nước (`/villages/non-nuoc`).
- Cập nhật và làm đẹp thư viện trưng bày của Làng Tranh Đông Hồ với các ảnh chủ đề hội họa/in ấn thực tế thay vì dùng ảnh gốm sứ tạm thời.

#### Chi tiết kỹ thuật & File thay đổi
1. **Heritage Villages Detail Page**:
   - Sửa đổi trong [page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/villages/[slug]/page.tsx).
   - Thay thế liên kết ảnh hỏng `photo-1525974160448-038cbe672e7d` tại thư viện ảnh Bát Tràng bằng ảnh bàn tay nặn gốm xoay chất lượng cao `photo-1578749556568-bc2c40e68b61`.
   - Thay thế liên kết ảnh `photo-1605721911519-3dfeb3be25e7` tại thư viện ảnh Bát Tràng bằng ảnh sản phẩm cốc gốm mỹ nghệ sắc nét `photo-1565193566173-7a0ee3dbe261`.
   - Thay thế liên kết ảnh bìa hỏng `photo-1599809275671-b5941cabc7a5` tại Làng đá Non Nước bằng ảnh tượng điêu khắc cẩm thạch trắng trong triển lãm nghệ thuật sang trọng `photo-1580136579312-94651dfd596d`.
   - Thay thế liên kết ảnh phong cảnh và ảnh placeholder cũ trong thư viện ảnh Làng đá Non Nước bằng các hình ảnh điêu khắc đá nghệ thuật tinh xảo (`photo-1542856391-010fb87dcfed` và `photo-1576016770956-debb63d90029`).
   - Cập nhật thư viện ảnh Đông Hồ bằng ba hình ảnh hội họa/tác phẩm in ấn nghệ thuật khác nhau (`photo-1579783902614-a3fb3927b6a5`, `photo-1513364776144-60967b0f800f`, `photo-1579783900882-c0d3dad7b119`).

---

### [2026-06-03] Order & Booking History Feature Implementation

#### Tác vụ hoàn thành
- Phát triển tính năng xem Lịch sử giao dịch (bao gồm Đơn đặt sản phẩm thủ công và Vé trải nghiệm workshop) dành cho khách du lịch.
- Tích hợp thêm liên kết truy cập nhanh "Lịch sử đặt hàng / Order History" vào thanh Menu Avatar của người dùng ở thanh Navigation chính (cả bản Desktop và Mobile Drawer).
- Đảm bảo thiết kế đồng bộ với cẩm nang thiết kế nghệ thuật cao cấp HoaLang (sử dụng parchment background, cream card, lacquer/gold/stone badges và micro-animations từ Framer Motion).

#### Chi tiết kỹ thuật & File thay đổi
1. **User Dropdown Navigation Update**:
   - Sửa đổi trong [Header.tsx](file:///d:/HoaLang/HoaLang_FE/components/layout/Header.tsx).
   - Thêm nút liên kết động `/profile/orders` vào menu dropdown của avatar (phía trên mục Mã giảm giá) ở cả giao diện Desktop và giao diện Mobile Drawer (Sheet).
2. **Translation & Localization Keys**:
   - Sửa đổi trong các tệp ngôn ngữ: [vi.json](file:///d:/HoaLang/HoaLang_FE/messages/vi.json), [en.json](file:///d:/HoaLang/HoaLang_FE/messages/en.json), [ja.json](file:///d:/HoaLang/HoaLang_FE/messages/ja.json), [ko.json](file:///d:/HoaLang/HoaLang_FE/messages/ko.json), và [zh.json](file:///d:/HoaLang/HoaLang_FE/messages/zh.json).
   - Thêm dịch thuật song ngữ cho chuỗi khóa `"orders"` trong phần `nav` và các mô tả, tiêu đề, trạng thái đơn hàng (paid, pending, cancelled, items count, guests count...) trong block `profile`.
3. **Frontend Auth Service Update**:
   - Sửa đổi trong [authService.ts](file:///d:/HoaLang/HoaLang_FE/lib/services/authService.ts).
   - Thêm phương thức API helper `getOrders()` để fetch lịch sử giao dịch của người dùng từ endpoint `/auth/orders`.
4. **Orders History Page Creation**:
   - Thêm mới [orders/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/profile/orders/page.tsx).
   - Thiết kế giao diện danh sách giao dịch sang trọng, phân loại theo bộ lọc tab (Tất cả, Đơn sản phẩm, Workshop di sản).
   - Hiển thị danh mục chi tiết sản phẩm đã mua (kèm ảnh sản phẩm), hoặc workshop đã đặt chỗ (kèm ảnh bìa workshop, thời gian tham gia, số khách).
   - Hiển thị chi tiết trạng thái thanh toán (PAYOS / COD, Đã thanh toán / Chờ xử lý) và trạng thái giao nhận trực quan thông qua `TagBadge`.

---

### [2026-06-02] Remove Artisan Owner tab in Registration Page

#### Tác vụ hoàn thành
- Loại bỏ tab chuyển đổi đăng ký vai trò nghệ nhân "Chủ làng nghề / Artisan Owner" trên trang đăng ký tài khoản (`/auth/register`).
- Đơn giản hóa toàn bộ các trường thông tin hiển thị, nhãn, gợi ý và mô tả quyền lợi để chỉ hướng tới đối tượng khách du lịch (Traveler / USER).
- Mặc định hóa thuộc tính đăng ký `role` gửi lên API Backend luôn là `USER`.

#### Chi tiết kỹ thuật & File thay đổi
1. **Registration Form Refactoring**:
   - Sửa đổi trong [register/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/register/page.tsx).
   - Thiết lập biến `activeRole` cố định ở giá trị `'USER'`.
   - Gỡ bỏ hoàn toàn mã giao diện của thẻ trượt chuyển vai trò (Role Switching Premium Tabs).
   - Tối giản hóa các nhãn, placeholder và danh sách quyền lợi (benefits list) để loại bỏ các trường hợp rẽ nhánh phức tạp không cần thiết cho nghệ nhân.


### [2026-06-01] Premium Overlay Registration Modal Implementation

#### Tác vụ hoàn thành
- Khắc phục giao diện lỗi thời và không nhất quán khi thay thế hộp thoại nhập tin nhắn gốc của trình duyệt (`window.prompt()`) bằng một **Overlay Modal biểu mẫu đăng ký cao cấp**.
- Thiết kế biểu mẫu điền thông tin đăng ký có đầy đủ các trường phong phú (Tên làng, Tên miền phụ, Tên nghệ nhân, SĐT, Tỉnh thành, và Bản mẫu thiết kế) được thiết kế theo đúng nhận diện thương hiệu nghệ thuật và màu sắc dó/sơn mài của HoaLang.

#### Chi tiết kỹ thuật & File thay đổi
1. **Interactive Overlay Form Dialog**:
   - Thay đổi trong [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/page.tsx).
   - Tích hợp thêm component Modal điều khiển bằng trạng thái React, kết hợp với các hiệu ứng chuyển động mượt mà của **Framer Motion (`AnimatePresence` và `motion.div`)**.
   - Bổ sung tính năng tự động chuẩn hóa và sinh tên miền phụ (Clean Slug Generator) tự động biến đổi chuỗi tiếng Việt có dấu (ví dụ: `Làng Gốm Bàu Trúc` -> `bau-truc`) thành slug hợp lệ tại runtime thời gian thực.
   - Thêm nút tắt linh hoạt dạng icon và nút hủy bỏ giúp tăng tốc độ thao tác của người quản trị.

---

### [2026-06-01] Google OAuth Avatar Referrer Policy Resolution

#### Tác vụ hoàn thành
- Khắc phục lỗi hiển thị ảnh đại diện (avatar) bị lỗi hiển thị/broken image khi người dùng thực hiện đăng nhập bằng tài khoản Google.
- Thêm thuộc tính `referrerPolicy="no-referrer"` vào các thẻ `<img>` hiển thị avatar trên toàn hệ thống giao diện (Desktop Header và Mobile Drawer Header) để vượt qua lớp bảo mật chống Hotlinking của Google.

#### Chi tiết kỹ thuật & File thay đổi
1. **Header Avatar Images Refactoring**:
   - Thay đổi trong [Header.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/layout/Header.tsx).
   - Tích hợp thêm thuộc tính `referrerPolicy="no-referrer"` cho cả component hiển thị ảnh đại diện người dùng ở thanh Menu chính phía trên (Desktop) và trong menu trượt di động (Mobile Drawer). Việc này giúp trình duyệt loại bỏ header `Referer` khi tải ảnh từ máy chủ `lh3.googleusercontent.com` của Google, giải quyết triệt để lỗi `403 Forbidden` do Google chặn cross-origin request.

---

### [2026-06-01] Next.js Page Export, Type Safety & Subdomain Routing Resolution

#### Tác vụ hoàn thành
- Khắc phục triệt để lỗi biên dịch `npm run build` trên Frontend liên quan đến Named Exports trong các trang (`page.tsx`).
- Refactor cấu trúc Dynamic Component Renderers trong `SectionRenderer.tsx` để đạt 100% Type Safety tuyệt đối mà không cần dùng `any` hay ép kiểu không an toàn.
- Giải quyết vấn đề định tuyến đa chi nhánh (Subdomain Routing): Sửa lỗi liên kết truy cập website làng nghề trên bản đồ và hệ thống bảng quản trị để hướng trực tiếp tới subdomain thực tế (ví dụ: `nonnuoc.hoalang.site`) thay vì đường dẫn thư mục giả lập trên domain chính (`/vi/tenant/...`).
- Đạt trạng thái biên dịch thành công hoàn hảo (Zero Errors) cho cả Frontend và Backend (`pnpm build`).

#### Chi tiết kỹ thuật & File thay đổi
1. **Next.js Page Export Rules Compliance**:
   - Sửa đổi trong các tệp: [orders/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/dashboard/orders/page.tsx), [website/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/dashboard/website/page.tsx), và [dashboard/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/dashboard/page.tsx).
   - Loại bỏ toàn bộ `export { OrdersLog };`, `export { WebsiteEditor };`, và `export { DashboardOverview };` ở cuối tệp. Do Next.js quy định các tệp `page.tsx` chỉ được phép export default duy nhất một component đại diện, việc export named trước đó đã làm lỗi trình dựng biên dịch `.next/types/.../page.ts`.
2. **Type Safety in SectionRenderer**:
   - Thay đổi trong [SectionRenderer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/tenant/SectionRenderer.tsx).
   - Thay thế cấu trúc ánh xạ động `SECTION_MAP` (vốn vi phạm TypeScript parameter type contravariance) bằng cấu trúc lệnh rẽ nhánh `switch (section.type)` cực kỳ tường minh.
   - Nhờ đó, TypeScript phân tích luồng dữ liệu (control flow analysis) có thể tự động thu hẹp kiểu dữ liệu (type narrowing) của `section` tương ứng với mỗi Component của từng Section cụ thể, đảm bảo sự an toàn tuyệt đối 100% Type Safety mà không có bất kỳ khai báo `any` nào.
3. **Subdomain Routing & Link Synchronization**:
   - Sửa đổi trong [app/[locale]/map/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/map/page.tsx). Tích hợp hàm tiện ích `getTenantUrl` và đổi nút "Truy cập website" thành thẻ `<a>` hướng tới địa chỉ subdomain tương ứng (như `nonnuoc.hoalang.site`) thay vì Next.js `<Link>` dẫn tới `/tenant/[slug]`. Đảm bảo mở trang ở tab mới (`target="_blank"`) giúp nâng tầm trải nghiệm khám phá bản đồ. Đồng thời, xóa bỏ import `Link` không sử dụng để vượt qua ESLint.
   - Sửa đổi trong [app/[locale]/admin/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/page.tsx). Thay thế link xem trực tiếp website của Super Admin bằng hàm `getTenantUrl` để điều hướng chuẩn xác tới subdomain của làng nghề.
   - Sửa đổi trong [app/[locale]/tenant/[slug]/builder/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/tenant/[slug]/builder/page.tsx). Cập nhật nút Back "Quay lại website" để dẫn tới subdomain chính thức thay vì thư mục con.
   - Sửa đổi trong [components/dashboard/DashboardSidebar.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/dashboard/DashboardSidebar.tsx) (cả giao diện Desktop và Mobile drawer). Đồng bộ nút "Xem Website" để trỏ về subdomain thực tế của chi nhánh.
   - Sửa đổi trong [components/dashboard/PublishPanel.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/dashboard/PublishPanel.tsx). Cập nhật biến `liveUrl` và `previewUrl` sử dụng helper `getTenantUrl` để phản ánh đúng cấu trúc URL tên miền phụ động ở mọi môi trường (Local và Production).
4. **Build Pipeline Validation**:
   - Chạy `npm run build` ở phía FE và `pnpm build` ở phía BE đều đạt trạng thái thành công 100%.

---

### [2026-05-31] i18n, Mapbox Fallback, and Aesthetics Enhancements

#### Tác vụ hoàn thành
- Tích hợp dịch đa ngôn ngữ toàn diện cho phần Footer.
- Nâng cấp Component bản đồ để xử lý lỗi thiếu Mapbox Token một cách mềm mại (Graceful Degradation).
- Đồng bộ các nguyên tắc thiết kế sang tệp cấu hình hệ thống `GEMINI.md`.
- Thiết lập tài liệu hóa và cấu hình rõ ràng các biến môi trường tại `.env.local` cho cả Local và Production.
- Khắc phục triệt để toàn bộ lỗi ESLint và TypeScript compiler (`unused-vars`, `no-explicit-any`) trên các tệp giao diện.

#### Chi tiết kỹ thuật & File thay đổi
1. **Footer Multi-language**:
   - Thay đổi trong [Footer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/layout/Footer.tsx).
   - Loại bỏ toàn bộ các chuỗi văn bản hardcode. Sử dụng `useTranslations('Footer')` từ `next-intl` để đảm bảo chuyển dịch hoàn hảo giữa tiếng Anh và tiếng Việt có dấu chuẩn sắc.
   - Các bản dịch tương ứng được thêm vào `messages/vi.json` và `messages/en.json`.
2. **Mapbox Graceful Fallback**:
   - Sửa đổi trong [MapboxMap.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/MapboxMap.tsx).
   - Thêm cơ chế kiểm tra `process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`. Nếu token không tồn tại, thay vì crash giao diện với lỗi Unhandled Runtime Error, hệ thống sẽ render một trình giữ chỗ (Placeholder) được thiết kế theo đúng nhận diện thương hiệu nghệ thuật của HoaLang (giấy dó Parchment, border Stone, logo vàng nghệ Gold và gạch chỉ hướng).
3. **GEMINI.md Rule Sync**:
   - Cập nhật [GEMINI.md](file:///C:/Users/Lenovo/.gemini/GEMINI.md).
   - Thêm quy tắc nghiêm ngặt về đa ngôn ngữ (`i18n Rules`), cấu trúc mã nguồn sạch (`Clean Project Structure`), và bộ nhớ phát triển (`Development Logs & Memory`).
4. **Environment Variables Documentation**:
   - Chỉnh sửa tệp [.env.local](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/.env.local).
   - Tổ chức và chú thích chi tiết các phân vùng biến môi trường cho môi trường phát triển cục bộ (`LOCAL DEVELOPMENT`) và môi trường triển khai thực tế (`PRODUCTION DEPLOYMENT`), giúp nhà phát triển dễ dàng chuyển đổi (comment/uncomment) mà không làm mất thông tin cấu hình.
5. **Zero Warnings ESLint & TypeScript Clean Up**:
   - Chỉnh sửa trong [VnAddressSelect.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/VnAddressSelect.tsx), [SectionRenderer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/tenant/SectionRenderer.tsx), và [ExperiencesSection.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/tenant/sections/ExperiencesSection.tsx).
   - Khai báo rõ ràng các interface (`RawWard`, `RawDistrict`, `ProvincePayload`) cho payloads địa chỉ để loại bỏ kiểu `any`.
   - Thay thế `React.ComponentType<any>` bằng kiểu dữ liệu tường minh `React.ComponentType<{ section: Section }>` trong bộ kết xuất Dynamic Section Renderer.
   - Loại bỏ các unused imports dư thừa (`useMemo`, `Calendar`) để vượt qua các khâu biên dịch ESLint nghiêm ngặt nhất.

#### Lưu ý cho lần phát triển tiếp theo
- Khi xây dựng các trang mới (Ví dụ: danh sách làng nghề, chi tiết sản phẩm), luôn bọc văn bản bằng `useTranslations` từ `next-intl`.
- Khi dùng các API key bên ngoài (Mapbox, v.v.), luôn có phương án fallback UI phòng trường hợp biến môi trường không khả dụng.

### [2026-05-31] Complete Authentication Integration: verify-account & OAuth callback

#### Tác vụ hoàn thành
- Tích hợp thành công 2 trang đích quan trọng trong Authentication Flow: Kích hoạt tài khoản (Email Verification) và Đăng nhập mạng xã hội (Google OAuth Callback).
- Đồng bộ dịch thuật đa ngôn ngữ toàn diện (i18n) cho cả 2 trang, đảm bảo Tiếng Việt chuẩn xác có dấu nghệ thuật, không hardcode text trực tiếp.
- Tuân thủ nghiêm ngặt cẩm nang thiết kế HoaLang: phối màu parchment background, cream card, lacquer accent buttons và copper elements.
- Bọc toàn bộ logic Client-Side Search Params trong `<Suspense>` của Next.js 14 App Router để loại bỏ hoàn toàn các lỗi opt-out of SSR/static compilation cảnh báo lúc build production.

#### Chi tiết kỹ thuật & File thay đổi
1. **Google OAuth Callback Page**:
   - Thêm mới [callback/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/callback/page.tsx).
   - Đọc query params: `accessToken`, `refreshToken`, `user` (được BE encode URI JSON).
   - Hydrate toàn bộ thông tin đăng nhập vào Zustand `useAuthStore` và cập nhật cookie an toàn.
   - Thêm hiệu ứng quay vòng đồng tinh xảo kèm grain background, tự động chuyển hướng theo phân quyền (`USER` -> Home `/`, `ADMIN` -> `/admin`, `VILLAGE_OWNER` -> `/dashboard`).
2. **Email Verification Page**:
   - Thêm mới [verify-account/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/verify-account/page.tsx).
   - Truy vấn API `/auth/verify-account?token=...` qua client `api.ts`.
   - Hiển thị các trạng thái trực quan: Loading spinner nhấp nháy màu sơn mài (lacquer), Success (thông báo chúc mừng có dấu, tự động đếm ngược 5 giây về login), và Error (thông báo lỗi, nút quay lại trang đăng nhập ghost style).
3. **i18n Translation Keys**:
   - Sửa đổi [vi.json](file:///d:/HoaLang/HoaLang_FE/messages/vi.json) và [en.json](file:///d:/HoaLang/HoaLang_FE/messages/en.json) để thêm các nhãn quốc tế hoá cho hai màn hình trên.

### [2026-06-01] Robust local multi-tenant API base URL mapping and HTML error response filters

#### Tác vụ hoàn thành
- Khắc phục triệt để lỗi hiển thị raw HTML trang 404 của Next.js khi người dùng thao tác ở môi trường cục bộ (localhost, 127.0.0.1, hoặc các subdomain phát triển cục bộ dạng `*.localhost`).
- Nâng cấp bộ bắt lỗi của trang Đăng nhập (`login/page.tsx`) tương ứng với các tiêu chuẩn an toàn lọc HTML đã thiết lập ở trang Đăng ký (`register/page.tsx`).

#### Chi tiết kỹ thuật & File thay đổi
1. **Local Multi-Tenant Host Detection**:
   - Thay đổi trong [api.ts](file:///d:/HoaLang/HoaLang_FE/lib/api.ts).
   - Nâng cấp `getInitialBaseUrl()` để nhận diện thêm các địa chỉ host nội bộ như `127.0.0.1` và bất kỳ subdomain con nào tận cùng bằng `.localhost` (ví dụ `battrang.localhost`). Thay vì trả về đường dẫn tương đối `/api/v1` (gây 404 do Next.js dev server không có proxy), cấu hình sẽ trả về URL tuyệt đối `http://localhost:5000/api/v1` giúp gọi thẳng sang cổng Backend Express.
2. **Robust Login Error Handlers & Fallbacks**:
   - Sửa đổi trong [page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/login/page.tsx).
   - Áp dụng bộ lọc và rà soát chuỗi phản hồi đặc biệt. Nếu phản hồi trả về chứa thẻ HTML (lỗi 404 từ server không có router, lỗi 502/504 cổng kết nối bị sập), hệ thống sẽ hiển thị một thông báo có nghĩa về lỗi kết nối mạng ("Lỗi kết nối: Không thể kết nối tới máy chủ Back-End (404 Not Found)") thay vì in nguyên bản mã nguồn HTML dài dặc lên khung thông báo Sonner.

### [2026-06-01] React Strict Mode Double-Fetch Guard for Account Verification

#### Tác vụ hoàn thành
- Sửa lỗi trang kích hoạt hiển thị trạng thái "Kích hoạt thất bại / Verification Failed" do `useEffect` chạy 2 lần trong chế độ React Strict Mode của môi trường Development.
- Bảo vệ trang kích hoạt khỏi việc gửi hai cuộc gọi API đồng thời gây ra tình trạng race condition và xung đột trạng thái xác thực.

#### Chi tiết kỹ thuật & File thay đổi
1. **Ref Request Guard in Verification Page**:
   - Thay đổi trong [page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/verify-account/page.tsx).
   - Sử dụng `useRef` làm lăng kính trạng thái `hasRequested` bảo vệ API. Nếu `hasRequested.current` đã là `true`, `useEffect` sẽ bỏ qua lần gọi tiếp theo. Điều này ngăn chặn triệt để cuộc gọi kép của React Strict Mode trong môi trường Development, giữ tính nhất quán 100% cho trạng thái UI.

### [2026-06-01] User Name Mapping Bug Fix on Login Page

#### Tác vụ hoàn thành
- Khắc phục lỗi hiển thị Email thay vì Họ tên người dùng trên Thanh điều hướng (Header) sau khi đăng nhập bằng tài khoản hệ thống (Credentials).
- Nhất quán hóa cấu trúc đối tượng người dùng lưu trữ trong Zustand Auth Store giữa các phương thức đăng nhập hệ thống và Google OAuth SSO.

#### Chi tiết kỹ thuật & File thay đổi
1. **User Schema Property Mapping on Login**:
   - Thay đổi trong [page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/login/page.tsx).
   - Sửa đổi ánh xạ đối tượng `mappedUser`: Cập nhật trường `name` sử dụng `user.fullName || user.name` thay vì chỉ gán `user.name` (trường không tồn tại trên Mongoose User model của backend do backend sử dụng `fullName`).
   - Việc sửa đổi này giúp đồng bộ hoàn hảo với cách ánh xạ của OAuth callback, cho phép Header render chuẩn xác Tên đầy đủ của người dùng (`user.name`) và chỉ rơi về Email khi cả hai giá trị tên đều bị khuyết thiếu.

### [2026-06-01] Premium User Avatar & Dropdown Menu Integration in Header

#### Tác vụ hoàn thành
- Tích hợp trường `avatar` vào cấu trúc người dùng của Zustand Auth Store, đồng bộ ánh xạ ảnh đại diện từ cả Đăng nhập thường và Google OAuth SSO.
- Thay thế nút "Đăng xuất" đơn giản bằng giao diện Ảnh đại diện (Avatar) tinh tế kèm Dropdown chuyển hướng động và kích hoạt đăng xuất sang trọng trên cả phiên bản Desktop và Mobile Drawer.
- Tuân thủ chặt chẽ design tokens của HoaLang: sử dụng cấu trúc ảnh vuông nhẹ (`rounded-sm`), viền nhạt `stone`, nền sơn mài `lacquer` cho monogram fallback, và hoạt ảnh mượt mà bằng Framer Motion.

#### Chi tiết kỹ thuật & File thay đổi
1. **Zustand Auth Store Schema Update**:
   - Thay đổi trong [authStore.ts](file:///d:/HoaLang/HoaLang_FE/lib/store/authStore.ts).
   - Bổ sung trường `avatar?: string` vào giao diện người dùng `User`.
2. **Auth Pages Mapping**:
   - Thay đổi trong [login/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/login/page.tsx) và [callback/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/callback/page.tsx).
   - Ánh xạ thêm trường `avatar` từ phản hồi của API Backend vào Zustand Store.
3. **Header User Interface Redesign**:
   - Thay đổi trong [Header.tsx](file:///d:/HoaLang/HoaLang_FE/components/layout/Header.tsx).
   - Thiết kế Avatar vuông `rounded-sm` (tương thích triết lý ảnh tạp chí của HoaLang) kết hợp Monogram tự động sinh từ chữ cái đầu của tên/email nếu người dùng chưa cập nhật ảnh.
   - Thêm dropdown menu sử dụng Framer Motion (`AnimatePresence` & `motion.div`) hiển thị Tên đầy đủ, Email, tùy chọn Quản trị hệ thống (theo quyền `ADMIN` hoặc `VILLAGE_OWNER`), và nút Đăng xuất tinh xảo.
   - Nâng cấp đồng bộ giao diện Mobile Drawer (Sheet) hiển thị block Profile người dùng có avatar và thông tin vai trò trực quan, ngăn nắp.
- Tuyệt đối tuân thủ quy tắc không dùng kiểu dữ liệu `any` và loại bỏ unused imports ngay sau khi code xong.

---

### [2026-06-01] Bilingual Role Registration Tabs & Artisan Owner Form Implementation

#### Tác vụ hoàn thành
- Tích hợp thêm thanh lựa chọn phân quyền (Role Switching Premium Tabs) cho phép người dùng chuyển đổi qua lại giữa hình thức đăng ký tài khoản **Khách du lịch (Traveler)** và **Chủ làng nghề (Artisan Owner)** tại trang Đăng ký tài khoản (`/auth/register`).
- Cá nhân hóa giao diện và trải nghiệm nhập liệu động: tự động thay đổi mô tả phụ đề trang, nhãn (labels), trình giữ chỗ (placeholders), danh sách quyền lợi tài khoản (benefits list) theo phân quyền được chọn để mang lại trải nghiệm chuyên nghiệp, thanh lịch.
- Kết nối thành công với API Backend bằng cách truyền động vai trò đăng ký (`USER` hoặc `VILLAGE_OWNER`) khi gửi biểu mẫu.

#### Chi tiết kỹ thuật & File thay đổi
1. **Dynamic Registration Form with Role Tabs**:
   - Thay đổi trong [register/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/register/page.tsx).
   - Thiết kế thanh tab chuyển quyền siêu phẳng bằng các nút bọc trong đường viền nhẹ `stone` và nền giấy dó `parchment/40`. Khi được chọn, tab active sẽ có nền sơn mài `lacquer` và chữ màu kem `cream` sang trọng, đi kèm micro-animation mượt mà.
   - Thêm trạng thái `activeRole` để quản lý phân quyền và đồng bộ hóa tự động các nội dung gợi ý/placeholder.
   - Khi chọn làm chủ làng nghề (`VILLAGE_OWNER`), các nhãn đổi thành "Họ và tên nghệ nhân / Artisan Name" và hộp thoại hiển thị danh sách quyền lợi sẽ chuyển đổi sang mô hình quản trị website làng nghề.

---

### [2026-06-01] Client-Side Security Route Guards & Hydration Flashing Prevention

#### Tác vụ hoàn thành
- Khắc phục lỗ hổng bảo mật cho phép khách du lịch chưa đăng nhập hoặc đăng nhập bằng tài khoản thông thường (`USER`) truy cập trái phép vào các trang quản trị của Chủ làng nghề tại đường dẫn `/dashboard` (và tất cả sub-routes bên trong).
- Khắc phục lỗ hổng bảo mật cho phép truy cập trái phép vào trang quản trị tối cao của Super Admin tại đường dẫn `/admin`.
- Thiết kế màn hình chờ xác thực phân quyền (Authenticating Screen) chuẩn cẩm nang mỹ thuật giúp ngăn chặn triệt để tình trạng nhấp nháy giao diện (UI flashing/flickering) khi Next.js đang hydrate và kiểm tra trạng thái xác thực.

#### Chi tiết kỹ thuật & File thay đổi
## 2. Nhật ký Thay đổi chi tiết (Changelog)

### [2026-06-01] Premium Overlay Registration Modal Implementation

#### Tác vụ hoàn thành
- Khắc phục giao diện lỗi thời và không nhất quán khi thay thế hộp thoại nhập tin nhắn gốc của trình duyệt (`window.prompt()`) bằng một **Overlay Modal biểu mẫu đăng ký cao cấp**.
- Thiết kế biểu mẫu điền thông tin đăng ký có đầy đủ các trường phong phú (Tên làng, Tên miền phụ, Tên nghệ nhân, SĐT, Tỉnh thành, và Bản mẫu thiết kế) được thiết kế theo đúng nhận diện thương hiệu nghệ thuật và màu sắc dó/sơn mài của HoaLang.

#### Chi tiết kỹ thuật & File thay đổi
1. **Interactive Overlay Form Dialog**:
   - Thay đổi trong [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/page.tsx).
   - Tích hợp thêm component Modal điều khiển bằng trạng thái React, kết hợp với các hiệu ứng chuyển động mượt mà của **Framer Motion (`AnimatePresence` và `motion.div`)**.
   - Bổ sung tính năng tự động chuẩn hóa và sinh tên miền phụ (Clean Slug Generator) tự động biến đổi chuỗi tiếng Việt có dấu (ví dụ: `Làng Gốm Bàu Trúc` -> `bau-truc`) thành slug hợp lệ tại runtime thời gian thực.
   - Thêm nút tắt linh hoạt dạng icon và nút hủy bỏ giúp tăng tốc độ thao tác của người quản trị.

---

### [2026-06-01] Google OAuth Avatar Referrer Policy Resolution

#### Tác vụ hoàn thành
- Khắc phục lỗi hiển thị ảnh đại diện (avatar) bị lỗi hiển thị/broken image khi người dùng thực hiện đăng nhập bằng tài khoản Google.
- Thêm thuộc tính `referrerPolicy="no-referrer"` vào các thẻ `<img>` hiển thị avatar trên toàn hệ thống giao diện (Desktop Header và Mobile Drawer Header) để vượt qua lớp bảo mật chống Hotlinking của Google.

#### Chi tiết kỹ thuật & File thay đổi
1. **Header Avatar Images Refactoring**:
   - Thay đổi trong [Header.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/layout/Header.tsx).
   - Tích hợp thêm thuộc tính `referrerPolicy="no-referrer"` cho cả component hiển thị ảnh đại diện người dùng ở thanh Menu chính phía trên (Desktop) và trong menu trượt di động (Mobile Drawer). Việc này giúp trình duyệt loại bỏ header `Referer` khi tải ảnh từ máy chủ `lh3.googleusercontent.com` của Google, giải quyết triệt để lỗi `403 Forbidden` do Google chặn cross-origin request.

---

### [2026-06-01] Next.js Page Export, Type Safety & Subdomain Routing Resolution

#### Tác vụ hoàn thành
- Khắc phục triệt để lỗi biên dịch `npm run build` trên Frontend liên quan đến Named Exports trong các trang (`page.tsx`).
- Refactor cấu trúc Dynamic Component Renderers trong `SectionRenderer.tsx` để đạt 100% Type Safety tuyệt đối mà không cần dùng `any` hay ép kiểu không an toàn.
- Giải quyết vấn đề định tuyến đa chi nhánh (Subdomain Routing): Sửa lỗi liên kết truy cập website làng nghề trên bản đồ và hệ thống bảng quản trị để hướng trực tiếp tới subdomain thực tế (ví dụ: `nonnuoc.hoalang.site`) thay vì đường dẫn thư mục giả lập trên domain chính (`/vi/tenant/...`).
- Đạt trạng thái biên dịch thành công hoàn hảo (Zero Errors) cho cả Frontend và Backend (`pnpm build`).

#### Chi tiết kỹ thuật & File thay đổi
1. **Next.js Page Export Rules Compliance**:
   - Sửa đổi trong các tệp: [orders/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/dashboard/orders/page.tsx), [website/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/dashboard/website/page.tsx), và [dashboard/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/dashboard/page.tsx).
   - Loại bỏ toàn bộ `export { OrdersLog };`, `export { WebsiteEditor };`, và `export { DashboardOverview };` ở cuối tệp. Do Next.js quy định các tệp `page.tsx` chỉ được phép export default duy nhất một component đại diện, việc export named trước đó đã làm lỗi trình dựng biên dịch `.next/types/.../page.ts`.
2. **Type Safety in SectionRenderer**:
   - Thay đổi trong [SectionRenderer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/tenant/SectionRenderer.tsx).
   - Thay thế cấu trúc ánh xạ động `SECTION_MAP` (vốn vi phạm TypeScript parameter type contravariance) bằng cấu trúc lệnh rẽ nhánh `switch (section.type)` cực kỳ tường minh.
   - Nhờ đó, TypeScript phân tích luồng dữ liệu (control flow analysis) có thể tự động thu hẹp kiểu dữ liệu (type narrowing) của `section` tương ứng với mỗi Component của từng Section cụ thể, đảm bảo sự an toàn tuyệt đối 100% Type Safety mà không có bất kỳ khai báo `any` nào.
3. **Subdomain Routing & Link Synchronization**:
   - Sửa đổi trong [app/[locale]/map/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/map/page.tsx). Tích hợp hàm tiện ích `getTenantUrl` và đổi nút "Truy cập website" thành thẻ `<a>` hướng tới địa chỉ subdomain tương ứng (như `nonnuoc.hoalang.site`) thay vì Next.js `<Link>` dẫn tới `/tenant/[slug]`. Đảm bảo mở trang ở tab mới (`target="_blank"`) giúp nâng tầm trải nghiệm khám phá bản đồ. Đồng thời, xóa bỏ import `Link` không sử dụng để vượt qua ESLint.
   - Sửa đổi trong [app/[locale]/admin/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/page.tsx). Thay thế link xem trực tiếp website của Super Admin bằng hàm `getTenantUrl` để điều hướng chuẩn xác tới subdomain của làng nghề.
   - Sửa đổi trong [app/[locale]/tenant/[slug]/builder/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/tenant/[slug]/builder/page.tsx). Cập nhật nút Back "Quay lại website" để dẫn tới subdomain chính thức thay vì thư mục con.
   - Sửa đổi trong [components/dashboard/DashboardSidebar.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/dashboard/DashboardSidebar.tsx) (cả giao diện Desktop và Mobile drawer). Đồng bộ nút "Xem Website" để trỏ về subdomain thực tế của chi nhánh.
   - Sửa đổi trong [components/dashboard/PublishPanel.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/dashboard/PublishPanel.tsx). Cập nhật biến `liveUrl` và `previewUrl` sử dụng helper `getTenantUrl` để phản ánh đúng cấu trúc URL tên miền phụ động ở mọi môi trường (Local và Production).
4. **Build Pipeline Validation**:
   - Chạy `npm run build` ở phía FE và `pnpm build` ở phía BE đều đạt trạng thái thành công 100%.

---

### [2026-05-31] i18n, Mapbox Fallback, and Aesthetics Enhancements

#### Tác vụ hoàn thành
- Tích hợp dịch đa ngôn ngữ toàn diện cho phần Footer.
- Nâng cấp Component bản đồ để xử lý lỗi thiếu Mapbox Token một cách mềm mại (Graceful Degradation).
- Đồng bộ các nguyên tắc thiết kế sang tệp cấu hình hệ thống `GEMINI.md`.
- Thiết lập tài liệu hóa và cấu hình rõ ràng các biến môi trường tại `.env.local` cho cả Local và Production.
- Khắc phục triệt để toàn bộ lỗi ESLint và TypeScript compiler (`unused-vars`, `no-explicit-any`) trên các tệp giao diện.

#### Chi tiết kỹ thuật & File thay đổi
1. **Footer Multi-language**:
   - Thay đổi trong [Footer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/layout/Footer.tsx).
   - Loại bỏ toàn bộ các chuỗi văn bản hardcode. Sử dụng `useTranslations('Footer')` từ `next-intl` để đảm bảo chuyển dịch hoàn hảo giữa tiếng Anh và tiếng Việt có dấu chuẩn sắc.
   - Các bản dịch tương ứng được thêm vào `messages/vi.json` và `messages/en.json`.
2. **Mapbox Graceful Fallback**:
   - Sửa đổi trong [MapboxMap.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/MapboxMap.tsx).
   - Thêm cơ chế kiểm tra `process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`. Nếu token không tồn tại, thay vì crash giao diện với lỗi Unhandled Runtime Error, hệ thống sẽ render một trình giữ chỗ (Placeholder) được thiết kế theo đúng nhận diện thương hiệu nghệ thuật của HoaLang (giấy dó Parchment, border Stone, logo vàng nghệ Gold và gạch chỉ hướng).
3. **GEMINI.md Rule Sync**:
   - Cập nhật [GEMINI.md](file:///C:/Users/Lenovo/.gemini/GEMINI.md).
   - Thêm quy tắc nghiêm ngặt về đa ngôn ngữ (`i18n Rules`), cấu trúc mã nguồn sạch (`Clean Project Structure`), và bộ nhớ phát triển (`Development Logs & Memory`).
4. **Environment Variables Documentation**:
   - Chỉnh sửa tệp [.env.local](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/.env.local).
   - Tổ chức và chú thích chi tiết các phân vùng biến môi trường cho môi trường phát triển cục bộ (`LOCAL DEVELOPMENT`) và môi trường triển khai thực tế (`PRODUCTION DEPLOYMENT`), giúp nhà phát triển dễ dàng chuyển đổi (comment/uncomment) mà không làm mất thông tin cấu hình.
5. **Zero Warnings ESLint & TypeScript Clean Up**:
   - Chỉnh sửa trong [VnAddressSelect.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/VnAddressSelect.tsx), [SectionRenderer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/tenant/SectionRenderer.tsx), và [ExperiencesSection.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/tenant/sections/ExperiencesSection.tsx).
   - Khai báo rõ ràng các interface (`RawWard`, `RawDistrict`, `ProvincePayload`) cho payloads địa chỉ để loại bỏ kiểu `any`.
   - Thay thế `React.ComponentType<any>` bằng kiểu dữ liệu tường minh `React.ComponentType<{ section: Section }>` trong bộ kết xuất Dynamic Section Renderer.
   - Loại bỏ các unused imports dư thừa (`useMemo`, `Calendar`) để vượt qua các khâu biên dịch ESLint nghiêm ngặt nhất.

#### Lưu ý cho lần phát triển tiếp theo
- Khi xây dựng các trang mới (Ví dụ: danh sách làng nghề, chi tiết sản phẩm), luôn bọc văn bản bằng `useTranslations` từ `next-intl`.
- Khi dùng các API key bên ngoài (Mapbox, v.v.), luôn có phương án fallback UI phòng trường hợp biến môi trường không khả dụng.

### [2026-05-31] Complete Authentication Integration: verify-account & OAuth callback

#### Tác vụ hoàn thành
- Tích hợp thành công 2 trang đích quan trọng trong Authentication Flow: Kích hoạt tài khoản (Email Verification) và Đăng nhập mạng xã hội (Google OAuth Callback).
- Đồng bộ dịch thuật đa ngôn ngữ toàn diện (i18n) cho cả 2 trang, đảm bảo Tiếng Việt chuẩn xác có dấu nghệ thuật, không hardcode text trực tiếp.
- Tuân thủ nghiêm ngặt cẩm nang thiết kế HoaLang: phối màu parchment background, cream card, lacquer accent buttons và copper elements.
- Bọc toàn bộ logic Client-Side Search Params trong `<Suspense>` của Next.js 14 App Router để loại bỏ hoàn toàn các lỗi opt-out of SSR/static compilation cảnh báo lúc build production.

#### Chi tiết kỹ thuật & File thay đổi
1. **Google OAuth Callback Page**:
   - Thêm mới [callback/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/callback/page.tsx).
   - Đọc query params: `accessToken`, `refreshToken`, `user` (được BE encode URI JSON).
   - Hydrate toàn bộ thông tin đăng nhập vào Zustand `useAuthStore` và cập nhật cookie an toàn.
   - Thêm hiệu ứng quay vòng đồng tinh xảo kèm grain background, tự động chuyển hướng theo phân quyền (`USER` -> Home `/`, `ADMIN` -> `/admin`, `VILLAGE_OWNER` -> `/dashboard`).
2. **Email Verification Page**:
   - Thêm mới [verify-account/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/verify-account/page.tsx).
   - Truy vấn API `/auth/verify-account?token=...` qua client `api.ts`.
   - Hiển thị các trạng thái trực quan: Loading spinner nhấp nháy màu sơn mài (lacquer), Success (thông báo chúc mừng có dấu, tự động đếm ngược 5 giây về login), và Error (thông báo lỗi, nút quay lại trang đăng nhập ghost style).
3. **i18n Translation Keys**:
   - Sửa đổi [vi.json](file:///d:/HoaLang/HoaLang_FE/messages/vi.json) và [en.json](file:///d:/HoaLang/HoaLang_FE/messages/en.json) để thêm các nhãn quốc tế hoá cho hai màn hình trên.

### [2026-06-01] Robust local multi-tenant API base URL mapping and HTML error response filters

#### Tác vụ hoàn thành
- Khắc phục triệt để lỗi hiển thị raw HTML trang 404 của Next.js khi người dùng thao tác ở môi trường cục bộ (localhost, 127.0.0.1, hoặc các subdomain phát triển cục bộ dạng `*.localhost`).
- Nâng cấp bộ bắt lỗi của trang Đăng nhập (`login/page.tsx`) tương ứng với các tiêu chuẩn an toàn lọc HTML đã thiết lập ở trang Đăng ký (`register/page.tsx`).

#### Chi tiết kỹ thuật & File thay đổi
1. **Local Multi-Tenant Host Detection**:
   - Thay đổi trong [api.ts](file:///d:/HoaLang/HoaLang_FE/lib/api.ts).
   - Nâng cấp `getInitialBaseUrl()` để nhận diện thêm các địa chỉ host nội bộ như `127.0.0.1` và bất kỳ subdomain con nào tận cùng bằng `.localhost` (ví dụ `battrang.localhost`). Thay vì trả về đường dẫn tương đối `/api/v1` (gây 404 do Next.js dev server không có proxy), cấu hình sẽ trả về URL tuyệt đối `http://localhost:5000/api/v1` giúp gọi thẳng sang cổng Backend Express.
2. **Robust Login Error Handlers & Fallbacks**:
   - Sửa đổi trong [page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/login/page.tsx).
   - Áp dụng bộ lọc và rà soát chuỗi phản hồi đặc biệt. Nếu phản hồi trả về chứa thẻ HTML (lỗi 404 từ server không có router, lỗi 502/504 cổng kết nối bị sập), hệ thống sẽ hiển thị một thông báo có nghĩa về lỗi kết nối mạng ("Lỗi kết nối: Không thể kết nối tới máy chủ Back-End (404 Not Found)") thay vì in nguyên bản mã nguồn HTML dài dặc lên khung thông báo Sonner.

### [2026-06-01] React Strict Mode Double-Fetch Guard for Account Verification

#### Tác vụ hoàn thành
- Sửa lỗi trang kích hoạt hiển thị trạng thái "Kích hoạt thất bại / Verification Failed" do `useEffect` chạy 2 lần trong chế độ React Strict Mode của môi trường Development.
- Bảo vệ trang kích hoạt khỏi việc gửi hai cuộc gọi API đồng thời gây ra tình trạng race condition và xung đột trạng thái xác thực.

#### Chi tiết kỹ thuật & File thay đổi
1. **Ref Request Guard in Verification Page**:
   - Thay đổi trong [page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/verify-account/page.tsx).
   - Sử dụng `useRef` làm lăng kính trạng thái `hasRequested` bảo vệ API. Nếu `hasRequested.current` đã là `true`, `useEffect` sẽ bỏ qua lần gọi tiếp theo. Điều này ngăn chặn triệt để cuộc gọi kép của React Strict Mode trong môi trường Development, giữ tính nhất quán 100% cho trạng thái UI.

### [2026-06-01] User Name Mapping Bug Fix on Login Page

#### Tác vụ hoàn thành
- Khắc phục lỗi hiển thị Email thay vì Họ tên người dùng trên Thanh điều hướng (Header) sau khi đăng nhập bằng tài khoản hệ thống (Credentials).
- Nhất quán hóa cấu trúc đối tượng người dùng lưu trữ trong Zustand Auth Store giữa các phương thức đăng nhập hệ thống và Google OAuth SSO.

#### Chi tiết kỹ thuật & File thay đổi
1. **User Schema Property Mapping on Login**:
   - Thay đổi trong [page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/login/page.tsx).
   - Sửa đổi ánh xạ đối tượng `mappedUser`: Cập nhật trường `name` sử dụng `user.fullName || user.name` thay vì chỉ gán `user.name` (trường không tồn tại trên Mongoose User model của backend do backend sử dụng `fullName`).
   - Việc sửa đổi này giúp đồng bộ hoàn hảo với cách ánh xạ của OAuth callback, cho phép Header render chuẩn xác Tên đầy đủ của người dùng (`user.name`) và chỉ rơi về Email khi cả hai giá trị tên đều bị khuyết thiếu.

### [2026-06-01] Premium User Avatar & Dropdown Menu Integration in Header

#### Tác vụ hoàn thành
- Tích hợp trường `avatar` vào cấu trúc người dùng của Zustand Auth Store, đồng bộ ánh xạ ảnh đại diện từ cả Đăng nhập thường và Google OAuth SSO.
- Thay thế nút "Đăng xuất" đơn giản bằng giao diện Ảnh đại diện (Avatar) tinh tế kèm Dropdown chuyển hướng động và kích hoạt đăng xuất sang trọng trên cả phiên bản Desktop và Mobile Drawer.
- Tuân thủ chặt chẽ design tokens của HoaLang: sử dụng cấu trúc ảnh vuông nhẹ (`rounded-sm`), viền nhạt `stone`, nền sơn mài `lacquer` cho monogram fallback, và hoạt ảnh mượt mà bằng Framer Motion.

#### Chi tiết kỹ thuật & File thay đổi
1. **Zustand Auth Store Schema Update**:
   - Thay đổi trong [authStore.ts](file:///d:/HoaLang/HoaLang_FE/lib/store/authStore.ts).
   - Bổ sung trường `avatar?: string` vào giao diện người dùng `User`.
2. **Auth Pages Mapping**:
   - Thay đổi trong [login/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/login/page.tsx) và [callback/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/callback/page.tsx).
   - Ánh xạ thêm trường `avatar` từ phản hồi của API Backend vào Zustand Store.
3. **Header User Interface Redesign**:
   - Thay đổi trong [Header.tsx](file:///d:/HoaLang/HoaLang_FE/components/layout/Header.tsx).
   - Thiết kế Avatar vuông `rounded-sm` (tương thích triết lý ảnh tạp chí của HoaLang) kết hợp Monogram tự động sinh từ chữ cái đầu của tên/email nếu người dùng chưa cập nhật ảnh.
   - Thêm dropdown menu sử dụng Framer Motion (`AnimatePresence` & `motion.div`) hiển thị Tên đầy đủ, Email, tùy chọn Quản trị hệ thống (theo quyền `ADMIN` hoặc `VILLAGE_OWNER`), và nút Đăng xuất tinh xảo.
   - Nâng cấp đồng bộ giao diện Mobile Drawer (Sheet) hiển thị block Profile người dùng có avatar và thông tin vai trò trực quan, ngăn nắp.
- Tuyệt đối tuân thủ quy tắc không dùng kiểu dữ liệu `any` và loại bỏ unused imports ngay sau khi code xong.

---

### [2026-06-01] Bilingual Role Registration Tabs & Artisan Owner Form Implementation

#### Tác vụ hoàn thành
- Tích hợp thêm thanh lựa chọn phân quyền (Role Switching Premium Tabs) cho phép người dùng chuyển đổi qua lại giữa hình thức đăng ký tài khoản **Khách du lịch (Traveler)** và **Chủ làng nghề (Artisan Owner)** tại trang Đăng ký tài khoản (`/auth/register`).
- Cá nhân hóa giao diện và trải nghiệm nhập liệu động: tự động thay đổi mô tả phụ đề trang, nhãn (labels), trình giữ chỗ (placeholders), danh sách quyền lợi tài khoản (benefits list) theo phân quyền được chọn để mang lại trải nghiệm chuyên nghiệp, thanh lịch.
- Kết nối thành công với API Backend bằng cách truyền động vai trò đăng ký (`USER` hoặc `VILLAGE_OWNER`) khi gửi biểu mẫu.

#### Chi tiết kỹ thuật & File thay đổi
1. **Dynamic Registration Form with Role Tabs**:
   - Thay đổi trong [register/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/register/page.tsx).
   - Thiết kế thanh tab chuyển quyền siêu phẳng bằng các nút bọc trong đường viền nhẹ `stone` và nền giấy dó `parchment/40`. Khi được chọn, tab active sẽ có nền sơn mài `lacquer` và chữ màu kem `cream` sang trọng, đi kèm micro-animation mượt mà.
   - Thêm trạng thái `activeRole` để quản lý phân quyền và đồng bộ hóa tự động các nội dung gợi ý/placeholder.
   - Khi chọn làm chủ làng nghề (`VILLAGE_OWNER`), các nhãn đổi thành "Họ và tên nghệ nhân / Artisan Name" và hộp thoại hiển thị danh sách quyền lợi sẽ chuyển đổi sang mô hình quản trị website làng nghề.

---

### [2026-06-01] Client-Side Security Route Guards & Hydration Flashing Prevention

#### Tác vụ hoàn thành
- Khắc phục lỗ hổng bảo mật cho phép khách du lịch chưa đăng nhập hoặc đăng nhập bằng tài khoản thông thường (`USER`) truy cập trái phép vào các trang quản trị của Chủ làng nghề tại đường dẫn `/dashboard` (và tất cả sub-routes bên trong).
- Khắc phục lỗ hổng bảo mật cho phép truy cập trái phép vào trang quản trị tối cao của Super Admin tại đường dẫn `/admin`.
- Thiết kế màn hình chờ xác thực phân quyền (Authenticating Screen) chuẩn cẩm nang mỹ thuật giúp ngăn chặn triệt để tình trạng nhấp nháy giao diện (UI flashing/flickering) khi Next.js đang hydrate và kiểm tra trạng thái xác thực.

#### Chi tiết kỹ thuật & File thay đổi
1. **Dashboard Route Protection**:
   - Sửa đổi trong [DashboardSidebar.tsx](file:///d:/HoaLang/HoaLang_FE/components/dashboard/DashboardSidebar.tsx).
   - Tích hợp Zuztand `useAuthStore` để lấy thông tin đăng nhập và router `@/navigation` để chuyển hướng.
   - Thêm `mounted` và `isAuthorized` làm hai chốt chặn bảo vệ. Nếu người dùng chưa đăng nhập, tự động đẩy về trang đăng nhập `/auth/login` kèm thông báo lỗi. Nếu đã đăng nhập nhưng không có vai trò `village_owner`, tự động chuyển hướng về trang chủ `/` kèm cảnh báo quyền hạn.
   - Trong thời gian chờ, render màn hình chờ xác thực có Compass xoay và grain background đồng bộ.
2. **Super Admin Route Protection**:
   - Sửa đổi trong [admin/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/admin/page.tsx).
   - Áp dụng cấu trúc chốt chặn tương tự Dashboard: bảo vệ nghiêm ngặt trang `/admin` chỉ dành riêng cho tài khoản có vai trò `admin`.

---

### [2026-06-01] End-to-End Forgot & Reset Password Implementation

#### Tác vụ hoàn thành
- Tích hợp và hoàn thiện tính năng khôi phục/đặt lại mật khẩu (Forgot & Reset Password) đồng bộ từ giao diện Client tới Backend API.
- Bổ sung trang yêu cầu khôi phục mật khẩu (`/auth/forgot-password`) để người dùng nhập email và nhận thư điện tử hướng dẫn khôi phục qua SMTP.
- Bổ sung trang nhập mật khẩu mới (`/auth/reset-password`) để đặt lại mật khẩu bảo mật và tự động đưa người dùng quay lại trang đăng nhập `/auth/login` qua đồng hồ đếm ngược 5 giây.
- Tích hợp Z Suspense boundary cho trang reset mật khẩu để Next.js 14 build tĩnh an toàn tuyệt đối.

#### Chi tiết kỹ thuật & File thay đổi
1. **Forgot & Reset Password Views**:
   - Sửa đổi trong [login/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/login/page.tsx). Thay thế link quên mật khẩu từ `#forgot` sang Next-Intl Link `/auth/forgot-password` để điều hướng chuẩn xác.
   - Thêm mới [forgot-password/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/forgot-password/page.tsx). Thiết kế biểu mẫu nhập email khôi phục tinh xảo kèm la bàn sơn mài xoay tròn lúc loading và thông điệp chúc mừng gửi thư thành công.
   - Thêm mới [reset-password/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/reset-password/page.tsx). Tích hợp search params trích xuất reset token và bọc trong `<Suspense>`. Cho phép người dùng nhập mật khẩu mới có xác nhận, hiển thị đồng hồ đếm ngược 5 giây và redirect khi đổi thành công.
   - Sửa đổi các file dịch [vi.json](file:///d:/HoaLang/HoaLang_FE/messages/vi.json) và [en.json](file:///d:/HoaLang/HoaLang_FE/messages/en.json) để hỗ trợ quốc tế hóa song ngữ toàn diện cho phân hệ này.

---

### [2026-06-01] Forgot & Reset Password Compilation & TypeScript Type Safety Fixes

#### Tác vụ hoàn thành
- Khắc phục lỗi biên dịch `Cannot find name 'AnimatePresence'` tại trang yêu cầu khôi phục mật khẩu (`/auth/forgot-password/page.tsx`) do thiếu import từ thư viện `framer-motion`.
- Tối ưu hóa và chuyển đổi toàn bộ cấu trúc xử lý lỗi trong khối `catch` từ kiểu khai báo trực tiếp `any` sang `unknown` tại cả hai trang khôi phục mật khẩu (`forgot-password/page.tsx`) và đặt lại mật khẩu (`reset-password/page.tsx`), đảm bảo tuân thủ 100% nguyên tắc TypeScript Type Safety nghiêm ngặt (không sử dụng kiểu `any` ngầm định hay tường minh) theo Rule 13 của cẩm nang phát triển `GEMINI.md`.

#### Chi tiết kỹ thuật & File thay đổi
1. **Forgot Password Screen Import & Catch Refactor**:
   - Sửa đổi trong [forgot-password/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/forgot-password/page.tsx).
   - Thêm `AnimatePresence` vào dòng khai báo import từ `framer-motion`.
   - Thay đổi kiểu bắt lỗi của khối `catch` từ `err: any` thành `err: unknown` và sử dụng type casting an toàn để truy xuất thuộc tính của đối tượng lỗi Axios phản hồi từ API Backend.
2. **Reset Password Screen Catch Refactor**:
   - Sửa đổi trong [reset-password/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/reset-password/page.tsx).
   - Thay thế kiểu bắt lỗi của khối `catch` từ `err: any` thành `err: unknown` tương thích với cơ chế rà soát TypeScript nghiêm ngặt, chuyển đổi cách truy cập các thuộc tính phản hồi Axios an toàn tuyệt đối.

---

### [2026-06-01] Multi-Tenant Dynamic PayOS & COD Checkout Integration

#### Tác vụ hoàn thành
- Kết nối thành công phân hệ Checkout với API Backend đa chi nhánh (multi-tenant) thực tế.
- Tự động hóa phân tách phương thức thanh toán dựa trên cấu hình cổng PayOS của từng làng nghề: chỉ hiển thị VietQR PayOS nếu làng nghề đó đã kết nối, ngược lại vô hiệu hóa và thông tin chi tiết qua tooltip/cảnh báo tinh xảo.
- Triển khai phân giải tên danh mục sang MongoDB ObjectIds tự động để đồng bộ với cấu trúc cơ sở dữ liệu Express/Mongoose.
- Xử lý các kịch bản COD thanh toán truyền thống hiển thị biên nhận di sản sang trọng và tự động chuyển hướng du khách tới trang thanh toán PayOS thật khi thực hiện giao dịch online sandbox.

#### Chi tiết kỹ thuật & File thay đổi
1. **Dynamic Checkout System**:
   - Thay đổi trong [CheckoutDrawer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/CheckoutDrawer.tsx).
   - Tích hợp `api` và `toast` thông báo. Khi mở Drawer, tự động gọi `GET /api/v1/tenant/payment-methods` để kiểm tra cấu hình PayOS của làng nghề.
   - Thêm trạng thái tải phương thức `fetchingMethods` hiển thị micro-loader và xử lý disable cổng thanh toán PayOS bằng viền đứt `dashed border`, làm mờ nhạt và hiển thị popover hướng dẫn chủ làng nghề cấu hình key.
   - Tích hợp `GET /api/v1/products` và `GET /api/v1/experiences` khi drawer mở ra, tự động đối chiếu tên Catalog tĩnh của trang landing với dữ liệu thật trong Database để trích xuất `matchedId`, tránh lỗi crash 404 khi gửi đơn đặt hàng.
   - Gửi yêu cầu thật qua `POST /api/v1/orders` (đối với Sản phẩm) và `POST /api/v1/bookings` (đối với Trải nghiệm/Workshop), tự động xử lý chuyển hướng `window.location.href = res.data.data.checkoutUrl` an toàn và mượt mà.
2. **Local Tenant Resolution Enhancement**:
   - Thay đổi trong [api.ts](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/lib/api.ts).
   - Bổ sung cơ chế fallback cho interceptor: trích xuất động slug từ pathname URL dạng `/tenant/[slug]` khi không sử dụng local subdomains, đảm bảo toàn bộ các request API trong quá trình kiểm thử E2E cục bộ tự động đính kèm header `x-tenant-slug` chuẩn xác.

---

### [2026-06-01] 100% Zero-Hardcoded i18n Localization for Checkout Module

#### Tác vụ hoàn thành
- Quốc tế hóa song ngữ toàn diện (Bilingual Elegance) cho toàn bộ phân hệ Checkout trong hệ thống HoaLang.
- Loại bỏ hoàn toàn các chuỗi hiển thị tĩnh (hardcoded strings) cũng như các logic rẽ nhánh ngôn ngữ thủ công (`locale === 'vi' ? ... : ...`) trong giao diện người dùng, tuân thủ nghiêm ngặt Quy tắc i18n số 12 của HoaLang UI Rule.
- Khắc phục lỗi cú pháp dư thừa dấu đóng ngoặc nhọn ở cuối các file dịch quốc tế `vi.json` và `en.json`.

#### Chi tiết kỹ thuật & File thay đổi
1. **Checkout Translation Namespace**:
   - Thay đổi trong [vi.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/vi.json) và [en.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/en.json).
   - Thiết lập block ngôn ngữ `"checkout"` chứa toàn bộ 38 khóa biên dịch cho nhãn (labels), tiêu đề đơn đặt hàng, mô tả chi tiết phương thức COD/PayOS, các thông điệp cảnh báo vô hiệu hóa, thông báo trạng thái giao dịch (toasts), biên nhận di sản (invoice), chỉ dẫn thanh toán thủ công và toàn bộ các placeholder trường nhập liệu động.
   - Sửa đổi cú pháp JSON: Loại bỏ dấu ngoặc nhọn thừa `}` ở dòng cuối cùng của cả hai file, phục hồi tính toàn vẹn cú pháp 100% cho cấu trúc tệp dịch.
2. **Checkout i18n Refactoring**:
   - Thay đổi trong [CheckoutDrawer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/CheckoutDrawer.tsx).
   - Tích hợp hook `useTranslations('checkout')` của `next-intl` để quản lý tập trung hóa dữ liệu ngôn ngữ.
   - Thay thế toàn bộ nhãn giao diện tĩnh, placeholder của các trường nhập liệu (`fullName`, `address`, `date`), toasts khởi tạo/kết nối PayOS sandbox và nội dung thông báo lỗi kết nối database bằng cú pháp dịch động `t('key')`.

---

### [2026-06-01] Desktop Full-Screen Frame Sizing, Smooth Scrolling & E2E Responsiveness Audit

#### Tác vụ hoàn thành
- Nâng cấp toàn diện giao diện trang chủ chính để mỗi phân hệ chính (`Bản đồ`, `Làng nghề`, `AI Lịch trình`, `Cửa hàng`, `Trải nghiệm`, và `Đăng ký nghệ nhân`) chiếm trọn vẹn **đúng 1 khung hình hiển thị (1 Viewport Height / 100vh)** khi hiển thị trên màn hình Desktop lớn, tạo cảm xúc tạp chí văn hóa siêu cao cấp.
- Thiết kế hệ thống tự động co giãn và thích ứng 100% (Responsiveness Audit) cho tất cả các thiết bị: Cho phép các phân hệ dàn trải tự nhiên theo chiều dọc (`min-h-screen py-12 sm:py-16`) trên thiết bị Tablet/Mobile để triệt tiêu hoàn toàn lỗi chồng chữ hoặc tràn khung chứa.
- Tích hợp cơ chế cuộn mượt tự động (Scroll Smooth) tăng tốc phần cứng trình duyệt khi du khách nhấn điều hướng trên thanh Header di sản.

#### Chi tiết kỹ thuật & File thay đổi
1. **Root Layout Smooth Scroll**:
   - Sửa đổi trong [layout.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/layout.tsx).
   - Bổ sung class utility `scroll-smooth` vào thẻ root `<html>` để hỗ trợ cơ chế cuộn mượt tự nhiên của Next.js và trình duyệt.
2. **Anchor smooth navigation links**:
   - Sửa đổi trong [Header.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/layout/Header.tsx).
   - Thay đổi định hướng liên kết của nút "BẢN ĐỒ" trong `navLinks` từ `/map` (trang atlas riêng) thành `/#map` (định danh neo tới phân vùng bản đồ trên trang chủ), giúp cả 5 nút điều hướng chính đồng bộ hóa cuộn mượt tới từng khung hình tương ứng.
3. **Viewport Frame Landing Page Redesign**:
   - Sửa đổi trong [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/page.tsx).
   - Cấu hình lại các thẻ `<section>` di sản (`#map`, `#villages`, `#itinerary`, `#shop`, `#experience`, `#artisan-registration`) sang cấu trúc khung hiển thị chuẩn `min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center py-12 sm:py-16 lg:py-0 relative overflow-hidden`.
   - Điều chỉnh chiều cao của hộp chứa Mapbox Map sang dạng `lg:h-[460px] lg:max-h-[52vh]` và các hộp chứa mỹ thuật của Cửa hàng, Trải nghiệm sang `lg:h-[380px] lg:max-h-[45vh]` để tối ưu hóa không gian hiển thị, loại bỏ 100% nguy cơ tràn chiều cao màn hình trên Laptop 13-15 inches.
    - Thử nghiệm và biên dịch thành công 100% bằng câu lệnh `npm run build` trên Front-end mà không gặp bất kỳ lỗi logic hay cảnh báo nghiêm trọng nào.

---

### [2026-06-02] Craft Villages Gallery Page & Multilingual Filter Integration

#### Tác vụ hoàn thành
- Phát triển thành công trang trưng bày và tìm kiếm tất cả các Làng Nghề (`/villages`) đáp ứng đầy đủ triết lý luxury editorial và thiết kế cao cấp của HoaLang.
- Tích hợp tính năng lọc đa năng (thanh tìm kiếm văn bản theo tên/tỉnh thành, bộ lọc dropdown Tỉnh thành, bộ lọc dropdown Ngành nghề sản xuất, và chốt chặn lọc các Làng Nghề "Đã xác minh" thiết kế hộp chọn ✦ dạng kim cương sang trọng).
- Cập nhật liên kết điều hướng trên thanh Header để mục "LÀNG NGHỀ" (Villages) chuyển từ liên kết neo cục bộ `/#villages` sang trang `/villages` chuyên biệt.
- Tích hợp dịch thuật đa ngôn ngữ 100% không hardcode chuỗi hiển thị cho cả 5 file cấu hình quốc tế hóa (`vi.json`, `en.json`, `ja.json`, `ko.json`, `zh.json`), tích hợp tự động phân giải tên Tỉnh thành và Nhãn ngành nghề sang ngôn ngữ tương ứng của du khách.

#### Chi tiết kỹ thuật & File thay đổi
1. **Types & Services**:
   - Thêm mới [types/village.ts](file:///d:/HoaLang/HoaLang_FE/types/village.ts): Định nghĩa kiểu dữ liệu `Village` bảo mật, đồng bộ 100% với Schema của Backend MongoDB.
   - Thêm mới [villageService.ts](file:///d:/HoaLang/HoaLang_FE/lib/services/villageService.ts): Quản lý các endpoint API gọi dữ liệu làng nghề thông qua Axios instance `api` tập trung.
2. **Nav Links**:
   - Sửa đổi [Header.tsx](file:///d:/HoaLang/HoaLang_FE/components/layout/Header.tsx): Cập nhật href của liên kết Làng nghề từ `/#villages` thành `/villages`.
2. **Robust Login Error Handlers & Fallbacks**:
   - Sửa đổi trong [page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/login/page.tsx).
   - Áp dụng bộ lọc và rà soát chuỗi phản hồi đặc biệt. Nếu phản hồi trả về chứa thẻ HTML (lỗi 404 từ server không có router, lỗi 502/504 cổng kết nối bị sập), hệ thống sẽ hiển thị một thông báo có nghĩa về lỗi kết nối mạng ("Lỗi kết nối: Không thể kết nối tới máy chủ Back-End (404 Not Found)") thay vì in nguyên bản mã nguồn HTML dài dặc lên khung thông báo Sonner.

### [2026-06-01] React Strict Mode Double-Fetch Guard for Account Verification

#### Tác vụ hoàn thành
- Sửa lỗi trang kích hoạt hiển thị trạng thái "Kích hoạt thất bại / Verification Failed" do `useEffect` chạy 2 lần trong chế độ React Strict Mode của môi trường Development.
- Bảo vệ trang kích hoạt khỏi việc gửi hai cuộc gọi API đồng thời gây ra tình trạng race condition và xung đột trạng thái xác thực.

#### Chi tiết kỹ thuật & File thay đổi
1. **Ref Request Guard in Verification Page**:
   - Thay đổi trong [page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/verify-account/page.tsx).
   - Sử dụng `useRef` làm lăng kính trạng thái `hasRequested` bảo vệ API. Nếu `hasRequested.current` đã là `true`, `useEffect` sẽ bỏ qua lần gọi tiếp theo. Điều này ngăn chặn triệt để cuộc gọi kép của React Strict Mode trong môi trường Development, giữ tính nhất quán 100% cho trạng thái UI.

### [2026-06-01] User Name Mapping Bug Fix on Login Page

#### Tác vụ hoàn thành
- Khắc phục lỗi hiển thị Email thay vì Họ tên người dùng trên Thanh điều hướng (Header) sau khi đăng nhập bằng tài khoản hệ thống (Credentials).
- Nhất quán hóa cấu trúc đối tượng người dùng lưu trữ trong Zustand Auth Store giữa các phương thức đăng nhập hệ thống và Google OAuth SSO.

#### Chi tiết kỹ thuật & File thay đổi
1. **User Schema Property Mapping on Login**:
   - Thay đổi trong [page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/login/page.tsx).
   - Sửa đổi ánh xạ đối tượng `mappedUser`: Cập nhật trường `name` sử dụng `user.fullName || user.name` thay vì chỉ gán `user.name` (trường không tồn tại trên Mongoose User model của backend do backend sử dụng `fullName`).
   - Việc sửa đổi này giúp đồng bộ hoàn hảo với cách ánh xạ của OAuth callback, cho phép Header render chuẩn xác Tên đầy đủ của người dùng (`user.name`) và chỉ rơi về Email khi cả hai giá trị tên đều bị khuyết thiếu.

### [2026-06-01] Premium User Avatar & Dropdown Menu Integration in Header

#### Tác vụ hoàn thành
- Tích hợp trường `avatar` vào cấu trúc người dùng của Zustand Auth Store, đồng bộ ánh xạ ảnh đại diện từ cả Đăng nhập thường và Google OAuth SSO.
- Thay thế nút "Đăng xuất" đơn giản bằng giao diện Ảnh đại diện (Avatar) tinh tế kèm Dropdown chuyển hướng động và kích hoạt đăng xuất sang trọng trên cả phiên bản Desktop và Mobile Drawer.
- Tuân thủ chặt chẽ design tokens của HoaLang: sử dụng cấu trúc ảnh vuông nhẹ (`rounded-sm`), viền nhạt `stone`, nền sơn mài `lacquer` cho monogram fallback, và hoạt ảnh mượt mà bằng Framer Motion.

#### Chi tiết kỹ thuật & File thay đổi
1. **Zustand Auth Store Schema Update**:
   - Thay đổi trong [authStore.ts](file:///d:/HoaLang/HoaLang_FE/lib/store/authStore.ts).
   - Bổ sung trường `avatar?: string` vào giao diện người dùng `User`.
2. **Auth Pages Mapping**:
   - Thay đổi trong [login/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/login/page.tsx) và [callback/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/callback/page.tsx).
   - Ánh xạ thêm trường `avatar` từ phản hồi của API Backend vào Zustand Store.
3. **Header User Interface Redesign**:
   - Thay đổi trong [Header.tsx](file:///d:/HoaLang/HoaLang_FE/components/layout/Header.tsx).
   - Thiết kế Avatar vuông `rounded-sm` (tương thích triết lý ảnh tạp chí của HoaLang) kết hợp Monogram tự động sinh từ chữ cái đầu của tên/email nếu người dùng chưa cập nhật ảnh.
   - Thêm dropdown menu sử dụng Framer Motion (`AnimatePresence` & `motion.div`) hiển thị Tên đầy đủ, Email, tùy chọn Quản trị hệ thống (theo quyền `ADMIN` hoặc `VILLAGE_OWNER`), và nút Đăng xuất tinh xảo.
   - Nâng cấp đồng bộ giao diện Mobile Drawer (Sheet) hiển thị block Profile người dùng có avatar và thông tin vai trò trực quan, ngăn nắp.
- Tuyệt đối tuân thủ quy tắc không dùng kiểu dữ liệu `any` và loại bỏ unused imports ngay sau khi code xong.

---

### [2026-06-01] Bilingual Role Registration Tabs & Artisan Owner Form Implementation

#### Tác vụ hoàn thành
- Tích hợp thêm thanh lựa chọn phân quyền (Role Switching Premium Tabs) cho phép người dùng chuyển đổi qua lại giữa hình thức đăng ký tài khoản **Khách du lịch (Traveler)** và **Chủ làng nghề (Artisan Owner)** tại trang Đăng ký tài khoản (`/auth/register`).
- Cá nhân hóa giao diện và trải nghiệm nhập liệu động: tự động thay đổi mô tả phụ đề trang, nhãn (labels), trình giữ chỗ (placeholders), danh sách quyền lợi tài khoản (benefits list) theo phân quyền được chọn để mang lại trải nghiệm chuyên nghiệp, thanh lịch.
- Kết nối thành công với API Backend bằng cách truyền động vai trò đăng ký (`USER` hoặc `VILLAGE_OWNER`) khi gửi biểu mẫu.

#### Chi tiết kỹ thuật & File thay đổi
1. **Dynamic Registration Form with Role Tabs**:
   - Thay đổi trong [register/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/%5Blocale%5D/auth/register/page.tsx).
   - Thiết kế thanh tab chuyển quyền siêu phẳng bằng các nút bọc trong đường viền nhẹ `stone` và nền giấy dó `parchment/40`. Khi được chọn, tab active sẽ có nền sơn mài `lacquer` và chữ màu kem `cream` sang trọng, đi kèm micro-animation mượt mà.
   - Thêm trạng thái `activeRole` để quản lý phân quyền và đồng bộ hóa tự động các nội dung gợi ý/placeholder.
   - Khi chọn làm chủ làng nghề (`VILLAGE_OWNER`), các nhãn đổi thành "Họ và tên nghệ nhân / Artisan Name" và hộp thoại hiển thị danh sách quyền lợi sẽ chuyển đổi sang mô hình quản trị website làng nghề.

---

### [2026-06-01] Client-Side Security Route Guards & Hydration Flashing Prevention

#### Tác vụ hoàn thành
- Khắc phục lỗ hổng bảo mật cho phép khách du lịch chưa đăng nhập hoặc đăng nhập bằng tài khoản thông thường (`USER`) truy cập trái phép vào các trang quản trị của Chủ làng nghề tại đường dẫn `/dashboard` (và tất cả sub-routes bên trong).
- Khắc phục lỗ hổng bảo mật cho phép truy cập trái phép vào trang quản trị tối cao của Super Admin tại đường dẫn `/admin`.
- Thiết kế màn hình chờ xác thực phân quyền (Authenticating Screen) chuẩn cẩm nang mỹ thuật giúp ngăn chặn triệt để tình trạng nhấp nháy giao diện (UI flashing/flickering) khi Next.js đang hydrate và kiểm tra trạng thái xác thực.

#### Chi tiết kỹ thuật & File thay đổi
1. **Dashboard Route Protection**:
   - Sửa đổi trong [DashboardSidebar.tsx](file:///d:/HoaLang/HoaLang_FE/components/dashboard/DashboardSidebar.tsx).
   - Tích hợp Zuztand `useAuthStore` để lấy thông tin đăng nhập và router `@/navigation` để chuyển hướng.
   - Thêm `mounted` và `isAuthorized` làm hai chốt chặn bảo vệ. Nếu người dùng chưa đăng nhập, tự động đẩy về trang đăng nhập `/auth/login` kèm thông báo lỗi. Nếu đã đăng nhập nhưng không có vai trò `village_owner`, tự động chuyển hướng về trang chủ `/` kèm cảnh báo quyền hạn.
   - Trong thời gian chờ, render màn hình chờ xác thực có Compass xoay và grain background đồng bộ.
2. **Super Admin Route Protection**:
   - Sửa đổi trong [admin/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/admin/page.tsx).
   - Áp dụng cấu trúc chốt chặn tương tự Dashboard: bảo vệ nghiêm ngặt trang `/admin` chỉ dành riêng cho tài khoản có vai trò `admin`.

---

### [2026-06-01] End-to-End Forgot & Reset Password Implementation

#### Tác vụ hoàn thành
- Tích hợp và hoàn thiện tính năng khôi phục/đặt lại mật khẩu (Forgot & Reset Password) đồng bộ từ giao diện Client tới Backend API.
- Bổ sung trang yêu cầu khôi phục mật khẩu (`/auth/forgot-password`) để người dùng nhập email và nhận thư điện tử hướng dẫn khôi phục qua SMTP.
- Bổ sung trang nhập mật khẩu mới (`/auth/reset-password`) để đặt lại mật khẩu bảo mật và tự động đưa người dùng quay lại trang đăng nhập `/auth/login` qua đồng hồ đếm ngược 5 giây.
- Tích hợp Z Suspense boundary cho trang reset mật khẩu để Next.js 14 build tĩnh an toàn tuyệt đối.

#### Chi tiết kỹ thuật & File thay đổi
1. **Forgot & Reset Password Views**:
   - Sửa đổi trong [login/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/login/page.tsx). Thay thế link quên mật khẩu từ `#forgot` sang Next-Intl Link `/auth/forgot-password` để điều hướng chuẩn xác.
   - Thêm mới [forgot-password/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/forgot-password/page.tsx). Thiết kế biểu mẫu nhập email khôi phục tinh xảo kèm la bàn sơn mài xoay tròn lúc loading và thông điệp chúc mừng gửi thư thành công.
   - Thêm mới [reset-password/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/reset-password/page.tsx). Tích hợp search params trích xuất reset token và bọc trong `<Suspense>`. Cho phép người dùng nhập mật khẩu mới có xác nhận, hiển thị đồng hồ đếm ngược 5 giây và redirect khi đổi thành công.
   - Sửa đổi các file dịch [vi.json](file:///d:/HoaLang/HoaLang_FE/messages/vi.json) và [en.json](file:///d:/HoaLang/HoaLang_FE/messages/en.json) để hỗ trợ quốc tế hóa song ngữ toàn diện cho phân hệ này.

---

### [2026-06-01] Forgot & Reset Password Compilation & TypeScript Type Safety Fixes

#### Tác vụ hoàn thành
- Khắc phục lỗi biên dịch `Cannot find name 'AnimatePresence'` tại trang yêu cầu khôi phục mật khẩu (`/auth/forgot-password/page.tsx`) do thiếu import từ thư viện `framer-motion`.
- Tối ưu hóa và chuyển đổi toàn bộ cấu trúc xử lý lỗi trong khối `catch` từ kiểu khai báo trực tiếp `any` sang `unknown` tại cả hai trang khôi phục mật khẩu (`forgot-password/page.tsx`) và đặt lại mật khẩu (`reset-password/page.tsx`), đảm bảo tuân thủ 100% nguyên tắc TypeScript Type Safety nghiêm ngặt (không sử dụng kiểu `any` ngầm định hay tường minh) theo Rule 13 của cẩm nang phát triển `GEMINI.md`.

#### Chi tiết kỹ thuật & File thay đổi
1. **Forgot Password Screen Import & Catch Refactor**:
   - Sửa đổi trong [forgot-password/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/forgot-password/page.tsx).
   - Thêm `AnimatePresence` vào dòng khai báo import từ `framer-motion`.
   - Thay đổi kiểu bắt lỗi của khối `catch` từ `err: any` thành `err: unknown` và sử dụng type casting an toàn để truy xuất thuộc tính của đối tượng lỗi Axios phản hồi từ API Backend.
2. **Reset Password Screen Catch Refactor**:
   - Sửa đổi trong [reset-password/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/reset-password/page.tsx).
   - Thay thế kiểu bắt lỗi của khối `catch` từ `err: any` thành `err: unknown` tương thích với cơ chế rà soát TypeScript nghiêm ngặt, chuyển đổi cách truy cập các thuộc tính phản hồi Axios an toàn tuyệt đối.

---

### [2026-06-02] User Profile Editing & Cloudinary Avatar Uploads

#### Tác vụ hoàn thành
- Tích hợp khả năng chỉnh sửa thông tin cá nhân bao gồm Họ tên, Số điện thoại và Ảnh đại diện ngay trên giao diện `/profile`.
- Hỗ trợ xem trước ảnh đại diện lập tức (avatar preview) khi người dùng chọn tập tin hình ảnh mới từ máy trước khi tiến hành lưu trữ.
- Đồng bộ dữ liệu cập nhật động với Zustand `useAuthStore` toàn cục để cập nhật lập tức Họ tên và Ảnh đại diện trên Thanh điều hướng (Header) mà không cần tải lại trang.
- Tích hợp chốt chặn hợp lệ phía Client (Họ tên tối thiểu 2 chữ cái, Số điện thoại phải đúng 10 số).

#### Chi tiết kỹ thuật & File thay đổi
1. **Zustand Auth Store**:
   - Sửa đổi [authStore.ts](file:///d:/HoaLang/HoaLang_FE/lib/store/authStore.ts): Thêm hành động `setUser(user: User)` để cập nhật thông tin người dùng trực tiếp trong kho lưu trữ Zustand.
2. **Auth Service**:
   - Sửa đổi [authService.ts](file:///d:/HoaLang/HoaLang_FE/lib/services/authService.ts): Thêm phương thức `updateProfile` gửi FormData chứa hình ảnh avatar và các trường văn bản đến backend bằng định dạng `multipart/form-data`.
3. **i18n Configuration**:
   - Sửa đổi các file dịch [vi.json](file:///d:/HoaLang/HoaLang_FE/messages/vi.json), [en.json](file:///d:/HoaLang/HoaLang_FE/messages/en.json), [ja.json](file:///d:/HoaLang/HoaLang_FE/messages/ja.json), [ko.json](file:///d:/HoaLang/HoaLang_FE/messages/ko.json), và [zh.json](file:///d:/HoaLang/HoaLang_FE/messages/zh.json) bổ sung các nút bấm biên dịch như `"btnEdit"`, `"btnSave"`, `"btnCancel"`, các thông báo trạng thái lỗi kiểm tra và lưu thành công.
4. **Profile View & Edit Layout**:
   - Sửa đổi [profile/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/profile/page.tsx): Tái cấu trúc trang để hỗ trợ hai chế độ View Mode và Edit Mode. Ở chế độ chỉnh sửa, hiển thị Camera icon dạng hover mờ trên ảnh đại diện, chuyển đổi các thẻ text sang input có hiển thị báo lỗi validator, hiển thị trạng thái đang lưu (loader xoay), đồng bộ hóa Zustand khi lưu thành công và thu hồi tài nguyên xem trước ảnh.

---

### [2026-06-01] Multi-Tenant Dynamic PayOS & COD Checkout Integration

#### Tác vụ hoàn thành
- Kết nối thành công phân hệ Checkout với API Backend đa chi nhánh (multi-tenant) thực tế.
- Tự động hóa phân tách phương thức thanh toán dựa trên cấu hình cổng PayOS của từng làng nghề: chỉ hiển thị VietQR PayOS nếu làng nghề đó đã kết nối, ngược lại vô hiệu hóa và thông tin chi tiết qua tooltip/cảnh báo tinh xảo.
- Triển khai phân giải tên danh mục sang MongoDB ObjectIds tự động để đồng bộ với cấu trúc cơ sở dữ liệu Express/Mongoose.
- Xử lý các kịch bản COD thanh toán truyền thống hiển thị biên nhận di sản sang trọng và tự động chuyển hướng du khách tới trang thanh toán PayOS thật khi thực hiện giao dịch online sandbox.

#### Chi tiết kỹ thuật & File thay đổi
1. **Dynamic Checkout System**:
   - Thay đổi trong [CheckoutDrawer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/CheckoutDrawer.tsx).
   - Tích hợp `api` và `toast` thông báo. Khi mở Drawer, tự động gọi `GET /api/v1/tenant/payment-methods` để kiểm tra cấu hình PayOS của làng nghề.
   - Thêm trạng thái tải phương thức `fetchingMethods` hiển thị micro-loader và xử lý disable cổng thanh toán PayOS bằng viền đứt `dashed border`, làm mờ nhạt và hiển thị popover hướng dẫn chủ làng nghề cấu hình key.
   - Tích hợp `GET /api/v1/products` và `GET /api/v1/experiences` khi drawer mở ra, tự động đối chiếu tên Catalog tĩnh của trang landing với dữ liệu thật trong Database để trích xuất `matchedId`, tránh lỗi crash 404 khi gửi đơn đặt hàng.
   - Gửi yêu cầu thật qua `POST /api/v1/orders` (đối với Sản phẩm) và `POST /api/v1/bookings` (đối với Trải nghiệm/Workshop), tự động xử lý chuyển hướng `window.location.href = res.data.data.checkoutUrl` an toàn và mượt mà.
2. **Local Tenant Resolution Enhancement**:
   - Thay đổi trong [api.ts](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/lib/api.ts).
   - Bổ sung cơ chế fallback cho interceptor: trích xuất động slug từ pathname URL dạng `/tenant/[slug]` khi không sử dụng local subdomains, đảm bảo toàn bộ các request API trong quá trình kiểm thử E2E cục bộ tự động đính kèm header `x-tenant-slug` chuẩn xác.

---

### [2026-06-01] 100% Zero-Hardcoded i18n Localization for Checkout Module

#### Tác vụ hoàn thành
- Quốc tế hóa song ngữ toàn diện (Bilingual Elegance) cho toàn bộ phân hệ Checkout trong hệ thống HoaLang.
- Loại bỏ hoàn toàn các chuỗi hiển thị tĩnh (hardcoded strings) cũng như các logic rẽ nhánh ngôn ngữ thủ công (`locale === 'vi' ? ... : ...`) trong giao diện người dùng, tuân thủ nghiêm ngặt Quy tắc i18n số 12 của HoaLang UI Rule.
- Khắc phục lỗi cú pháp dư thừa dấu đóng ngoặc nhọn ở cuối các file dịch quốc tế `vi.json` và `en.json`.

#### Chi tiết kỹ thuật & File thay đổi
1. **Checkout Translation Namespace**:
   - Thay đổi trong [vi.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/vi.json) và [en.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/en.json).
   - Thiết lập block ngôn ngữ `"checkout"` chứa toàn bộ 38 khóa biên dịch cho nhãn (labels), tiêu đề đơn đặt hàng, mô tả chi tiết phương thức COD/PayOS, các thông điệp cảnh báo vô hiệu hóa, thông báo trạng thái giao dịch (toasts), biên nhận di sản (invoice), chỉ dẫn thanh toán thủ công và toàn bộ các placeholder trường nhập liệu động.
   - Sửa đổi cú pháp JSON: Loại bỏ dấu ngoặc nhọn thừa `}` ở dòng cuối cùng của cả hai file, phục hồi tính toàn vẹn cú pháp 100% cho cấu trúc tệp dịch.
2. **Checkout i18n Refactoring**:
   - Thay đổi trong [CheckoutDrawer.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/CheckoutDrawer.tsx).
   - Tích hợp hook `useTranslations('checkout')` của `next-intl` để quản lý tập trung hóa dữ liệu ngôn ngữ.
   - Thay thế toàn bộ nhãn giao diện tĩnh, placeholder của các trường nhập liệu (`fullName`, `address`, `date`), toasts khởi tạo/kết nối PayOS sandbox và nội dung thông báo lỗi kết nối database bằng cú pháp dịch động `t('key')`.

---

### [2026-06-01] Desktop Full-Screen Frame Sizing, Smooth Scrolling & E2E Responsiveness Audit

#### Tác vụ hoàn thành
- Nâng cấp toàn diện giao diện trang chủ chính để mỗi phân hệ chính (`Bản đồ`, `Làng nghề`, `AI Lịch trình`, `Cửa hàng`, `Trải nghiệm`, và `Đăng ký nghệ nhân`) chiếm trọn vẹn **đúng 1 khung hình hiển thị (1 Viewport Height / 100vh)** khi hiển thị trên màn hình Desktop lớn, tạo cảm xúc tạp chí văn hóa siêu cao cấp.
- Thiết kế hệ thống tự động co giãn và thích ứng 100% (Responsiveness Audit) cho tất cả các thiết bị: Cho phép các phân hệ dàn trải tự nhiên theo chiều dọc (`min-h-screen py-12 sm:py-16`) trên thiết bị Tablet/Mobile để triệt tiêu hoàn toàn lỗi chồng chữ hoặc tràn khung chứa.
- Tích hợp cơ chế cuộn mượt tự động (Scroll Smooth) tăng tốc phần cứng trình duyệt khi du khách nhấn điều hướng trên thanh Header di sản.

#### Chi tiết kỹ thuật & File thay đổi
1. **Root Layout Smooth Scroll**:
   - Sửa đổi trong [layout.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/layout.tsx).
   - Bổ sung class utility `scroll-smooth` vào thẻ root `<html>` để hỗ trợ cơ chế cuộn mượt tự nhiên của Next.js và trình duyệt.
2. **Anchor smooth navigation links**:
   - Sửa đổi trong [Header.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/layout/Header.tsx).
   - Thay đổi định hướng liên kết của nút "BẢN ĐỒ" trong `navLinks` từ `/map` (trang atlas riêng) thành `/#map` (định danh neo tới phân vùng bản đồ trên trang chủ), giúp cả 5 nút điều hướng chính đồng bộ hóa cuộn mượt tới từng khung hình tương ứng.
3. **Viewport Frame Landing Page Redesign**:
   - Sửa đổi trong [page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/page.tsx).
   - Cấu hình lại các thẻ `<section>` di sản (`#map`, `#villages`, `#itinerary`, `#shop`, `#experience`, `#artisan-registration`) sang cấu trúc khung hiển thị chuẩn `min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center py-12 sm:py-16 lg:py-0 relative overflow-hidden`.
   - Điều chỉnh chiều cao của hộp chứa Mapbox Map sang dạng `lg:h-[460px] lg:max-h-[52vh]` và các hộp chứa mỹ thuật của Cửa hàng, Trải nghiệm sang `lg:h-[380px] lg:max-h-[45vh]` để tối ưu hóa không gian hiển thị, loại bỏ 100% nguy cơ tràn chiều cao màn hình trên Laptop 13-15 inches.
    - Thử nghiệm và biên dịch thành công 100% bằng câu lệnh `npm run build` trên Front-end mà không gặp bất kỳ lỗi logic hay cảnh báo nghiêm trọng nào.

---

### [2026-06-02] Craft Villages Gallery Page & Multilingual Filter Integration

#### Tác vụ hoàn thành
- Phát triển thành công trang trưng bày và tìm kiếm tất cả các Làng Nghề (`/villages`) đáp ứng đầy đủ triết lý luxury editorial và thiết kế cao cấp của HoaLang.
- Tích hợp tính năng lọc đa năng (thanh tìm kiếm văn bản theo tên/tỉnh thành, bộ lọc dropdown Tỉnh thành, bộ lọc dropdown Ngành nghề sản xuất, và chốt chặn lọc các Làng Nghề "Đã xác minh" thiết kế hộp chọn ✦ dạng kim cương sang trọng).
- Cập nhật liên kết điều hướng trên thanh Header để mục "LÀNG NGHỀ" (Villages) chuyển từ liên kết neo cục bộ `/#villages` sang trang `/villages` chuyên biệt.
- Tích hợp dịch thuật đa ngôn ngữ 100% không hardcode chuỗi hiển thị cho cả 5 file cấu hình quốc tế hóa (`vi.json`, `en.json`, `ja.json`, `ko.json`, `zh.json`), tích hợp tự động phân giải tên Tỉnh thành và Nhãn ngành nghề sang ngôn ngữ tương ứng của du khách.

#### Chi tiết kỹ thuật & File thay đổi
1. **Types & Services**:
   - Thêm mới [types/village.ts](file:///d:/HoaLang/HoaLang_FE/types/village.ts): Định nghĩa kiểu dữ liệu `Village` bảo mật, đồng bộ 100% với Schema của Backend MongoDB.
   - Thêm mới [villageService.ts](file:///d:/HoaLang/HoaLang_FE/lib/services/villageService.ts): Quản lý các endpoint API gọi dữ liệu làng nghề thông qua Axios instance `api` tập trung.
2. **Nav Links**:
   - Sửa đổi [Header.tsx](file:///d:/HoaLang/HoaLang_FE/components/layout/Header.tsx): Cập nhật href của liên kết Làng nghề từ `/#villages` thành `/villages`.
3. **i18n Configuration**:
   - Bổ sung namespace `"villagesList"` vào [vi.json](file:///d:/HoaLang/HoaLang_FE/messages/vi.json), [en.json](file:///d:/HoaLang/HoaLang_FE/messages/en.json), [ja.json](file:///d:/HoaLang/HoaLang_FE/messages/ja.json), [ko.json](file:///d:/HoaLang/HoaLang_FE/messages/ko.json), và [zh.json](file:///d:/HoaLang/HoaLang_FE/messages/zh.json).
4. **Villages Gallery Page**:
   - Sửa đổi [villages/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/villages/page.tsx): Triển khai toàn diện giao diện trang theo phong cách tạp chí nghệ thuật cao cấp. Sử dụng `PageHeader` bọc grain và organic gold gradient, chi tiết tìm kiếm có focus màu bronze, và lưới `VillageCard` áp dụng staggered offset (`lg:translate-y-8` trên cột thứ hai) để phá lưới visual.
   - Tích hợp cơ chế fallback dữ liệu ngoại tuyến (`MOCK_FALLBACK_VILLAGES`) an toàn giúp giao diện hiển thị mượt mà ngay cả khi backend phản hồi chậm hoặc ngoại tuyến.

---

### [2026-06-02] User Profile Page & Avatar Dropdown Navigation Integration

#### Tác vụ hoàn thành
- Tích hợp liên kết điều hướng từ khối chi tiết tài khoản người dùng tại Header dropdown (cả bản Desktop và bản Mobile hamburger menu) chuyển đến trang hồ sơ cá nhân `/profile`.
- Triển khai trang thông tin cá nhân `/profile` theo triết lý luxury editorial của HoaLang: hiển thị đầy đủ thông tin chi tiết của người dùng như họ tên, địa chỉ email, số điện thoại, vai trò quyền hạn và số dư ví đồng hành.
- Hỗ trợ đa ngôn ngữ 100% không hardcode chuỗi hiển thị cho cả 5 file cấu hình quốc tế hóa (`vi.json`, `en.json`, `ja.json`, `ko.json`, `zh.json`), hiển thị vai trò người dùng được badged có phong cách tương thích.

#### Chi tiết kỹ thuật & File thay đổi
1. **Header Component**:
   - Sửa đổi [Header.tsx](file:///d:/HoaLang/HoaLang_FE/components/layout/Header.tsx): Bọc khối thông tin chi tiết người dùng (`user?.name` và `user?.email`) trong thẻ `<Link href="/profile">` trên cả Desktop dropdown và Mobile menu, kết hợp hover effect (`hover:bg-parchment/60 hover:text-lacquer` trên Desktop) tăng trải nghiệm người dùng.
2. **i18n Configuration**:
   - Bổ sung namespace `"profile"` vào [vi.json](file:///d:/HoaLang/HoaLang_FE/messages/vi.json), [en.json](file:///d:/HoaLang/HoaLang_FE/messages/en.json), [ja.json](file:///d:/HoaLang/HoaLang_FE/messages/ja.json), [ko.json](file:///d:/HoaLang/HoaLang_FE/messages/ko.json), và [zh.json](file:///d:/HoaLang/HoaLang_FE/messages/zh.json).
3. **Profile Page Layout**:
   - Thêm mới [profile/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/profile/page.tsx): Triển khai giao diện hiển thị thông tin hồ sơ di sản sử dụng `PageHeader` (variant="light" nền giấy dó), các khung viền kim cương góc vàng truyền thống, bảng thông tin dạng grid tỉ mỉ, hiển thị trạng thái số dư ví định dạng theo locale hiện tại, và nút đăng xuất tài khoản đồng bộ.
   - Quản lý trạng thái xác thực và bảo mật trang: tự động chuyển hướng người dùng chưa đăng nhập về trang `/auth/login` khi cố gắng truy cập trang `/profile`.

---

### [2026-06-02] Vouchers & Discount Codes Navigation & Premium Editorial Page

#### Tác vụ hoàn thành
- Tích hợp thêm mục điều hướng "Mã giảm giá" / "Vouchers" trong dropdown avatar người dùng ở Header (cả trên giao diện Desktop và Mobile hamburger menu).
- Tạo trang danh sách mã giảm giá di sản `/profile/vouchers` hiển thị các mã ưu đãi đang hoạt động của hệ thống, tuân thủ nghiêm ngặt cẩm nang mỹ thuật thương hiệu HoaLang.
- Hỗ trợ dịch thuật quốc tế hóa (i18n) hoàn toàn trên 5 ngôn ngữ (`vi.json`, `en.json`, `ja.json`, `ko.json`, `zh.json`), không hardcode chuỗi hiển thị.
- Thiết kế tính năng copy mã giảm giá nhanh chóng kèm toast thông báo và trạng thái đổi icon/text "Đã sao chép" sang trọng.

#### Chi tiết kỹ thuật & File thay đổi
1. **Header Component**:
   - Sửa đổi [Header.tsx](file:///d:/HoaLang/HoaLang_FE/components/layout/Header.tsx): Thêm link `/profile/vouchers` hiển thị nhãn `t('vouchers')` vào dropdown người dùng ở Desktop và Mobile drawer, bọc phân vùng dòng kẻ `stone/30` gọn gàng.
2. **Voucher API Service**:
   - Thêm mới [voucherService.ts](file:///d:/HoaLang/HoaLang_FE/lib/services/voucherService.ts): Định nghĩa kiểu dữ liệu `Voucher` và phương thức `getActiveVouchers()` để truy vấn API `/vouchers` của backend.
3. **i18n Configuration**:
   - Cập nhật [vi.json](file:///d:/HoaLang/HoaLang_FE/messages/vi.json), [en.json](file:///d:/HoaLang/HoaLang_FE/messages/en.json), [ja.json](file:///d:/HoaLang/HoaLang_FE/messages/ja.json), [ko.json](file:///d:/HoaLang/HoaLang_FE/messages/ko.json), và [zh.json](file:///d:/HoaLang/HoaLang_FE/messages/zh.json) để bổ sung kho dịch thuật `"vouchers"` (tiêu đề, điều kiện tối thiểu, hạn dùng, trạng thái sao chép).
4. **Vouchers Page Layout**:
   - Thêm mới [profile/vouchers/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/profile/vouchers/page.tsx): Triển khai trang hiển thị danh sách ưu đãi. Thiết kế coupon card có răng cưa lượn sóng bên rìa, nền `cream` border `stone` cực mỏng, hover chuyển động `translateY(-5px)` + bóng đổ mịn `shadow-hover`, font display Cormorant Garamond và body Be Vietnam Pro. Hỗ trợ nút sao chép thông minh, Suspense & Route Guard bảo mật (tự động đẩy khách chưa đăng nhập về trang login).

---

### [2026-06-03] Fix PayOS Config Tenant Resolution & Dashboard State Sync

#### Tác vụ hoàn thành
- Khắc phục triệt để lỗi mất đồng bộ ngữ cảnh Tenant (x-tenant-slug) khi Owner truy cập các trang cài đặt/cổng thanh toán bên trong Bảng điều khiển quản trị (`/dashboard`).
- Hỗ trợ kế thừa và dự phòng thông tin Tenant tự động trong Axios Request Interceptor từ query parameter hoặc `sessionStorage` để đính kèm header `x-tenant-slug` chuẩn xác.
- Tự động lưu trữ thông tin Tenant đầu tiên của Owner vào `sessionStorage` ngay sau khi đăng nhập thành công.
- Đồng bộ hóa Sidebar Bảng quản trị (`DashboardSidebar`) tự động tải và khởi tạo lại `sessionStorage` từ dữ liệu user đã xác thực trong Zustand Store khi refresh trình duyệt.
- Tích hợp kết xuất sản phẩm động từ cơ sở dữ liệu MongoDB thay cho cơ chế hiển thị 100% tĩnh trước kia, kèm theo cơ chế dự phòng (mock fallback) an toàn.

#### Chi tiết kỹ thuật & File thay đổi
1. **Zustand Auth Store**:
   - Sửa đổi [authStore.ts](file:///d:/HoaLang/HoaLang_FE/lib/store/authStore.ts): Cập nhật kiểu `User` interface để chứa thêm mảng thông tin `tenants` (bao gồm `slug`, `name`, `role`).
2. **Login Redirect Handler**:
   - Sửa đổi [login/page.tsx](file:///d:/HoaLang/HoaLang_FE/app/[locale]/auth/login/page.tsx): Ánh xạ (map) thuộc tính `tenants` từ payload backend trả về sang Zustand Store. Nếu vai trò là `VILLAGE_OWNER` và có danh sách tenant liên kết, tự động ghi nhận tenant đầu tiên vào `sessionStorage` (`hoalang_tenant_slug` và `hoalang_tenant_name`).
3. **Dashboard Sidebar**:
   - Sửa đổi [DashboardSidebar.tsx](file:///d:/HoaLang/HoaLang_FE/components/dashboard/DashboardSidebar.tsx): Cải tiến useEffect mount để nếu `sessionStorage` trống nhưng user store có chứa thông tin `tenants`, tự động khôi phục ngữ cảnh tenant trở lại `sessionStorage` và sidebar state.
4. **Axios Client Interceptor**:
   - Sửa đổi [api.ts](file:///d:/HoaLang/HoaLang_FE/lib/api.ts): Mở rộng cơ chế phân giải `x-tenant-slug` trong request interceptor để kiểm tra thêm query string `?slug=...` và `sessionStorage` trước khi bỏ cuộc, đảm bảo mọi request từ client-side dashboard luôn đính kèm tenant-slug chính xác.
5. **Dynamic Products Section**:
   - Sửa đổi [ProductsSection.tsx](file:///d:/HoaLang/HoaLang_FE/components/tenant/sections/ProductsSection.tsx): Chuyển đổi component sang lấy sản phẩm động từ MongoDB (`GET /api/v1/products`) thông qua Axios client có tự động phân giải tenant. Tích hợp mock data fallback nếu cơ sở dữ liệu trống hoặc API bị lỗi.
### [2026-06-03] Merchant Settings Sub-navigation Tabs Implementation

#### Tác vụ hoàn thành
- Tích hợp thanh chọn chuyển hướng phân vùng cấu hình (Settings Sub-navigation Tabs) vào trang Thiết lập cổng thanh toán PayOS (`settings/payment/page.tsx`), đồng bộ hoàn toàn với giao diện trang Thiết lập thông tin cơ bản (`settings/page.tsx`).
- Cho phép chủ làng nghề (VILLAGE_OWNER) di chuyển qua lại dễ dàng giữa việc cập nhật thông tin làng nghề và cấu hình khóa kết nối PayOS.

#### Chi tiết kỹ thuật & File thay đổi
1. **Settings Navigation Synchronicity**:
   - Sửa đổi [payment/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/dashboard/settings/payment/page.tsx).
   - Thiết lập thêm trạng thái local `tenantSlug` cùng hook `useEffect` để giải mã và đồng bộ slug hiện tại từ `sessionStorage` tương tự trang thông tin cơ bản.
   - Thêm phần kết xuất HTML/JSX đại diện cho sub-navigation tabs bên dưới phần tiêu đề chính, sử dụng đúng cấu trúc màu chữ và trạng thái hoạt ảnh chuyển hướng của cẩm nang giao diện.
2. **Build Verification**:
   - Thực hiện build kiểm thử frontend (`pnpm build`) hoàn thành thành công và không ghi nhận bất cứ lỗi biên dịch hay cảnh báo kiểu dữ liệu nào.

---

### [2026-06-03] Absolute Backend API URL Mapping & Package-lock Cleanup

#### Tác vụ hoàn thành
- Khắc phục lỗi đăng nhập thất bại (404 Not Found từ Vercel) trên môi trường Production bằng cách đồng bộ hoá và sử dụng trực tiếp địa chỉ Backend URL tuyệt đối (`NEXT_PUBLIC_API_URL`) thay cho đường dẫn tương đối `/api/v1` ở phía client-side.
- Loại bỏ hoàn toàn tệp khóa xung đột `package-lock.json` và cấu hình chặn trong `.gitignore` để Vercel tự động nhận diện và sử dụng chính xác trình quản lý gói `pnpm` (`pnpm-lock.yaml`) khi deploy.

#### Chi tiết kỹ thuật & File thay đổi
1. **API Client Configuration**:
   - Sửa đổi [api.ts](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/lib/api.ts): Cập nhật hàm `getInitialBaseUrl()` để ở môi trường production phía client-side, Axios client sẽ trả về trực tiếp giá trị của `process.env.NEXT_PUBLIC_API_URL` (nạp từ Vercel Dashboard) thay vì rơi về đường dẫn tương đối `/api/v1`. Giải quyết triệt để lỗi gọi API bị Next.js / Vercel chặn trả về trang 404 HTML.
2. **Lockfiles Clean Up**:
   - Xóa bỏ tệp `package-lock.json` khỏi Git tracking và thêm vào [.gitignore](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/.gitignore).

---

### [2026-06-04] Onboarding Email Notifications System, Idempotent Approval Retry, and Rejection Reason Modal Integration

#### Tác vụ hoàn thành
- **Thông báo Email Xác Nhận ở Onboarding Success**: Bổ dung thông điệp đa ngôn ngữ vào bước 3 (thành công) thông báo rằng hệ thống đã gửi thư xác nhận đến địa chỉ email đăng ký để tiện theo dõi trạng thái.
- **Tích Hợp Dialog Lý Do Từ Chối Ở Super Admin**:
  - Tích hợp thêm dialog nhập lý do từ chối khi Super Admin click vào nút "Từ Chối" trong danh sách đơn đăng ký chờ phê duyệt.
  - Lý do từ chối là bắt buộc nhập, được truyền dưới dạng thuộc tính `reason` trong payload POST `/tenant/requests/:id/reject`.
  - Toàn bộ chuỗi hiển thị, nhãn, gợi ý trong modal từ chối và nút xác nhận đã được localize đầy đủ qua 5 file locale (vi, en, ja, ko, zh).

#### Chi tiết kỹ thuật & File thay đổi
1. **Pages & Components**:
   - Sửa đổi [onboarding/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/onboarding/page.tsx)
   - Sửa đổi [admin/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/page.tsx)
2. **Localization Files**:
   - Cập nhật [vi.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/vi.json), [en.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/en.json), [ja.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/ja.json), [ko.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/ko.json), và [zh.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/zh.json)

---

### [2026-06-04] Secure Onboarding Approvals & Active DNS Domain Verification

#### Tác vụ hoàn thành
- **Ẩn thông tin Mật khẩu khởi tạo của Tenant**: Loại bỏ trường mật khẩu khỏi Credentials Modal hiển thị cho Super Admin sau khi phê duyệt thành công. Super Admin chỉ nhìn thấy Tên người sở hữu, Email đăng nhập và Subdomain. Thay đổi nhãn "Mật khẩu ngẫu nhiên" thành "Mật khẩu" trên tất cả các ngôn ngữ, và cập nhật chân trang để ghi rõ mật khẩu được gửi tự động qua email và ẩn khỏi admin để bảo mật.
- **Thêm Xác thực Định dạng Email của Tenant**:
  - Tích hợp kiểm tra định dạng email bằng regex (/^[^\s@]+@[^\s@]+\.[^\s@]+$/) cho ô nhập email khi Super Admin đăng ký làng nghề thủ công mới trong dashboard.
  - Cấu hình thông báo lỗi phù hợp bằng i18n cho cả 5 ngôn ngữ.

#### Chi tiết kỹ thuật & File thay đổi
1. **Pages & Components**:
   - Sửa đổi [admin/page.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/app/[locale]/admin/page.tsx)
2. **Localization Files**:
   - Cập nhật [vi.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/vi.json), [en.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/en.json), [ja.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/ja.json), [ko.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/ko.json), và [zh.json](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/messages/zh.json)

---

### [2026-06-04] Secure Onboarding Status Matching (Session vs LocalStorage)

#### Tác vụ hoàn thành
- **Ngăn chặn thông báo sai người dùng**: Cập nhật `OnboardingStatusCheck.tsx` để tích hợp với `useAuthStore`. Nếu người dùng đã đăng nhập, hệ thống sẽ kiểm tra xem email của tài khoản đang hoạt động (`user.email`) có khớp với email lưu trong `localStorage` của đơn đăng ký hay không. Nếu không khớp (ví dụ: đang đăng nhập bằng tài khoản du khách khác), tiến trình kiểm tra trạng thái sẽ tự động bỏ qua để tránh hiển thị nhầm thông báo phê duyệt.

#### Chi tiết kỹ thuật & File thay đổi
1. **Pages & Components**:
   - Sửa đổi [OnboardingStatusCheck.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/OnboardingStatusCheck.tsx) để so sánh tài khoản trước khi poll.

---

### [2026-06-04] Bugfix: Tự động dừng Polling & Dọn dẹp localStorage khi Check Status Onboarding Báo Lỗi 404

#### Tác vụ hoàn thành
- **Triệt tiêu lỗi console spam 404 liên tục:** Khắc phục lỗi trình duyệt gửi request `/api/v1/tenant/requests/check` liên tục mỗi 5 giây và nhận về lỗi 404 Not Found (khiến console đầy log đỏ) khi backend database bị xóa/reset trong quá trình thử nghiệm làm biến mất đơn đăng ký cũ của email được ghi nhớ ở local.
- **Giải pháp:** Cập nhật khối `catch` trong component `OnboardingStatusCheck` để kiểm tra mã trạng thái Axios response. Nếu nhận về HTTP status 404, lập tức xóa sạch các khóa `localStorage` liên quan đến onboarding của email đó (`hoalang_onboarding_email`, `hoalang_onboarding_slug`, `hoalang_onboarding_name`) và xóa interval chạy ngầm (`clearInterval`) để dừng polling ngay lập tức.

#### Chi tiết kỹ thuật & File thay đổi
1. **Pages & Components**:
   - Sửa đổi [OnboardingStatusCheck.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/OnboardingStatusCheck.tsx) bổ sung check `axiosError.response?.status === 404`.

---

### [2026-06-04] Resilience: Vietnam Provinces API Offline Fallback & Address Autocomplete Console Cleanup

#### Tác vụ hoàn thành
- **Resilience - Local Fallback cho danh sách Tỉnh/Thành/Phường/Xã:** Khắc phục lỗi CORS hoặc lỗi mạng từ bên thứ ba `https://provinces.open-api.vn/` khiến dropdown chọn Tỉnh/Thành và Phường/Xã của Việt Nam bị trống rỗng khi đăng ký làng nghề (Onboarding). 
  - Triển khai bộ dữ liệu tĩnh cục bộ chuẩn hóa mã GSO gồm 63 Tỉnh/Thành phố của Việt Nam (`FALLBACK_PROVINCES`).
  - Triển khai danh mục Quận/Huyện/Xã mẫu cho các vùng di sản trọng điểm (`FALLBACK_WARDS`) và hàm sinh danh sách trung tâm dự phòng (`getGenericWards`) để đảm bảo form đăng ký hoạt động 100% trơn tru ngay cả khi API bên thứ ba bị sập hoặc chặn CORS.
- **Dọn dẹp Console Warning do Abort Controller:** Loại bỏ việc in cảnh báo `AbortError: signal is aborted without reason` trong component `AddressAutocomplete` khi người dùng gõ phím nhanh. Đây là hành vi hủy request cũ (debounce) bình thường của ứng dụng.

#### Chi tiết kỹ thuật & File thay đổi
1. **Pages & Components**:
   - Sửa đổi [VnAddressSelect.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/VnAddressSelect.tsx) bổ sung data offline và logic load fallback.
   - Sửa đổi [AddressAutocomplete.tsx](file:///c:/Project%20Web/Multi-Tenant/HoaLang/hoalang-fe/components/shared/AddressAutocomplete.tsx) bỏ qua cảnh báo khi `err.name === 'AbortError'`.







