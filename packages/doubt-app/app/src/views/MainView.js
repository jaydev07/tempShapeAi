/* eslint-disable */

import React from 'react'
import { createScope, map, transformProxies } from './helpers'

const scripts = [
  { loading: fetch("https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=60e4457659061df1559d8c43").then(body => body.text()), isAsync: false },
  { loading: fetch("js/webflow.js").then(body => body.text()), isAsync: false },
]

let Controller

class MainView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/MainController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = MainView

        return Controller
      }

      throw e
    }
  }

  componentDidMount() {
    const htmlEl = document.querySelector('html')
    htmlEl.dataset['wfPage'] = '60e454acb9ed068c424f17e1'
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
    const proxies = MainView.Controller !== MainView ? transformProxies(this.props.children) : {

    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/normalize.css);
          @import url(/css/webflow.css);
          @import url(/css/shape-ai-chat-platform.webflow.css);
        ` }} />
        <span className="af-view">
          <div>
            <a href="main-chat-mobile.html" className="af-class-div-block-8 w-inline-block"><img src="images/arrow-left.svg" loading="lazy" alt />
              <div className="af-class-profile-card">
                <div className="af-class-profile_img" />
                <div className="af-class-name-des-wrapper">
                  <h3 className="af-class-heading-2">Shaurya Sinha</h3>
                  <div className="af-class-text-block-3">Instuctor</div>
                </div>
              </div>
            </a>
            <div className="af-class-div-block-10">
              <div className="af-class-div-block-7">
                <div className="af-class-form-block w-form">
                  <form id="email-form" name="email-form" data-name="Email Form" className="af-class-form"><input type="text" className="af-class-text-field af-class-basic w-input" maxLength={256} name="name" data-name="Name" placeholder id="name" /></form>
                  <div className="w-form-done">
                    <div>Thank you! Your submission has been received!</div>
                  </div>
                  <div className="w-form-fail">
                    <div>Oops! Something went wrong while submitting the form.</div>
                  </div>
                </div>
              </div>
              <div className="af-class-div-block-6"><img src="images/send.svg" loading="lazy" alt /></div>
            </div>
            {/* [if lte IE 9]><![endif] */}
          </div>
        </span>
      </span>
    )
  }
}

export default MainView

/* eslint-enable */