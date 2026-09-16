import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/utills/toasterContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { verifyOtpAsync } from "@/features/authentication/authSlice";

interface TwoFactorAuthState {
  username: string;
  token: string;
  qrCode: string;
  timestamp: number;
}

const TwoFactorAuth: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { qrCodeLoading } = useAppSelector((state) => state.auth);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(300);
  const [userCredentials, setUserCredentials] = useState<TwoFactorAuthState | null>(null);

  useEffect(() => {
    const savedState = sessionStorage.getItem("2fa_state");
    if (savedState) {
      try {
        const parsedState: any = JSON.parse(savedState);
        
        // If timestamp is missing, add it now (backward compatibility)
        if (!parsedState.timestamp) {
          parsedState.timestamp = Date.now();
          sessionStorage.setItem("2fa_state", JSON.stringify(parsedState));
        }
        
        const now = Date.now();
        const elapsed = Math.floor((now - parsedState.timestamp) / 1000);
        const remainingTime = Math.max(0, 300 - elapsed);

        if (remainingTime > 0) {
          setUserCredentials(parsedState as TwoFactorAuthState);
          setOtpTimer(remainingTime);
        } else {
          sessionStorage.removeItem("2fa_state");
          showToast("OTP has expired. Please login again.", "error");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error parsing 2FA state:", error);
        sessionStorage.removeItem("2fa_state");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

 
  useEffect(() => {
    let interval: any = null;
    if (userCredentials && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((timer) => {
          if (timer <= 1) {
          
            sessionStorage.removeItem("2fa_state");
            showToast("OTP has expired. Please login again.", "error");
            navigate("/login");
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [userCredentials, otpTimer, navigate]);

  const backToLogin = () => {
    sessionStorage.removeItem("2fa_state");
    setOtpCode(["", "", "", "", "", ""]);
    setOtpTimer(300);
    setUserCredentials(null);
    navigate("/login");
  };

  const verifyOTP = async () => {
    const otpString = otpCode.join("");
    if (otpString.length !== 6) {
      showToast("Please enter the complete 6-digit OTP", "error");
      return;
    }

    if (!userCredentials?.token) {
      showToast("Session expired. Please login again.", "error");
      backToLogin();
      return;
    }

    try {
      const res = await dispatch(verifyOtpAsync({ otp: otpString, secret: "" }));
     
      if (verifyOtpAsync.rejected.match(res)) {
        const errorMessage = 
          (res.payload as any)?.message || 
          (res.error as any)?.message || 
          "Invalid OTP. Please try again.";
        showToast(errorMessage, "error");
        setOtpCode(["", "", "", "", "", ""]);
        return;
      }

      if (res?.payload?.data?.success) {
        sessionStorage.removeItem("2fa_state");
        showToast("OTP verified successfully!", "success");
        navigate("/");
      } else {
        showToast(
          "Invalid OTP. Please try again.",
          "error"
        );
        setOtpCode(["", "", "", "", "", ""]);
      }
    } catch (error: any) {
      showToast(
        error?.response?.message || "Invalid OTP. Please try again.",
        "error"
      );
      setOtpCode(["", "", "", "", "", ""]);
    }
  };

  const handleOtpChange = (index: any, value: any) => {

    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtpCode = [...otpCode];
      
    
      digits.forEach((digit: string, i: number) => {
        if (index + i < 6) {
          newOtpCode[index + i] = digit;
        }
      });
      
      setOtpCode(newOtpCode);
      
   
      const nextIndex = Math.min(index + digits.length, 5);
      const nextInput = document.getElementById(`otp-input-${nextIndex}`);
      if (nextInput) nextInput.focus();
      return;
    }

 
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpCode = [...otpCode];
      newOtpCode[index] = value;
      setOtpCode(newOtpCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");
    
    if (digits.length > 0) {
      const newOtpCode = [...otpCode];
      digits.forEach((digit: string, i: number) => {
        if (i < 6) {
          newOtpCode[i] = digit;
        }
      });
      setOtpCode(newOtpCode);
      
      // Focus on the last filled input or next empty input
      const nextIndex = Math.min(digits.length, 5);
      const nextInput = document.getElementById(`otp-input-${nextIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: any, e: any) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  if (!userCredentials) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative">
          <div className="flex justify-center mb-6">
            <img
              src="/OakterImage.png"
              alt="Spigen Logo"
              className="h-16 w-auto"
            />
          </div>
          <h3 className="text-center text-2xl font-bold text-blue-600 mb-5">
            Two-Factor Authentication
          </h3>

          <p className="text-center text-sm text-gray-600 mb-8">
            Enter the 6-digit verification code sent to your registered Email
            address (expires in 5 minutes)
          </p>

          <div className="flex justify-center gap-3 mb-5">
            {otpCode.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onPaste={handleOtpPaste}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                disabled={otpTimer === 0}
                className="focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  width: 50,
                  height: 50,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  border: digit ? "2px solid #3b82f6" : "1px solid #d9d9d9",
                  borderRadius: 8,
                }}
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-600 mb-8">
            Code expires in{" "}
            <span className="font-medium">
              {Math.floor(otpTimer / 60)
                .toString()
                .padStart(2, "0")}
              :{(otpTimer % 60).toString().padStart(2, "0")}
            </span>
          </p>

          <button
            onClick={verifyOTP}
            disabled={qrCodeLoading || otpTimer === 0}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {qrCodeLoading ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="text-center my-5">
            <button
              onClick={backToLogin}
              className="text-gray-600 text-sm hover:underline"
            >
              ← Back to Sign In
            </button>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
            <span className="text-blue-500 text-lg">🛡️</span>
            <p>
              For your security, this code will expire in 5 minutes. Never
              share this code with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;

