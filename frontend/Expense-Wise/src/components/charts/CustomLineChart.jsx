import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts'

const CustomLineChart = ({data, dataKey='displayDate'}) => {

  const CustomTooltip = ({ active, payload }) => {
    if(active && payload && payload.length){
      return(
        <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
          <p className='text-xs font-semibold text-purple-800 mb-1'> {payload[0].payload.category} </p>
          <p className='text-sm text-gray-600'>
            Amount: <span className='text-sm font-medium text-gray-900'>₹ {payload[0].payload.amount}</span>
          </p>
        </div>
      )
    }
    return null
  }


  return (
    <div className='bg-white mt-6'>
      <ResponsiveContainer width="100%" height={380} debounce={1}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id='incomeGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#875cf5' stopOpacity={0.3}/>
              <stop offset='95%' stopColor='#875cf5' stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
          <XAxis dataKey={dataKey} 
            tick={{ fontSize: 12, fill: "#888" }} 
            axisLine={false} 
            tickLine={false} 
            padding={{ left: 10, right: 10 }}/>
          <YAxis tick={{ fontSize: 12, fill: "#888" }} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
            />
          <Tooltip content={CustomTooltip}/>
          <Area
          type='monotone' // Smooth curve
            dataKey='amount'
            stroke='#875cf5'
            strokeWidth={3}
            fill='url(#incomeGradient)'
            isAnimationActive={false}
            dot={{ r: 4, fill: "#875cf5", strokeWidth: 2, stroke: "#fff" }} // "Hollow" dot look
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomLineChart