export type CreateHistoryType = {
  date: string;
  title: string;
  description: string;
  video_url: string;
  doc_url: string;
  created_by: string;
  created_date: string;
};

export type HistoryResponse = {
  success: boolean;
  message: string;
  data?: any;
  code?: number;
};

export type HistoryState = {
  createHistoryLoading: boolean;
  historyListLoading: boolean;
  historyList: HistoryItem[] | null;
  updateHistoryLoading: boolean;
  deleteHistoryLoading: boolean;
};

export type HistoryItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  video_url: string;
  doc_url: string;
  created_by: string;
  created_by_name?: string;
  created_date: string;
};




