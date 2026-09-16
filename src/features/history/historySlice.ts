import axiosInstance from "@/api/spigenDashApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { CreateHistoryType, HistoryResponse } from "./historyType";
import { showToast } from "@/utills/toasterContext";

const initialState: any = {
  createHistoryLoading: false,
  historyListLoading: false,
  historyList: null,
  updateHistoryLoading: false,
  deleteHistoryLoading: false,
  userListLoading: false,
  userListData: [],
  statusListLoading: false,
  statusList: [],
  deleteFileRequestLoading: false,
};

export const createHistory = createAsyncThunk<
  AxiosResponse<HistoryResponse>,
  CreateHistoryType
>("history/createHistory", async (payload) => {
  const response = await axiosInstance.post("/changelog/add", payload);
  return response;
});
export const getDownloadFileStatus = createAsyncThunk<
  AxiosResponse<HistoryResponse>
>("history/status/file", async () => {
  const response = await axiosInstance.get("/admin/fetch-user-file-requests");
  return response;
});

export const deleteDownloadFileRequest = createAsyncThunk<
  AxiosResponse<HistoryResponse>,
  string
>("history/status/file/delete", async (id) => {
  const response = await axiosInstance.delete(
    `/admin/delete-user-file-request/${id}`,
  );
  return response;
});

export const getHistoryList = createAsyncThunk<
  AxiosResponse<HistoryResponse>,
  void
>("history/fetch", async () => {
  const response = await axiosInstance.get("/changelog/fetch");
  return response;
});

export const userList = createAsyncThunk<AxiosResponse<any>, void>(
  "history/userList",
  async () => {
    const response = await axiosInstance.get(
      `/org/user/list?type=developer&status=1`,
    );
    return response;
  },
);

export const updateHistory = createAsyncThunk<
  AxiosResponse<HistoryResponse>,
  { id: string; payload: any }
>("history/updateHistory", async ({ id, payload }) => {
  const response = await axiosInstance.put(
    `/changelog/edit/${id}?status=${payload.status}`,
    payload,
  );
  return response;
});

export const deleteHistory = createAsyncThunk<
  AxiosResponse<HistoryResponse>,
  string
>("history/deleteHistory", async (id) => {
  const response = await axiosInstance.delete(`/changelog/delete/${id}`);
  return response;
});

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create History
    builder
      .addCase(createHistory.pending, (state) => {
        state.createHistoryLoading = true;
      })
      .addCase(createHistory.fulfilled, (state, action) => {
        state.createHistoryLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload.data.message || "History created successfully",
            "success",
          );
        } else {
          showToast(
            action.payload.data.message || "Failed to create history",
            "error",
          );
        }
      })
      .addCase(createHistory.rejected, (state) => {
        state.createHistoryLoading = false;
      });

    // Get History List
    builder
      .addCase(getHistoryList.pending, (state) => {
        state.historyListLoading = true;
      })
      .addCase(getHistoryList.fulfilled, (state, action) => {
        state.historyListLoading = false;
        if (action.payload.data.success) {
          state.historyList = action.payload.data.data || [];
        }
      })
      .addCase(getHistoryList.rejected, (state) => {
        state.historyListLoading = false;
      });
    builder
      .addCase(getDownloadFileStatus.pending, (state) => {
        state.statusListLoading = true;
      })
      .addCase(getDownloadFileStatus.fulfilled, (state, action) => {
        state.statusListLoading = false;
        if (action.payload.data.success) {
          state.statusList = action.payload.data.data || [];
        }
      })
      .addCase(getDownloadFileStatus.rejected, (state) => {
        state.statusListLoading = false;
      });

    // Delete Download File Request
    builder
      .addCase(deleteDownloadFileRequest.pending, (state) => {
        state.deleteFileRequestLoading = true;
      })
      .addCase(deleteDownloadFileRequest.fulfilled, (state, action) => {
        state.deleteFileRequestLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload.data.message || "File deleted successfully",
            "success",
          );
        } else {
          showToast(action.payload.data.message || "Failed to delete file", "error");
        }
      })
      .addCase(deleteDownloadFileRequest.rejected, (state) => {
        state.deleteFileRequestLoading = false;
      });

    // Update History
    builder
      .addCase(updateHistory.pending, (state) => {
        state.updateHistoryLoading = true;
      })
      .addCase(updateHistory.fulfilled, (state, action) => {
        state.updateHistoryLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload.data.message || "History updated successfully",
            "success",
          );
        } else {
          showToast(
            action.payload.data.message || "Failed to update history",
            "error",
          );
        }
      })
      .addCase(updateHistory.rejected, (state) => {
        state.updateHistoryLoading = false;
      });

    // Delete History
    builder
      .addCase(deleteHistory.pending, (state) => {
        state.deleteHistoryLoading = true;
      })
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.deleteHistoryLoading = false;
        if (action.payload.data.success) {
          showToast(
            action.payload.data.message || "History deleted successfully",
            "success",
          );
        } else {
          showToast(
            action.payload.data.message || "Failed to delete history",
            "error",
          );
        }
      })
      .addCase(deleteHistory.rejected, (state) => {
        state.deleteHistoryLoading = false;
      });

    builder
      .addCase(userList.pending, (state) => {
        state.userListLoading = true;
      })
      .addCase(userList.fulfilled, (state, action) => {
        state.userListLoading = false;
        state.userListData = action.payload.data.data || [];
      })
      .addCase(userList.rejected, (state) => {
        state.updateHistoryLoading = false;
      });
  },
});

export default historySlice.reducer;
