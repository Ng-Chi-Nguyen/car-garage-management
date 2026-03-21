# Stitch UI Review - 2026-03-21

## Scope

- Project: `3259228669609376879`
- Source of truth used for review:
  - Stitch project screens and metadata
  - Converted markdown docs under `docs/project/`, `docs/QuanLyGargaOto/`, `docs/references/`
- Review focus:
  - business-flow fidelity
  - UI state completeness
  - handoff readiness for implementation

## Verified Stitch MCP capabilities used

- `stitch_get_project`: success
- `stitch_list_screens`: success
- `stitch_get_screen`: success
- `stitch_edit_screens`: invoked, timed out at MCP layer; result may still have been processed remotely and should be rechecked in Stitch
- `stitch_generate_variants`: invoked, timed out at MCP layer; result may still have been processed remotely and should be rechecked in Stitch

## Screens reviewed

- `c48cfc356ffd439da8f95453d44d930b` - Đăng nhập - GMS (Enterprise)
- `cddaa71b77414982b06cf2fb5894fb8b` - Tổng quan hệ thống - GMS (Bento)
- `d3f285503ecc4b0e9f7dd371de8ec083` - Trạng thái xưởng - GMS
- `2964e107cbc541279b44630d8bdc2dde` - Tiếp nhận xe mới - GMS
- `6fb23dc2a02349a3ad32784269da86a6` - Modal Lập phiếu tiếp nhận - GMS
- `cec9a39b648b4110a80accc9d198695c` - Lập phiếu sửa chữa - GMS
- `9437251858324065b945129f513d817f` - Quản lý Kho vật tư - GMS
- `772414998b2e46d3957849882273a2ad` - Thẻ kho chi tiết - GMS
- `9904bac370e74608a1d404e7ff325d36` - Thu tiền và Công nợ - GMS (Enterprise)
- `24c1c98c18d54e6ebe0f072889e9f919` - In Quyết toán - GMS
- `8e2f468570024b90ad822de0cd353932` - Danh sách Khách hàng - GMS
- `92da33060c0b4b5faee5d49fffcea501` - Hồ sơ khách hàng chi tiết - GMS
- `bb455b62eb334f21a57f7c7638f504ba` - Báo cáo Khách hàng chuyên sâu - GMS
- `06db4c559add4840aba767b8e1c2864d` - Cài đặt hệ thống - GMS
- `f1b846752fe04a6e92fcb5d6d7adb780` - Nhật ký thao tác - GMS

## Strengths

- Visual direction is strong and coherent with the enterprise blue “Mechanical Atelier” style.
- Information architecture already maps well to the real garage lifecycle: reception, repair, inventory, finance, CRM, and system administration.
- Typography hierarchy and dashboard presentation are mature enough for demos.
- Print-oriented screen isolation is good on the settlement print flow.

## Critical gaps against business spec

### 1. Reception flow is visually polished but operationally incomplete

Required by spec but not clearly represented in UI:
- quota rule for max cars received per day
- lookup by license plate and auto-fill for existing vehicles
- governed vehicle taxonomy instead of loose text entry
- intake condition capture, belongings, and structured issue intake

### 2. Repair and financial flows do not communicate core rules strongly enough

- repair order should show frozen snapshot pricing logic for parts and labor
- payment flow should visibly enforce `collected_amount <= current_debt`
- inventory flow should emphasize stock math, not only listing data

### 3. Missing business reporting surfaces

Current project lacks dedicated monthly screens for:
- revenue report (BM5.1)
- inventory report (BM5.2)
- debt report (BM5.3)

### 4. State design is incomplete

Missing or weak across the system:
- active nav state
- loading states
- empty states
- validation states
- success/error feedback patterns aligned with toast-based implementation

## Highest-priority screens to improve first

### A. `2964e107cbc541279b44630d8bdc2dde` - Tiếp nhận xe mới - GMS

Why first:
- this is the operational entry point of the garage workflow
- improving it increases both spec alignment and demo credibility immediately

Changes needed:
- split customer lookup/new customer and vehicle lookup/new vehicle clearly
- add required fields: license plate, phone, make, model, vehicle type, odometer, intake date/time, service advisor, fuel level
- add issue intake, belongings, damage/scratch note capture, expected delivery, priority
- add visible quota warning/blocked state when daily capacity is reached
- add right-side confirmation summary
- add clear CTAs: `Lưu tạm`, `Tạo phiếu sửa chữa`, `In phiếu tiếp nhận`

### B. `9904bac370e74608a1d404e7ff325d36` - Thu tiền và Công nợ - GMS (Enterprise)

Why second:
- it expresses a hard business rule directly visible to users and stakeholders
- it is one of the clearest screens to demonstrate rule-driven UI quality

Changes needed:
- show current debt prominently
- block collection amount above debt with obvious validation state
- add payment method selection
- add amount received / change handling when relevant
- add recent payment history and post-payment debt preview
- keep submission state and failure/success state explicit

## Stitch edit prompt used

```text
Refine these garage management screens to align with Vietnamese garage operations and the existing enterprise blue Mechanical Atelier design system. For the vehicle intake screen: add clear sections for customer lookup vs new customer, vehicle lookup vs new vehicle, required intake fields (license plate, phone, car make, model, vehicle type, odometer, intake date/time, service advisor, fuel level), customer-reported issues, attached belongings, scratch/damage intake notes, expected delivery, priority, and a visible daily quota warning state when max cars received is reached. Add a right-side summary panel and workflow CTAs: Lưu tạm, Tạo phiếu sửa chữa, In phiếu tiếp nhận. For the payment/debt screen: make debt validation explicit so collected amount cannot exceed current debt, add payment method selection, amount received / change handling where appropriate, debt summary, recent payment history, and clear states for valid/invalid submission. Keep layouts desktop-first, dense but readable, with strong hierarchy, operational badges, and obvious required fields.
```

## Stitch variant prompt used

```text
Generate improved variants for the vehicle intake experience in this garage management system, focusing on better intake flow, customer/vehicle lookup clarity, quota warning visibility, condition capture, and right-side confirmation summary while preserving the current enterprise Mechanical Atelier style.
```

## Recommended next design sequence

1. Finalize intake screen
2. Finalize payment/debt screen
3. Upgrade repair-order screen with technician assignment, status, and pricing summary
4. Add dedicated monthly reporting surfaces
5. Standardize empty/loading/error/success states across all data-heavy screens

## Verification summary

- Documentation conversion completed for text-based docs under `docs/project/`, `docs/QuanLyGargaOto/`, and `docs/references/`
- Sample converted files were spot-checked for preamble/source lines
- Stitch read operations succeeded
- Stitch write/generation operations were attempted but timed out from MCP; manual recheck in Stitch UI is required to confirm whether backend processing completed

## Final Route Verification (Static Shell Phase)
- Verified 15 Stitch routes (mechanic_flow excluded) successfully using local client build validation.
- All exported HTML designs have been converted into structural static React components via Tailwind and Vite.
