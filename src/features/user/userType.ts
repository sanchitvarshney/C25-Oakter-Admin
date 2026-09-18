export type AddUserPayload = {
  username: string;
  email: string;
  mobile: string;
  password: string;
  asktochange: "off" | "on";
  verification: "E" | "M" | "1" | "0";
  project: string;
  vendor: string;
};
export type AdduserApiResponse = {
  message: string;
  success: boolean;
};
type UserType = {
  userID: string;
  type: string; // The "type" field can be restricted to known values
  gender: string;
  fullName: string;
  emailID: string;
  mobileNo: string;
};

export type UserApiResponse = {
  success: boolean;
  data: UserType[];
};

export type UserProfileData = {
  type: string;
  userID: string;
  user_name: string;
  fullName: string;
  email: string;
  mobile: string;
  status: string;
  gender: string;
  twoFactoryAuth: string;
  registerDt: string;
  newsLetterSubscription: string; // Assuming this field is either 'YES' or 'NO'
};

export type UserProfileResponse = {
  success: boolean;
  data: any;
};

export type ChangeUserPasswordPayload = {
  userId: string;
  newPassword: string;
  confirmPassword: string;
  askPasswordChange: boolean;
};
export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export type UpdateEmailPayload = {
  userId: string;
  emailId: string;
  isVerified: string;
};

export type Modify2FactorAuthPayload = {
  userId: string;
  status: string;
};

export type UpdateMobilePayload = {
  userId: string;
  mobileNo: string;
  isVerified: string;
};
export type UpdateuserProfilePayload = {
  userId: any;
  name: string;
  gender: string;
};

export type CompanyType = {
  id: string;
  text: string;
};

export type CompanyApiResponse = {
  success: boolean;
  data: CompanyType[];
};

// New types for company management
export type CompanyListItem = {
  company_name: string;
  company_id: string;
  company_pan_no: string;
  company_status: string;
  company_server: string;
};

export type CompanyListApiResponse = {
  code: number;
  status: string;
  data: CompanyListItem[];
};

export type CompanyDetail = {
  ID: number;
  einvoiceUsername: string;
  einvoicePassword: string;
  gstHeroUserName: string;
  gstHeroPassword: string;
  company_name: string;
  company_trade_name: string;
  company_pan_no: string;
  company_cin_no: string;
  company_id: string;
  company_email: string;
  company_mob: string;
  company_state: string;
  companey_city: string;
  company_address: string;
  company_pin_code: string;
  company_gst_no: string;
  insert_by: string;
  insert_date: string;
  update_by: string;
  update_date: string;
  company_status: string;
  company_server: string;
  termsnconditions: string;
  bankdetails: string;
  certifiedtext: string;
  min_type: string;
  state_name: string;
};

export type CompanyDetailApiResponse = {
  code: number;
  status: string;
  data: CompanyDetail;
};

export type CompanyByIdPayload = {
  company_id: string;
};

export type CompanyUserType = {
  username: string;
  custid: string;
  email: string;
  mobile: string;
  status: string;
  company_id: string;
};

export type CompanyUsersApiResponse = {
  code: number;
  status: string;
  data: CompanyUserType[];
};

// New: Signup approval types
export type SignupRequest = {
  username: string;
  custID: string;
  email: string;
  mobile: string;
  regDtTm: string;
};

export type SignupRequestsApiResponse = {
  code: number;
  status: string;
  data: SignupRequest[];
};

export type ApproveSignupPayload = {
  company: string;
  username: string;
  email: string;
  mobile: string;
  verification: "E" | "M" | "1" | "0";
  project: string;
  vendor: string;
};

// New: PO Team types
export type POTeamMember = {
  leader_name: string;
  member_name: string;
  leader_id: string;
  member_id: string;
  cost_center: string;
  cost_center_name: string;
  cost_center_short_name: string;
};

export type POTeamApiResponse = {
  code: number;
  status: string;
  data: POTeamMember[];
};

export type UserOption = {
  id: string;
  text: string;
};

export type UsersApiResponse = {
  code: number;
  status: string;
  data: UserOption[];
};

export type CostCenterOption = {
  id: string;
  text: string;
};

export type CostCenterApiResponse = {
  success: boolean;
  data: CostCenterOption[];
};

export type AddPOTeamMemberPayload = {
  leader_id: string;
  member_id: string;
   cost_center: string[];
};

export type AdduserSatates = {
  addUserloading: boolean;
  userList: UserType[] | null;
  getUserListLoading: boolean;
  getUserProfileLoading: boolean;
  userProfile: any;
  cahngeUserPasswordLoading: boolean;
  updateUserEmailLoading: boolean;
  updateUserMobileLoading: boolean;
  suspendUserLoading: boolean;
  activateUserLoading: boolean;
  updateUserProfileLoading: boolean;
  updateUserStatusLoading: boolean;
  updateUserVerificationLoading: boolean;
  updateUserLoginStatusLoading: boolean;
  loading: boolean;
  activityData: any;
  activityLoading: boolean;
  companyList: CompanyType[] | null;
  companyUsers: CompanyUserType[] | null;
  getCompanyListLoading: boolean;
  getCompanyUsersLoading: boolean;
  vendorList: any[] | null;
  getVendorListLoading: boolean;
  // New company management states
  companyManagementList: CompanyListItem[] | null;
  companyDetail: CompanyDetail | null;
  getCompanyManagementListLoading: boolean;
  getCompanyDetailLoading: boolean;
  updateCompanyLoading: boolean;
  // New signup approval states
  signupRequests: SignupRequest[] | null;
  getSignupRequestsLoading: boolean;
  approveSignupLoading: boolean;
  rejectSignupLoading: boolean;
  // New PO team states
  poTeamMembers: POTeamMember[] | null;
  getPOTeamLoading: boolean;
  addPOTeamLoading: boolean;
  deletePOTeamLoading: boolean;
  users: UserOption[] | null;
  getUsersLoading: boolean;
  costCenters: CostCenterOption[] | null;
  getCostCentersLoading: boolean;
  allCostCenters: CostCenterOption[] | null;
  getAllCostCentersLoading: boolean;
  // New: company/server status toggle loadings
  updateCompanyStatusLoading: boolean;
  updateCompanyServerStatusLoading: boolean;
};
