import moment from 'moment'

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email)
}

export const getInitials = (name) => {
  if (!name) return ""

  const words = name.split(" ")
  let initials = ""
  
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    if (words[i]) initials += words[i][0]
  }
  return initials.toUpperCase()
}

export const addThousandSeparator = (num) => {
  if (num == null || isNaN(num)) return ""

  const [integerPart, fractionalPart] = num.toString().split(".")
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  return fractionalPart
  ? `${formattedInteger}.${fractionalPart}`
  : formattedInteger
}

export const prepareExpenseBarChartData = (data = []) => {
  return [...data]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      displayDate: moment(item.date).format("Do MMM"), // "Do" adds the 1st, 2nd, 3rd
      category: item?.category,
      amount: Number(item?.amount) || 0,
    }));
}

export const prepareIncomeBarChartData = (data = []) => {
  return [...data]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      displayDate: moment(item.date).format("Do MMM"), // Consistent labeling
      source: item?.source,
      amount: Number(item?.amount) || 0,
    }));
}

export const prepareExpenseLineChartData = (data = []) => {
   return [...data]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      displayDate: moment(item.date).format("Do MMM"), // "Do" adds the 1st, 2nd, 3rd
      category: item?.category,
      amount: Number(item?.amount) || 0,
    }));
}