/* eslint-disable */

import React from 'react'
import { createScope, map, transformProxies } from './helpers'

const scripts = [
  { loading: fetch("https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=60e4457659061df1559d8c43").then(body => body.text()), isAsync: false },
  { loading: fetch("js/webflow.js").then(body => body.text()), isAsync: false },
]

let Controller

class OnboardingMobileView extends React.Component {
  static get Controller() {
    if (Controller) return Controller

    try {
      Controller = require('../controllers/OnboardingMobileController')
      Controller = Controller.default || Controller

      return Controller
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        Controller = OnboardingMobileView

        return Controller
      }

      throw e
    }
  }



  render() {
    const proxies = OnboardingMobileView.Controller !== OnboardingMobileView ? transformProxies(this.props.children) : {

    }

    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url(/css/normalize.css);
          @import url(/css/webflow.css);
          @import url(/css/shape-ai-chat-platform.webflow.css);
        ` }} />
        <span className="af-view">
          <div className="af-class-body">
            <div className="af-class-container w-container">
              <div className="af-class-div-block">
                <div data-animation="slide" data-duration={500} data-infinite={1} className="af-class-slider w-slider">
                  <div className="w-slider-mask">
                    <div className="af-class-slide w-slide">
                      <div className="af-class-div-block-2"><img src="images/Asking-questions-1.svg" loading="lazy" alt />
                        <div>
                          <h1 className="af-class-heading">Ask your Doubts</h1>
                        </div>
                        <div className="af-class-text-block">Ask any Doubt you have with any course</div>
                      </div>
                    </div>
                    <div className="w-slide">
                      <div className="af-class-div-block-2"><img src="images/Notifications-1.svg" loading="lazy" alt />
                        <div>
                          <h1 className="af-class-heading">Get Expert Answers</h1>
                        </div>
                        <div className="af-class-text-block">Get Expert Answers from mentors</div>
                      </div>
                    </div>
                  </div>
                  <div className="af-class-left-arrow w-slider-arrow-left">
                    <div className="af-class-icon-2 w-icon-slider-left" />
                  </div>
                  <div className="af-class-right-arrow w-slider-arrow-right">
                    <div className="af-class-icon w-icon-slider-right" />
                  </div>
                  <div className="af-class-slide-nav w-slider-nav w-slider-nav-invert w-shadow w-round" />
                </div>
                <div className="af-class-div-block-11">
                  <a href="/register" className="af-class-sign-up-btn w-inline-block">
                    <div className="af-class-text-block-4">Sign Up</div>
                  </a>
                  <div className="af-class-login-txt">
                    <div className="af-class-text-block-5">Already have an Account? <a href="/login" className="af-class-link">Log In</a>
                    </div>
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

export default OnboardingMobileView

/* eslint-enable */