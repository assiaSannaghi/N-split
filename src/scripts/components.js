export const activityComponent = ({ fullName, description, totalePrice }) => {
  return `
    <div class="activity">
        <p class="initial">${fullName.slice(0, 1).toUpperCase()}</p>
        <p class="title">${description.toUpperCase()} 
            <span>By ${fullName}</span>
        </p>
        <p class="price">${totalePrice} MAD</p>
    </div>
  `;
};

export const groupComponent = ({ description, usersList, id }) => {
  return `
    <div class="group" data-group-id="${id}">
        <p class="initial">${description.slice(0, 1).toUpperCase()}</p>
        <p class="title">${description.toUpperCase()}
          <span>With ${usersList.map((user) => user.fullName).join(", ")}
          </span>
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
    </div>
  `;
};

export const balanceComponent = (key, value) => {
  console.log("key, value", key, value);
  return `
<div class="user-balance">
  <p class="initial">${key.slice(0, 1).toUpperCase()}</p>
  <p class="user">${key}</p>
  <p class="rest rest-${value >= 0 ? "positive" : "negative"}">${
    value >= 0 ? "+" : "-"
  } ${Math.abs(value)} MAD</p>
</div>
`;
};

export const totalPriceComponent = (expenssData) => {
  const totalPrice = document.getElementById("total-price");
  totalPrice.textContent =
    typeof expenssData === "string"
      ? +totalPrice.textContent + +expenssData
      : expenssData.reduce((acc, el) => acc + +el.totalePrice, 0);
};
