import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import { Typography, IconButton, Tooltip, Chip, Button } from "@mui/material";
import { Icons } from "@/components/icons/icons";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  getDownloadFileStatus,
  deleteDownloadFileRequest,
} from "@/features/history/historySlice";
import { showToast } from "@/utills/toasterContext";

const DownloadFileStatus: React.FC = () => {
  const dispatch = useAppDispatch();
  const { statusList, statusListLoading, deleteFileRequestLoading } =
    useAppSelector((s) => s.history);
const [deleteConfirm, setDeleteConfirm] = React.useState<{
    open: boolean;
    key: string;
  }>({
    open: false,
    key: "",
  });

    useEffect(() => {
      dispatch(getDownloadFileStatus())
        .then((res: any) => {
          if (res?.payload?.data?.success) {
            showToast(
              res?.payload?.data?.message || "Status fetched",
              "success",
            );
          } else {
            showToast(res?.payload?.data?.message || "Failed", "error");
          }
        })
        .catch((e) => {
          showToast(e?.message || "Failed", "error");
        });
    }, [dispatch]);

  //   const handleSearchUsers = (searchTerm: string, type: "leader" | "member") => {
  //     if (searchTerm.length >= 2) {
  //       dispatch(searchUsers(searchTerm));
  //       if (type === "leader") setShowLeaderList(true);
  //       if (type === "member") setShowMemberList(true);
  //     } else {
  //       if (type === "leader") setShowLeaderList(false);
  //       if (type === "member") setShowMemberList(false);
  //     }
  //   };

  //   const handleSearchCostCenters = (searchTerm: string) => {
  //     if (searchTerm.length >= 2) {
  //       dispatch(searchCostCenters(searchTerm));
  //       setShowCostCenterList(true);
  //     } else {
  //       setShowCostCenterList(false);
  //     }
  //   };

    const handleDelete = (key: string) => {
      setDeleteConfirm({ open: true, key });
    };

    const confirmDelete = async () => {
      await dispatch(deleteDownloadFileRequest(deleteConfirm.key));
      setDeleteConfirm({ open: false, key: "" });
      dispatch(getDownloadFileStatus());
    };

    const cancelDelete = () => setDeleteConfirm({ open: false, key: "" });

  const columns: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 100,
      flex: 1,
      filter: true,
      valueGetter: (params: any) => params.node.rowIndex + 1,
    },
    {
      field: "module",
      headerName: "Module Name",
      minWidth: 200,
      flex: 1,
      filter: true,
    },
    {
      field: "txt",
      headerName: "File",
      minWidth: 200,
      flex: 1,
      filter: true,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      flex: 1,
      filter: true,
      cellRenderer: (params: any) =>
        params.value === "complete" ? (
          <Chip label="Complete" color="success" size="small" />
        ) : params.value === "pending" ? (
          <Chip label="Pending" color="warning" size="small" />
        ) : (
          <Chip label="Incomplete" color="error" size="small" />
        ),
    },
    {
      field: "userName",
      headerName: "Downloaded By",
      minWidth: 200,
      flex: 1,
      filter: true,
    },
    {
      headerName: "Actions",
      field: "action",
      maxWidth: 100,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete(params.data.id)}
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
      <div className="rounded-sm px-[20px] pt-[15px]">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h2" fontWeight={500} fontSize={20}>
            File Download Status
          </Typography>
        </div>

        <div className="ag-theme-quartz h-[calc(100vh-140px)]">
          <AgGridReact
            columnDefs={columns}
            rowData={statusList || []}
            loadingOverlayComponent={CustomLoadingOverlay}
            loadingOverlayComponentParams={{
              loadingMessage: "Loading PO team members...",
            }}
            noRowsOverlayComponent={OverlayNoRowsTemplate}
            noRowsOverlayComponentParams={{
              message: "No PO team members found",
            }}
            loading={statusListLoading}
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

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirm.open} onOpenChange={cancelDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to remove this file from the download list?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outlined" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={confirmDelete}
                disabled={deleteFileRequestLoading}
              >
                {deleteFileRequestLoading ? (
                  <span className="flex items-center">
                    <Icons.refresh className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DownloadFileStatus;
