import React, { useEffect } from 'react';
import { Grid, TextField, Button, Typography, Container, Checkbox, FormControlLabel, Divider } from '@mui/material';
import { useSocket } from '../../Contexts/SocketProvider';
import { useState } from 'react';
import ReactMarkdown from "react-markdown";
import { useLoading } from '../../Contexts/LoadingContext';
import html2pdf from 'html2pdf.js';

function Material() {
  const [includeMedia, setIncludeMedia] = useState(false);
  const [includeProblems, setIncludeProblems] = useState(false);
  const [topic, setTopic] = useState("");
  const [numberOfProblems, setNumberOfProblems] = useState(0);
  const [content, setContent] = useState("");
  const socket = useSocket();
  const { startLoading, finishLoading } = useLoading()
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    startLoading();
    socket.emit('process-prompt', {
      prompt: `Make a study material (in detail) for the topic : ${topic}  with these options: ${includeMedia ? "include Media" : "don't include Media"}, ${includeProblems ? `include Practice Problems (${numberOfProblems} problems)` : "don't include Practice Problems. also try to exaplain all concepts of it"}`,
      feature: 'material',
      prompt_type: 'text',
      topic: topic,
      options: {
        media: includeMedia,
        problems: includeProblems,
        numberOfProblems: includeProblems ? numberOfProblems : 0 // Send 0 if problems are not included
      }
    });
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('contentToDownload');
    if (!element) {
      console.error('Content element not found');
      return;
    }

    console.log('Generating PDF...');

    html2pdf()
      .from(element)
      .save()
      .then(() => {
        console.log('PDF generated successfully');
        // Trigger download
        const pdfBlob = new Blob([element.innerHTML], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = 'study_material.pdf'; // Set the filename for the downloaded file
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pdfUrl);
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };



  useEffect(() => {
    if (socket) {
      socket.on('processed-prompt-material', data => {
        setContent(data);
        finishLoading();
      });

      socket.on('material-status', data => {
        setStatus(data)
      })
    }
  }, [socket]);

  // Function to handle changes in the number of problems
  const handleNumberOfProblemsChange = (event) => {
    const value = parseInt(event.target.value);
    // Limit the number of problems to a certain range (e.g., 1 to 10)
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setNumberOfProblems(value);
    }
  };

  return (
    <>
      <Container >
        <Typography variant="h4" align="center" gutterBottom>
          Study Material Generator
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <TextField
                onChange={(e) => setTopic(e.target.value)}
                variant="outlined"
                label="Enter Topic"
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeProblems}
                    onChange={(e) => setIncludeProblems(e.target.checked)}
                    name="includeProblems"
                  />
                }
                label="Include Practice Problems"
              />
            </Grid>
            {includeProblems && (
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  value={numberOfProblems}
                  onChange={handleNumberOfProblemsChange}
                  variant="outlined"
                  label="Number of Problems (1-10)"
                  fullWidth
                  required
                  inputProps={{ min: 1, max: 10 }} // Set min and max values for input
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Generate
              </Button>
            </Grid>
          </Grid>
        </form>
        <Typography variant='h8'>{status}</Typography>
      </Container>


      {content && (
        <Container>
          <Divider color='white' style={{
            marginTop: "10px",
            marginBottom: "10px"
          }} />
          <div id="contentToDownload">
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
          <Button
            onClick={handleDownloadPDF}
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '10px' }}
          >
            Download PDF
          </Button>
        </Container>
      )}
    </>
  );
}

export default Material;
