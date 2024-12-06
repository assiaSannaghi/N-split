import "../styles/index.scss";
import {
  activityComponent,
  balanceComponent,
  totalPriceComponent,
} from "./components";
import {
  fetchExpensses,
  fetchMethode,
  fetchUsers,
  updateUserData,
} from "./fetch";

const addBtn = document.getElementById("add-btn");
const addForm = document.getElementById("add-form");
const balanceBtn = document.getElementById("balance-btn");
const expensesBtn = document.getElementById("expenses-btn");
const balanceContainer = document.getElementById("balance-container");
const expensesContainer = document.getElementById("expenses-container");
const cancelBtn = document.getElementById("cancel-btn");
const activityTitle = document.getElementById("activity-title");
const activityAmount = document.getElementById("activity-amount");
const paidBy = document.getElementById("activity-paid");
const activities = document.getElementById("activities");
export const totalPrice = document.getElementById("total-price");
const splitInput = document.querySelectorAll(".split-input");

export let prices = [];

const reset = () => {
  splitInput.forEach((el) => (el.value = ""));
  paidBy.value = "";
  activityTitle.value = "";
  activityAmount.value = "";
  addForm.style.display = "none";
};
const handleLoad = async () => {
  const expenssList = await fetchExpensses();

  //   total price
  totalPriceComponent(expenssList);
  //   activities
  activities.innerHTML = expenssList
    .map((itemData) => activityComponent(itemData))
    .join("");

  // balance
  if (expenssList.length === 0) {
    balanceContainer.innerHTML = "";
    const users = await fetchUsers();
    users.forEach(async (user) => {
      const currentDelta = 0;
      const userId = user.id;
      const newUserData = await updateUserData({ delta: currentDelta }, userId);

      const htmlBalance = balanceComponent(
        newUserData.fullName,
        newUserData.delta
      );
      balanceContainer.innerHTML += htmlBalance;
    });
  } else {
    const users = await fetchUsers();
    console.log("users load", users);
    balanceContainer.innerHTML = users
      .map((itemData) => balanceComponent(itemData.fullName, itemData.delta))
      .join("");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const paidByValue = paidBy.value;
  const activityTitleValue = activityTitle.value;
  const activityAmountValue = activityAmount.value;

  if (paidByValue && activityTitleValue && activityAmountValue) {
    const formData = new FormData(e.target);
    const data = {};
    for (let keyValue of formData.entries()) {
      data[keyValue[0]] = keyValue[1];
    }

    const splitedAmount = [...splitInput].map((el) => ({
      expenssOwnerId: el.dataset.uid,
      price: +el.value,
    }));
    console.log(splitedAmount);
    const [userId, fullName] = data.paid.split("-");
    const finalData = {
      ownerId: userId,
      fullName: fullName,
      description: data.title,
      totalePrice: data.amount,
      expenssList: splitedAmount,
    };
    console.log("finalData", finalData.fullName);

    const html = activityComponent(finalData);

    totalPriceComponent(activityAmountValue);
    activities.innerHTML += html;

    // balance

    const addExpenss = await fetchMethode(finalData);
    // console.log("addExpenss", addExpenss);
    const currentBalance = addExpenss.expenssList.map((user) => {
      if (+user.expenssOwnerId === +addExpenss.ownerId) {
        return {
          price: +addExpenss.totalePrice - +user.price,
          ownerId: user.expenssOwnerId,
        };
      } else {
        return {
          price: -+user.price,
          ownerId: user.expenssOwnerId,
        };
      }
    });
    const users = await fetchUsers();
    balanceContainer.innerHTML = "";
    users.forEach(async (user) => {
      const currentDelta = user.delta;
      const userId = user.id;
      const currentPrice = currentBalance.find(
        (item) => item.ownerId == userId
      ).price;

      const newUserData = await updateUserData(
        { delta: currentDelta + currentPrice },
        userId
      );

      const htmlBalance = balanceComponent(
        newUserData.fullName,
        newUserData.delta
      );
      balanceContainer.innerHTML += htmlBalance;
      console.log("newUserData", newUserData);
    });

    reset();
  }
};

addBtn.addEventListener("click", () => {
  addForm.style.display = "flex";
});

balanceBtn.addEventListener("click", () => {
  expensesContainer.style.display = "none";
  balanceContainer.style.display = "block";
  expensesBtn.classList.remove("active-mode");
  balanceBtn.classList.add("active-mode");
});

expensesBtn.addEventListener("click", () => {
  expensesContainer.style.display = "block";
  balanceContainer.style.display = "none";
  expensesBtn.classList.add("active-mode");
  balanceBtn.classList.remove("active-mode");
});

activityAmount.addEventListener("focusout", () => {
  const amountValue = activityAmount.value;
  if (amountValue) {
    const splitAmount = Math.round(amountValue / splitInput.length);
    splitInput.forEach((el) => (el.value = splitAmount));
  } else {
    splitInput.forEach((el) => (el.value = ""));
  }
});

addForm.addEventListener("submit", handleSubmit);
window.addEventListener("load", handleLoad);

cancelBtn.addEventListener("click", () => {
  reset();
});
