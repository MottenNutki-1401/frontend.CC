export const handleFileChange = (e, setFiles) => {
  const selectedFiles = Array.from(e.target.files);
  setFiles(selectedFiles);
};

export const handleDrop = (e, setFiles) => {
  e.preventDefault();

  const droppedFiles = Array.from(e.dataTransfer.files);
  setFiles(droppedFiles);
};

export const handleDragOver = (e) => {
  e.preventDefault();
};



//export const handleFileChange = (event, setFiles) => {
 // setFiles(event.target.files);
//};

//export const handleDrop = (event, setFiles) => {
  //event.preventDefault();
  //const droppedFiles = event.dataTransfer.files;
 // setFiles(droppedFiles);
//};

//export const handleDragOver = (event) => {
 // event.preventDefault();
//};