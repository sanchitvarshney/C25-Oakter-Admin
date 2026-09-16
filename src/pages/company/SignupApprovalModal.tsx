import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons/icons";
import { SignupRequest, ApproveSignupPayload } from "@/features/user/userType";
import {
  approveSignup,
  fetchVendorList,
} from "@/features/user/userSlice";
import { showToast } from "@/utills/toasterContext";
import useDebounce from "@/hooks/useDebounce";

const projectOptions = [
  { text: "Vendor", value: "vendor" },
  { text: "IMS", value: "ims" },
];

const verificationOptions = [
  { text: "Mobile Verified", value: "M" },
  { text: "Email Verified", value: "E" },
  { text: "Not Verified", value: "0" },
  { text: "All Verified", value: "1" },
];

interface SignupApprovalModalProps {
  open: boolean;
  onClose: () => void;
  signup: SignupRequest | null;
  onApproved: () => void;
}

const SignupApprovalModal: React.FC<SignupApprovalModalProps> = ({
  open,
  onClose,
  signup,
  onApproved,
}) => {
  const dispatch = useAppDispatch();
  const {
    approveSignupLoading,
    vendorList,
    getVendorListLoading,
  } = useAppSelector((s) => s.user);

  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorOpen, setVendorOpen] = useState(false);
  const [selectedVendorText, setSelectedVendorText] = useState("");
  const debouncedVendorSearch = useDebounce(vendorSearch, 300);

  const [form, setForm] = useState<ApproveSignupPayload>({
    company: "",
    username: "",
    email: "",
    mobile: "",
    verification: "1",
    project: "ims",
    vendor: "--",
  });

  useEffect(() => {
    if (open) {
      // prefill from selected signup
      setForm((prev) => ({
        ...prev,
        username: signup?.username || "",
        email: signup?.email || "",
        mobile: signup?.mobile || "",
      }));
    }
  }, [open, signup]);

  useEffect(() => {
    if (debouncedVendorSearch && debouncedVendorSearch.length >= 2) {
      dispatch(fetchVendorList(debouncedVendorSearch));
      setVendorOpen(true);
    } else {
      setVendorOpen(false);
    }
  }, [debouncedVendorSearch, dispatch]);

  const handleVendorSelect = (vendorId: string, vendorText: string) => {
    setForm((prev) => ({ ...prev, vendor: vendorId }));
    setSelectedVendorText(vendorText);
    setVendorOpen(false);
    setVendorSearch("");
  };

  const handleChange = (field: keyof ApproveSignupPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApprove = async () => {
    if (!signup) return;
    await dispatch(
      approveSignup({ custid: signup.custID, payload: form })
    ).then((res: any) => {
      if (res.payload.data.status === "success") {
        showToast("Signup approved successfully", "success");
        onApproved();
      } else {
        showToast(
          res?.payload?.data?.message?.msg || "Something went wrong",
          "error"
        );
      }
    });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Approve Signup</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={form.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                maxLength={10}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verification">Verification Status</Label>
              <select
                id="verification"
                className="w-full border rounded px-3 py-2"
                value={form.verification}
                onChange={(e) => handleChange("verification", e.target.value)}
              >
                {verificationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.text}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <select
                id="project"
                className="w-full border rounded px-3 py-2"
                value={form.project}
                onChange={(e) => {
                  const next = e.target.value;
                  // update project and handle vendor visibility/default
                  setForm((prev) => ({
                    ...prev,
                    project: next,
                    vendor: next === "vendor" ? "" : "--",
                  }));
                  // reset vendor search state when switching project
                  if (next !== "vendor") {
                    setVendorSearch("");
                    setSelectedVendorText("");
                    setVendorOpen(false);
                  }
                }}
              >
                {projectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.text}
                  </option>
                ))}
              </select>
            </div>
            {form.project === "vendor" && (
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <div className="relative">
                  <Input
                    id="vendor"
                    placeholder="Search vendor..."
                    value={vendorSearch || selectedVendorText || form.vendor}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    onFocus={() => setVendorOpen(true)}
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
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={approveSignupLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {approveSignupLoading ? (
                <span className="flex items-center">
                  <Icons.refresh className="animate-spin h-4 w-4 mr-2" />{" "}
                  Approving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Icons.done className="h-4 w-4 mr-2" /> Approve
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupApprovalModal;
