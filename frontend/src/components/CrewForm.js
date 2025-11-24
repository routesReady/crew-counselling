import React, { useState, useEffect } from "react";
import "./CrewForm.css";

const CrewForm = () => {
  const [crewId, setCrewId] = useState("");
  const [fetchedUser, setFetchedUser] = useState(null);
  const [formData, setFormData] = useState({
    roadYear: "",
    roadNumber: "",
    type: "",
    place: "",
    remark: "",
    date: "",
    authorizedUser: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔗 Replace this with your actual Render backend URL
  const BACKEND_URL = "https://crew-counselling-backend.onrender.com";

  const authorizedUsers = [
    "AIJAZ AHMED",
    "AJAY KUMAR I",
    "ASHOK KUMAR",
    "CHANDRA SHEKHAR SHARMA",
    "CHHAVI KUMAR JAIN",
    "D R PARIHAR",
    "G C AGRAWAL",
    "GANGA CHARAN P",
    "JAGDISH BANGAD",
    "JAGDISH I",
    "JAI PRAKASH SINGH",
    "LAXMI NARAYAN MEENA",
    "LILA RAM B",
    "MANOHAR LAL SINGH",
    "MITHILESH PRASAD",
    "MUJAHAT.ALI.KHAN",
    "MUKESH KUMAR CHALIYAN",
    "NAHAR SINGH MEENA",
    "NETRAM MEENA",
    "OM PRAKASH KAUSHIK",
    "PADAM SINGH GURJAR",
    "PRAHALAD KUMAR MEENA",
    "RAJENDRA KUMAR PATHAWAR",
    "RAKESH KARA",
    "RAKESH NARAYAN DUBEY",
    "RAM NIWAS MEENA",
    "RAMESH CHAND VERMA",
    "RAMGOPAL YADAV",
    "RAMOTAR MEENA",
    "SANJAY KUMAR JAIN",
    "SANTOSH SHARMA",
    "SATISH KR SHARMA",
    "SATYANARAIN",
    "SHRIPRAKASH SHARMA",
    "SURYA PRAKASH",
    "SUSHIL KUMAR MISHRA",
    "TEJ PAL MEENA",
    "UMESH CHAND R GUPTA",
    "Y K SHARMA",
    "Sr. DEE/TRO",
    "DEE/TRO",
    "ADEE/TRO",
    "Others",
  ];

  // 🚫 Prevent navigating back to cached page
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, []);

  const fetchUser = async () => {
    setMessage("");
    if (!formData.authorizedUser) {
      setMessage("⚠️ Please select an authorized user first.");
      return;
    }
    if (!crewId) {
      setMessage("⚠️ Please enter a CREW ID.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/fetchUser/${crewId}`);
      if (!res.ok) throw new Error("Crew not found");
      const data = await res.json();
      setFetchedUser(data);
      setMessage("✅ Crew data fetched successfully!");
    } catch {
      setMessage("❌ Crew not found. Please check the ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const insertData = async () => {
    if (!fetchedUser) {
      setMessage("⚠️ Please fetch crew data first.");
      return;
    }

    const { roadYear, roadNumber, type, place, remark, date, authorizedUser } =
      formData;
    if (
      !roadYear ||
      !roadNumber ||
      !type ||
      !place ||
      !remark ||
      !date ||
      !authorizedUser
    ) {
      setMessage("❌ Please fill in all required fields before inserting data.");
      return;
    }

    const combinedData = {
      CREWID: fetchedUser.CREWID,
      CREW_NAME: fetchedUser.CREW_NAME,
      DSG: fetchedUser.DSG,
      HQ: fetchedUser.HQ,
      CLI_Name: fetchedUser.CLI_Name,
      AuthorizedUser: authorizedUser,
      RoadRegYear: roadYear,
      RoadRegNumber: roadNumber,
      Type: type,
      Place: place,
      Remark: remark,
      Date: date,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/insertUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combinedData),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage("✅ Data inserted successfully!");
        setFetchedUser(null);
        setCrewId("");
        setFormData({
          roadYear: "",
          roadNumber: "",
          type: "",
          place: "",
          remark: "",
          date: "",
          authorizedUser: "",
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ " + result.message);
      }
    } catch {
      setMessage("❌ Failed to insert data.");
    }
  };

  const handleDownload = () => {
    window.open(`${BACKEND_URL}/download`);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Crew Counselling Form</h1>
        <h2>Kota Division, WCR</h2>

        <div className="form-section">
          <label>Authorized User:</label>
          <select
            name="authorizedUser"
            value={formData.authorizedUser}
            onChange={handleChange}
            required
          >
            <option value="">Select Authorized User</option>
            {authorizedUsers.map((user, i) => (
              <option key={i} value={user}>
                {user}
              </option>
            ))}
          </select>

          <label>Enter Counselling Crew ID:</label>
          <input
            type="text"
            value={crewId}
            onChange={(e) => setCrewId(e.target.value)}
            placeholder="e.g. KOTA1026"
          />
          <button onClick={fetchUser} disabled={loading}>
            {loading ? "Fetching..." : "Fetch Data"}
          </button>
        </div>

        {fetchedUser && (
          <div className="data-section">
            <h2>Fetched Crew Details</h2>
            <p>
              <b>CREWID:</b> {fetchedUser.CREWID}
            </p>
            <p>
              <b>Name:</b> {fetchedUser.CREW_NAME}
            </p>
            <p>
              <b>Designation:</b> {fetchedUser.DSG}
            </p>
            <p>
              <b>Headquarter:</b> {fetchedUser.HQ}
            </p>
            <p>
              <b>CLI Name:</b> {fetchedUser.CLI_Name}
            </p>

            <div className="extra-fields">
              <label>Road Reg No.:</label>
              <div className="row">
                <select
                  name="roadYear"
                  value={formData.roadYear}
                  onChange={handleChange}
                >
                  <option value="">Year</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
                <input
                  type="text"
                  name="roadNumber"
                  placeholder="Enter Number"
                  value={formData.roadNumber}
                  onChange={handleChange}
                />
              </div>

              <label>Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="FP">FP</option>
                <option value="Lobby">Lobby</option>
                <option value="Yard">Yard</option>
                <option value="R/Room">R/Room</option>
                <option value="Station">Station</option>
                <option value="Other">Other</option>
              </select>

              <label>Place/Section:</label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
              />

              <label>Remark (max 50 chars):</label>
              <input
                type="text"
                name="remark"
                maxLength="50"
                value={formData.remark}
                onChange={handleChange}
              />

              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />

              <button onClick={insertData}>Insert Data</button>
            </div>
          </div>
        )}

        {message && <div className="message">{message}</div>}

        <button onClick={handleDownload} className="download-btn">
          📥 Download Inserted Data
        </button>

        <footer>
          <p>Created By - M. A. Khan (CLI/GGC/WCR)</p>
          <p>
            Guidance By - Kirtesh Meena (Sr. DEE/TRO), Vivek Khare (DEE/TRO)
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CrewForm;

