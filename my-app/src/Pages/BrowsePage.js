import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import "./BrowsePage.css";

function BrowsePage() {
  const [fileList, setFileList] = useState([]);
  const [finalList, setFinalList] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(0);
  const history = useHistory();

  async function getdata(entryNumber) {
    const res = await fetch("http://localhost:8080/getFileList", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        currentEntry: entryNumber ? entryNumber : currentEntry,
      }),
    });

    const result = await res.json();
    console.log("entries: ", result);
    if (result.result == "success") {
      // setCurrentEntry(result.loadedEntries);
      // console.log("")
    }
    setFileList(result.list);
  }

  useEffect(async () => {
    getdata();
  }, []);

  useEffect(() => {
    let list = fileList.map((file) => {
      return (
        <div className="card">
          <div className="thumbnail">
            <img
              src={`http://localhost:8080/${file.thumbnail}`}
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="entry-info">
            <div className>
              <h1>{file.title}</h1>
            </div>
            <div>
              <h4>Language: {file.language}</h4>
            </div>
            <div className="year">
              <h4>{file.year}</h4>
            </div>
          </div>
        </div>
      );
    });
    setFinalList(list);
  }, [fileList]);

  return (
    <div style={{ position: "relative", zIndex: 1, display: "flex" }}>
      <div className="experiment"></div>
      <div style={{ width: "50%" }}>
        {currentEntry >= 0 ? (
          <div className="pagination">
            <span
              onClick={() => {
                console.log("currentEntry: ", currentEntry);
                if (currentEntry > 0) {
                  setCurrentEntry(currentEntry > 0 ? currentEntry - 6 : 0);
                  getdata(currentEntry - 6);
                }
                // else if(currentEntry )
                 else {
                  setCurrentEntry(0)
                  getdata(0);
                }
              }}
            >
              Previous
            </span>
          </div>
        ) : (
          <div></div>
        )}
        <div className="video-entry">{finalList}</div>
        <div className="pagination">
          <span
            onClick={() => {
              console.log("currentEntry: ", currentEntry);
              setCurrentEntry(currentEntry + 6);
              getdata(currentEntry + 6);
            }}
          >
            Next
          </span>
        </div>
      </div>
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          right: 0,
          height: "100%",
        }}
        className="heading"
      >
        <h1>YOUR</h1>
        <h1>UPLOADS</h1>
      </div>
      <div
        className="upload-page-btn"
        onClick={() => {
          history.push("/upload");
        }}
      >
        <img src="/svg/upload.svg" width="100%" />
      </div>
    </div>
  );
}

export default BrowsePage;
