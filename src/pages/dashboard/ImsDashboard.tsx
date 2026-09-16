import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { fetchImsDashboardData } from "@/features/dashboard/imsDashboardSlice";
import DashboardSkeleton from "@/components/reusable/DashboardSkeleton";
import { RootState } from "@/features/store";

const StatCard = ({
  title,
  value,
  sublabel,
}: {
  title: string;
  value: string | number;
  sublabel?: string;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {sublabel && <p className="text-xs text-gray-500 mt-1">{sublabel}</p>}
        </div>
      </div>
    </div>
  );
};

const ImsDashboard = () => {
  const dispatch = useAppDispatch();
  const ims = useAppSelector((s: RootState) => s.imsDashboard);

  useEffect(() => {
    dispatch(fetchImsDashboardData());
  }, [dispatch]);

  const topProducts = useMemo(
    () => ims.topMfg?.topProducts ?? [],
    [ims.topMfg]
  );

  if (ims.loading) return <DashboardSkeleton />;
  if (ims.error)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-2">⚠️</div>
          <div className="text-lg text-gray-700">{ims.error}</div>
          <button
            onClick={() => dispatch(fetchImsDashboardData())}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                IMS Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Inventory & Manufacturing Overview (Last 3 Months)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {/* Master counts */}
        {ims.master && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Master</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Components"
                value={ims.master.totalComponents}
                sublabel={`Last: ${ims.master.lastComponent}`}
              />
              <StatCard
                title="Products"
                value={ims.master.totalProducts}
                sublabel={`Last: ${ims.master.lastProduct}`}
              />
              <StatCard
                title="Projects"
                value={ims.master.totalProjects}
                sublabel={`Last: ${ims.master.lastProject}`}
              />
              <StatCard
                title="Vendors"
                value={ims.master.totalVendors}
                sublabel={`Last: ${ims.master.lastVendor}`}
              />
            </div>
          </div>
        )}

        {/* Transactions */}
        {ims.transactions && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Transactions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Rejection"
                value={ims.transactions.totalRejection}
                sublabel={`Last: ${ims.transactions.lastRejection}`}
              />
              <StatCard
                title="Consumption"
                value={ims.transactions.totalConsumption}
                sublabel={`Last: ${ims.transactions.lastConsumption}`}
              />
              <StatCard
                title="JW Challan"
                value={ims.transactions.totalJWchallan}
                sublabel={`Last: ${ims.transactions.lastJWchallan}`}
              />
              <StatCard
                title="PO"
                value={ims.transactions.totalPO}
                sublabel={`Last: ${ims.transactions.lastPO}`}
              />
              <StatCard
                title="JW PO"
                value={ims.transactions.totalJW_PO}
                sublabel={`Last: ${ims.transactions.lastJW_PO}`}
              />
              <StatCard
                title="MFG"
                value={ims.transactions.totalMFG}
                sublabel={`Last: ${ims.transactions.lastMFG}`}
              />
              <StatCard
                title="FG In"
                value={ims.transactions.totalFGin}
                sublabel={`Last: ${ims.transactions.lastFGin}`}
              />
              <StatCard
                title="FG Out"
                value={ims.transactions.totalFGout}
                sublabel={`Last: ${ims.transactions.lastFGout}`}
              />
            </div>
          </div>
        )}

        {/* Gate Pass */}
        {ims.gp && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Gate Pass
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="RGP"
                value={ims.gp.totalRGP}
                sublabel={`Last: ${ims.gp.lastRGP}`}
              />
              <StatCard
                title="NRGP"
                value={ims.gp.totalNRGP}
                sublabel={`Last: ${ims.gp.lastNRGP}`}
              />
              <StatCard
                title="RGP DC Challan"
                value={ims.gp.totalRGP_DCchallan}
                sublabel={`Last: ${ims.gp.lastDCchallan}`}
              />
              <StatCard title="Gate Pass" value={ims.gp.totalGatePass} />
            </div>
          </div>
        )}

        {/* MIN */}
        {ims.min && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">MIN</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard
                title="Total MIN"
                value={ims.min.totalMIN}
                sublabel={`Last: ${ims.min.lastMin}`}
              />
              <StatCard
                title="PO MIN"
                value={ims.min.totalPOMin}
                sublabel={`Last: ${ims.min.lastPOMin}`}
              />
              <StatCard
                title="JW MIN"
                value={ims.min.totalJWMin}
                sublabel={`Last: ${ims.min.lastJWMin}`}
              />
              <StatCard
                title="Normal MIN"
                value={ims.min.totalNormalMIN}
                sublabel={`Last: ${ims.min.lastNormalMin}`}
              />
            </div>
          </div>
        )}

        {/* Pending */}
        {ims.pending && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Pending
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard title="PO" value={ims.pending.pendingPO} />
              <StatCard title="JW PO" value={ims.pending.pendingJW_PO} />
              <StatCard title="PPR" value={ims.pending.pendingPPR} />
              <StatCard title="FG" value={ims.pending.pendingFG} />
              <StatCard
                title="MR Approval"
                value={ims.pending.pendingMRapproval}
              />
            </div>
          </div>
        )}

        {/* Top MFG Products */}
        {topProducts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Top MFG Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topProducts.map((p) => (
                <div
                  key={p.productSku}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="text-sm text-gray-500">{p.productSku}</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {p.productName}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mt-2">
                    {p.totalmfgQuantity.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImsDashboard;
