function calculate() {
  const principal = parseFloat(document.getElementById("principal").value);
  const years = parseInt(document.getElementById("years").value || 0);
  const months = parseInt(document.getElementById("months").value || 0);
  const days = parseInt(document.getElementById("days").value || 0);
  const startDate = new Date(document.getElementById("startDate").value);
  const dailyRate = 0.10;

  if (!principal || isNaN(startDate.getTime())) {
    alert("Please enter a valid principal and start date.");
    return;
  }

  // Calculate total number of days
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + years);
  endDate.setMonth(endDate.getMonth() + months);
  endDate.setDate(endDate.getDate() + days);

  let date = new Date(startDate);
  let balance = principal;
  let totalEarnings = 0;
  let dataRows = "";

  while (date <= endDate) {
    const day = date.getDay(); // 0 = Sun, 6 = Sat
    if (day !== 0 && day !== 6) {
      const earning = round(balance * dailyRate, 2);
      totalEarnings = round(totalEarnings + earning, 2);
      balance = round(balance + earning, 2);

      const maxLotSize = calcMaxLotSize(earning);
      const maxLayers = round(maxLotSize / 0.01, 2);

      dataRows += `
        <tr>
          <td>${formatDate(date)}</td>
          <td>${getDayName(date)}</td>
          <td>${earning}</td>
          <td>${totalEarnings}</td>
          <td>${balance}</td>
          <td>${maxLotSize}</td>
          <td>${maxLayers}</td>
        </tr>
      `;
    }
    date.setDate(date.getDate() + 1);
  }

  document.getElementById("summary").innerHTML = `
    <p><strong>Investment Value:</strong> $${balance}</p>
    <p><strong>Total Interest / Earnings:</strong> $${totalEarnings}</p>
    <p><strong>Percentage Profit:</strong> ${round((totalEarnings / principal) * 100, 2)}%</p>
    <p><strong>Start Date:</strong> ${formatDate(startDate)}<br><strong>End Date:</strong> ${formatDate(endDate)}</p>
  `;

  document.querySelector("#breakdown tbody").innerHTML = dataRows;
}

// Helper Functions
function round(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function calcMaxLotSize(earning) {
  if (earning < 1) return 0;
  return round(0.01 * Math.floor((earning - 1) / 3) + 0.01, 2);
}

function formatDate(d) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
}

function getDayName(d) {
  return d.toLocaleDateString('en-GB', { weekday: 'short' });
}
