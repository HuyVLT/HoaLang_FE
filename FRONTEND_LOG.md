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

