import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SaveAsIcon from '@mui/icons-material/SaveAs';

const formatTime = (time) => {
  if (!time) return "N/A";

  // Check if time already includes AM or PM
  if (time.includes("AM") || time.includes("PM")) {
    // Ensure proper formatting with padded hour
    const [hour, minute, second] = time.split(/[: ]/); // Split by ':' or space
    const paddedHour = hour.padStart(2, "0"); // Pad hour if necessary
    return `${paddedHour}:${minute}:${second} ${time.slice(-2)}`;
  }

  const [hour, minute, second] = time.split(":");
  const hour24 = parseInt(hour, 10);
  const hour12 = hour24 % 12 || 12; // Convert to 12-hour format
  const ampm = hour24 < 12 ? "AM" : "PM";
  return `${String(hour12).padStart(2, "0")}:${minute}:${second} ${ampm}`;
};

const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

const ViewAttendanceRecord = () => {
  const [personID, setPersonID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [personName, setPersonName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/attendance/api/all-attendance", { personID, startDate, endDate });
      setRecords(response.data);

      if (response.data.length > 0) {
        setPersonName(response.data[0].PersonName);
      } else {
        setPersonName("");
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  const currentYear = 2024;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthClick = (monthIndex) => {
    const year = 2024;
  
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0)); // last day of month
  
    // format as YYYY-MM-DD (ISO format expected by <TextField type="date" />)
    const formattedStart = start.toISOString().substring(0, 10);
    const formattedEnd = end.toISOString().substring(0, 10);
  
    setStartDate(formattedStart);
    setEndDate(formattedEnd);
  };

  // const handleSaveRecords = async () => {
  //   try {
  //     const formattedRecords = records.map(record => ({
  //       personID: record.PersonID,
  //       date: record.Date,
  //       Day: getDayOfWeek(record.Date),
  //       timeIN: record.Time1 || null,
  //       breaktimeIN: record.Time2 || null,
  //       breaktimeOUT: record.Time3 || null,
  //       timeOUT: record.Time4 || null
  //     }));

  //     const response = await axios.post('http://localhost:5000/api/save-attendance', { records: formattedRecords });

  //     const savedMessages = response.data.map(result =>
  //       result.status === 'exists'
  //         ? `Record for ${result.personID} on ${result.date} already exists.`
  //         : `Record for ${result.personID} on ${result.date} saved successfully.`
  //     );

  //     alert(savedMessages.join('\n'));
  //   } catch (error) {
  //     console.error('Error saving attendance records:', error);
  //   }
  // };
  const handleSaveRecords = async () => {
    try {
      const formattedRecords = records.map((record) => ({
        personID: record.PersonID,
        date: record.Date,
        Day: getDayOfWeek(record.Date),
        timeIN: record.Time1 ? formatTime(record.Time1) : null,
        breaktimeIN: record.Time2 ? formatTime(record.Time2) : null,
        breaktimeOUT: record.Time3 ? formatTime(record.Time3) : null,
        timeOUT: record.Time4 ? formatTime(record.Time4) : null,
      }));

      const response = await axios.post("http://localhost:5000/attendance/api/save-attendance", { records: formattedRecords });

      const savedMessages = response.data.map((result) => (result.status === "exists" ? `Record for ${result.personID} on ${result.date} already exists.` : `Record for ${result.personID} on ${result.date} saved successfully.`));

      alert(savedMessages.join("\n"));
    } catch (error) {
      console.error("Error saving attendance records:", error);
    }
  };

  return (
    <Container>
          <div
                      style={{
                        backgroundColor: '#6D2323',
                        color: '#ffffff',
                        padding: '20px',
                        width: '96.5%',
                        borderRadius: '8px',
                        borderBottomLeftRadius: '0px',
                        borderBottomRightRadius: '0px',
                       
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', color: '#ffffff', }}>
                        <SearchIcon sx={{ fontSize: '3rem', marginRight: '16px', marginTop: '5px', marginLeft: '5px' }} />
                        <div>
                          <h4 style={{ margin: 0, fontSize: '150%', marginBottom: '2px' }}>
                            View Attendance Records
                          </h4>
                          <p style={{ margin: 0, fontSize: '85%' }}>
                          Generate & review attendance records
             
                          </p>
                        </div>
                      </div>                        
                      </div>
                      
                          
    <Container sx={{bgcolor: "white", height: "90%", paddingTop: "-5px",  paddingBottom: '-10px', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px',}}>
      {/* Month Buttons */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2, pt: 5 }}>
        {months.map((month, index) => (
          <Button
            key={month}
            variant="contained"
            onClick={() => handleMonthClick(index)}
            sx={{
              backgroundColor: "#6D2323",
              color: "white", // optional: text color for contrast
              "&:hover": {
                backgroundColor: "#d4bd99", // optional: slightly darker hover effect
              },
            }}
          >
            {month}
          </Button>
        ))}
      </Box>

    <div style={{ padding: "10px", marginLeft:'-10px', paddingTop:'25px' }}>

      
      <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
        <TextField
          label="Enter Person ID"
          value={personID}
          onChange={(e) => setPersonID(e.target.value)}
          required
          fullWidth
          margin="normal"
          sx={{ width: "250px", marginLeft: "50px" }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
        sx={{
          width: "250px",
          height: "54px",
          marginLeft: "10px",
          marginTop: "14px",
        }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
        sx={{
          width: "250px",
          height: "54px",
          marginLeft: "10px",
          marginTop: "14px",
        }}
        InputLabelProps={{ shrink: true }}
      />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            width: "200px",
            height: "54px",
            marginLeft: "10px",
            marginTop: "14px",
            bgcolor: "#6D2323",
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          startIcon={<SearchIcon />}

        >
          
          Search Record
        </Button>

      </form>

      {personName && (
        <Typography variant="h5" gutterBottom sx={{textAlign:'center', bgcolor: '#6D2323', color:'white', borderRadius:'5px', padding:'10px'}}>
          Device Record for <b>{personName}</b>
        </Typography>
      )}
      {records.length > 0 && (
        <TableContainer component={Paper} style={{ marginBottom: "5%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PersonID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Time IN</TableCell>
                <TableCell>Breaktime IN</TableCell>
                <TableCell>Breaktime OUT</TableCell>
                <TableCell>Time OUT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.PersonID}</TableCell>
                  <TableCell>{record.Date}</TableCell>
                  <TableCell>{getDayOfWeek(record.Date)}</TableCell>
                  <TableCell>{formatTime(record.Time1)}</TableCell>
                  <TableCell>{formatTime(record.Time2)}</TableCell>
                  <TableCell>{formatTime(record.Time3)}</TableCell>
                  <TableCell>{formatTime(record.Time4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="contained" color="secondary" onClick={handleSaveRecords} style={{ marginTop: "16px", backgroundColor: '#6D2323' }
        
        }
        startIcon={<SaveAsIcon />}

        >
            Save Records
          </Button>
        </TableContainer>
      )}
    </div>
    </Container>
    </Container>
  );
};

export default ViewAttendanceRecord;
