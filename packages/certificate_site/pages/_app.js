import 'bootstrap/scss/bootstrap.scss';
import {useEffect} from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
      if (window && window.location.href.includes('cert.shapeai.cf')) {
      window.location.href = 'https://cert.shapeai.tech' + (window.location.href.split('cert.shapeai.cf')[1] ? window.location.href.split('cert.shapeai.cf')[1]: '');
    }
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
