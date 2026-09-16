import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import { Typography, IconButton, Tooltip } from "@mui/material";
import { Icons } from "@/components/icons/icons";
import { fetchSignupRequests, rejectSignup } from "@/features/user/userSlice";
import SignupApprovalModal from "@/pages/company/SignupApprovalModal";
import { showToast } from "@/utills/toasterContext";

const SignupApprovals: React.FC = () => {
  const dispatch = useAppDispatch();
  const { signupRequests, getSignupRequestsLoading } = useAppSelector(
    (s) => s.user
  );

  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedSignup, setSelectedSignup] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchSignupRequests());
  }, [dispatch]);

  const columns: ColDef[] = [
    { field: "username", headerName: "Username", minWidth: 200, flex: 1 },
    { field: "custID", headerName: "Customer ID", minWidth: 140 },
    { field: "type", headerName: "Type", minWidth: 140 },
    { field: "email", headerName: "Email", minWidth: 220, flex: 1 },
    { field: "mobile", headerName: "Mobile", minWidth: 130 },
    { field: "regDtTm", headerName: "Registered At", minWidth: 220, flex: 1 },
    {
      headerName: "Actions",
      field: "action",
      maxWidth: 160,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Approve">
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                setSelectedSignup(params.data);
                setApprovalModalOpen(true);
              }}
            >
              <Icons.checkcircle fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton
              color="error"
              size="small"
              onClick={async () => {
                const ok = window.confirm(
                  "Are you sure you want to reject this signup?"
                );
                if (!ok) return;
                dispatch(rejectSignup({ custid: params.data.custID })).then((res: any) => {
                  if (res.payload.data.status === "success") {
                    showToast(res.payload.data.message || "Signup rejected successfully", "success");
                    dispatch(fetchSignupRequests());
                  } else {
                    showToast(res.payload.data.message || "Failed to reject signup", "error");
                  }
                });
              }}
            >
              <Icons.delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
      sortable: false,
      filter: false,
    },
  ];

  return (
    <div className="overflow-y-auto h-[calc(100vh-72px)]">
      <div className="rounded-sm p-[20px]">
        <Typography variant="h2" fontWeight={500} fontSize={20}>
          Pending Signups
        </Typography>

        <div className="mt-[20px] ag-theme-quartz h-[calc(100vh-140px)]">
          <AgGridReact
            columnDefs={columns}
            rowData={signupRequests || []}
            loadingOverlayComponent={CustomLoadingOverlay}
            loadingOverlayComponentParams={{
              loadingMessage: "Loading signups...",
            }}
            noRowsOverlayComponent={OverlayNoRowsTemplate}
            noRowsOverlayComponentParams={{
              message: "No pending signups",
            }}
            loading={getSignupRequestsLoading}
            pagination={true}
            paginationPageSize={20}
            domLayout="normal"
            suppressRowClickSelection={true}
            tooltipShowDelay={0}
            tooltipHideDelay={2000}
            enableCellTextSelection
          />
        </div>
      </div>

      <SignupApprovalModal
        open={approvalModalOpen}
        onClose={() => {
          setApprovalModalOpen(false);
          setSelectedSignup(null);
        }}
        signup={selectedSignup}
        onApproved={() => {
          setApprovalModalOpen(false);
          setSelectedSignup(null);
          dispatch(fetchSignupRequests());
        }}
      />
    </div>
  );
};

export default SignupApprovals;
