/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";

// Helper to strip HTML tags
const stripHtml = (html) => {
  if (typeof html !== "string") return html;
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const ExportButtons = ({ data, fileName = "export", fields }) => {
  const [modalMessage, setModalMessage] = useState("");
  const users = data || [];

  const headers =
    Array.isArray(fields) && fields.length > 0
      ? fields
      : users.length > 0
        ? Object.keys(users[0])
        : [];

  const showModal = (message) => {
    setModalMessage(message);
  };

  const closeModal = () => {
    setModalMessage("");
  };

  const sanitizedValue = (value) => stripHtml(value);

  const copyToClipboard = () => {
    const tsv = [
      headers.join("\t"),
      ...users.map((user) =>
        headers.map((header) => sanitizedValue(user[header])).join("\t")
      ),
    ].join("\n");

    navigator.clipboard
      .writeText(tsv)
      .then(() => showModal("Table data copied to clipboard"))
      .catch(() => showModal("Failed to copy table data"));
  };

  const exportToExcel = () => {
    const worksheetData = users.map((user) => {
      const row = {};
      headers.forEach((key) => {
        row[key] = sanitizedValue(user[key]);
      });
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToCSV = () => {
    const worksheetData = users.map((user) => {
      const row = {};
      headers.forEach((key) => {
        row[key] = sanitizedValue(user[key]);
      });
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const print = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(
      "<style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(`<h1>${fileName}</h1>`);
    printWindow.document.write("<table>");
    printWindow.document.write(
      `<thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>`
    );
    printWindow.document.write("<tbody>");
    users.forEach((user) => {
      printWindow.document.write(
        `<tr>${headers.map((header) => `<td>${user[header]}</td>`).join("")}</tr>`
      );
    });
    printWindow.document.write("</tbody></table>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="d-flex gap-2">
        <button onClick={copyToClipboard} className="btn btn-secondary btn-sm">
          COPY
        </button>
        <button onClick={exportToExcel} className="btn btn-secondary btn-sm">
          EXCEL
        </button>
        <button onClick={exportToCSV} className="btn btn-secondary btn-sm">
          CSV
        </button>
        <button onClick={print} className="btn btn-secondary btn-sm">
          PDF
        </button>
      </div>
      {modalMessage && <Modal message={modalMessage} onClose={closeModal} />}
    </>
  );
};

ExportButtons.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileName: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.string),
};

export default ExportButtons;

const Modal = ({ message, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "48px", color: "#4CAF50" }}>!</div>
      <h2>Notification</h2>
      <p>{message}</p>
      <div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            margin: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          OK
        </button>
      </div>
    </div>
  </div>
);
