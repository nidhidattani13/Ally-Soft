const tableBody = document.getElementById("tableBody");

function addRow() {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" placeholder="Product Name"></td>
    <td>
      <select>
        <option value="nos">Nos</option>
        <option value="pcs">Pcs</option>
        <option value="kgs">Kgs</option>
        <option value="dz">Dz</option>
        <option value="boxes">Boxes</option>
      </select>
    </td>
    <td><input type="number" min="0" placeholder="Rate"></td>
    <td><input type="number" min="0" placeholder="Quantity"></td>
    <td><input type="number" min="0" max="100" placeholder="Discount %"></td>
    <td><input type="number" min="0" max="100" placeholder="Tax %"></td>
    <td><input type="text" readonly></td>
    <td>
      <button type="button" onclick="deleteRow(this)">Delete</button>
    </td>
  `;

  row.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => calculate(row));
  });

  tableBody.appendChild(row);
  calculate(row);
}

function deleteRow(button) {
  if (tableBody.rows.length > 1) {
    button.closest("tr").remove();
    updateSummary();
  }
}

function calculate(row) {
  const rate = parseFloat(row.cells[2].querySelector("input").value) || 0;
  const qty = parseFloat(row.cells[3].querySelector("input").value) || 0;
  const discount = parseFloat(row.cells[4].querySelector("input").value) || 0;
  const tax = parseFloat(row.cells[5].querySelector("input").value) || 0;

  let price = rate * qty;
  let afterDiscount = price - (price * (discount / 100));
  let taxAmount = afterDiscount * (tax / 100);
  let finalAmount = afterDiscount + taxAmount;

  row.cells[6].querySelector("input").value = finalAmount.toFixed(2);

  updateSummary();
}

function updateSummary() {
  let totalQuantity = 0;
  let totalProducts = 0;
  let subtotal = 0;
  let totalTax = 0;

  [...tableBody.rows].forEach(row => {
    const rate = parseFloat(row.cells[2].querySelector("input").value) || 0;
    const qty = parseFloat(row.cells[3].querySelector("input").value) || 0;
    const discount = parseFloat(row.cells[4].querySelector("input").value) || 0;
    const tax = parseFloat(row.cells[5].querySelector("input").value) || 0;

    if (rate > 0 && qty > 0) {
      totalQuantity++;
      totalProducts += qty;

      let price = rate * qty;
      let afterDiscount = price - (price * (discount / 100));
      let taxAmount = afterDiscount * (tax / 100);

      subtotal += afterDiscount;
      totalTax += taxAmount;
    }
  });

  const totalAmount = subtotal + totalTax;
  const roundedTotal = Math.round(totalAmount);
  const roundOff = +(roundedTotal - totalAmount).toFixed(2); 

  const cgst = totalTax / 2;
  const sgst = totalTax / 2;

  document.getElementById("totalProducts").textContent = totalQuantity + " (" + totalProducts + ")";
  document.getElementById("afterDiscount").textContent = subtotal.toFixed(2);
  document.getElementById("cgst").textContent = cgst.toFixed(2);
  document.getElementById("sgst").textContent = sgst.toFixed(2);
  document.getElementById("totalAmount").textContent = totalAmount.toFixed(0);
  document.getElementById("finalAmount").textContent = roundOff.toFixed(2); 
}


addRow();
