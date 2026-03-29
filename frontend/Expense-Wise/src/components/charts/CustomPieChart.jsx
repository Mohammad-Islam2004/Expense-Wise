import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import CustomTooltip from './CustomTooltip'
import CustomLegend from './CustomLegend'

const CustomPieChart = ({ data, label, totalAmount, color, showTextAnchor }) => {
  return (
    <div style={{ width: '100%', minHeight: '400px' }}>
    <ResponsiveContainer width="100%" height={380} debounce={1}>
      <PieChart>
        <Pie
        data={data}
        isAnimationActive={false}
        dataKey="amount"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={130}
        innerRadius={100}
        labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={color[index % color.length]}/>
          ))}
        </Pie>
        <Tooltip content={CustomTooltip}/>
        <Legend content={CustomLegend}/>

        {showTextAnchor && (
          <>
            <text
            x="50%"
            y="50%"
            dy={-25}
            textAnchor='middle'
            fill='#666'
            fontSize="14px"
            > {label} </text>
            <text
            x="50%"
            y="50%"
            dy={8}
            textAnchor='middle'
            fill='#333'
            fontSize="24px"
            > {totalAmount} </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
    </div>
  )
}

export default CustomPieChart