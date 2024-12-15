export async function fetchData(API, method, jsonData, userId = "") {
  try {
    const response = await fetch(`http://localhost:8484/${API}/${userId}`, {
      method: `${method}`,
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

export async function getData(API, groupId = "") {
  try {
    const response = await fetch(
      `http://localhost:8484/${API}?${
        API === "users" ? "id" : "groupId"
      }=${groupId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    // console.log("fetchUsers", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

// {
//   "groupId": 1,
//   "description": "North trip",
//   "usersList": [
//     {
//       "id": "1",
//       "fullName": "hamza",
//       "delta": 75
//     },
//     {
//       "id": "2",
//       "fullName": "nabil",
//       "delta": -25
//     },
//     {
//       "id": "3",
//       "fullName": "assia",
//       "delta": -25
//     },
//     {
//       "id": "4",
//       "fullName": "mina",
//       "delta": -25
//     }
//   ]
// }

// export async function fetchMethode(jsonData) {
//   try {
//     const response = await fetch("http://localhost:8484/expensses", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(jsonData), // Send JSON-encoded data
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// export async function fetchUsers() {
//   try {
//     const response = await fetch("http://localhost:8484/users", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log("fetchUsers", result);
//     return result;
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// export async function fetchExpensses() {
//   try {
//     const response = await fetch("http://localhost:8484/expensses", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log(result);
//     return result;
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

//fetchData('users','PATCH',jsonData, userId)
// export async function updateUserData(jsonData, userId) {
//   try {
//     const response = await fetch(`http://localhost:8484/users/${userId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(jsonData), // Send JSON-encoded data
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }
