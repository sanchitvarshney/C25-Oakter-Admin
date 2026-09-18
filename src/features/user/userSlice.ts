import axiosInstance from "@/api/spigenDashApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  AdduserApiResponse,
  AddUserPayload,
  AdduserSatates,
  ChangePasswordResponse,
  ChangeUserPasswordPayload,
  Modify2FactorAuthPayload,
  UpdateEmailPayload,
  UpdateMobilePayload,
  UpdateuserProfilePayload,
  UserApiResponse,
  UserProfileResponse,
  CompanyApiResponse,
  CompanyUsersApiResponse,
  CompanyListApiResponse,
  CompanyDetailApiResponse,
  CompanyByIdPayload,
  SignupRequestsApiResponse,
  ApproveSignupPayload,
  POTeamApiResponse,
  UsersApiResponse,
  CostCenterApiResponse,
  AddPOTeamMemberPayload,
} from "./userType";
import { showToast } from "@/utills/toasterContext";

const initialState: AdduserSatates = {
  addUserloading: false,
  userList: null,
  getUserListLoading: false,
  getUserProfileLoading: false,
  userProfile: null,
  cahngeUserPasswordLoading: false,
  updateUserEmailLoading: false,
  updateUserMobileLoading: false,
  suspendUserLoading: false,
  activateUserLoading: false,
  updateUserProfileLoading: false,
  updateUserStatusLoading: false,
  updateUserVerificationLoading: false,
  updateUserLoginStatusLoading: false,
  loading: false,
  activityLoading: false,
  activityData: null,
  companyList: null,
  companyUsers: null,
  getCompanyListLoading: false,
  getCompanyUsersLoading: false,
  vendorList: null,
  getVendorListLoading: false,
  // New company management states
  companyManagementList: null,
  companyDetail: null,
  getCompanyManagementListLoading: false,
  getCompanyDetailLoading: false,
  updateCompanyLoading: false,
  // New signup approval states
  signupRequests: null,
  getSignupRequestsLoading: false,
  approveSignupLoading: false,
  rejectSignupLoading: false,
  // New PO team states
  poTeamMembers: null,
  getPOTeamLoading: false,
  addPOTeamLoading: false,
  deletePOTeamLoading: false,
  users: null,
  getUsersLoading: false,
  costCenters: null,
  getCostCentersLoading: false,
  allCostCenters: null,
  getAllCostCentersLoading: false,
  // New: company/server status toggle loadings
  updateCompanyStatusLoading: false,
  updateCompanyServerStatusLoading: false,
};

export const addUser = createAsyncThunk<
  AxiosResponse<AdduserApiResponse>,
  AddUserPayload
>("user/create", async (paylod) => {
  const response = await axiosInstance.post("/auth/register", paylod);
  return response;
});
export const getUserList = createAsyncThunk<
  AxiosResponse<UserApiResponse>,
  string
>("user/getUserList", async (type) => {
  const response = await axiosInstance.get(`/user/list/${type}`);
  return response;
});

export const getUserProfile = createAsyncThunk<
  AxiosResponse<UserProfileResponse>,
  string
>("user/getUserProfile", async (userId) => {
  const response = await axiosInstance.get(`/admin/fetchProfile/${userId}`);
  if (response.data.success) {
    showToast("Data Fetched Successfully", "success");
  }
  return response;
});

export const changeUserPassword = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>, // The success response type
  ChangeUserPasswordPayload, // The payload type
  { rejectValue: string } // Type for reject value, assuming an error message
>("user/changeuserPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(
      `/admin/updateUserSettings`,
      payload
    );
    return response; // Return the success response
  } catch (error: any) {
    // Handle error by returning a rejected value with the proper type
    return rejectWithValue(error.response.data.message);
  }
});

export const updateUserEmail = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>,
  UpdateEmailPayload
>("user/updateUserEmail", async (paylod) => {
  const response = await axiosInstance.put(`/admin/update-email-id`, paylod);
  return response;
});

export const change2FactorAuthStatus = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>,
  Modify2FactorAuthPayload
>("user/modify2FactorAuth", async (paylod) => {
  const response = await axiosInstance.put(
    `/user/two-step-verification`,
    paylod
  );
  return response;
});

export const updateUserMobile = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>,
  UpdateMobilePayload
>("user/updateUserMobile", async (paylod) => {
  const response = await axiosInstance.put(
    `/admin/update-user-mobile-no`,
    paylod
  );
  return response;
});
export const suspendUser = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>,
  string
>("user/suspendUser", async (paylod) => {
  const response = await axiosInstance.put(`/user/${paylod}/suspend`);
  return response;
});
export const activateUser = createAsyncThunk<
  AxiosResponse<ChangePasswordResponse>,
  string
>("user/activateUser", async (paylod) => {
  const response = await axiosInstance.put(`/user/${paylod}/activate`);
  return response;
});
export const updateUserProfile = createAsyncThunk<
  AxiosResponse<any>,
  UpdateuserProfilePayload
>("user/updateUserProfile", async (paylod) => {
  const response = await axiosInstance.put(`/user/update`, paylod);
  return response;
});

export const requirePasswordChange = createAsyncThunk<AxiosResponse<any>, any>(
  "user/requirePasswordChange",
  async (paylod) => {
    const response = await axiosInstance.put(
      `/user/require-password-change`,
      paylod
    );
    return response;
  }
);

export const updateUserStatus = createAsyncThunk<AxiosResponse<any>, any>(
  "user/updateUserStatus",
  async (paylod) => {
    const response = await axiosInstance.put(
      `/user/update-user-status`,
      paylod
    );
    return response;
  }
);
export const updateUserVerification = createAsyncThunk<AxiosResponse<any>, any>(
  "user/updateUserVerification",
  async (paylod) => {
    const response = await axiosInstance.put(
      `/admin/update-user-verification-status`,
      paylod
    );
    return response;
  }
);
export const updateUserLoginStatus = createAsyncThunk<AxiosResponse<any>, any>(
  "user/updateUserLoginStatus",
  async (paylod) => {
    const response = await axiosInstance.put(
      `/admin/update-user-verification-status?type=loginStatus`,
      paylod
    );
    return response;
  }
);
export const userLoginLogs = createAsyncThunk<AxiosResponse<any>, any>(
  "/user/userLoginLogs",
  async (payload) => {
    const response = await axiosInstance.get(
      `/admin/loginLogs?userId=${payload}`
    );
    return response;
  }
);
export const userActivityLogs = createAsyncThunk<AxiosResponse<any>, any>(
  "/user/userActivityLogs",
  async (payload) => {
    const response = await axiosInstance.get(`/user/getLogs?userId=${payload}`);
    return response;
  }
);

export const updateCompanyUserStatus = createAsyncThunk<
  AxiosResponse<any>,
  {userID: string; status: string }
>("user/updateCompanyUserStatus", async (payload) => {
  const response = await axiosInstance.put(
    `/org/user/edit`,
    payload
  );
  return response;
});

export const getCompanyList = createAsyncThunk<
  AxiosResponse<CompanyApiResponse>,
  string
>("user/getCompanyList", async (searchQuery) => {
  const response = await axiosInstance.post("/backend/companyList", {
    search: searchQuery,
  });
  return response;
});

export const fetchCompanyUsers = createAsyncThunk<
  AxiosResponse<CompanyUsersApiResponse>
>("user/fetchCompanyUsers", async () => {
  const response = await axiosInstance.get("org/user/list");
  return response;
});

export const fetchVendorList = createAsyncThunk<AxiosResponse<any>, string>(
  "user/fetchVendorList",
  async (searchQuery) => {
    const response = await axiosInstance.post("/backend/vendorList", {
      search: searchQuery,
    });
    return response;
  }
);

// New company management API functions
export const getCompanyManagementList = createAsyncThunk<
  AxiosResponse<CompanyListApiResponse>,
  void
>("user/getCompanyManagementList", async () => {
  try {
    const response = await axiosInstance.get("/company/compny_list");
    return response;
  } catch (error) {
    console.error("Company list API error:", error);
    throw error;
  }
});

export const getCompanyById = createAsyncThunk<
  AxiosResponse<CompanyDetailApiResponse>,
  CompanyByIdPayload
>("user/getCompanyById", async (payload) => {
  try {
    const response = await axiosInstance.post("/company/compny_by_id", payload);
    return response;
  } catch (error) {
    console.error("Company by ID API error:", error);
    throw error;
  }
});

// New: Signup approval thunks
export const fetchSignupRequests = createAsyncThunk<
  AxiosResponse<SignupRequestsApiResponse>,
  void
>("user/fetchSignupRequests", async () => {
  const response = await axiosInstance.post("/auth/signup/fetch");
  return response;
});

export const approveSignup = createAsyncThunk<
  AxiosResponse<any>,
  { custid: string; payload: ApproveSignupPayload }
>("user/approveSignup", async ({ custid, payload }) => {
  const response = await axiosInstance.post(
    `/auth/signup/approve/${custid}`,
    payload
  );
  return response;
});

export const rejectSignup = createAsyncThunk<
  AxiosResponse<any>,
  { custid: string }
>("user/rejectSignup", async ({ custid }) => {
  const response = await axiosInstance.delete(`/auth/signup/reject/${custid}`);
  return response;
});

export const updateCompany = createAsyncThunk<AxiosResponse<any>, any>(
  "user/updateCompany",
  async (payload) => {
    try {
      const response = await axiosInstance.post(
        "/company/updateCompany",
        payload
      );
      return response;
    } catch (error) {
      console.error("Update company API error:", error);
      throw error;
    }
  }
);

// New: PO Team thunks
export const fetchPOTeamMembers = createAsyncThunk<
  AxiosResponse<POTeamApiResponse>,
  void
>("user/fetchPOTeamMembers", async () => {
  const response = await axiosInstance.get(
    "/admin/po_mail/fetch_po_team_memeber"
  );
  return response;
});

export const addPOTeamMember = createAsyncThunk<
  AxiosResponse<any>,
  AddPOTeamMemberPayload
>("user/addPOTeamMember", async (payload) => {
  // Map UI payload to API contract
  const apiPayload = {
    team_leader: payload.leader_id,
    team_member: payload.member_id,
    cost_center: payload.cost_center,
  };
  const response = await axiosInstance.post(
    "/admin/po_mail/add_team_in_po",
    apiPayload
  );
  return response;
});

export const deletePOTeamMember = createAsyncThunk<
  AxiosResponse<any>,
  { leader_id: string; member_id: string; cost_center: string }
>("user/deletePOTeamMember", async (payload) => {
  // Map UI payload to API contract
  const apiPayload = {
    team_leader: payload.leader_id,
    team_member: payload.member_id,
    cost_center: payload.cost_center,
  };
  const response = await axiosInstance.post(
    "/admin/po_mail/delete_Member",
    apiPayload
  );
  return response;
});

export const searchUsers = createAsyncThunk<
  AxiosResponse<UsersApiResponse>,
  string
>("user/searchUsers", async (searchQuery) => {
  const formData = new FormData();
  formData.append("search", searchQuery);
  const response = await axiosInstance.post("/backend/fetchUsers", formData);
  return response;
});

export const searchCostCenters = createAsyncThunk<
  AxiosResponse<CostCenterApiResponse>,
  string
>("user/searchCostCenters", async (searchQuery) => {
  const formData = new FormData();
  formData.append("search", searchQuery);
  const response = await axiosInstance.post("/backend/costCenter", formData);
  return response;
});

export const fetchAllCostCenters = createAsyncThunk<
  AxiosResponse<CostCenterApiResponse>,
  void
>("user/fetchAllCostCenters", async () => {
  const response = await axiosInstance.get("/admin/po_mail/fetch_all_cc");
  return response;
});

export const updateCompanyServerStatus = createAsyncThunk<
  AxiosResponse<any>,
  { comp_id: string; status: "ON" | "OFF" }
>("user/updateCompanyServerStatus", async (payload) => {
  const response = await axiosInstance.post(
    "/company/updateCompanyServerStatus",
    payload
  );
  return response;
});

export const updateCompanyStatus = createAsyncThunk<
  AxiosResponse<any>,
  { comp_id: string; status: "A" | "B" }
>("user/updateCompanyStatus", async (payload) => {
  const response = await axiosInstance.post(
    "/company/updateCompanyStatus",
    payload
  );
  return response;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.addUserloading = true;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.addUserloading = false;
      })
      .addCase(addUser.rejected, (state) => {
        state.addUserloading = false;
      })
      .addCase(userActivityLogs.pending, (state) => {
        state.activityLoading = true;
      })
      .addCase(userActivityLogs.fulfilled, (state) => {
        state.activityLoading = false;
      })
      .addCase(userActivityLogs.rejected, (state) => {
        state.activityLoading = false;
      })
      .addCase(getUserList.pending, (state) => {
        state.getUserListLoading = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.getUserListLoading = false;
        if (action.payload.data.success) {
          state.userList = action.payload.data.data;
        }
      })
      .addCase(getUserList.rejected, (state) => {
        state.getUserListLoading = false;
        state.userList = [];
      })
      .addCase(getUserProfile.pending, (state) => {
        state.getUserProfileLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.getUserProfileLoading = false;
        if (action.payload.data.success) {
          state.userProfile = action.payload.data.data;
        }
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.getUserProfileLoading = false;
        state.userProfile = [];
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.cahngeUserPasswordLoading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.cahngeUserPasswordLoading = false;
        if (action?.payload?.data?.success == true) {
          showToast(
            action.payload?.data?.message || "Password changed successfully",
            "success"
          );
        } else {
          state.cahngeUserPasswordLoading = false;
        }
      })
      .addCase(changeUserPassword.rejected, (state) => {
        state.cahngeUserPasswordLoading = false;
      })
      .addCase(updateUserEmail.pending, (state) => {
        state.updateUserEmailLoading = true;
      })
      .addCase(updateUserEmail.fulfilled, (state, action) => {
        state.updateUserEmailLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "User updated successfully",
            "success"
          );
        }
      })
      .addCase(updateUserEmail.rejected, (state) => {
        state.updateUserEmailLoading = false;
      })
      .addCase(updateUserMobile.pending, (state) => {
        state.updateUserMobileLoading = true;
      })
      .addCase(updateUserMobile.fulfilled, (state, action) => {
        state.updateUserMobileLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message ||
              "Mobile number updated successfully",
            "success"
          );
        }
      })
      .addCase(updateUserMobile.rejected, (state) => {
        state.updateUserMobileLoading = false;
      })
      .addCase(suspendUser.pending, (state) => {
        state.suspendUserLoading = true;
      })
      .addCase(suspendUser.fulfilled, (state, action) => {
        state.suspendUserLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "User suspended successfully",
            "success"
          );
        }
      })
      .addCase(suspendUser.rejected, (state) => {
        state.suspendUserLoading = false;
      })
      .addCase(change2FactorAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(change2FactorAuthStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(change2FactorAuthStatus.rejected, (state) => {
        state.loading = false;
      })
      .addCase(requirePasswordChange.pending, (state) => {
        state.loading = true;
      })
      .addCase(requirePasswordChange.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requirePasswordChange.rejected, (state) => {
        state.loading = false;
      })
      .addCase(userLoginLogs.pending, (state) => {
        state.getUserListLoading = true;
      })
      .addCase(userLoginLogs.fulfilled, (state) => {
        state.getUserListLoading = false;
      })
      .addCase(userLoginLogs.rejected, (state) => {
        state.getUserListLoading = false;
      })
      .addCase(activateUser.pending, (state) => {
        state.activateUserLoading = true;
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        state.activateUserLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "User activated successfully",
            "success"
          );
        }
      })
      .addCase(activateUser.rejected, (state) => {
        state.activateUserLoading = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateUserProfileLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateUserProfileLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "Profile updated successfully",
            "success"
          );
        }
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.updateUserProfileLoading = false;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.updateUserStatusLoading = true;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.updateUserStatusLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "Status updated successfully",
            "success"
          );
        }
      })
      .addCase(updateUserStatus.rejected, (state) => {
        state.updateUserStatusLoading = false;
      })
      .addCase(updateUserVerification.pending, (state) => {
        state.updateUserVerificationLoading = true;
      })
      .addCase(updateUserVerification.fulfilled, (state, action) => {
        state.updateUserVerificationLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message ||
              "Verification updated successfully",
            "success"
          );
        }
      })
      .addCase(updateUserVerification.rejected, (state) => {
        state.updateUserVerificationLoading = false;
      })
      .addCase(updateUserLoginStatus.pending, (state) => {
        state.updateUserLoginStatusLoading = true;
      })
      .addCase(updateUserLoginStatus.fulfilled, (state, action) => {
        state.updateUserLoginStatusLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message ||
              "Login status updated successfully",
            "success"
          );
        }
      })
      .addCase(updateUserLoginStatus.rejected, (state) => {
        state.updateUserLoginStatusLoading = false;
      })
      .addCase(getCompanyList.pending, (state) => {
        state.getCompanyListLoading = true;
      })
      .addCase(getCompanyList.fulfilled, (state, action) => {
        state.getCompanyListLoading = false;
        // Handle direct array response from the API
        if (Array.isArray(action.payload.data)) {
          state.companyList = action.payload.data;
        } else if (action.payload.data.success) {
          state.companyList = action.payload.data.data;
        }
      })
      .addCase(getCompanyList.rejected, (state) => {
        state.getCompanyListLoading = false;
        state.companyList = [];
      })
      .addCase(fetchCompanyUsers.pending, (state) => {
        state.getCompanyUsersLoading = true;
      })
      .addCase(fetchCompanyUsers.fulfilled, (state, action:any) => {
        state.getCompanyUsersLoading = false;
        if (action.payload.data.success) {
          state.companyUsers = action.payload.data.data;
        }
      })
      .addCase(fetchCompanyUsers.rejected, (state) => {
        state.getCompanyUsersLoading = false;
        state.companyUsers = [];
      })
      .addCase(updateCompanyUserStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompanyUserStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCompanyUserStatus.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchVendorList.pending, (state) => {
        state.getVendorListLoading = true;
      })
      .addCase(fetchVendorList.fulfilled, (state, action) => {
        state.getVendorListLoading = false;
        if (action.payload.data.success) {
          state.vendorList = action.payload.data.data;
        }
      })
      .addCase(fetchVendorList.rejected, (state) => {
        state.getVendorListLoading = false;
        state.vendorList = [];
      })
      .addCase(getCompanyManagementList.pending, (state) => {
        state.getCompanyManagementListLoading = true;
      })
      .addCase(getCompanyManagementList.fulfilled, (state, action:any) => {
        state.getCompanyManagementListLoading = false;
        if (action.payload.data.success) {
          state.companyManagementList = action.payload.data.data;
        }
      })
      .addCase(getCompanyManagementList.rejected, (state) => {
        state.getCompanyManagementListLoading = false;
        state.companyManagementList = [];
      })
      .addCase(getCompanyById.pending, (state) => {
        state.getCompanyDetailLoading = true;
      })
      .addCase(getCompanyById.fulfilled, (state, action:any) => {
        state.getCompanyDetailLoading = false;
        if (action.payload.data.success) {
          state.companyDetail = action.payload.data.data;
        }
      })
      .addCase(getCompanyById.rejected, (state) => {
        state.getCompanyDetailLoading = false;
        state.companyDetail = null;
      })
      .addCase(updateCompany.pending, (state) => {
        state.updateCompanyLoading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.updateCompanyLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload?.data?.message || "Company updated successfully",
            "success"
          );
        }
      })
      .addCase(updateCompany.rejected, (state) => {
        state.updateCompanyLoading = false;
        showToast("Failed to update company", "error");
      })
      // Signup approval reducers
      .addCase(fetchSignupRequests.pending, (state) => {
        state.getSignupRequestsLoading = true;
      })
      .addCase(fetchSignupRequests.fulfilled, (state, action:any) => {
        state.getSignupRequestsLoading = false;
      
        if (action.payload.data.success) {
          state.signupRequests = action.payload.data.data;
        } else {
          state.signupRequests = [];
        }
      })
      .addCase(fetchSignupRequests.rejected, (state) => {
        state.getSignupRequestsLoading = false;
        state.signupRequests = [];
      })
      .addCase(approveSignup.pending, (state) => {
        state.approveSignupLoading = true;
      })
      .addCase(approveSignup.fulfilled, (state, action) => {
        state.approveSignupLoading = false;
        if (
          action.payload?.data?.success ||
          action.payload?.data?.success
        ) {
          showToast(
            action.payload?.data?.message || "User approved successfully",
            "success"
          );
        } else {
          showToast("Failed to approve user", "error");
        }
      })
      .addCase(approveSignup.rejected, (state) => {
        state.approveSignupLoading = false;
        showToast("Failed to approve user", "error");
      })
      .addCase(rejectSignup.pending, (state) => {
        state.rejectSignupLoading = true;
      })
      .addCase(rejectSignup.fulfilled, (state, action) => {
        state.rejectSignupLoading = false;
        if (
          action.payload?.data?.success ||
          action.payload?.data?.success
        ) {
          showToast(
            action.payload?.data?.message || "User rejected successfully",
            "success"
          );
        } else {
          showToast("Failed to reject user", "error");
        }
      })
      .addCase(rejectSignup.rejected, (state) => {
        state.rejectSignupLoading = false;
        showToast("Failed to reject user", "error");
      })
      // PO Team reducers
      .addCase(fetchPOTeamMembers.pending, (state) => {
        state.getPOTeamLoading = true;
      })
      .addCase(fetchPOTeamMembers.fulfilled, (state, action:any) => {
        state.getPOTeamLoading = false;
        if (action.payload.data.success) {
          state.poTeamMembers = action.payload.data.data;
        } else {
          state.poTeamMembers = [];
        }
      })
      .addCase(fetchPOTeamMembers.rejected, (state) => {
        state.getPOTeamLoading = false;
        state.poTeamMembers = [];
      })
      .addCase(addPOTeamMember.pending, (state) => {
        state.addPOTeamLoading = true;
      })
      .addCase(addPOTeamMember.fulfilled, (state, action) => {
        state.addPOTeamLoading = false;
        if (
          action.payload?.data?.success ||
          action.payload?.data?.success
        ) {
          const rawMsg = action.payload?.data?.message;
          const msg =
            typeof rawMsg === "string"
              ? rawMsg
              : typeof rawMsg?.msg === "string"
              ? rawMsg.msg
              : "Team member added successfully";
          showToast(msg, "success");
        } else {
          showToast("Failed to add team member", "error");
        }
      })
      .addCase(addPOTeamMember.rejected, (state) => {
        state.addPOTeamLoading = false;
        showToast("Failed to add team member", "error");
      })
      .addCase(deletePOTeamMember.pending, (state) => {
        state.deletePOTeamLoading = true;
      })
      .addCase(deletePOTeamMember.fulfilled, (state, action) => {
        state.deletePOTeamLoading = false;
        if (
          action.payload?.data?.success ||
          action.payload?.data?.success
        ) {
          const rawMsg = action.payload?.data?.message;
          const msg =
            typeof rawMsg === "string"
              ? rawMsg
              : typeof rawMsg?.msg === "string"
              ? rawMsg.msg
              : "Team member deleted successfully";
          showToast(msg, "success");
        } else {
          showToast("Failed to delete team member", "error");
        }
      })
      .addCase(deletePOTeamMember.rejected, (state) => {
        state.deletePOTeamLoading = false;
        showToast("Failed to delete team member", "error");
      })
      .addCase(searchUsers.pending, (state) => {
        state.getUsersLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action:any) => {
        state.getUsersLoading = false;
        if (action.payload.data.success) {
          state.users = action.payload.data.data;
        } else {
          state.users = [];
        }
      })
      .addCase(searchUsers.rejected, (state) => {
        state.getUsersLoading = false;
        state.users = [];
      })
      .addCase(searchCostCenters.pending, (state) => {
        state.getCostCentersLoading = true;
      })
      .addCase(searchCostCenters.fulfilled, (state, action) => {
        state.getCostCentersLoading = false;
        if (action.payload.data.success) {
          state.costCenters = action.payload.data.data;
        } else {
          state.costCenters = [];
        }
      })
      .addCase(searchCostCenters.rejected, (state) => {
        state.getCostCentersLoading = false;
        state.costCenters = [];
      })
      .addCase(fetchAllCostCenters.pending, (state) => {
        state.getAllCostCentersLoading = true;
      })
      .addCase(fetchAllCostCenters.fulfilled, (state, action) => {
        state.getAllCostCentersLoading = false;
        if (action.payload.data.success) {
          state.allCostCenters = action.payload.data.data;
        } else {
          state.allCostCenters = [];
        }
      })
      .addCase(fetchAllCostCenters.rejected, (state) => {
        state.getAllCostCentersLoading = false;
        state.allCostCenters = [];
      })
      .addCase(updateCompanyServerStatus.pending, (state) => {
        state.updateCompanyServerStatusLoading = true;
      })
      .addCase(updateCompanyServerStatus.fulfilled, (state, action) => {
        state.updateCompanyServerStatusLoading = false;
        const rawMsg = action.payload?.data?.message;
        const msg =
          typeof rawMsg === "string"
            ? rawMsg
            : typeof rawMsg?.msg === "string"
            ? rawMsg.msg
            : "Company server status updated";
        showToast(msg, "success");
      })
      .addCase(updateCompanyServerStatus.rejected, (state) => {
        state.updateCompanyServerStatusLoading = false;
        showToast("Failed to update company server status", "error");
      })
      .addCase(updateCompanyStatus.pending, (state) => {
        state.updateCompanyStatusLoading = true;
      })
      .addCase(updateCompanyStatus.fulfilled, (state, action) => {
        state.updateCompanyStatusLoading = false;
        const rawMsg = action.payload?.data?.message;
        const msg =
          typeof rawMsg === "string"
            ? rawMsg
            : typeof rawMsg?.msg === "string"
            ? rawMsg.msg
            : "Company status updated";
        showToast(msg, "success");
      })
      .addCase(updateCompanyStatus.rejected, (state) => {
        state.updateCompanyStatusLoading = false;
        showToast("Failed to update company status", "error");
      });
  },
});

export default userSlice.reducer;
