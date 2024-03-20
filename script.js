function uploadFile() {
    const input = document.getElementById("input-file");
    if (!input.files.length) {
      alert("Please select a file to upload");
      return;
    }
    const file = input.files[0];
    const formData = new FormData();
    formData.append("userImage", file);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          // If server response is not OK, throw an error
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse JSON response
      })
     .then((data) => {
    if (data.success) {
      alert("Upload successful!"); // Alert success
      console.log(data.message); // Log success message
    } else {
      throw new Error("Upload failed: " + data.message); // Throw error on failure
    }
})
  }

  
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".upload").addEventListener("click", uploadFile);
  });
