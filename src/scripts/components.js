export const activityComponent = ({ fullName, description, totalePrice }) => {
  return `
    <div class="activity">
        <p class="initial">${fullName.slice(0, 1)}</p>
        <p class="title">${description.toUpperCase()} 
            <span>By ${fullName}
            </span>
        </p>
        <p class="price">${totalePrice} MAD</p>
    </div>
  `;
};
export const balanceComponent = (key, value) => {
  console.log("key, value", key, value);
  return `
<div class="user-balance">
  <p class="initial">${key.slice(0, 1)}</p>
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
