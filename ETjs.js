// Expense Tracker

let budget = Number(localStorage.getItem("budget")) || 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Dashboard Elements
const allocatedBudgetDisplay =
  document.querySelectorAll("#dashboardsection .details p:nth-child(2)")[0];

const totalExpenseDisplay =
  document.querySelectorAll("#dashboardsection .details p:nth-child(2)")[1];

const remainingBalanceDisplay =
  document.querySelectorAll("#dashboardsection .details p:nth-child(2)")[2];

// Strategy Elements
const needsDisplay =
  document.querySelectorAll("#Strategy .dispS p:nth-child(2)")[0];

const wantsDisplay =
  document.querySelectorAll("#Strategy .dispS p:nth-child(2)")[1];

const growthDisplay =
  document.querySelectorAll("#Strategy .dispS p:nth-child(2)")[2];

// Budget Section
const budgetInput =
  document.querySelector("#enterbudgetbutton input");

const budgetButton =
  document.querySelector("#enterbudgetbutton button");

// Expense Section
const dateInput =
  document.querySelectorAll("#expensesection input")[0];

const amountInput =
  document.querySelectorAll("#expensesection input")[1];

const categoryInput =
  document.querySelector("#expensesection select");

const descriptionInput =
  document.querySelectorAll("#expensesection input")[2];

const expenseButton =
  document.querySelector("#expensesection button");

// Transaction Table
const table = document.querySelector(".table-container table");

const emptyMessage =
  document.querySelector(".empty-message");

// Save Data

function saveData() {
  localStorage.setItem("budget", budget);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Update Strategy

function updateStrategy() {
  const needs = budget * 0.5;
  const wants = budget * 0.3;
  const growth = budget * 0.2;

  needsDisplay.textContent = `₹ ${needs.toFixed(2)}`;
  wantsDisplay.textContent = `₹ ${wants.toFixed(2)}`;
  growthDisplay.textContent = `₹ ${growth.toFixed(2)}`;
}

// Update Dashboard

function updateDashboard() {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const remainingBalance = budget - totalExpenses;

  allocatedBudgetDisplay.textContent =
    `₹ ${budget.toFixed(2)}`;

  totalExpenseDisplay.textContent =
    `₹ ${totalExpenses.toFixed(2)}`;

  remainingBalanceDisplay.textContent =
    `₹ ${remainingBalance.toFixed(2)}`;
}

// Render Transactions

function renderTransactions() {

  let oldBody = table.querySelector("tbody");

  if (oldBody) {
    oldBody.remove();
  }

  const tbody = document.createElement("tbody");

  if (expenses.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  expenses.forEach(expense => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.description}</td>
      <td>${expense.category}</td>
      <td>₹ ${expense.amount.toFixed(2)}</td>
      <td>${expense.date}</td>
    `;

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
}

// Budget Submit


budgetButton.addEventListener("click", () => {

  const enteredBudget = Number(budgetInput.value);

  if (enteredBudget <= 0) {
    alert("Please enter a valid budget.");
    return;
  }

  budget = enteredBudget;

  saveData();
  updateStrategy();
  updateDashboard();

  budgetInput.value = "";

});

// Add Expense

expenseButton.addEventListener("click", () => {

  const date = dateInput.value;
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const description = descriptionInput.value;

  if (
    !date ||
    !amount ||
    !description.trim()
  ) {
    alert("Please fill all fields.");
    return;
  }

  expenses.push({
    date,
    amount,
    category,
    description
  });

  saveData();

  renderTransactions();
  updateDashboard();

  dateInput.value = "";
  amountInput.value = "";
  descriptionInput.value = "";

});

// Initial Load

updateStrategy();
updateDashboard();
renderTransactions();