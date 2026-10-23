
function calculate() {
  const principal = parseFloat(document.getElementById("principal").value);
  const years = parseInt(document.getElementById("years").value || 0);
  const months = parseInt(document.getElementById("months").value || 0);
  const days = parseInt(document.getElementById("days").value || 0);
  const startDate = new Date(document.getElementById("startDate").value);

  const dailyRate = 0.10;       // 10% daily profit
  const reinvestRate = 0.20;    // 20% reinvested
  const realisedRate = 0.80;    // 80% realised profit

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
  let totalRealised = 0;
  let dataRows = "";

  while (date <= endDate) {
    const day = date.getDay();

    // Only Monday to Friday
    if (day !== 0 && day !== 6) {
      const startingBalance = balance;

      // Calculate 10% daily profit
      const earning = round(startingBalance * dailyRate, 2);

      // Reinvest 20% of daily profit
      const reinvested = round(earning * reinvestRate, 2);

      // Remaining 80% is realised profit
      const realised = round(earning - reinvested, 2);

      // Only reinvested amount increases balance
      balance = round(balance + reinvested, 2);

      // Track totals
      totalEarnings = round(totalEarnings + earning, 2);
      totalReinvested = round(totalReinvested + reinvested, 2);
      totalRealised = round(totalRealised + realised, 2);

      const maxLotSize = calcMaxLotSize(balance);
      const maxLayers = round(maxLotSize / 0.01, 2);

      dataRows += `
        <tr>
          <td>${formatDate(date)}</td>
          <td>${getDayName(date)}</td>
          <td>${formatNum(startingBalance)}</td>
          <td>${formatNum(earning)}</td>
          <td>${formatNum(reinvested)}</td>
          <td>${formatNum(realised)}</td>
          <td>${formatNum(totalRealised)}</td>
          <td>${formatNum(balance)}</td>
          <td>${formatNum(maxLotSize)}</td>
          <td>${formatNum(maxLayers)}</td>
        </tr>
      `;
    }

    date.setDate(date.getDate() + 1);
  }

  const totalValue = round(balance + totalRealised, 2);
  const profitPercent = round((totalEarnings / principal) * 100, 2);

  document.getElementById("summary").innerHTML = `
    <p><strong>Initial Investment:</strong> $${formatNum(principal)}</p>
    <p><strong>Final Account Balance:</strong> $${formatNum(balance)}</p>
    <p><strong>Total Profit Generated:</strong> $${formatNum(totalEarnings)}</p>
    <p><strong>Total Reinvested (20%):</strong> $${formatNum(totalReinvested)}</p>
    <p><strong>Total Realised Profit (80%):</strong> $${formatNum(totalRealised)}</p>
    <p><strong>Combined Value:</strong> $${formatNum(totalValue)}</p>
    <p><strong>Percentage Profit:</strong> ${profitPercent.toLocaleString()}%</p>
    <p><strong>Start Date:</strong> ${formatDate(startDate)}</p>
    <p><strong>End Date:</strong> ${formatDate(endDate)}</p>
  `;

  document.querySelector("#breakdown thead").innerHTML = `
    <tr>
      <th>Date</th>
      <th>Day</th>
      <th>Starting Balance</th>
      <th>Daily Profit (10%)</th>
      <th>Reinvested (20%)</th>
      <th>Realised (80%)</th>
      <th>Total Realised</th>
      <th>Closing Balance</th>
      <th>Max Lot Size</th>
      <th>Max Layers</th>
    </tr>
  `;

  document.querySelector("#breakdown tbody").innerHTML = dataRows;
}
