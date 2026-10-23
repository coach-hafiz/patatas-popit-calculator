
function calculate() {
  const principal = parseFloat(document.getElementById("principal").value);
  const years = parseInt(document.getElementById("years").value || 0);
  const months = parseInt(document.getElementById("months").value || 0);
  const days = parseInt(document.getElementById("days").value || 0);
  const startDate = new Date(document.getElementById("startDate").value);

  const dailyPips = 30;
  const pipValue = 10;
  const reinvestRate = 0.20;

  if (!Number.isFinite(principal) || principal <= 0 ||
      isNaN(startDate.getTime())) {
    alert("Please enter a valid principal and start date.");
    return;
  }

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + years);
  endDate.setMonth(endDate.getMonth() + months);
  endDate.setDate(endDate.getDate() + days);

  let date = new Date(startDate);
  let balance = principal;
  let totalEarnings = 0;
  let totalReinvested = 0;
  let totalWithdrawable = 0;
  let dataRows = "";

  while (date <= endDate) {
    const day = date.getDay();

    if (day !== 0 && day !== 6) {
      // Calculate lot size from opening balance
      const lotSize = calcMaxLotSize(balance);

      // Profit based on 10 pips
      const earning = round(lotSize * dailyPips * pipValue, 2);

      // Split daily profit
      const reinvested = round(earning * reinvestRate, 2);
      const withdrawable = round(earning - reinvested, 2);

      // Update totals
      totalEarnings = round(totalEarnings + earning, 2);
      totalReinvested = round(totalReinvested + reinvested, 2);
      totalWithdrawable = round(totalWithdrawable + withdrawable, 2);

      // Only 20% is carried forward
      balance = round(balance + reinvested, 2);

      // Lot size for next trading day
      const nextLotSize = calcMaxLotSize(balance);
      const maxLayers = round(nextLotSize / 0.01, 2);

      dataRows += `
        <tr>
          <td>${formatDate(date)}</td>
          <td>${getDayName(date)}</td>
          <td>${formatNum(lotSize)}</td>
          <td>${formatNum(earning)}</td>
          <td>${formatNum(reinvested)}</td>
          <td>${formatNum(withdrawable)}</td>
          <td>${formatNum(totalEarnings)}</td>
          <td>${formatNum(balance)}</td>
          <td>${formatNum(nextLotSize)}</td>
          <td>${formatNum(maxLayers)}</td>
        </tr>
      `;
    }

    date.setDate(date.getDate() + 1);
  }

  document.getElementById("summary").innerHTML = `
    <p><strong>Final Trading Balance:</strong> $${formatNum(balance)}</p>
    <p><strong>Total Gross Profit:</strong> $${formatNum(totalEarnings)}</p>
    <p><strong>Total Reinvested (20%):</strong> $${formatNum(totalReinvested)}</p>
    <p><strong>Total Withdrawable (80%):</strong> $${formatNum(totalWithdrawable)}</p>
    <p><strong>Percentage Profit:</strong> ${formatNum((totalEarnings / principal) * 100)}%</p>
    <p><strong>Balance Growth:</strong> ${formatNum((totalReinvested / principal) * 100)}%</p>
    <p><strong>Start Date:</strong> ${formatDate(startDate)}</p>
    <p><strong>End Date:</strong> ${formatDate(endDate)}</p>
  `;

  document.querySelector("#breakdown tbody").innerHTML = dataRows;
}

// Helper Functions
function round(num, decimals = 2) {
  return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) /
    Math.pow(10, decimals);
}

function calcMaxLotSize(balance) {
  // 0.01% of balance, rounded up to nearest 0.01 lot
  return round(Math.ceil((balance * 0.0001) / 0.01) * 0.01, 2);
}

function formatDate(d) {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit"
  });
}

function getDayName(d) {
  return d.toLocaleDateString("en-GB", {
    weekday: "short"
  });
}

function formatNum(num) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
