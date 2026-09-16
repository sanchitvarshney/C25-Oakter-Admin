import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import Avatar from "@mui/material/Avatar";
import { Icons } from "@/components/icons/icons";
import { Switch } from "@/components/ui/switch";
import SharedDialog from "@/components/shared/SharedDialog";
import { useEffect, useState } from "react";
import {
  updateCompanyUserStatus,
  fetchCompanyUsers,
} from "@/features/user/userSlice";
import { showToast } from "@/utills/toasterContext";

const ViewUser = () => {
  const dispatch = useAppDispatch();
  const { companyUsers, getCompanyUsersLoading, loading } = useAppSelector(
    (state) => state.user
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{
    row: any;
    nextStatus: "0" | "1";
  } | null>(null);

  const columns: ColDef[] = [
    {
      field: "username",
      headerName: "Name",
      minWidth: 200,
      maxWidth: 400,
      filter: true,
      cellRenderer: (params: any) => (
          <div className="flex items-center gap-[10px] py-[5px] max-w-max ">
          <Avatar src={"https://material-ui.com/static/images/avatar/1.jpg"} />
          <Link
            to={`/user/view-user/${params?.data?.custID}`}
            className="text-blue-600 flex items-center gap-[5px]"
          >
            {params.value}
            <Icons.followLink fontSize="small" sx={{ fontSize: "15px" }} />
          </Link>
        </div>
      ),
      autoHeight: true,
      flex: 1,
    },
    {
      field: "custID",
      headerName: "Customer ID",
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
      filter: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      maxWidth: 400,
      filter: true,
    },
    {
      field: "mobile",
      headerName: "Mobile No.",
      filter: true,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      maxWidth: 180,
      filter: true,
      cellRenderer: (params: any) => {
        const isActive = params.value === "1";
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              disabled={loading}
              onCheckedChange={(checked) => {
                setPendingToggle({
                  row: params.data,
                  nextStatus: checked ? "1" : "0",
                });
                setConfirmOpen(true);
              }}
              aria-label="Toggle user status"
            />
            <span
              className={`text-xs ${
                isActive ? "text-green-700" : "text-red-700"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
  ];

  const handleConfirmUpdate = () => {
    if (!pendingToggle) return;
    const { row, nextStatus } = pendingToggle;
    const payload = {
      userID: row.custID,
      status: nextStatus,
    };
    dispatch(updateCompanyUserStatus(payload)).then((res: any) => {
      const code = res?.payload?.data?.success;
      if (code) {
        showToast(
          res?.payload?.data?.message || "User status updated",
          "success"
        );
        dispatch(fetchCompanyUsers());
      }
      setConfirmOpen(false);
      setPendingToggle(null);
    });
  };

  useEffect(() => {
    dispatch(fetchCompanyUsers());
  }, []);

  return (
    <div className="h-full">
      <div className="h-[50px] flex items-center gap-[20px] px-[10px] text-blue-600 border-b justify-between ">
        <div className="flex items-center gap-[20px]">
          <Link to={"/user/add-user"} className="flex items-center gap-[5px]">
            <Icons.add fontSize="small" />
            Add new user
          </Link>
        </div>
        {/* <div className="flex items-center gap-[15px]">
          <CompanySearch />
        </div> */}
      </div>
      <div className={"ag-theme-quartz h-[calc(100vh-130px)] "}>
        <AgGridReact
          rowHeight={60}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          loadingOverlayComponent={CustomLoadingOverlay}
          suppressCellFocus={true}
          loading={getCompanyUsersLoading}
          rowData={companyUsers ? companyUsers : []}
          columnDefs={columns}
          pagination
          paginationPageSize={20}
        />
      </div>

      <SharedDialog
        open={confirmOpen}
        title="Confirm status change"
        content={
          pendingToggle ? (
            <div>
              Are you sure you want to set this user as{" "}
              <span className="font-semibold">
                {pendingToggle.nextStatus === "1" ? "Active" : "Inactive"}
              </span>
              ?
            </div>
          ) : null
        }
        loading={loading}
        onClose={() => {
          setConfirmOpen(false);
          setPendingToggle(null);
        }}
        onConfirm={handleConfirmUpdate}
        confirmText="Yes, update"
        cancelText="Cancel"
        color="primary"
      />
    </div>
  );
};

export default ViewUser;
