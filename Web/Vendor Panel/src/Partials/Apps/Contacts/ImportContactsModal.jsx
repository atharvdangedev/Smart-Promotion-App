/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { handleApiError } from "../utils/handleApiError";
import toast from "react-hot-toast";

const ImportContactsModal = ({ show, onClose }) => {
  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const resetInput = () => {
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      const isCsv =
        selectedFile.type === "text/csv" ||
        selectedFile.type === "application/vnd.ms-excel" ||
        selectedFile.name.toLowerCase().endsWith(".csv");

      if (isCsv) {
        setFile(selectedFile);
      } else {
        toast.error("Only CSV files are allowed!");
        resetInput();
      }
    }
  };

  const handleClose = () => {
    resetInput();
    onClose();
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a CSV file.");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("csv_file", file);

      const response = await axios.post(
        `${APP_URL}/${user.rolename}/contacts/import-contacts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            }
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        resetInput();
        onClose();
      }
    } catch (error) {
      handleApiError(error, "importing", "contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const headers = [
      "contact_name",
      "contact_number",
      "email",
      "birthdate",
      "label",
      "note",
    ];
    const exampleRow = [
      "Jane Smith",
      "8149017842",
      "jane@example.com",
      "01-01-1990",
      "Client",
      "Met at expo",
    ];
    const csvContent = [headers.join(","), exampleRow.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered edit-shareable-popup">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom border-light bg-light">
            <h5 className="modal-title text-primary">
              <strong>Import Contacts</strong>
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="csvFile" className="form-label">
                Select CSV file
              </label>
              <input
                type="file"
                className="form-control"
                id="csvFile"
                accept=".csv,text/csv,application/vnd.ms-excel"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            {/* Guidelines Section */}
            <div className="alert alert-warning small">
              <h6 className="fw-bold">CSV Guidelines</h6>
              <ul className="mb-0">
                <li>
                  <strong>contact_name (required):</strong> Text only, no
                  numbers/symbols (allowed: spaces, - , '). Example:{" "}
                  <em>Jane Smith</em>
                </li>
                <li>
                  <strong>contact_number (required):</strong> Digits only,
                  length 10–15. No spaces or +. Example: <em>8149011956</em>
                </li>
                <li>
                  <strong>email (required):</strong> Must be valid format{" "}
                  <em>(local@domain.tld)</em>. Example:{" "}
                  <em>jane@example.com</em>
                </li>
                <li>
                  <strong>birthdate (optional):</strong> Format{" "}
                  <em>DD-MM-YYYY</em>, must be a valid date. Example:{" "}
                  <em>01-01-1990</em>
                </li>
                <li>
                  <strong>label (optional):</strong> One word/short tag like{" "}
                  <em>Client</em>, <em>Lead</em>, <em>Vendor</em>.
                </li>
                <li>
                  <strong>note (optional):</strong> Free text, max ~255
                  characters. Example: <em>Met at expo</em>.
                </li>
              </ul>
              <button
                type="button"
                className="btn btn-link p-0 mt-2"
                onClick={handleDownloadSample}
              >
                📥 Download Sample CSV
              </button>
            </div>

            {file && (
              <div className="alert alert-info p-2">
                <strong>File:</strong> {file.name} <br />
                <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
              </div>
            )}

            {loading && (
              <div className="mt-3">
                <label className="form-label">Uploading...</label>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                  >
                    {progress}%
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportContactsModal;
