import React from 'react';
export const StoreContext = React.createContext(null)

export default function Store ({ children }) {
  const [recipe, setRecipe] = React.useState({})
  const [selectedDate, setSelectedDate] = React.useState(getCurrentDate())
  const [page, setPage] = React.useState(1)
  const [selectedIngredients, setSelectedIngredients] = React.useState([])

  const store = {
    recipe: recipe,
    setRecipe,
    selectedDate: selectedDate,
    setSelectedDate,
    page: page,
    setPage,
    selectedIngredients: selectedIngredients,
    setSelectedIngredients
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

function getCurrentDate(separator='-') {
  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  
  return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}