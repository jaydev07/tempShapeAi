const m1C = (name, credId, note, imageUrl, height, width) => {
	return `
 <!DOCTYPE html>
  <html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>First Week Completion Certificate</title>
    <style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');
      /* Container holding the image and the text */
    body {
    height: ${height};
    width: ${width};
    }
    
    .container {
      position: relative;
      text-align: center;
      color: white;
    }
    
    /* Bottom left text */
    .bottom-left {
      position: absolute;
      bottom: 48%;
      left: 42%;
    }
    
    /* Top left text */
    .top-left {
      position: absolute;
      top: 8px;
      left: 16px;
    }
    
    /* Top right text */
    .top-right {
      position: absolute;
      top: 8px;
      right: 16px;
    }
    
    /* Bottom right text */
    .bottom-right {
      position: absolute;
      bottom: 0%;
      right: 1%;
    }
    
    /* Centered text */
    .centered {
      position: absolute;
      bottom: 268px;
      left: 34%;
    }
    .note {
      position: absolute;
      bottom: 52%;
      left: 34.5%;
      font-size: 14px;
      width: 50%;
      height: 8%;
      text-align: justify;
    }
    h1{
        font-size: 44px;
  font-family: 'Roboto', sans-serif;
  color: #666666;
    }

  .creds {
      font-family: 'Roboto', sans-serif;
  color: #666666;
  }

  .points {
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    color: #666666;
  }
    </style>
    
  </head>
  <body data-new-gr-c-s-check-loaded="8.872.0" data-gr-ext-installed="">
    <div class="container">
      <img src="${imageUrl}" alt="Snow" width="">
      <div class="centered"><h1>${name}</h1><h1></h1></div>
      <div class="note">
        <p class="creds">
    ${note}
        </p></div>
      <div class="bottom-right"><p class="creds">Credential Id: ${credId}</p></div>
    </div>
  
  
</body></html>`;
};

export default m1C;