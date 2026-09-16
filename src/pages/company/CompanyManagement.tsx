import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import { Icons } from "@/components/icons/icons";
import { Typography, IconButton, Tooltip, Switch } from "@mui/material";
import {
  getCompanyManagementList,
  getCompanyById,
  updateCompanyServerStatus,
  updateCompanyStatus,
} from "@/features/user/userSlice";
import { showToast } from "@/utills/toasterContext";
import CompanyEditModal from "./CompanyEditModal";

const CompanyManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    companyManagementList,
    getCompanyManagementListLoading,
    getCompanyDetailLoading,
    updateCompanyServerStatusLoading,
    updateCompanyStatusLoading,
  } = useAppSelector((state) => state.user);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  useEffect(() => {
    dispatch(getCompanyManagementList());
  }, [dispatch]);

  const handleEditCompany = async (companyId: string) => {
    try {
      setSelectedCompany(null);
      setEditModalOpen(true);

      const result = (await dispatch(
        getCompanyById({ company_id: companyId })
      )) as any;

      if (result.payload?.data?.success) {
        setSelectedCompany(result.payload.data.data);
      } else {
        console.error("API Error:", result.payload?.data?.message);
        showToast("Failed to fetch company details", "error");
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      showToast("Error fetching company details", "error");
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCompany(null);
  };

  const handleCompanyUpdated = () => {
    handleCloseEditModal();
    dispatch(getCompanyManagementList()); // Refresh the list
  };

  const handleToggleServer = async (companyId: string, current: string) => {
    const next = current === "ON" ? "OFF" : "ON";
    await dispatch(
      updateCompanyServerStatus({ comp_id: companyId, status: next })
    );
    dispatch(getCompanyManagementList());
  };

  const handleToggleStatus = async (companyId: string, current: string) => {
    const next = current === "A" ? "B" : "A";
    await dispatch(
      updateCompanyStatus({ comp_id: companyId, status: next as any })
    );
    dispatch(getCompanyManagementList());
  };

  const columns: ColDef[] = [
    {
      field: "company_name",
      headerName: "Company Name",
      minWidth: 290,
      maxWidth: 400,
      filter: true,
      flex: 1,
    },
    {
      field: "company_id",
      headerName: "Company ID",
      minWidth: 120,
      maxWidth: 150,
      filter: true,
    },
    {
      field: "company_pan_no",
      headerName: "PAN No",
      minWidth: 150,
      maxWidth: 200,
      filter: true,
    },
    {
      field: "company_status",
      headerName: "COM STATUS",
      minWidth: 140,
      maxWidth: 160,
      filter: true,
      cellRenderer: (params: any) => (
        <div className="flex items-center">
          <Switch
            size="small"
            checked={params.value === "A"}
            onChange={() =>
              handleToggleStatus(
                params.data.company_id,
                params.data.company_status
              )
            }
            disabled={updateCompanyStatusLoading}
            inputProps={{ "aria-label": "company-status" }}
          />
        </div>
      ),
    },
    {
      field: "company_server",
      headerName: "SERVER STATUS",
      minWidth: 160,
      maxWidth: 180,
      filter: true,
      cellRenderer: (params: any) => (
        <div className="flex items-center">
          <Switch
            size="small"
            checked={params.value === "ON"}
            onChange={() =>
              handleToggleServer(
                params.data.company_id,
                params.data.company_server
              )
            }
            disabled={updateCompanyServerStatusLoading}
            inputProps={{ "aria-label": "server-status" }}
          />
        </div>
      ),
    },
    {
      headerName: "Actions",
      field: "action",
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit Company">
            <IconButton
              color="primary"
              onClick={() => handleEditCompany(params.data.company_id)}
              size="small"
            >
              <Icons.edit fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
      sortable: false,
      filter: false,
      maxWidth: 100,
    },
  ];

  return (
    <div className="overflow-y-auto h-[calc(100vh-72px)]">
      <div className="rounded-sm p-[20px]">
        <Typography variant="h2" fontWeight={500} fontSize={20}>
          Company Management
        </Typography>

        <div className="mt-[20px] ag-theme-quartz h-[calc(100vh-140px)]">
          <AgGridReact
            columnDefs={columns}
            rowData={companyManagementList}
            loadingOverlayComponent={CustomLoadingOverlay}
            loadingOverlayComponentParams={{
              loadingMessage: "Loading companies...",
            }}
            noRowsOverlayComponent={OverlayNoRowsTemplate}
            noRowsOverlayComponentParams={{
              message: "No companies found",
            }}
            loading={getCompanyManagementListLoading}
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

      {/* Edit Company Modal */}
      <CompanyEditModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        company={selectedCompany}
        onCompanyUpdated={handleCompanyUpdated}
        loading={getCompanyDetailLoading}
      />
    </div>
  );
};

export default CompanyManagement;
