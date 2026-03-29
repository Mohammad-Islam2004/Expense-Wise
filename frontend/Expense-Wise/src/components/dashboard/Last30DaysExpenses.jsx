import { useMemo } from 'react' // Import useMemo
import { prepareExpenseBarChartData } from '../../utils/helper'
import CustomBarChart from '../charts/CustomBarChart'

const Last30DaysExpenses = ({ data }) => {
  const chartData = useMemo(() => {
    return prepareExpenseBarChartData(data);
  }, [data]);

  return (
    <div className='card col-span-1'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Last 30 Days Expenses</h5>
      </div>

      <CustomBarChart data={chartData} dataKey="displayDate"/>
    </div>
  )
}

export default Last30DaysExpenses