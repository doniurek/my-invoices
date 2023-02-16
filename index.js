async function getInvoices(input) {
  let response = await fetch('https://api.stripe.com/v1/invoices', {
    headers: {
      Authorization : `Bearer ${input}`
    }
  });

  console.log(await response.json())
}