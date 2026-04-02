import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance'
import {API_PATHS} from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import ExpenseOverview from '../../components/expense/ExpenseOverview'
import AddExpenseForm from '../../components/expense/AddExpenseForm'
import Modal from '../../components/Modal'
import ExpenseList from '../../components/expense/ExpenseList'
import DeleteAlert from '../../components/DeleteAlert'


const Expense = () => {
  useUserAuth()
  const [ expenseData, setExpenseData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null })
  const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false)
  const [filterType, setFilterType] = useState('all'); 
const [selectedDate, setSelectedDate] = useState("");

  // get all expense details
  const fetchExpenseDetails = async() => {
    if (loading) return

    setLoading(true)

    try{
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`)
      if (response.data){
        setExpenseData(response.data)
      }
    }
    catch(error){
      console.log("Something went wrong. Please try again later", error)
    }
    finally{
      setLoading(false)
    }
  }

  // handle add expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon} = expense

    //validation check
    if(!category.trim()){
      toast.error("Category is required.")
      return
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Amount should be valid number greater than 0.")
    }

    if(!date){
      toast.error("Date ir required.")
    }

    try{
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      })

      setOpenAddExpenseModel(false)
      toast.success("Expense added successfully.")
      fetchExpenseDetails()
    }
    catch (error){
      console.error("Error adding expense:", error.response?.data?.message || error.message)
    }
  }

  // delete expense
  const deleteExpense = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))
      setOpenDeleteAlert({show: false, data: null})
      toast.success("Expense deleted successfully.")
      fetchExpenseDetails()
    }
    catch(error){
      console.error("Error deleting expense", error.response?.data?.message || error.message)
    }
  }

  // download expense details
  const handleDownloadExpenseDetails = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
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
    
    link.setAttribute("download", "Expense_Details.xlsx");
    
    document.body.appendChild(link);
    link.click();

    link.remove(); 
    window.URL.revokeObjectURL(url);
    
    toast.success("Download started successfully!");
  } catch (error) {
    console.error("Error downloading expense details", error);
    toast.error("Failed to download expense details. Check your connection.");
  }
};

  useEffect(()=>{
    fetchExpenseDetails()
    return ()=>{}
  })

  const getFilteredExpense = () => {
  if (!expenseData || filterType === 'all') return expenseData;
  const now = new Date();
  
  return expenseData.filter((item) => {
    if (!item.date) return false;

    // Standardizing your "30th Mar 2026" format
    const dateCleaned = item.date.replace(/(\d+)(st|nd|rd|th)/, "$1");
    const itemDate = new Date(dateCleaned);

    if (filterType === "daily") {
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

// This is what we pass to the components
const displayExpense = getFilteredExpense();

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
      <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
      {filterType === 'daily' && (
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-500 rounded-[7px] px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      )}

      <div className="flex bg-gray-100 p-1 rounded-lg">
        {['daily', 'monthly', 'yearly', 'all'].map((t) => (
          <button 
            key={t} 
            onClick={() => {
              setFilterType(t);
              if (t !== 'daily') setSelectedDate(""); 
            }}
            className={`px-4 py-1 text-sm font-medium rounded-[7px] transition-all ${
              filterType === t ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions={displayExpense}
              onAddExpense={() => setOpenAddExpenseModel(true)}
            />
          </div>

          <ExpenseList
            transactions={displayExpense}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id})
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
        isOpen={openAddExpenseModel}
        onClose={() => (setOpenAddExpenseModel(false))}
        title= 'Add Expense'
        >
          <AddExpenseForm onAddExpense={handleAddExpense}/>
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => (setOpenDeleteAlert({show: false, data: null}))}
        title= 'Delete Expense'
        >
          <DeleteAlert
            content='Are you sure you want to delete this expense ?'
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
    
  )
}

export default Expense