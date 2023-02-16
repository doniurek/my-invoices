async function getInvoices(input) {
  let response = await fetch('https://api.stripe.com/v1/invoices', {
    headers: {
      Authorization : `Bearer ${input}`
    }
  });

  let result = await response.json()

  const tblBody = document.getElementById("tableBody")

  for (let i = 0; i < result.data.length; i++) {
    const row = document.createElement("tr");
    row.insertCell(0).innerHTML = result.data[i].number
    row.insertCell(1).innerHTML = result.data[i].total / 100
    row.insertCell(2).innerHTML = result.data[i].currency
    row.insertCell(3).innerHTML = new Date(result.data[i].created * 1000).toLocaleDateString()

    tblBody.appendChild(row);
  }
}