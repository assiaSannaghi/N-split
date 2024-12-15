import "../styles/index.scss";
import {
  activityComponent,
  balanceComponent,
  groupComponent,
  totalPriceComponent,
} from "./components";
import { fetchData, getData } from "./fetch";

const addGroupBtn = document.getElementById("add-group-btn");
const addGroupForm = document.getElementById("add-group-form");
const groupTitle = document.getElementById("group-title");
const groupsList = document.getElementById("groups-list");
const addParticipantBtn = document.getElementById("add-participant-btn");
const participantsContainer = document.getElementById("participants-container");
const cancelGrbBtn = document.getElementById("cancel-grp-btn");
const groupsContainer = document.getElementById("groups-container");
const gobackBtn = document.getElementById("goback-btn");
const groupDescription = document.getElementById("group-description");

const addActivityBtn = document.getElementById("add-activity-btn");
const addActivityForm = document.getElementById("add-activity-form");
const balanceBtn = document.getElementById("balance-btn");
const expensesBtn = document.getElementById("expenses-btn");
const balanceContainer = document.getElementById("balance-container");
const expensesContainer = document.getElementById("expenses-container");
const cancelBtn = document.getElementById("cancel-btn");
const activityTitle = document.getElementById("activity-title");
const activitySplitedAmount = document.getElementById("activity-amount");
const paidBy = document.getElementById("activity-paid");
const activities = document.getElementById("activities");
const detailsContainer = document.getElementById("details");
const splitsContainer = document.getElementById("splits");
export const totalPrice = document.getElementById("total-price");
// const splitInput = document.querySelectorAll(".split-input");

const resetActivity = () => {
  const splitInput = document.querySelectorAll(".split-input");
  splitInput.forEach((el) => (el.value = ""));
  paidBy.value = "";
  activityTitle.value = "";
  activitySplitedAmount.value = "";
  addActivityForm.style.display = "none";
};

const resetGroup = () => {
  groupTitle.value = "";
  participantsContainer.innerHTML = `
          <label id="group-participants">Participants</label>
          <input class="input participant" aria-labelledby="group-participants" name="participant1" type="text"
            placeholder="Participant Name">
          <input class="input participant" aria-labelledby="group-participants" name="participant2" type="text"
            placeholder="Participant Name">
          <button id="add-participant-btn" class="add-participant-btn">Add Another Participant</button>
  `;
  addGroupForm.style.display = "none";
};

const handleLoad = async () => {
  const usersList = await getData("users");

  if (usersList.length) {
    // show groups list on UI
    groupsList.innerHTML = usersList
      .map((user) => groupComponent(user))
      .join("");
  }
};

const handleGroupSubmit = async (e) => {
  e.preventDefault();
  const participants = document.querySelectorAll(".participant");

  const groupTitleValue = groupTitle.value;
  const participantsValue = [...participants].map((el) => el.value);

  if (
    groupTitleValue.trim() &&
    participantsValue.every((el) => el.trim() !== "")
  ) {
    const formData = new FormData(e.target);
    const data = {};
    for (let keyValue of formData.entries()) {
      data[keyValue[0]] = keyValue[1];
    }

    const usersData = participantsValue.map((user, i) => ({
      id: i + 1,
      fullName: user,
      delta: 0,
    }));
    const finalData = {
      description: data.title,
      usersList: usersData,
    };

    const addUsers = await fetchData("users", "POST", finalData);

    groupsList.innerHTML += groupComponent(addUsers);
    resetGroup();
  }
};

let num = 3;
const handleParticipant = () => {
  const html = `
  <input class="input participant" aria-labelledby="group-participants" name="participant${num}" type="text"
  placeholder="Participant Name">
    `;
  addParticipantBtn.insertAdjacentHTML("beforebegin", html);

  num++;
};

const handleGroupsList = async (e) => {
  if (e.target && e.target.classList.contains("group")) {
    const group = await getData("users", e.target.dataset.groupId);
    const expenssesList = await getData("expensses", e.target.dataset.groupId);
    const [{ description, id, usersList }] = group;
    console.log("expenssesList", expenssesList);
    console.log("usersList", usersList);

    //   total price
    totalPriceComponent(expenssesList);

    // activities
    activities.innerHTML = expenssesList
      .map((itemData) => activityComponent(itemData))
      .join("");

    // paid by options
    paidBy.innerHTML = "";
    usersList.forEach((user) => {
      user.id;
      paidBy.innerHTML += `
      <option value="${user.id}-${user.fullName}">${user.fullName}</option>
      `;
    });

    // splitscontainer
    splitsContainer.innerHTML = "";
    usersList.forEach((user) => {
      user.id;
      splitsContainer.innerHTML += `
        <div class="split-group">
          <p class="initial">${user.fullName.slice(0, 1).toUpperCase()}</p>
          <label for="${user.fullName}">${user.fullName}</label>
          <input class="input split-input" id="${user.fullName}" data-uid="${
        user.id
      }" name="${user.fullName}" type="number">
        </div>
      `;
    });

    // balance
    balanceContainer.innerHTML = usersList
      .map((itemData) => balanceComponent(itemData.fullName, itemData.delta))
      .join("");

    groupDescription.textContent = description.toUpperCase();
    groupDescription.setAttribute("data-group-id", id);
    addActivityForm.setAttribute("data-group-id", id);
    detailsContainer.style.display = "block";
    gobackBtn.style.display = "block";
    groupsContainer.style.display = "none";
  }
};

const handleGobackBtn = () => {
  detailsContainer.style.display = "none";
  gobackBtn.style.display = "none";
  groupsContainer.style.display = "block";
};

const handleActivitySubmit = async (e) => {
  e.preventDefault();
  const paidByValue = paidBy.value;
  const activityTitleValue = activityTitle.value;
  const activityAmountValue = activitySplitedAmount.value;
  const groupId = e.target.dataset.groupId;
  const splitInput = document.querySelectorAll(".split-input");

  if (paidByValue && activityTitleValue.trim() && activityAmountValue > 0) {
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
      groupId: groupId,
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

    const addExpenss = await fetchData("expensses", "POST", finalData);
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
    const getGroup = await getData("users", groupId);
    console.log("getGroup", getGroup);
    balanceContainer.innerHTML = "";
    const newUserList = [];
    getGroup[0].usersList.forEach(async (user) => {
      const currentDelta = user.delta;
      const userId = user.id;
      const currentPrice = currentBalance.find(
        (item) => item.ownerId == userId
      ).price;
      newUserList.push({ ...user, delta: currentDelta + currentPrice });
      console.log("newUserList", newUserList);
    });
    const newUserData = await fetchData(
      "users",
      "PATCH",
      { usersList: newUserList },
      groupId
    );
    console.log("newUserData", newUserData);
    newUserData.usersList.forEach((user) => {
      const htmlBalance = balanceComponent(user.fullName, user.delta);
      balanceContainer.innerHTML += htmlBalance;
    });

    resetActivity();
  }
};

const handleAddActivityBtn = () => {
  addActivityForm.style.display = "flex";
};

const handleAddGroupBtn = () => {
  addGroupForm.style.display = "flex";
};

const handleBalanceBtn = () => {
  expensesContainer.style.display = "none";
  balanceContainer.style.display = "block";
  expensesBtn.classList.remove("active-mode");
  balanceBtn.classList.add("active-mode");
};

const handleExpensesBtn = () => {
  expensesContainer.style.display = "block";
  balanceContainer.style.display = "none";
  expensesBtn.classList.add("active-mode");
  balanceBtn.classList.remove("active-mode");
};

const handlerSplitedAmount = () => {
  const amountValue = activitySplitedAmount.value;
  const splitInput = document.querySelectorAll(".split-input");
  if (amountValue) {
    const splitAmount = Math.round(amountValue / splitInput.length);
    splitInput.forEach((el) => (el.value = splitAmount));
  } else {
    splitInput.forEach((el) => (el.value = ""));
  }
};

const handleCancel = () => {
  resetActivity();
};

const handleCancelGrp = () => {
  resetGroup();
};

window.addEventListener("load", handleLoad);

addGroupForm.addEventListener("submit", handleGroupSubmit);
addGroupBtn.addEventListener("click", handleAddGroupBtn);
cancelGrbBtn.addEventListener("click", handleCancelGrp);
addParticipantBtn.addEventListener("click", handleParticipant);
groupsList.addEventListener("click", handleGroupsList);
gobackBtn.addEventListener("click", handleGobackBtn);

addActivityBtn.addEventListener("click", handleAddActivityBtn);
balanceBtn.addEventListener("click", handleBalanceBtn);
expensesBtn.addEventListener("click", handleExpensesBtn);
activitySplitedAmount.addEventListener("focusout", handlerSplitedAmount);
addActivityForm.addEventListener("submit", handleActivitySubmit);
cancelBtn.addEventListener("click", handleCancel);
