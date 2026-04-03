# Auth Demo Scope

## Scope
- **Successful Staff/Admin Login**: Users with roles `Admin` or `NhanVien` are authenticated successfully and granted access to the internal dashboard/operations. The frontend will redirect them appropriately upon successful login.
- **Disallowed KhachHang Login**: Users with the `KhachHang` role are rejected during login with a 403 Forbidden status and an internal-access error message. The frontend prevents unauthorized access by enforcing a role-aware guard.
- **Invalid Credentials**: Login attempts with incorrect email or password will be rejected with a 401 Unauthorized status, displaying a clear error message.

## Out of Scope
- Public customer registration UI is deferred and not part of this demo.
- General product documentation rewrite.

## Troubleshooting
Required Demo Environment Variables:
- `DEMO_STAFF_EMAIL`
- `DEMO_STAFF_PASSWORD`
- `DEMO_CUSTOMER_EMAIL`
- `DEMO_CUSTOMER_PASSWORD`

If authentication behaves unexpectedly during the demo, verify that these environment variables are correctly populated and that the database contains users matching these credentials with their respective roles.