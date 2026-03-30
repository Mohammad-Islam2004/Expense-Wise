import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2 } from 'react-icons/lu'

const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete }) => {
  const getAmountStyles = () => 
    type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
  
  return (
    <div className='group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60 transition-all'>
      {/* Icon Section - Fixed Width */}
      <div className='w-12 h-12 flex-shrink-0 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full'>
        {icon ? (
          <img src={icon} alt={title} className='w-6 h-6'/>
        ) : (
          <LuUtensils/>
        )}
      </div>

      <div className='flex-1 flex items-center justify-between min-w-0'>
        {/* Text Section - Fixed min-width ensures icons align */}
        <div className='flex-1 min-w-[120px] sm:min-w-[150px]'>
          <p className='text-sm text-gray-700 font-semibold truncate'>{title}</p>
          <p className='text-[10px] text-gray-400 mt-0.5'>{date}</p>
        </div>

        {/* Actions & Amount Section */}
        <div className='flex items-center gap-3 ml-2'>
          {!hideDeleteBtn && (
            <button 
              className='text-gray-400 hover:text-red-500 cursor-pointer transition-opacity
                         opacity-100 min-[750px]:opacity-0 min-[750px]:group-hover:opacity-100'
              onClick={onDelete}
            >
              <LuTrash2 size={18}/>
            </button>
          )}
          
          {/* Amount Pill - Fixed Width to prevent jumping */}
          <div className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-md min-w-22.5 ${getAmountStyles()}`}>
            <h6 className='text-xs font-bold whitespace-nowrap'>
              {type === 'income' ? "+" : "-"} ₹{amount}
            </h6>
            <div className='shrink-0'>
              {type === "income" ? <LuTrendingUp size={14}/> : <LuTrendingDown size={14}/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionInfoCard