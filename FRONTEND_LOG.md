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
- Tuyệt đối tuân thủ quy tắc không dùng kiểu dữ liệu `any` và loại bỏ unused imports ngay sau khi code xong.

