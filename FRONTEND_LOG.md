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

---

## 2. Nhật ký Thay đổi chi tiết (Changelog)

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


