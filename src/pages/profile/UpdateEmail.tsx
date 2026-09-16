import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  getEmailOtpAsync,
  updateEmailAsync,
} from "@/features/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/utills/toasterContext";
import { Icons } from "@/components/icons/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
// import { useUser } from "@/hooks/useUser";
type Props = {
  open: boolean;
  handleClose: () => void;
};
const OTP_VALIDITY_SECONDS = 180;
const OTP_LENGTH = 4;

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; secondsLeft: number },
) {
  const { secondsLeft, ...circularProps } = props;
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...circularProps} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {`${secondsLeft}s`}
        </Typography>
      </Box>
    </Box>
  );
}

const UpadteEmail: React.FC<Props> = ({ open, handleClose }) => {
  //   const { user } = useUser();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { emailOtpLoading, updateEmailLoading } = useAppSelector(
    (state) => state.auth,
  );
  const [update, setUpdate] = React.useState<boolean>(false);
  const [otpSent, setOtpSent] = React.useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = React.useState(OTP_VALIDITY_SECONDS);
  const [send, setSend] = React.useState<boolean>(true);
  const [otp, setOtp] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");

  useEffect(() => {
    setUpdate(false);
    setOtpSent(false);
    setEmail("");
    setOtp("");
  }, [open]);
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (!send) {
      timer = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            setSend(true);
            clearInterval(timer!);
            return OTP_VALIDITY_SECONDS; // Reset the timer
          }
          return prevSeconds - 1; // Decrement by 1 second
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [send]);
  const handleReSendOtp = () => {
    dispatch(getEmailOtpAsync({ email: email }))
      .then((res: any) => {
        console.log(res);
        if (res.payload.data.success) {
          setSend(false);
          setSecondsLeft(OTP_VALIDITY_SECONDS); // Reset timer
        } else {
          showToast(res.payload.data.message, "error");
        }
      })
      .catch((error: any) => {
        showToast(error?.message || "Error sending OTP", "error");
      });
  };
  const handleSendOTP = () => {
    if (!email) return showToast("Please enter email", "error");
    //regex for chekc valid emal
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return showToast("Please enter valid email", "error");
    dispatch(getEmailOtpAsync({ email }))
      .then((res: any) => {
        if (res.payload.data.success) {
          setOtpSent(true);
          setSend(false);
          setSecondsLeft(OTP_VALIDITY_SECONDS);
        } else {
          showToast(res.payload.data.message, "error");
        }
      })
      .catch((error: any) => {
        showToast(error?.message || "Error sending OTP", "error");
      });
  };
  const handleUpdateEmail = () => {
    if (!otp) return showToast("Please enter otp", "error");
    dispatch(updateEmailAsync({ otp: otp })).then((res: any) => {
      if (res.payload.data.success) {
        setUpdate(false);
        setOtpSent(false);
        localStorage.clear();
        navigate("/login");
      }else {
        showToast(res.payload.data.message, "error");
      }
    }).catch((error: any) => {
      showToast(error?.message || "Error updating email", "error");
    });
  };
  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === "backdropClick") return;
        handleClose();
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className="absolute top-0 left-0 right-0">
        {(emailOtpLoading || updateEmailLoading) && <LinearProgress />}
      </div>
      <DialogTitle id="alert-dialog-title">
        <Typography fontWeight={600} fontSize={20}>
          {update ? "Update Email" : "   Are you sure ?"}
        </Typography>
      </DialogTitle>

      {update && <Divider />}
      {update ? (
        <DialogContent className="max-h-[70vh] overflow-y-auto flex flex-col gap-[20px] min-w-[600px]">
          <Typography>
            {otpSent
              ? "Enter the OTP sent to your email address"
              : "Enter your new email address"}
          </Typography>

          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            label="New Email"
            disabled={otpSent}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Icons.email />
                  </InputAdornment>
                ),
              },
            }}
          />
          {otpSent && (
            <TextField
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
              }
              variant="filled"
              label="OTP"
              placeholder="0000"
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  maxLength: OTP_LENGTH,
                },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <div className="flex items-center gap-[10px]">
                        {send ? (
                          <MuiTooltip title="Resend Code" placement="top">
                            <IconButton
                              disabled={emailOtpLoading}
                              onClick={handleReSendOtp}
                              size="small"
                            >
                              <Icons.refresh />
                            </IconButton>
                          </MuiTooltip>
                        ) : (
                          <CircularProgressWithLabel
                            size={30}
                            value={(secondsLeft / OTP_VALIDITY_SECONDS) * 100}
                            secondsLeft={secondsLeft}
                          />
                        )}
                        <Icons.code />
                      </div>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        </DialogContent>
      ) : (
        <DialogContent className="max-h-[70vh] overflow-y-auto">
          Are you sure you want to update your email address?
        </DialogContent>
      )}
      {update && <Divider />}
      <DialogActions>
        <Button
          disabled={emailOtpLoading || updateEmailLoading}
          onClick={handleClose}
          sx={{ color: "red", background: "white" }}
          variant="contained"
        >
          No
        </Button>
        {update ? (
          otpSent ? (
            <Button
              disabled={emailOtpLoading || updateEmailLoading}
              onClick={handleUpdateEmail}
              variant="contained"
            >
              Update
            </Button>
          ) : (
            <Button
              disabled={emailOtpLoading}
              onClick={handleSendOTP}
              variant="contained"
            >
              Send OTP
            </Button>
          )
        ) : (
          <Button
            disabled={emailOtpLoading}
            onClick={() => {
              setUpdate(true);
            }}
            autoFocus
            variant="contained"
          >
            Yes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UpadteEmail;
