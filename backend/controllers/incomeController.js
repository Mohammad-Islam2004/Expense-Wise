
const xlsx = require("xlsx");
const Income = require("../models/Income");

//add income
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!source || amount === undefined || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number." });
    }

    const newIncome = new Income({
      userId,
      icon: icon,
      source,
      amount: Number(amount),
      date: new Date(date),
    });

    await newIncome.save();

    res.status(201).json({
      message: "Income added successfully",
      income: newIncome
    });

  } catch (err) {
    console.error("Add Income Error:", err.message);
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

//get income
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try{
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  }
  catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

//delete income
exports.deleteIncome = async (req, res) => {
  try{
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully."});
  }
  catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

//download income excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id
  try{
    const income = await Income.find({ userId }).sort({ date: -1})

    //prepare data for excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }))

    const wb = xlsx.utils.book_new()
    const ws = xlsx.utils.json_to_sheet(data)
    xlsx.utils.book_append_sheet(wb, ws, "Income")
    xlsx.writeFile(wb, 'Income_details.xlsx')
    res.download('Income_details.xlsx')
  }
  catch (err) {
    res.status(500).json({ message: "Server Error", Error: err.message });
  }
}