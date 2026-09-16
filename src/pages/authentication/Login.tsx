import { showToast } from "@/utills/toasterContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { loginUserAsync } from "@/features/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLoginWithGoogle = (googleResponse: { credential?: string }) => {
    const credential = googleResponse.credential;
    if (!credential) {
      showToast("Login failed: missing credential", "error");
      return;
    }
    dispatch(loginUserAsync({ credential })).then((res: any) => {
      if (res.meta?.requestStatus === "rejected") {
        const msg =
          res.payload?.response?.data?.message ??
          res.payload?.message ??
          "Login failed";
        showToast(msg, "error");
        return;
      }

      const success = res?.payload?.data?.success;
      const message = res?.payload?.data?.message;
      const data = res?.payload?.data?.data;

      if (success) {
        const isTwoStep = data?.isTwoStep;
        if (isTwoStep === "Y") {
          const twoFactorState = {
            username: data?.username,
            token: data?.token,
            qrCode: data?.qrCode,
            timestamp: Date.now(),
          };
          sessionStorage.setItem("2fa_state", JSON.stringify(twoFactorState));
          showToast("OTP sent to your registered email address", "success");
          navigate("/verify-2fa");
        } else {
          navigate("/");
        }
      } else {
        showToast(message ?? "Login failed", "error");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50 ring-1 ring-gray-100">
            <img src="/mslogo.png" alt="Spigen Logo" className="h-12 w-auto" />
          </div>
          <Typography
            variant="h5"
            style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1f2937" }}
          >
            C25 (Oakter) Admin 
          </Typography>
          <p className="mt-2 text-center text-sm text-gray-500">
            Welcome back — sign in to continue to your dashboard
          </p>
        </div>

        <div className="mt-8 ">
          {loading ? (
            <div className="flex h-[44px] items-center justify-center gap-3 rounded-full bg-gray-50 ring-1 ring-gray-100">
              <CircularProgress size={20} thickness={4} />
              <Typography style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                Signing you in…
              </Typography>
            </div>
          ) : (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleLoginWithGoogle(credentialResponse);
                }}
                onError={() => {
                  showToast("Login failed", "error");
                }}
                text="continue_with"
                logo_alignment="center"
                theme="outline"
                shape="pill"
                size="large"
                width="336"
              />
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
