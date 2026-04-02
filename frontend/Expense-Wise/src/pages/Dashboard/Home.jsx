import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { useUserAuth } from "../../hooks/useUserAuth"
import { useEffect, useState } from "react"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { IoMdCard } from "react-icons/io"
import InfoCard from "../../components/cards/InfoCard"
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu"
import { addThousandSeparator } from "../../utils/helper"
import RecentTransactions from "../../components/dashboard/RecentTransactions"
import FinanceOverview from "../../components/dashboard/FinanceOverview"
import ExpenseTransactions from "../../components/dashboard/ExpenseTransactions"
import Last30DaysExpenses from "../../components/dashboard/Last30DaysExpenses"
import RecentIncomeWithChart from "../../components/dashboard/RecentIncomeWithChart"
import RecentIncome from "../../components/dashboard/RecentIncome"

const Home = () => {
  useUserAuth()

  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState("all")

  const fetchDashboardData = async () => {
    if (loading) return

    setLoading(true)

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`,
      )

      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.log("Something went wrong. Please try again", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    return () => {}
  })

  const getFilteredList = (transactions) => {
    if (!transactions) return []
    if (filterType === "all") return transactions

    const now = new Date()

    return transactions.filter((item) => {
      if (!item.date) return false

      // 1. Clean the string: "30th Mar 2026" -> "30 Mar 2026"
      const dateCleaned = item.date.replace(/(\d+)(st|nd|rd|th)/, "$1")
      const itemDate = new Date(dateCleaned)

      // 2. Debugging: Uncomment the line below to see dates in your Console (F12)
      // console.log(`Comparing item: ${itemDate.toDateString()} with now: ${now.toDateString()}`);

      if (filterType === "daily") {
        return itemDate.toDateString() === now.toDateString()
      }

      if (filterType === "monthly") {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        )
      }

      if (filterType === "yearly") {
        return itemDate.getFullYear() === now.getFullYear()
      }

      return true
    })
  }

  // Apply filter to your raw data
  const filteredRecent = getFilteredList(
    dashboardData?.recentTransactions || [],
  )

  // Recalculate Totals for InfoCards based on filtered data
  const totalIncome = filteredRecent
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredRecent
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = totalIncome - totalExpense

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="flex gap-2 mb-6 justify-end">
          {["daily", "monthly", "yearly", "all"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1 text-sm font-medium rounded-md transition-all ${
                filterType === type
                  ? "bg-primary text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandSeparator(totalBalance || 0)}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandSeparator(totalIncome || 0)}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandSeparator(totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={filteredRecent}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={totalBalance || 0}
            totalIncome={totalIncome || 0}
            totalExpense={totalExpense || 0}
          />

          <ExpenseTransactions
            transactions={
              getFilteredList(
                dashboardData?.last30DaysExpenses?.transactions,
              ) || []
            }
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={
              getFilteredList(
                dashboardData?.last30DaysExpenses?.transactions,
              ) || []
            }
          />

          <RecentIncomeWithChart
            data={
              getFilteredList(
                dashboardData?.last60DaysIncome?.transactions?.slice(0, 4),
              ) || []
            }
            totalIncome={totalIncome || 0}
          />

          <RecentIncome
            transactions={getFilteredList(
              dashboardData?.last60DaysIncome?.transactions,
            )}
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home
