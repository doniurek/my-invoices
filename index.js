async function getInvoices(input) {

  let response = await fetch('https://api.stripe.com/v1/invoices?status=open', {
    headers: {
      Authorization : `Bearer ${input}`
    }
  });

  let result = await response.json()

  const tblBody = document.getElementById("tableBody")

  for (let i = 0; i < result.data.length; i++) {
    const row = document.createElement("tr");
    row.insertCell(0).innerHTML = result.data[i].number
    row.insertCell(1).innerHTML = result.data[i].id
    row.insertCell(2).innerHTML = result.data[i].total / 100
    row.insertCell(3).innerHTML = result.data[i].currency
    row.insertCell(4).innerHTML = new Date(result.data[i].created * 1000).toLocaleDateString()
    row.insertCell(5).innerHTML = '<input type="button" id="paybtn" value="Mark as paid" onClick="payInvoice(this)">'

    tblBody.appendChild(row);
  }
}

function saveApiKey(input) {
  sessionStorage.setItem("apiKey", input)
}

async function payInvoice(obj) {
  if (confirm('Are you sure you want to pay this invoice?')) {
    let index = obj.parentNode.parentNode.rowIndex
    let table = document.getElementById("invoicesTable");
    let invoiceID = table.rows[index].cells[1].innerHTML

    console.log(invoiceID)

    let response = await fetch(`https://api.stripe.com/v1/invoices/${invoiceID}/pay?paid_out_of_band=true`, {
      method: 'POST',
      headers: {
        Authorization : `Bearer ${sessionStorage.getItem("apiKey")}`
      }
    });

    table.deleteRow(index)
  }
}