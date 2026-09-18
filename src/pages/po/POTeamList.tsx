import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import { Typography, IconButton, Tooltip, Button, Chip } from "@mui/material";
import { Icons } from "@/components/icons/icons";
import {
  fetchPOTeamMembers,
  deletePOTeamMember,
  searchUsers,
  searchCostCenters,
  addPOTeamMember,
  fetchAllCostCenters,
} from "@/features/user/userSlice";
import { showToast } from "@/utills/toasterContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const POTeamList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    poTeamMembers,
    getPOTeamLoading,
    deletePOTeamLoading,
    users,
    getUsersLoading,
    costCenters,
    getCostCentersLoading,
    addPOTeamLoading,
    getAllCostCentersLoading,
  } = useAppSelector((s) => s.user);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leader_id: "",
    member_id: "",
  });
    const [costCenterSelections, setCostCenterSelections] = useState<
    { id: string; text: string }[]
  >([]);
  const [leaderSearch, setLeaderSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [costCenterSearch, setCostCenterSearch] = useState("");
  const [showLeaderList, setShowLeaderList] = useState(false);
  const [showMemberList, setShowMemberList] = useState(false);
  const [showCostCenterList, setShowCostCenterList] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    leaderId: "",
    memberId: "",
    costCenter: "",
  });

  useEffect(() => {
    dispatch(fetchPOTeamMembers());
  }, [dispatch]);

  const handleSearchUsers = (searchTerm: string, type: "leader" | "member") => {
    if (searchTerm.length >= 2) {
      dispatch(searchUsers(searchTerm));
      if (type === "leader") setShowLeaderList(true);
      if (type === "member") setShowMemberList(true);
    } else {
      if (type === "leader") setShowLeaderList(false);
      if (type === "member") setShowMemberList(false);
    }
  };

  const handleSearchCostCenters = (searchTerm: string) => {
    if (searchTerm.length >= 2) {
      dispatch(searchCostCenters(searchTerm));
    }
    setShowCostCenterList(true);
  };

  const handleSelectAllCostCenters = async () => {
    try {
      const res = await dispatch(fetchAllCostCenters()).unwrap();
      if (res.data.success) {
        setCostCenterSelections(res.data.data);
      }
    } finally {
      setCostCenterSearch("");
      setShowCostCenterList(false);
    }
  };

  const handleAddMember = async () => {
    if (!formData.leader_id || !formData.member_id ||  costCenterSelections.length === 0) {
      showToast("Please fill all fields", "error");
      return;
    }

    await dispatch( addPOTeamMember({
        ...formData,
        cost_center: costCenterSelections.map((c) => c.id),
      }));
    setAddModalOpen(false);
    setFormData({ leader_id: "", member_id: "" });
        setCostCenterSelections([]);
    setLeaderSearch("");
    setMemberSearch("");
    setCostCenterSearch("");
    setShowLeaderList(false);
    setShowMemberList(false);
    setShowCostCenterList(false);
    dispatch(fetchPOTeamMembers());
  };

  const handleDeleteMember = (
    leaderId: string,
    memberId: string,
    costCenter: string,
  ) => {
    setDeleteConfirm({ open: true, leaderId, memberId, costCenter });
  };

  const confirmDelete = async () => {
    const { leaderId, memberId, costCenter } = deleteConfirm;
    await dispatch(
      deletePOTeamMember({
        leader_id: leaderId,
        member_id: memberId,
        cost_center: costCenter,
      }),
    ).then((res) => {
      console.log(res);
    });
    setDeleteConfirm({
      open: false,
      leaderId: "",
      memberId: "",
      costCenter: "",
    });
    dispatch(fetchPOTeamMembers());
  };

  const cancelDelete = () =>
    setDeleteConfirm({
      open: false,
      leaderId: "",
      memberId: "",
      costCenter: "",
    });

  const columns: ColDef[] = [
    {
      field: "leader_name",
      headerName: "Leader Name",
      minWidth: 200,
      flex: 1,
      filter: true,
    },
    {
      field: "member_name",
      headerName: "Member Name",
      minWidth: 200,
      flex: 1,
      filter: true,
    },
    {
      field: "cost_center_name",
      headerName: "Cost Center",
      minWidth: 200,
      flex: 1,
      filter: true,
    },
    {
      field: "cost_center_short_name",
      headerName: "Cost Center Code",
      minWidth: 150,
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
              onClick={() =>
                handleDeleteMember(
                  params.data.leader_id,
                  params.data.member_id,
                  params.data.cost_center,
                )
              }
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
            PO Team List
          </Typography>
          <Button
            variant="contained"
            onClick={() => setAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Icons.add className="mr-2" />
            Add Member
          </Button>
        </div>

        <div className="ag-theme-quartz h-[calc(100vh-140px)]">
          <AgGridReact
            columnDefs={columns}
            rowData={poTeamMembers || []}
            loadingOverlayComponent={CustomLoadingOverlay}
            loadingOverlayComponentParams={{
              loadingMessage: "Loading PO team members...",
            }}
            noRowsOverlayComponent={OverlayNoRowsTemplate}
            noRowsOverlayComponentParams={{
              message: "No PO team members found",
            }}
            loading={getPOTeamLoading}
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

      {/* Add Member Modal */}
      <Dialog open={addModalOpen} onOpenChange={() => setAddModalOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add PO Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leader">SELECT LEADER</Label>
              <div className="relative">
                <Input
                  id="leader"
                  placeholder="SELECT LEADER"
                  value={leaderSearch}
                  onChange={(e) => {
                    setLeaderSearch(e.target.value);
                    handleSearchUsers(e.target.value, "leader");
                  }}
                />
                {getUsersLoading && (
                  <div className="absolute right-2 top-2">
                    <Icons.refresh className="animate-spin h-4 w-4" />
                  </div>
                )}
                {showLeaderList &&
                  users &&
                  users.length > 0 &&
                  leaderSearch && (
                    <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData({ ...formData, leader_id: user.id });
                            setLeaderSearch(user.text);
                            setShowLeaderList(false);
                          }}
                        >
                          {user.text}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="member">SELECT MEMBER</Label>
              <div className="relative">
                <Input
                  id="member"
                  placeholder="SELECT MEMBER"
                  value={memberSearch}
                  onChange={(e) => {
                    setMemberSearch(e.target.value);
                    handleSearchUsers(e.target.value, "member");
                  }}
                />
                {getUsersLoading && (
                  <div className="absolute right-2 top-2">
                    <Icons.refresh className="animate-spin h-4 w-4" />
                  </div>
                )}
                {showMemberList &&
                  users &&
                  users.length > 0 &&
                  memberSearch && (
                    <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData({ ...formData, member_id: user.id });
                            setMemberSearch(user.text);
                            setShowMemberList(false);
                          }}
                        >
                          {user.text}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="costCenter">SELECT COST CENTER</Label>
                 {costCenterSelections.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {costCenterSelections.map((cc) => (
                    <Chip
                      key={cc.id}
                      label={cc.text}
                      size="small"
                      onDelete={() =>
                        setCostCenterSelections((prev) =>
                          prev.filter((c) => c.id !== cc.id)
                        )
                      }
                    />
                  ))}
                </div>
              )}
              <div className="relative">
                <Input
                  id="costCenter"
                 placeholder="Search and add cost centers"
                  value={costCenterSearch}
                  onFocus={() => setShowCostCenterList(true)}
                  onChange={(e) => {
                    setCostCenterSearch(e.target.value);
                    handleSearchCostCenters(e.target.value);
                  }}
                />
                {(getCostCentersLoading || getAllCostCentersLoading) && (
                  <div className="absolute right-2 top-2">
                    <Icons.refresh className="animate-spin h-4 w-4" />
                  </div>
                )}
                {showCostCenterList && (
                  <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer font-medium text-blue-600 border-b"
                      onClick={handleSelectAllCostCenters}
                    >
                      All Cost Centers
                    </div>
                    {costCenters &&
                      costCenters.length > 0 &&
                      costCenterSearch &&
                      costCenters.map((costCenter) => (
                        <div
                          key={costCenter.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                         onClick={() => {
                            setCostCenterSelections((prev) => {
                              if (prev.some((c) => c.id === costCenter.id)) {
                                return prev;
                              }
                              return [
                                ...prev,
                                { id: costCenter.id, text: costCenter.text },
                              ];
                            });
                            setCostCenterSearch("");
                            setShowCostCenterList(false);
                          }}
                        >
                          {costCenter.text}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => {
                  setAddModalOpen(false);
                  setFormData({
                    leader_id: "",
                    member_id: "",
                  
                  });
                       setCostCenterSelections([]);
                  setLeaderSearch("");
                  setMemberSearch("");
                  setCostCenterSearch("");
                  setShowLeaderList(false);
                  setShowMemberList(false);
                  setShowCostCenterList(false);
                }}
              >
                RESET
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={addPOTeamLoading}
                className=" hover:bg-green-400 text-white"
              >
                {addPOTeamLoading ? (
                  <span className="flex items-center">
                    <Icons.refresh className="animate-spin h-4 w-4 mr-2" />
                    SAVING...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Icons.save className="h-4 w-4 mr-2" />
                    SAVE
                  </span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirm.open} onOpenChange={cancelDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to remove this team member from PO team?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outlined" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={confirmDelete}
                disabled={deletePOTeamLoading}
              >
                {deletePOTeamLoading ? (
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

export default POTeamList;
