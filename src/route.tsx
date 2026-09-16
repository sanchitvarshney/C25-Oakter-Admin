import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import RootLayout from "./layouts/RootLayout";
import AddNewUser from "./pages/user/AddNewUser";
import ViewUser from "./pages/user/ViewUser";
import UserProfile from "./pages/user/UserProfile";
import Login from "./pages/authentication/Login";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PermissionList from "./pages/permissions/PermissionList";
import Profile from "@/pages/profile/Profile";
import UserLayout from "./layouts/UserLayout";
import PermissionLayout from "./layouts/PermissionLayout";
import PasswordRecoveryPage from "@/pages/authentication/PasswordRecoveryPage";
import AdminManagement from "@/pages/admin/AdminManagement";
import CompanyManagement from "@/pages/company/CompanyManagement";
import SignupApprovals from "@/pages/signup/SignupApprovals";
import POTeamList from "@/pages/po/POTeamList";
import ImsDashboard from "@/pages/dashboard/ImsDashboard";
import LocationLayout from "@/layouts/LocationLayout";
import LocationList from "@/pages/location/LocationList";
import AllotLocationPage from "@/pages/location/AllotLocationPage";
import HistoryLayout from "@/layouts/HistoryLayout";
import HistoryManagement from "@/pages/history/HistoryManagement";
import ViewHistoryList from "@/pages/history/ViewHistoryList";
import TwoFactorAuth from "./pages/authentication/TwoFactorAuth";
import DownloadFileStatus from "./pages/fileDownloadStatus/DownloadFileStatus";

export const router = createBrowserRouter([
  {
    element: (
        <ProtectedRoute authentication>
        <RootLayout>
          <App />
        </RootLayout>
        </ProtectedRoute>
     
    ),
    path: "/",
    children: [
      {
        path: "/",
        element: <ImsDashboard />,
      },
      {
        path: "/ims-dashboard",
        element: <ImsDashboard />,
      },
      {
        path: "/company",
        element: <CompanyManagement />,
      },
      {
        path: "/signup/approvals",
        element: <SignupApprovals />,
      },
      {
        path: "/po/team",
        element: <POTeamList />,
      },
          {
        path: "/dowmload/file/status",
        element: <DownloadFileStatus />,
      },
      {
        path: "/user/add-user",
        element: (
          <UserLayout>
            <AddNewUser />
          </UserLayout>
        ),
      },
      {
        path: "/user/view-user",
        element: (
          <UserLayout>
            <ViewUser />
          </UserLayout>
        ),
      },
      {
        path: "/user/view-user/:id",
        element: <UserProfile />,
      },
      {
        path: "/permission/list",
        element: (
          <PermissionLayout>
            <PermissionList />
          </PermissionLayout>
        ),
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/admin",
        element: <AdminManagement />,
      },
      {
        path: "/location/list",
        element: (
          <LocationLayout>
            <LocationList />
          </LocationLayout>
        ),
      },
      {
        path: "/location/alloted-location",
        element: (
          <LocationLayout>
            <AllotLocationPage />
          </LocationLayout>
        ),
      },
      {
        path: "/history",
        element: (
          <HistoryLayout>
            <HistoryManagement />
          </HistoryLayout>
        ),
      },
      {
        path: "/history/view-history",
        element: (
          <HistoryLayout>
            <ViewHistoryList />
          </HistoryLayout>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute authentication={false}>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <ProtectedRoute authentication={false}>
        <PasswordRecoveryPage />
      </ProtectedRoute>
    ),
  },
    {
    path: "/verify-2fa",
    element: (
      <ProtectedRoute authentication={false}>
        <TwoFactorAuth />
      </ProtectedRoute>
    ),
  },
]);
