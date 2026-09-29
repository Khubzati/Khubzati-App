# Driver Flow Evidence

Verification date: 2026-07-26  
Simulator: iPhone 17 Pro, iOS 26.2, UDID `04E89427-AF97-4CE8-99DC-44A384047E28`  
Build: Flutter `dev` flavor, `lib/main_dev.dart`, `API_BASE_URL=http://localhost:3000/v1`  
Backend: local Node API on port 3000 with the migrated local PostgreSQL database  
Isolated actor: `driver@example.com`, user `8e0c8e6c-3fec-4bbb-8d2d-4ad60080a155`

The test phone was temporarily changed from `+962790000444` to `+962923567912` because the Simulator hardware-input bridge dropped repeated digits. It was restored during cleanup.

## Runtime failures reproduced and fixed

1. OTP authentication initially reached `DriverDashboardRoute`, but construction threw `ProviderNotFoundException: Could not find the correct Provider<DriverDashboardService> above this DriverDashboardBloc`. The screen now resolves the already-registered `DriverDashboardBloc` through GetIt. After rebuilding, dashboard loading completed normally.
2. Changing the authoritative user role from `driver` to `customer` returned `403 {message: "Session role is no longer valid"}`, but the old client remained on the dashboard and repeatedly retried. The interceptor now treats this exact authoritative revocation response as a session failure. A focused concurrent transport regression proves one invalidation, and the rebuilt app made one rejected request, cleared the session, and redirected to login without looping.

Changed runtime files:

- `khubzati-app/lib/features/driver/dashboard/presentation/screens/driver_dashboard_screen.dart`
- `khubzati-app/lib/core/api/interceptors/auth_interceptor.dart`
- `khubzati-app/test/transport/launch_failure_transport_test.dart`

Post-change gates required by those fixes: `flutter analyze` passed with no issues; `flutter test` passed 65/65.

## Executed lifecycle evidence

| Driver check | Executable evidence | Result |
| --- | --- | --- |
| Login/OTP reaches dashboard | Clean install opened account selection. Driver entry opened phone login. Backend generated OTP and returned authentication success. UI route heading became `Driver Dashboard`. | PASS |
| Correct driver-only shell | Dashboard exposed only Dashboard, Deliveries, History, and Profile driver tabs. Customer, bakery-owner, and restaurant-owner shells were absent. | PASS |
| Cold-start restoration | Flutter process was terminated, then the installed app was relaunched from the iOS home screen. It opened directly on the loaded driver dashboard without login or OTP. | PASS |
| Resume refresh | App was sent to the iOS home screen and resumed. It stayed on the driver dashboard without duplicate navigation or unauthorized redirect. Dashboard refresh completed and the protected availability, available-deliveries, accepted-assignments, and delivered-assignments requests returned 200. Pull-to-refresh independently showed the loading transition and the same four-request reload. | PASS |
| Logout clears access | Dashboard logout navigated to login. The app was removed from the app switcher and relaunched; it opened account selection and did not restore dashboard access. | PASS |
| Revoked session redirects | While on the dashboard, the authoritative role changed `driver -> customer`. The next refresh returned 403 `Session role is no longer valid`. After the focused fix, one protected request caused one session invalidation and navigation to login; a terminated/relaunched app opened account selection. No repeated request or redirect loop followed. | PASS |
| Delivery smoke | Local order `a1ff6695-a34a-42f2-bb2f-c2b2dc6c74e0` began `ready_for_pickup` with no assignment. Tapping `Accept Delivery` changed the UI from 0 to 1 active delivery. PostgreSQL contained assignment `00ca37e0-01f2-417b-8ebd-6c7ddcba0c52`, status `accepted`, for driver profile `4ebad0ae-08c7-4abc-926e-9003c17e99ce`; profile status became `busy`. | PASS |

## Dashboard behavior

- Loading terminated into the real dashboard.
- Driver availability returned 200 with status `online`.
- Available deliveries returned 200 and rendered the safe test order.
- Empty active-assignment state rendered correctly before acceptance.
- Completed assignments loaded without route exceptions.
- Pull-to-refresh completed and returned the same dashboard content.
- No navigation loop occurred after the provider correction.

## Database state and cleanup

Before delivery smoke: order `a1ff6695-a34a-42f2-bb2f-c2b2dc6c74e0` was `ready_for_pickup`, `deliveryAssignment: null`.

After acceptance: one `accepted` assignment existed and the driver profile was `busy`.

Cleanup was exact and completed:

- deleted assignment `00ca37e0-01f2-417b-8ebd-6c7ddcba0c52`;
- deleted notification job `5700a778-6203-4049-b483-9227128ea569`;
- restored driver profile to `online`;
- restored user role `driver`, phone `+962790000444`, verified/non-deleted state, and cleared OTP fields;
- logged the app out.

Final cleanup probe: `assignment: null`, `job: null`, profile `online`, original phone restored.

