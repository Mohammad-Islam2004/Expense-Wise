
const xlsx = require("xlsx");
const Expense = require("../models/Expense");

//add expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    if (!category || amount === undefined || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number." });
    }

    const newExpense = new Expense({
      userId,
      icon: icon,
      category,
      amount: Number(amount),
      date: new Date(date),
    });

    await newExpense.save();

    res.status(201).json({
      message: "Expense added successfully",
      income: newExpense
    });

  } catch (err) {
    console.error("Add Expense Error:", err.message);
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

//get expense
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try{
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  }
  catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

//delete expense
exports.deleteExpense = async (req, res) => {
  try{
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully."});
  }
  catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

//download expense excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id
  try{
    const expense = await Expense.find({ userId }).sort({ date: -1})

    //prepare data for excel
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }))

    const wb = xlsx.utils.book_new()
    const ws = xlsx.utils.json_to_sheet(data)
    xlsx.utils.book_append_sheet(wb, ws, "Expense")
    xlsx.writeFile(wb, 'Expense_details.xlsx')
    res.download('Expense_details.xlsx')
  }
  catch (err) {
    res.status(500).json({ message: "Server Error", Error: err.message });
  }
}