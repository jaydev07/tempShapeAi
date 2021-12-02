/* eslint-disable */

import React from 'react'
import { createScope, map, transformProxies } from './helpers'

const scripts = [
  { loading: fetch("https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=60e4457659061df1559d8c43").then(body => body.text()), isAsync: false },
  { loading: fetch("js/webflow.js").then(body => body.text()), isAsync: false },
]

let Controller

class MainChatScreenView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/MainChatScreenController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = MainChatScreenView

        return Controller
      }

      throw e
    }
  }

  componentDidMount() {
    const htmlEl = document.querySelector('html')
    htmlEl.dataset['wfPage'] = '60e44a409c50590411659738'
    htmlEl.dataset['wfSite'] = '60e4457659061df1559d8c43'

    scripts.concat(null).reduce((active, next) => Promise.resolve(active).then((active) => {
      const loading = active.loading.then((script) => {
        new Function(`
          with (this) {
            eval(arguments[0])
          }
        `).call(window, script)

        return next
      })

      return active.isAsync ? next : loading
    }))
  }

  render() {
    const proxies = MainChatScreenView.Controller !== MainChatScreenView ? transformProxies(this.props.children) : {

    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/normalize.css);
          @import url(/css/webflow.css);
          @import url(/css/shape-ai-chat-platform.webflow.css);
        ` }} />
        <span className="af-view">
          <div className="af-class-body-2">
            <div className="af-class-container-2 w-container">
              <div className="w-row">
                <div className="af-class-column-3 w-col w-col-4">
                  <div className="af-class-div-block-4">
                    <div className="af-class-logo-wrapper">
                      <div><img src="images/Logo-Icon.svg" loading="lazy" width={44} alt className="af-class-image" /></div><img src="images/SHAPEAI-white.svg" loading="lazy" width={176} alt />
                    </div>
                  </div>
                  <a href="main-chat-screen-active-chat.html" className="af-class-profile-card w-inline-block">
                    <div className="af-class-profile_img" />
                    <div className="af-class-name-des-wrapper">
                      <h3 className="af-class-heading-2">Shaurya Sinha</h3>
                      <div className="af-class-text-block-3">Instuctor</div>
                    </div>
                  </a>
                  <a href="#" className="af-class-profile-card w-inline-block">
                    <div className="af-class-profile_img" />
                    <div className="af-class-name-des-wrapper">
                      <h3 className="af-class-heading-2">Full Stack Web Dev Internship</h3>
                      <div className="af-class-text-block-3">Course Channel</div>
                    </div>
                  </a>
                </div>
                <div className="af-class-column-4 af-class-main w-col w-col-8">
                  <div className="af-class-div-block-5">
                    <div>Select a chat to start messenging</div>
                  </div>
                </div>
              </div>
            </div>
            {/* [if lte IE 9]><![endif] */}
          </div>
        </span>
      </span>
    )
  }
}

export default MainChatScreenView

/* eslint-enable */