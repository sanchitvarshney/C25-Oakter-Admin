import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/spigenDashApi";

export type MasterCounts = {
  totalComponents: number;
  lastComponent: string;
  totalProducts: number;
  lastProduct: string;
  totalProjects: number;
  lastProject: string;
  totalVendors: number;
  lastVendor: string;
};

export type TransactionsCounts = {
  totalRejection: string;
  lastRejection: string;
  totalConsumption: string;
  lastConsumption: string;
  totalJWchallan: string;
  lastJWchallan: string;
  totalPO: string;
  lastPO: string;
  totalJW_PO: string;
  lastJW_PO: string;
  totalMFG: string;
  lastMFG: string;
  totalFGin: string;
  lastFGin: string;
  totalFGout: string;
  lastFGout: string;
};

export type GPCounts = {
  totalRGP: string;
  lastRGP: string;
  totalNRGP: string;
  lastNRGP: string;
  totalRGP_DCchallan: string;
  lastDCchallan: string;
  totalGatePass: string;
};

export type MINCounts = {
  totalMIN: string;
  lastMin: string;
  totalPOMin: string;
  lastPOMin: string;
  totalJWMin: string;
  lastJWMin: string;
  totalNormalMIN: string;
  lastNormalMin: string;
};

export type PendingCounts = {
  pendingPO: string;
  pendingJW_PO: string;
  pendingPPR: string;
  pendingFG: string;
  pendingMRapproval: string;
};

export type TopProduct = {
  productSku: string;
  totalmfgQuantity: number;
  productName: string;
};

export type TopMfgProducts = {
  topProducts: TopProduct[];
};

export interface ImsDashboardState {
  master: MasterCounts | null;
  transactions: TransactionsCounts | null;
  gp: GPCounts | null;
  min: MINCounts | null;
  pending: PendingCounts | null;
  topMfg: TopMfgProducts | null;
  loading: boolean;
  error: string | null;
}

const initialState: ImsDashboardState = {
  master: null,
  transactions: null,
  gp: null,
  min: null,
  pending: null,
  topMfg: null,
  loading: false,
  error: null,
};

const DATE_RANGE_PAYLOAD = { data: "22-05-2025-19-08-2025" };

export const fetchImsDashboardData = createAsyncThunk(
  "imsDashboard/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [masterRes, transactionsRes, gpRes, minRes, pendingRes, topMfgRes] =
        await Promise.all([
          // Master counts (date range not applied as per note)
          axiosInstance.post("/tranCount/master_counts", {}),
          // Transactions and other counts (3 months payload)
          axiosInstance.post(
            "/tranCount/transaction_counts/transaction",
            DATE_RANGE_PAYLOAD
          ),
          axiosInstance.post(
            "/tranCount/transaction_counts/GP",
            DATE_RANGE_PAYLOAD
          ),
          axiosInstance.post(
            "/tranCount/transaction_counts/MIN",
            DATE_RANGE_PAYLOAD
          ),
          axiosInstance.post("/tranCount/pending_counts", DATE_RANGE_PAYLOAD),
          axiosInstance.post("/tranCount/top_mfg_products", DATE_RANGE_PAYLOAD),
        ]);

      return {
        master: masterRes.data?.data as MasterCounts,
        transactions: transactionsRes.data?.data as TransactionsCounts,
        gp: gpRes.data?.data as GPCounts,
        min: minRes.data?.data as MINCounts,
        pending: pendingRes.data?.data as PendingCounts,
        topMfg: topMfgRes.data?.data as TopMfgProducts,
      };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch IMS dashboard data"
      );
    }
  }
);

const imsDashboardSlice = createSlice({
  name: "imsDashboard",
  initialState,
  reducers: {
    clearImsDashboard: (state) => {
      state.master = null;
      state.transactions = null;
      state.gp = null;
      state.min = null;
      state.pending = null;
      state.topMfg = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImsDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImsDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.master = action.payload.master;
        state.transactions = action.payload.transactions;
        state.gp = action.payload.gp;
        state.min = action.payload.min;
        state.pending = action.payload.pending;
        state.topMfg = action.payload.topMfg;
      })
      .addCase(fetchImsDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearImsDashboard } = imsDashboardSlice.actions;
export default imsDashboardSlice.reducer;

