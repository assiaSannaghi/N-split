export async function fetchMethode(jsonData) {
  try {
    const response = await fetch("http://localhost:8484/expensses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData), // Send JSON-encoded data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:8484/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("fetchUsers", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function fetchExpensses() {
  try {
    const response = await fetch("http://localhost:8484/expensses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function updateUserData(jsonData, userId) {
  try {
    const response = await fetch(`http://localhost:8484/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData), // Send JSON-encoded data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}
