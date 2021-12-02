export default (name, body) => {
	return `
<html lang="en">
  <head>
    <style>
      .button {
      border-radius: 4px;
      background-color: #f41ee9;
      border: none;
      color: #FFFFFF;
      text-align: center;
      font-size: 28px;
      padding: 20px;
      width: 200px;
      transition: all 0.5s;
      cursor: pointer;
      margin: 5px;
      }
      .button span {
      cursor: pointer;
      display: inline-block;
      position: relative;
      transition: 0.5s;
      }
      .button span:after {
      content: '\\\\00bb';
      position: absolute;
      opacity: 0;
      top: 0;
      right: -20px;
      transition: 0.5s;
      }
      .button:hover span {
      padding-right: 25px;
      }
      .button:hover span:after {
      opacity: 1;
      right: 0;
      }
    </style>
  </head>
  <body>
    <div id=":1ns" class="ii gt">
      <div id=":1nr" class="a3s aXjCH msg2433186818234786545">
        <u></u>
        <div style="padding:0;margin:0">
          <table style="height:100%;width:100%;background-color:#efefef" align="center">
            <tbody>
              <tr>
                <td valign="top" id="m_2433186818234786545dbody" style="width:100%;height:100%;padding-top:30px;padding-bottom:30px;background-color:#efefef">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-color:#ff3737;max-width:600px;box-sizing:border-box;width:100%;margin:0px auto">
                    <tbody>
                      <tr>
                        <td valign="top" align="center" style="background-color:#ffd7d7;box-sizing:border-box;font-size:0px;text-align:center">
                          <div class="m_2433186818234786545layer_2" style="max-width:600px;display:inline-block;vertical-align:top;width:100%">
                            <table style="border-collapse:collapse;width:100%;background-color:#545CD8" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                <tr>
                                  <td valign="top" style="padding:20px;box-sizing:border-box;text-align:center">
                                    <img style="border-width:0px;border-style:none;max-width:260px;width:100%;border-color:#e00000" width="630" alt="Image" src="https://uploads-ssl.webflow.com/604cac9b9d1aac837756f953/6060617e59cb0e6801f2223f_image%201.png" class="CToWUd">
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td valign="top" align="center" style="background-color:#ffffff;box-sizing:border-box;font-size:0px;text-align:center">
                          <div class="m_2433186818234786545layer_2" style="max-width:600px;display:inline-block;vertical-align:top;width:100%">
                            <table style="border-collapse:collapse;width:100%" border="0" cellpadding="0" cellspacing="0">
                              <tbody>
                                <tr>
                                  <td valign="top" style="padding:54px;text-align:left;color:#151516;font-size:12px;font-family:&quot;Lucida Sans Unicode&quot;,&quot;Lucida Grande&quot;,sans-serif;word-break:break-word;direction:ltr;box-sizing:border-box">
                                    <p style="margin:0px;padding:0px"><span style="font-size:14px"><b><span class='ec ec-sparkling-heart'></span>
                                      Greetings from Team Shape AI,</b></span>
                                    </p>
                                    <p style="text-align:center;margin:0px;padding:0px"><span style="font-size:14px"><br></span></p>
                                    <p style="margin:0px;padding:0px"><span style="font-size:14px">
                                    ${body}
                                    </span></p>
                                    <br>
                                    </p>
                                    <p style="margin:0px;padding:0px">
                                      <br>
                                    </p>
                                    <p style="margin:0px;padding:0px"><span style="font-size:14px">If you have any further queries, please email us at - <u><a href="mailto:shapeured@gmail.com" target="_blank">shapeured@gmail.com</a></u>.<br><br> </span></p>
                                    <p style="margin:0px;padding:0px"><span style="font-size:14px"><br></span></p>
                                    <p style="margin:0px;padding:0px"><span style="font-size:14px"><br></span></p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td valign="top" align="center" style="background-color:#efefef;box-sizing:border-box;font-size:0px;text-align:center">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="text-align:center;background-color:#fff;padding-top:10px;padding-bottom:10px;font-size:8pt;font-family:sans-serif">
            <p style="text-align:center;text-decoration:none;color:#666">ShapeAI Mumbai,India. <a href="https://shapeai.tech" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://shapeai.tech&amp;source=gmail&amp;ust=1581987706808000&amp;usg=AFQjCNHq_YTN4wfVEAp0GRegvKDajEMmzg">https://shapeai.tech</a></p>
          </div>
          <img src="" style="width:1px;height:1px" alt="" class="CToWUd">
        </div>
      </div>
      <div class="yj6qo"></div>
      <div class="yj6qo"></div>
      <div class="yj6qo"></div>
    </div>
  </body>
</html>
	`
}