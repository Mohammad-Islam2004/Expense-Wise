const TimeFilter = ({ activeFilter, setFilter }) => {
  return (
    <div className='flex bg-gray-100 p-1 rounded-lg w-fit mb-6'>
      {['daily', 'monthly', 'yearly'].map((type) => (
        <button
          key={type}
          onClick={() => setFilter(type)}
          className={`px-6 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeFilter === type 
            ? "bg-white text-primary shadow-sm" 
            : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  )
}

export default TimeFilter;