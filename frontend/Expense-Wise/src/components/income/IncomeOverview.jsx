import React, { useMemo } from 'react' 
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from '../charts/CustomBarChart'
import { prepareIncomeBarChartData } from '../../utils/helper'

const IncomeOverview = ({ transactions, onAddIncome }) => {
  
  const chartData = useMemo(() => {
    return prepareIncomeBarChartData(transactions || []);
  }, [transactions]);

  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <div>
          <h5 className='text-lg'>Income Overview</h5>
          <p className='text-xs text-gray-400 mt-0.5'>
            Track your earnings over time and analyze your income trends.
          </p>
        </div>
        
        <button 
          className='add-btn' 
          onClick={() => onAddIncome && onAddIncome()}
        >
          <LuPlus className='text-lg' /> Add Income
        </button>
      </div>

      <div className='mt-10'>
        <CustomBarChart data={chartData} dataKey="displayDate" />
      </div>
    </div>
  )
}

export default IncomeOverview