import React, { useMemo } from "react" // 1. Import useMemo
import CustomPieChart from "../charts/CustomPieChart"

const COLORS = ["#875cf5", "#fa2c37", "#ff6908", "#4139f6"]

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  
  // 2. Replace useState and useEffect with useMemo
  const chartData = useMemo(() => {
    if (!data) return [];
    
    return data.map((item) => ({
      name: item?.source,
      amount: item?.amount,
    }));
  }, [data]); // Only re-calculates if the 'data' prop changes

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label='Total Income'
        totalAmount={`₹ ${totalIncome}`}
        showTextAnchor
        color={COLORS}
      />
    </div>
  )
}

export default RecentIncomeWithChart