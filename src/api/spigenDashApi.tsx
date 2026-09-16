import axios from "axios";
import { getToken } from "@/utills/tokenUtills";
import { v4 as uuidv4 } from "uuid";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { showToast } from "@/utills/toasterContext";
import { getFinancialSessionHeaderValue } from "@/utills/indianFiscalYear";

const getFingerprint = async () => {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error("Failed to get fingerprint", error);
    return null;
  }
};

const generateUniqueId = () => {
  return uuidv4();
};

const generateTriggerUidHeader = () => {
  const uid = generateUniqueId().replace(/-/g, "");
  const timestamp = formatTimestamp();
  return `${uid}:${timestamp}`;
};

const formatTimestamp = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(now.getFullYear()).slice(-4); // Last 2 digits of the year
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
};

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
     "company-branch": localStorage.getItem("company-branch") ?? "BROAKTRC25",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = getToken();
  const triggerUid = generateTriggerUidHeader();


  config.headers["session"] = getFinancialSessionHeaderValue();

  if (token) {
    const uniqueid = uuidv4();
    const fingerprint = await getFingerprint();

    config.headers.Authorization = `${token}`;
    config.headers["x-csrf-token"] = `${token}`;
    config.headers["x-click-token"] = uniqueid;
    config.headers["fingerprint"] = fingerprint || "unknown";
    config.headers["company-branch"] = localStorage.getItem("company-branch") ?? "BROAKTRC25";
    config.headers["x-trigger-uid"] = triggerUid;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const logOut = error?.response?.data?.data?.logout
    const status = error?.response?.data?.success
    if (logOut && !status) {
     localStorage.clear();
     sessionStorage.clear();
      window.location.href = "/login";
    }
    showToast(error.response?.data?.message ? error.response?.data?.message : error.response?.data?.message?.msg, "error");
    return Promise.reject(error);
  }
);

export default axiosInstance;
