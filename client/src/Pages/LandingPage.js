import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [uploadBtnState, setUploadBtnState] = useState("UPLOAD");
  const [uploading, setUploading] = useState(false);
  const [uploadedThumbnail, setUploadedThumbnail] = useState("");
  const [uploadedVideo, setUploadedVideo] = useState("");
  const [language, setLanguage] = useState("");
  const [languageValidation, setLanguageValidation] = useState("");
  const [nameValidation, setNameValidation] = useState("");
  const [yearValidation, setYearValidation] = useState("");
  const [thumbnailValidation, setThumbnailValidation] = useState("");
  const [videoValidation, setVideoValidation] = useState("");
  let formData = new FormData();
  const [formdata, setFormData] = useState(formData);
  const history = useHistory();

  async function uploadMovie(files) {
    const tempFormData = formdata;
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    tempFormData.set("file", await files[0]);
    setFormData(tempFormData);
    console.log("from inside: ", files);
    setUploadedVideo(files[0].name);
    console.log("form data: ", ...formdata);
  }

  async function uploadImage(files) {
    const tempFormData = formdata;
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    tempFormData.set("thumbnail", await files[0]);
    setFormData(tempFormData);
    console.log("from inside: ", files);
    setUploadedThumbnail(files[0].name);
    console.log("form data: ", ...formdata);
  }

  function validate() {
    let points = 0;
    if (name.length == 0) {
      setNameValidation("This field is necessary");
    } else {
      setNameValidation("");
      points += 1;
    }
    if (year.length != 4) {
      setYearValidation("Invalid Year");
    } else {
      points += 1;
      setYearValidation("");
    }
    if (language.length == 0) {
      setLanguageValidation("This field is necessary");
    } else {
      setLanguageValidation("");
      points += 1;
    }
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    //   if (key != "thumbnail") {
    //     setThumbnailValidation("upload a thumbnail");
    //     points += 1;
    //   } else {
    //     setThumbnailValidation("");
    //   }

    //   if (key != "file") {
    //     setVideoValidation("upload a video file");
    //     points += 1;
    //   } else {
    //     setVideoValidation("");
    //   }
    // }
    if (points == 3) {
      return true;
    } else {
      return false;
    }
  }

  async function submit() {
    if (validate() == true) {
      setUploading(true);
      setUploadBtnState("Uploading...");
      const finalFormData = formdata;
      finalFormData.set("title", name);
      finalFormData.set("year", year);
      finalFormData.set("language", language);

      const data = new URLSearchParams(formdata);

      console.log("data: ", ...data);
      const res = await fetch(process.env.REACT_APP_API_URL + "/saveFile", {
        method: "POST",
        body: formdata,
      });

      const result = await res.json();
      if (result.result == "success") {
        setUploading(false);
        setUploadBtnState("UPLOAD");
        setThumbnailValidation("");
        setVideoValidation("");
      } else if (result.result == "no files") {
        setUploading(false);
        setUploadBtnState("UPLOAD");
        setThumbnailValidation("upload this file");
        setVideoValidation("upload this file");
      }
      setFormData(new FormData());
    }
  }

  return (
    // <div className="main">
    // </div>
    <div className="upload-page">
      <div className="video-info">
        <div className="title">
          <span>ENTER THE MOVIE INFO</span>
        </div>
        <div className="input">
          <input
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
          <span className="label">Movie Name</span>
          <div className="error">
            <span>{nameValidation}</span>
          </div>
        </div>
        <div className="input">
          <input
            type="text"
            onChange={(e) => {
              setYear(e.target.value);
            }}
            value={year}
          />
          <span className="label">Year of Release</span>
          <div className="error">
            <span>{yearValidation}</span>
          </div>
        </div>
        <div className="input">
          <input
            type="text"
            onChange={(e) => {
              setLanguage(e.target.value);
            }}
            value={language}
          />
          <span className="label">Language</span>
          <div className="error">
            <span>{languageValidation}</span>
          </div>
        </div>
        <div
          className="upload-btn"
          onClick={() => {
            if (!uploading) {
              submit();
            }
          }}
          disabled="true"
        >
          <span>{uploadBtnState}</span>
        </div>
        <div
          className="upload-btn"
          onClick={() => {
            if (!uploading) {
              history.push("/");
            }
          }}
        >
          <span>Cancel</span>
        </div>
      </div>
      <div className="upload">
        <div className="upload-section">
          <div className="title">
            <span>UPLOAD FILES</span>
          </div>
          <div className="upload-thumbnail">
            <div>
              <h3>Upload Thumbnail: </h3>
              <p>The size of the thumbnail should be below 2mb.</p>
              <p>Supported file formats are JPG and PNG</p>
              <div className="error">
                <span>{thumbnailValidation}</span>
              </div>
            </div>
            <div className="drop-thumbnail">
              <Dropzone onDrop={(acceptedFiles) => uploadImage(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <span
                        style={{ fontSize: "0.75rem" }}
                        className="drop-text"
                      >
                        {uploadedThumbnail
                          ? uploadedThumbnail.slice(0, 25) + "..."
                          : "Drag 'n' drop some files here, or click to select files"}
                      </span>
                      <img
                        src="/svg/thumbnail.svg"
                        style={{ display: "block" }}
                        className="drop-img"
                      />
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </div>
          <hr />
          <div className="upload-thumbnail">
            <div>
              <h3>Upload Movie: </h3>
              <p>The size of the movie should be below 100mb.</p>
              <p>Supported file formats are wmv and mp4</p>
              <div className="error">
                <span>{videoValidation}</span>
              </div>
            </div>
            <div className="drop-thumbnail">
              <Dropzone onDrop={(acceptedFiles) => uploadMovie(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <span
                        style={{ fontSize: "0.75rem" }}
                        className="drop-text"
                      >
                        {uploadedVideo
                          ? uploadedVideo.slice(0, 25) + "..."
                          : "Drag 'n' drop some files here, or click to select files"}
                      </span>
                      <img
                        src="/svg/movie.svg"
                        style={{ display: "block" }}
                        className="drop-img"
                      />
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
