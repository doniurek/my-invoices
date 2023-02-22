$(document).ready(function() {
  $('#submitbtn').click(function() {
    sessionStorage.getItem('apiKey')
      ? getInvoices(sessionStorage.getItem('apiKey'))
      : alert('Please input and save your API key first!')
  })
});

async function getInvoices(input) {
  $.ajax({
    type: 'GET',
    url: 'https://api.stripe.com/v1/invoices?status=open',
    dataType: 'json',
    headers: {
      'Authorization' : `Bearer ${input}`
    }
  })
    .done(function(json) {
      let tblBody = $('table tbody')

      for (let i = 0; i < json.data.length; i++) {
        content += '<tr>'
        content += '<td>' + json.data[i].number + '</td>'
        content += '<td>' + json.data[i].id + '</td>'
        content += '<td>' + json.data[i].total / 100 + '</td>'
        content += '<td>' + json.data[i].currency + '</td>'
        content += '<td>' + new Date(json.data[i].created * 1000).toLocaleDateString() + '</td>'
        content += '<td>' + '<input type="button" id="paybtn" value="Mark as paid" onClick="payInvoice(this)">' + '</td>'
        content += '</tr>'
      }
      tblBody.append(content)
    })
  }

function saveApiKey(input) {
  sessionStorage.setItem('apiKey', input)
}

async function payInvoice(obj) {
  if (confirm('Are you sure you want to pay this invoice?')) {
    let index = $(obj).parent().parent().index()
    let invoiceID = $('#invoicesTable').find('tbody tr').eq(index).find('td').eq(1).html()

    $.ajax({
      type: 'POST',
      url: `https://api.stripe.com/v1/invoices/${invoiceID}/pay?paid_out_of_band=true`,
      headers: {
        'Authorization' : `Bearer ${sessionStorage.getItem("apiKey")}`
      }
    })

    $('tbody tr').eq(index).remove()
  }
}