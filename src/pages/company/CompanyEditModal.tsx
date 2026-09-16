import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons/icons";
import { CompanyDetail } from "@/features/user/userType";
import { showToast } from "@/utills/toasterContext";
import { updateCompany } from "@/features/user/userSlice";

interface CompanyEditModalProps {
  open: boolean;
  onClose: () => void;
  company: CompanyDetail | null;
  onCompanyUpdated: () => void;
  loading: boolean;
}

const CompanyEditModal: React.FC<CompanyEditModalProps> = ({
  open,
  onClose,
  company,
  onCompanyUpdated,
  loading,
}) => {
  const dispatch = useAppDispatch();
  const { updateCompanyLoading } = useAppSelector((state) => state.user);
  const [formData, setFormData] = useState<Partial<CompanyDetail>>({});

  useEffect(() => {
    if (company) {
      setFormData(company);
    } else {
      setFormData({});
    }
  }, [company]);

  const handleInputChange = (field: keyof CompanyDetail, value: string) => {
    try {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } catch (err) {}
  };

  const handleSubmit = async () => {
    try {
      if (!company?.company_id) {
        showToast("Company ID is required", "error");
        return;
      }

      if (!formData.company_name?.trim()) {
        showToast("Company name is required", "error");
        return;
      }

      if (!formData.company_pan_no?.trim()) {
        showToast("PAN number is required", "error");
        return;
      }

      if (!formData.company_email?.trim()) {
        showToast("Email address is required", "error");
        return;
      }

      const payload = {
        company_name: formData.company_name || "",
        company_pan_no: formData.company_pan_no || "",
        company_cin_no: formData.company_cin_no || "",
        company_mobile: formData.company_mob || "",
        company_state_name: formData.company_state || "",
        company_city: formData.companey_city || "",
        company_gstin: formData.company_gst_no || "",
        company_pincode: formData.company_pin_code || "",
        company_email: formData.company_email || "",
        company_address: formData.company_address || "",
        customer_id: company.company_id,
      };

      const result: any = await dispatch(updateCompany(payload));
      if (result.payload?.data?.success || result.payload.data.code == 200) {
        showToast("Company updated successfully", "success");
        onCompanyUpdated();
        onClose();
      } else {
        showToast(
          result.payload?.data?.message || "Failed to update company",
          "error"
        );
      }
    } catch (error) {
      showToast("Failed to update company", "error");
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Company Modification</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-8 flex items-center justify-center text-gray-500">
            <Icons.refresh className="animate-spin mr-2" />
            Loading company details...
          </div>
        ) : !company ? (
          <div className="p-8 text-center text-gray-500">
            <p>No company data available</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company's name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name || ""}
                  onChange={(e) =>
                    handleInputChange("company_name", e.target.value)
                  }
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_pan_no">PAN No : XXXXX0000X</Label>
                <Input
                  id="company_pan_no"
                  value={formData.company_pan_no || ""}
                  onChange={(e) =>
                    handleInputChange("company_pan_no", e.target.value)
                  }
                  placeholder="Enter PAN number"
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_cin_no">
                  CIN No : X 00000 XX 000 XXX 000000
                </Label>
                <Input
                  id="company_cin_no"
                  value={formData.company_cin_no || ""}
                  onChange={(e) =>
                    handleInputChange("company_cin_no", e.target.value)
                  }
                  placeholder="Enter CIN number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_state">State</Label>
                <Input
                  id="company_state"
                  value={formData.company_state || ""}
                  onChange={(e) =>
                    handleInputChange("company_state", e.target.value)
                  }
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companey_city">City</Label>
                <Input
                  id="companey_city"
                  value={formData.companey_city || ""}
                  onChange={(e) =>
                    handleInputChange("companey_city", e.target.value)
                  }
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_gst_no">GSTIN</Label>
                <Input
                  id="company_gst_no"
                  value={formData.company_gst_no || ""}
                  onChange={(e) =>
                    handleInputChange("company_gst_no", e.target.value)
                  }
                  placeholder="Enter GSTIN"
                  maxLength={15}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_pin_code">Pincode</Label>
                <Input
                  id="company_pin_code"
                  value={formData.company_pin_code || ""}
                  onChange={(e) =>
                    handleInputChange("company_pin_code", e.target.value)
                  }
                  placeholder="Enter pincode"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_email">e-mail address</Label>
                <Input
                  id="company_email"
                  type="email"
                  value={formData.company_email || ""}
                  onChange={(e) =>
                    handleInputChange("company_email", e.target.value)
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_mob">Mobile No.</Label>
                <Input
                  id="company_mob"
                  value={formData.company_mob || ""}
                  onChange={(e) =>
                    handleInputChange("company_mob", e.target.value)
                  }
                  placeholder="Enter mobile number"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_address">Address</Label>
              <Textarea
                id="company_address"
                value={formData.company_address || ""}
                onChange={(e) =>
                  handleInputChange("company_address", e.target.value)
                }
                placeholder="Enter company address"
                rows={3}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSubmit}
                disabled={updateCompanyLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {updateCompanyLoading ? (
                  <span className="flex items-center">
                    <Icons.refresh className="animate-spin h-4 w-4 mr-2" />{" "}
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Icons.done className="h-4 w-4 mr-2" /> RECTIFY & SAVE
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompanyEditModal;
