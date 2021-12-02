/* eslint-disable */

import React from 'react'
import { createScope, map, transformProxies } from './helpers'

const scripts = [
  { loading: fetch("https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=60e4457659061df1559d8c43").then(body => body.text()), isAsync: false },
  { loading: fetch("js/webflow.js").then(body => body.text()), isAsync: false },
]

let Controller

class LogInMobileView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/LogInMobileController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = LogInMobileView

        return Controller
      }

      throw e
    }
  }

  componentDidMount() {
    const htmlEl = document.querySelector('html')
    htmlEl.dataset['wfPage'] = '60e45f3cc5d3947345c88d0a'
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
    const proxies = LogInMobileView.Controller !== LogInMobileView ? transformProxies(this.props.children) : {

    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/normalize.css);
          @import url(/css/webflow.css);
          @import url(/css/shape-ai-chat-platform.webflow.css);
        ` }} />
        <span className="af-view">
          <div className="af-class-body-4">
            <div>
              <h1 className="af-class-heading-3">Welcome Back</h1>
            </div>
            <div className="af-class-text-block-6">Log In to get started</div>
            <div className="af-class-div-block-12">
              <div className="w-form">
                <form id="email-form" name="email-form" data-name="Email Form">
                  <div className="af-class-div-block-13"><label htmlFor="name-4" className="af-class-field-label-2">Email Address</label><input type="email" className="af-class-text-field w-input" maxLength={256} name="name-4" data-name="Name 4" placeholder id="name-4" /></div>
                  <div className="af-class-div-block-15"><label htmlFor="name-2" className="af-class-field-label-2">Password</label><input type="password" className="af-class-text-field w-input" maxLength={256} name="name-2" data-name="Name 2" placeholder id="name-2" /></div>
                </form>
                <div className="w-form-done">
                  <div>Thank you! Your submission has been received!</div>
                </div>
                <div className="w-form-fail">
                  <div>Oops! Something went wrong while submitting the form.</div>
                </div>
              </div>
            </div>
            <div>
              <div className="af-class-div-block-11">
                <a href="main-chat-mobile.html" className="af-class-sign-up-btn w-inline-block">
                  <div className="af-class-text-block-4">Log In</div>
                </a>
                <div className="af-class-forgot-pass">
                  <div className="af-class-text-block-5 af-class-forgot"><em>Forgot Password?</em>
                    <a href="#" className="af-class-link" />
                  </div>
                </div>
                <div className="af-class-login-txt">
                  <div className="af-class-text-block-5">Not Registered Yet? <a href="sign-up-mobile.html" className="af-class-link-2"><span>Register</span></a>
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

export default LogInMobileView

/* eslint-enable */