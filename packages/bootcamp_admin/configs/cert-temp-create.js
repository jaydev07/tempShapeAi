const m1C = (name, credId, imageUrl, height, width, nameDivPosition) => {
	return `
 <!DOCTYPE html>
  <html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      width: 100%;
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
    #bottom-right {
      position: absolute;
      bottom: 0%;
      right: 1%;
    }
    
    /* Centered text */
    .centered {
      position: absolute;
      bottom: ${nameDivPosition.bottom}px;
      left: ${nameDivPosition.left}px;
      /*width: 100%;*/
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
    h1 {
      font-size: 44px;
  		font-family: 'Roboto', sans-serif;
  		color: blue;
  		text-transform: uppercase;
    }

  .creds {
      font-family: 'Roboto', sans-serif;
  		color: #666666;
  		margin: 0;
    	font-size: 41px;
    }

    </style>
    
  </head>
  <body>
    <div class="container">
      <img src="${imageUrl}" alt="Snow" width="">
      <div id='name-div' class="centered">
      	<h1 id="name" >${name}</h1>
      </div>
			<div id="bottom-right">
    	<p class="creds">Scan the QR code to verify </p>
     <img id="qr" src="https://shapeai-uploads.s3.ap-south-1.amazonaws.com/sample-qr" width="220">
     <p class="creds">or visit: <a href="https://cert.shapeai.tech/verify/$cred_id">https://cert.shapeai.tech/verify/$cred_id</a></p>
     </div>
    </div>
	</body>
</html>`;
};

export default m1C;