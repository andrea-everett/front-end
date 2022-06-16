const FetchApi = (imageUrl) => {
    const raw = JSON.stringify({
      user_app_id: {
        user_id: "sdpibbilqljk",
        app_id: "smart",
      },
      inputs: [
        {
          data: {
            image: {
              // url: "https://api.time.com/wp-content/uploads/2014/06/screen-shot-2014-06-09-at-9-20-55-am.png"
              url: imageUrl
              // url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmFjZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            },
          },
        },
      ],
    });
    
    fetch(
      "https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/outputs",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Key 746a5b15da834a9a8149083e99b062e6",
        },
        body: raw
      }
    )
      .then((response) => response.text())
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("error", error));
  }
  
  // this.displayFaceBox(this.calculateFaceLocation(result))
  
  export default FetchApi;