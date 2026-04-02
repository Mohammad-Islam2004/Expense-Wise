import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import {useUserAuth} from '../../hooks/useUserAuth'
import IncomeOverview from '../../components/income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance'
import {API_PATHS} from '../../utils/apiPaths'
import Modal from '../../components/Modal'
import AddIncomeForm from '../../components/income/AddIncomeForm'
import toast from 'react-hot-toast'
import IncomeList from '../../components/income/IncomeList'
import DeleteAlert from '../../components/DeleteAlert'

const Income = () => {
  useUserAuth()
  const [ incomeData, setIncomeData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null })
  const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false)
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState("");

  // get all income details
  const fetchIncomeDetails = async() => {
    if (loading) return

    setLoading(true)

    try{
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`)
      if (response.data){
        setIncomeData(response.data)
      }
    }
    catch(error){
      console.log("Something went wrong. Please try again later", error)
    }
    finally{
      setLoading(false)
    }
  }

  // handle add income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon} = income

    //validation check
    if(!source.trim()){
      toast.error("Source is required.")
      return
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Amount should be valid number greater than 0.")
    }

    if(!date){
      toast.error("Date ir required.")
    }

    try{
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      })

      setOpenAddIncomeModel(false)
      toast.success("Income added successfully.")
      fetchIncomeDetails()
    }
    catch (error){
      console.error("Error adding income:", error.response?.data?.message || error.message)
    }
  }

  // delete income
  const deleteIncome = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))
      setOpenDeleteAlert({show: false, data: null})
      toast.success("Income details deleted successfully.")
      fetchIncomeDetails()
    }
    catch(error){
      console.error("Error deleting income", error.response?.data?.message || error.message)
    }
  }

  // download income details
  const handleDownloadIncomeDetails = async () => {
    try {
    const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
      responseType: "blob", 
    });

    if (response.data.type === "application/json") {
      toast.error("Could not generate report. Please try again.");
      return;
    }

    const blob = new Blob([response.data], { 
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
    });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    
    link.setAttribute("download", "Income_Details.xlsx");
    
    document.body.appendChild(link);
    link.click();

    link.remove(); 
    window.URL.revokeObjectURL(url);
    
    toast.success("Download started successfully!");
  } catch (error) {
    console.error("Error downloading income details", error);
    toast.error("Failed to download income details. Check your connection.");
  }
  }

  useEffect(() => {
    fetchIncomeDetails()

    return () => {}
  }, )

  const getFilteredIncome = () => {
  if (!incomeData) return [];
  if (filterType === 'all') return incomeData;

  const now = new Date();
  
  return incomeData.filter((item) => {
    if (!item.date) return false;

    // Clean the "30th Mar 2026" format for comparison
    const dateCleaned = item.date.replace(/(\d+)(st|nd|rd|th)/, "$1");
    const itemDate = new Date(dateCleaned);

    if (filterType === "daily") {
      // If user picked a date in the calendar, use that. Otherwise, use Today.
      const targetDate = selectedDate ? new Date(selectedDate) : now;
      return itemDate.toDateString() === targetDate.toDateString();
    }

    if (filterType === "monthly") {
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }

    if (filterType === "yearly") {
      return itemDate.getFullYear() === now.getFullYear();
    }

    return true;
  });
};

const displayIncome = getFilteredIncome();

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
  {/* Date Picker - Only shows when 'daily' is selected */}
  {filterType === 'daily' && (
    <input 
      type="date" 
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="border border-gray-500 rounded-[7px] px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary"
    />
  )}

  {/* Existing Filter Buttons */}
  <div className="flex bg-gray-100 p-1 rounded-lg">
    {['daily', 'monthly', 'yearly', 'all'].map((t) => (
      <button 
        key={t} 
        onClick={() => {
          setFilterType(t);
          if (t !== 'daily') setSelectedDate(""); // Reset date if switching to Monthly/Yearly
        }}
        className={`px-4 py-1 text-sm font-medium rounded-md transition-all ${
          filterType === t ? "bg-primary text-white" : "bg-white text-gray-800"
        }`}
      >
        {t.toUpperCase()}
      </button>
    ))}
  </div>
</div>

<IncomeOverview
  transactions={displayIncome}  /* CHANGED THIS */
  onAddIncome={() => setOpenAddIncomeModel(true)}
/>
          </div>

          <IncomeList
            transactions={displayIncome}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id})
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal
        isOpen={openAddIncomeModel}
        onClose={() => (setOpenAddIncomeModel(false))}
        title= 'Add Income'
        >
          <AddIncomeForm onAddIncome={handleAddIncome}/>
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => (setOpenDeleteAlert({show: false, data: null}))}
        title= 'Delete Income'
        >
          <DeleteAlert
            content='Are you sure you want to delete this income source ?'
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Income