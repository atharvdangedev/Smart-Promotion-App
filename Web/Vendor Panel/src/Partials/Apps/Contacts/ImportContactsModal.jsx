/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { handleApiError } from "../utils/handleApiError";
import toast from "react-hot-toast";

const ImportContactsModal = ({ show, onClose }) => {
  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else if (selectedFile) {
      alert("Only CSV files are allowed!");
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a CSV file.");
      return;
    }

    setLoading(true);

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
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        onClose();
      }
    } catch (error) {
      handleApiError(error, "importing", "contacts");
    } finally {
      setLoading(false);
    }
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
              onClick={onClose}
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
                accept=".csv"
                onChange={handleFileChange}
              />
            </div>

            {file && (
              <div className="alert alert-info p-2">
                <strong>File:</strong> {file.name} <br />
                <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
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
