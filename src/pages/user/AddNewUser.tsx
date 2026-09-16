import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Checkbox,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { AddUserPayload } from "@/features/user/userType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import { addUser, fetchVendorList } from "@/features/user/userSlice";
import { showToast } from "@/utills/toasterContext";
import { Icons } from "@/components/icons/icons";
import { useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";

const schema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().regex(/^([6-9]\d{9})$/, "Invalid Indian mobile number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
    askPasswordChange: z.boolean(),
    verification: z.enum(["E", "M", "1", "0"]),
    project: z.enum(["ims", "vendor"]),
    vendor: z.string().optional(),
  })
  .refine(
    (data) => {
      // If project is "vendor", vendor field is not required
      // If project is "ims", vendor field is required
      if (data.project === "vendor" && !data.vendor) {
        return false;
      }
      return true;
    },
    {
      message: "Vendor is required when Project is Vendor",
      path: ["vendor"],
    }
  );

// Define the form input types using TypeScript
type FormData = z.infer<typeof schema>;

const AddNewUser: React.FC = () => {
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorOpen, setVendorOpen] = useState(false);
  const [selectedVendorText, setSelectedVendorText] = useState("");

  const authTypes = [
    { label: "Only Email Verified", value: "E" },
    { label: "Only Mobile Verified", value: "M" },
    { label: "Both OK", value: "1" },
    { label: "None", value: "0" },
  ];

  const debouncedVendorSearch = useDebounce(vendorSearch, 300);

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      askPasswordChange: false,
      verification: "M",
      mobile: "",
      project: "ims",
      vendor: "",
    },
  });

  const watchedProject = watch("project");

  const dispatch = useAppDispatch();
  const { addUserloading, vendorList, getVendorListLoading } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (debouncedVendorSearch && debouncedVendorSearch.length >= 2) {
      dispatch(fetchVendorList(debouncedVendorSearch));
      setVendorOpen(true);
    } else {
      setVendorOpen(false);
    }
  }, [debouncedVendorSearch, dispatch]);

  const handleVendorSelect = (vendorId: string, vendorText: string) => {
    setValue("vendor", vendorId);
    setSelectedVendorText(vendorText);
    setVendorOpen(false);
    setVendorSearch("");
  };

  const resetForm = () => {
    reset();
    setSelectedVendorText("");
    setVendorSearch("");
  };

  const onSubmit = (data: FormData) => {
    const payload: AddUserPayload = {
      // company: data.company,
      username: data.username,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      asktochange: data.askPasswordChange ? "on" : "off",
      verification: data.verification,
      project: data.project,
      vendor: data.project === "ims" ? "--" : data.vendor || "",
    };
    dispatch(addUser(payload)).then((res: any) => {
      if (res.payload.data.code == 200) {
        showToast(res.payload.data.message, "success");
        resetForm();
      } else {
        const errorMessage =
          res.payload.data.message?.msg ||
          res.payload.data.message ||
          "An error occurred";
        showToast(errorMessage, "error");
      }
    });
  };

  return (
    <div className="overflow-y-auto h-[calc(100vh-72px)]">
      <div className="rounded-sm  p-[20px]">
        <Typography variant="h2" fontWeight={500} fontSize={20}>
          Add New User
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[20px] grid grid-cols-2 max-w-[70%] gap-[20px]">
            {/* Project */}
            <Controller
              name="project"
              control={control}
              render={({ field }) => (
                <FormControl variant="filled" error={!!errors.project}>
                  <InputLabel>Project</InputLabel>
                  <Select
                    label="Project"
                    {...field}
                    value={field.value || ""}
                    onChange={(value) => {
                      field.onChange(value);
                      // Clear vendor when switching to vendor project
                      if (value.target.value === "vendor") {
                        setValue("vendor", "");
                        setSelectedVendorText("");
                      }
                    }}
                    fullWidth
                  >
                    <MenuItem value="ims">IMS</MenuItem>
                    <MenuItem value="vendor">Vendor</MenuItem>
                  </Select>
                  <p className="text-red-500">{errors.project?.message}</p>
                </FormControl>
              )}
            />

            {/* Full Name */}
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  variant="filled"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              )}
            />

            {/* Vendor - Only show when Project is IMS */}
            {watchedProject === "vendor" && (
              <div className="relative">
                <Controller
                  name="vendor"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Vendor"
                      variant="filled"
                      error={!!errors.vendor}
                      helperText={errors.vendor?.message}
                      value={vendorSearch || selectedVendorText || field.value}
                      onChange={(e) => setVendorSearch(e.target.value)}
                      onFocus={() => setVendorOpen(true)}
                      placeholder="Search vendor..."
                      fullWidth
                    />
                  )}
                />
                {vendorOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {getVendorListLoading ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : vendorList && vendorList.length > 0 ? (
                      <div className="py-2">
                        {vendorList.map((vendor) => (
                          <div
                            key={vendor.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() =>
                              handleVendorSelect(vendor.id, vendor.text)
                            }
                          >
                            {vendor.text}
                          </div>
                        ))}
                      </div>
                    ) : vendorSearch.length >= 2 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No vendors found
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {/* Mobile No. */}
            <Controller
              name="mobile"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mobile No."
                  variant="filled"
                  error={!!errors.mobile}
                  helperText={errors.mobile?.message}
                />
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="e-mail address"
                  variant="filled"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="New Password"
                  type="password"
                  variant="filled"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Re-enter Password"
                  type="password"
                  variant="filled"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />

            {/* Ask to change password */}
            <div className="col-span-2 flex items-center gap-3 mt-2">
              <Controller
                name="askPasswordChange"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label="ask to change password at first login?"
                  />
                )}
              />
            </div>

            {/* Verification Status */}
            <div className="col-span-2 grid grid-cols-2 items-center mt-2">
              <Typography className="text-sm text-gray-700">
                Verification Status
              </Typography>
              <Controller
                name="verification"
                control={control}
                render={({ field }) => (
                  <FormControl variant="filled" error={!!errors.verification}>
                    <InputLabel>Verification Status</InputLabel>
                    <Select
                      label="Verification Status"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                    >
                      {authTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <p className="text-red-500">
                      {errors.verification?.message}
                    </p>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="mt-[20px]">
            <LoadingButton
              startIcon={<Icons.save fontSize="small" />}
              loading={addUserloading}
              type="submit"
              variant="contained"
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
