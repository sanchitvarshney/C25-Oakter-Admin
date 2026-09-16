import { useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import { Icons } from "@/components/icons/icons";
import {
  getHistoryList,
  deleteHistory,
  updateHistory,
} from "@/features/history/historySlice";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import SharedDialog from "@/components/shared/SharedDialog";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SelectUser from "@/components/reusable/selectors/SelectUser";
import LoadingButton from "@mui/lab/LoadingButton";

// Define Zod schema for edit form
const editSchema = z.object({
  date: z.string().min(1, "Date is required"),
  title: z.string().min(1, "Title is required"),
  description: z.any(),
  video_url: z.string().optional(),
  doc_url: z.string().optional(),
  created_by: z.string().min(1, "Created by is required"),
});

type EditFormValues = z.infer<typeof editSchema>;

const ViewHistoryList = () => {
  const dispatch = useAppDispatch();
  const {
    historyList,
    historyListLoading,
    deleteHistoryLoading,
    updateHistoryLoading,
  } = useAppSelector((state) => state.history);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const {
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    control: editControl,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      date: "",
      title: "",
      description: "",
      video_url: "",
      doc_url: "",
      created_by: "",
    },
  });

  useEffect(() => {
    if (selectedHistory && editDialogOpen) {
      setEditValue(
        "date",
        selectedHistory.date
          ? new Date(selectedHistory.date).toISOString().split("T")[0]
          : ""
      );
      setEditValue("title", selectedHistory.title || "");
      setEditValue("description", selectedHistory.description || "");
      setEditValue("video_url", selectedHistory.videoUrl || "");
      setEditValue(
        "doc_url",
        selectedHistory.docUrl || selectedHistory.doc_url || ""
      );
      setEditValue("created_by", selectedHistory.createdBy || "");
    }
  }, [selectedHistory, editDialogOpen, setEditValue]);

  const handleEditClick = useCallback(
    (historyItem: any) => {
      setSelectedHistory(historyItem);
      setEditDialogOpen(true);
      if (historyItem.createdBy) {
        const user = historyList?.find(
          (u: any) => u.custID === historyItem.createdBy
        );
        setSelectedUser(user || null);
      }
    },
    [historyList]
  );

  const handleEditSubmitForm = (data: EditFormValues) => {
    if (!selectedHistory?.id) return;
    const payload: any = {
      date: data.date,
      title: data.title,
      description: data.description,
      videoUrl: data.video_url || "",
      docUrl: data.doc_url || "",
      createdBy: data.created_by,
    };

    dispatch(updateHistory({ id: selectedHistory.changelogId, payload })).then(
      (res: any) => {
        if (res.payload?.data?.success) {
          dispatch(getHistoryList());
          setEditDialogOpen(false);
          setSelectedHistory(null);
          setSelectedUser(null);
          resetEditForm();
        }
      }
    );
  };

  const handleDeleteClick = useCallback((id: string) => {
    setPendingDelete(id);
    setConfirmOpen(true);
  }, []);

  const columns: ColDef[] = useMemo(
    () => [
      {
        field: "date",
        headerName: "Date",
        filter: true,
        align: "center",
        cellRenderer: (params: any) => {
          if (!params.value) return "-";
          const date = new Date(params.value);
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
        flex: 1,
      },
      {
        field: "title",
        headerName: "Title",
        filter: true,
        flex: 1,
        cellRenderer: (params: any) => (
          <div className="py-[5px]">
            <span className="text-slate-700 font-medium">
              {params.value || "-"}
            </span>
          </div>
        ),
        autoHeight: true,
      },

      {
        field: "createdBy",
        headerName: "Created By",
        filter: true,
        flex: 1,
        cellRenderer: (params: any) => (
          <div className="py-[5px]">
            <span className="text-slate-700">
              {params.value || params.data?.createdBy || "-"}
            </span>
          </div>
        ),
      },

      {
        field: "createdAt",
        headerName: "Created Date",
        filter: true,
        flex: 1,
        cellRenderer: (params: any) => {
          if (!params.value) return "-";
          const date = new Date(params.value);
          return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },

      {
        headerName: "Actions",
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-2">
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEditClick(params.data)}
                  disabled={updateHistoryLoading}
                >
                  <Icons.edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(params.data.changelogId)}
                  disabled={deleteHistoryLoading}
                >
                  <Icons.delete fontSize="small" />
                </IconButton>
              </Tooltip>
         
            </div>
          );
        },
      },
    ],
    [
      handleEditClick,
      handleDeleteClick,
      updateHistoryLoading,
      deleteHistoryLoading,
    ]
  );

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    dispatch(deleteHistory(pendingDelete)).then((res: any) => {
      if (res.payload?.data?.success) {
        dispatch(getHistoryList());
      }
      setConfirmOpen(false);
      setPendingDelete(null);
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedHistory(null);
    setSelectedUser(null);
    resetEditForm();
  };

  useEffect(() => {
    dispatch(getHistoryList());
  }, [dispatch]);

  return (
    <div className="h-full">
      <div className="h-[50px] flex items-center gap-[20px] px-[10px] text-blue-600 border-b justify-between ">
        <div className="flex items-center gap-[20px]">
          <Link to={"/history"} className="flex items-center gap-[5px]">
            <Icons.add fontSize="small" />
            Add New Changelog
          </Link>
        </div>
      </div>
      <div className={"ag-theme-quartz h-[calc(100vh-130px)] "}>
        <AgGridReact
          rowHeight={60}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          loadingOverlayComponent={CustomLoadingOverlay}
          suppressCellFocus={true}
          loading={historyListLoading}
          rowData={historyList ? historyList : []}
          columnDefs={columns}
          pagination
          paginationPageSize={20}
        />
      </div>

      <SharedDialog
        open={confirmOpen}
        title={"Confirm Delete"}
        content={
          <div>
            Are you sure you want to delete this changelog entry? This action
            cannot be undone.
          </div>
        }
        loading={deleteHistoryLoading}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText={"Yes, delete"}
        cancelText="Cancel"
        color={pendingDelete ? "error" : "primary"}
      />

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Changelog</DialogTitle>
        <form onSubmit={handleEditSubmit(handleEditSubmitForm)}>
          <DialogContent>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="col-span-2">
                <Controller
                  name="title"
                  control={editControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Title"
                      variant="outlined"
                      error={!!editErrors.title}
                      helperText={editErrors.title?.message}
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              </div>

              <div className="col-span-2">
                <Controller
                  name="description"
                  control={editControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={6}
                      error={!!editErrors.description}
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              </div>

              <Controller
                name="video_url"
                control={editControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Video URL"
                    variant="outlined"
                    error={!!editErrors.video_url}
                    helperText={editErrors.video_url?.message}
                    fullWidth
                    margin="normal"
                    placeholder="https://example.com/video.mp4"
                  />
                )}
              />

              <Controller
                name="doc_url"
                control={editControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Document URL"
                    variant="outlined"
                    error={!!editErrors.doc_url}
                    helperText={editErrors.doc_url?.message}
                    fullWidth
                    margin="normal"
                    placeholder="https://example.com/document.pdf"
                  />
                )}
              />

              <Controller
                name="date"
                control={editControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date"
                    type="date"
                    variant="outlined"
                    error={!!editErrors.date}
                    helperText={editErrors.date?.message}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />

              <div className="col-span-1 mt-4">
                <SelectUser
                  value={selectedUser}
                  onChange={(value: any) => {
                    setSelectedUser(value);
                    if (value) {
                      setEditValue("created_by", value.custID);
                    } else {
                      setEditValue("created_by", "");
                    }
                  }}
                  label="Created By"
                  varient="outlined"
                  error={!!editErrors.created_by}
                  helperText={editErrors.created_by?.message}
                  required
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseEditDialog}
              disabled={updateHistoryLoading}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              loading={updateHistoryLoading}
              variant="contained"
              startIcon={<Icons.save fontSize="small" />}
            >
              Update
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ViewHistoryList;
