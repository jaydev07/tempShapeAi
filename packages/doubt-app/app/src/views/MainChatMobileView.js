/* eslint-disable */

import React from 'react'
import { createScope, map, transformProxies } from './helpers'

const scripts = [
  { loading: fetch("https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=60e4457659061df1559d8c43").then(body => body.text()), isAsync: false },
  { loading: fetch("js/webflow.js").then(body => body.text()), isAsync: false },
]

let Controller

class MainChatMobileView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/MainChatMobileController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = MainChatMobileView

        return Controller
      }

      throw e
    }
  }

  componentDidMount() {
    const htmlEl = document.querySelector('html')
    htmlEl.dataset['wfPage'] = '60e4521b5793a2879bc7ebe7'
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
    const proxies = MainChatMobileView.Controller !== MainChatMobileView ? transformProxies(this.props.children) : {

    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/normalize.css);
          @import url(/css/webflow.css);
          @import url(/css/shape-ai-chat-platform.webflow.css);
        ` }} />
        <span className="af-view">
          <div className="af-class-body-3">
            <div className="af-class-div-block-8">
              <div><img src="images/SHAPEAI-white.svg" loading="lazy" width={118} alt /></div>
            </div>
            <div className="af-class-div-block-9">
              <a href="main.html" className="af-class-profile-card w-inline-block">
                <div className="af-class-profile_img" />
                <div className="af-class-name-des-wrapper">
                  <h3 className="af-class-heading-2">Shaurya Sinha</h3>
                  <div className="af-class-text-block-3">Instuctor</div>
                </div>
              </a>
              <div className="af-class-profile-card">
                <div className="af-class-profile_img" />
                <div className="af-class-name-des-wrapper">
                  <h3 className="af-class-heading-2">Full Stack Web Dev Internship</h3>
                  <div className="af-class-text-block-3">Course Channel</div>
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

export default MainChatMobileView

/* eslint-enable */