import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import MemberProfile from "../pages/admin/MemberProfile";
import CoachProfile from "../pages/coach/CoachProfile";
import Schedule from "../pages/coach/Schedule";



const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/admin/member-profile", element: <MemberProfile /> },
  { path: "/coach/profile", element: <CoachProfile /> }, 
  { path: "/coach/schedule", element: <Schedule /> },
]);

export default router;