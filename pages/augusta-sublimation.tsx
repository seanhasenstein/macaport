import React from 'react';
import styled from 'styled-components';
import useHasMounted from 'hooks/useHasMounted';
import Layout from '../components/Layout';

export default function AugustaSublimation() {
  const hasMounted = useHasMounted();

  if (hasMounted) {
    return (
      <Layout title="Sublimation">
        <SublimationChild />
      </Layout>
    );
  } else {
    return null;
  }
}

function SublimationChild() {
  React.useEffect(() => {
    document.querySelector('#myIframe')?.addEventListener('load', () => {
      sendParentHeightToChild();
    });
    const onPageLoad = () => {
      pageLoad();
    };

    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  let pageUrl = window.location.href;
  let domainUrl = document.domain;
  let pageQuery: any = null;
  let iframeHasSameDomainUrl = true;

  const defaultConfig = {
    discount: 5,
    addlLeadTime: 2,
    moq: 6,
    moqPrice: 60,
  };

  const categoryArray = [
    {
      name: 'fanwear',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'lacrosse',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'baseball',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'basketball',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'soccer',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'football',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'fleece',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'track',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'training',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'softball',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'polo',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: '5-day-turbo',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'volleyball',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'babe-ruth-turbo',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'accessories',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'compression',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'semi-sublimated',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'default-page',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'search-display-view-tags',
      tag: 'search-display-view-tags',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'search-display-view-term',
      searchTerm: 'search-display-view-tags',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'custom-headwear',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'styles',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'running-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'beanies-knits',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'camo-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'on-field-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'lifestyle-outdoor-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'sideline-coaches-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'trucker-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'visors',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'boonie-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'features',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'flexfit-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'snapback-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'structured-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
    {
      name: 'unstructured-hats',
      discount: defaultConfig.discount,
      addlLeadTime: defaultConfig.addlLeadTime,
      moq: defaultConfig.moq,
      moqPrice: defaultConfig.moqPrice,
    },
  ];

  const categoryShareMapper: any = {
    fanwear: 'fanwear',
    lacrosse: 'lacrosse',
    baseball: 'baseball',
    basketball: 'basketball',
    soccer: 'soccer',
    football: 'football',
    fleece: 'fleece',
    outerwear: 'fleece',
    track: 'track',
    training: 'training',
    softball: 'softball',
    polos: 'polo',
    turbo: '5-day-turbo',
    volleyball: 'volleyball',
    'babe ruth turbo': 'babe-ruth-turbo',
    'masks, gaiters,': 'accessories',
    compression: 'compression',
    'semi-sublimated': 'semi-sublimated',
    'freestyle sublimation': 'default-page',
    'search-display-view-tags': 'search-display-view-tags',
    'search-display-view-term': 'search-display-view-term',
    'custom headwear': 'custom-headwear',
    styles: 'styles',
    'active/lightweight': 'running-hats',
    beanies: 'beanies-knits',
    camo: 'camo-hats',
    'on-field': 'on-field-hats',
    outdoor: 'lifestyle-outdoor-hats',
    sideline: 'sideline-coaches-hats',
    'truckers / mesh back': 'trucker-hats',
    visors: 'visors',
    'wide brim / boonie': 'boonie-hats',
    features: 'features',
    flexfit: 'flexfit-hats',
    snapback: 'snapback-hats',
    structured: 'structured-hats',
    unstructured: 'unstructured-hats',
  };

  window.onmessage = e => {
    const data = e.data.toString();

    if (e.data.domainUrl) {
      iframeHasSameDomainUrl = false;
      pageUrl = e.data.pageUrl;
      pageQuery = e.data.pageQuery;
      const domain = e.data.domainUrl;
      domainUrl = domain.replace(/^https?:\/\//, '');
      setIframeSrc();
      // const iframeSrc = getIframeSrc();
    }
    if (data.indexOf('asgIframeHeight') > -1) {
      const iframeDiv = document.getElementById('iframediv');
      const iframeHeight = e.data.split(':');

      if (iframeDiv) {
        iframeDiv.style.height = iframeHeight[1] + 'px';
      }
    }
    if (data.indexOf('reLoadIframe') > -1) {
      //document.getElementById("showSummary").style.display = "none";
      setIframeSrc();
    }
    if (data.indexOf('scrollToTop') > -1) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    if (data.indexOf('asgPageName') > -1) {
      const pageName = e.data.split(':');
      if (pageName[1] == 'configurator')
        document.getElementById('myIframe')?.setAttribute('scrolling', 'yes');
      else {
        document.getElementById('myIframe')?.setAttribute('scrolling', 'no');
      }
    }
    if (data.indexOf('cartData') > -1) {
      const queryString = getCurrentUrlParams();
      let categoryName = queryString['categoryName'];
      if (categoryName) {
        categoryName = categoryName.toLowerCase();
      } else {
        categoryName = 'freestyle sublimation';
      }
      const path = window.location.origin + window.location.pathname;

      const obj = data.split('#');
      const objList = obj[1];
      localStorage.setItem('cartObject', objList);
      localStorage.setItem('cartCategoryName', categoryName);
      localStorage.setItem('cartPath', path);
      // TODO: window.location = '/cart';
      window.location.href = '/cart';
    }
  };

  function sendParentHeightToChild() {
    const child = (document.getElementById('myIframe') as HTMLIFrameElement)
      .contentWindow;
    const elemTop = document.getElementById('iframediv')!.offsetTop;
    const windowHeight =
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      window.innerHeight;
    const calcHeight = windowHeight - elemTop;
    if (child && child.postMessage) {
      child.postMessage('parentHeight:' + calcHeight, '*');
      child.postMessage('parentDomain:' + domainUrl, '*');
    }
  }
  function sendDataToChild() {
    const child = (document.getElementById('myIframe') as HTMLIFrameElement)
      .contentWindow;
    if (child && child.postMessage) {
      child.postMessage('loadNextPageIframe', '*');
    }
  }
  function getFullUrl() {
    let searchLocation = false;
    if (window.location) {
      if (window.location.search) {
        if (window.location.search.substr(1)) {
          searchLocation = true;
        }
      }
    }
    if (searchLocation) {
      return window.location.search.substr(1);
    } else {
      const baseUrl = window.document.baseURI;
      const baseUrlData = baseUrl.split('?');
      if (baseUrlData[1] != undefined) {
        return baseUrlData[1];
      }
      return '';
    }
  }
  function getCurrentUrlParams() {
    if (iframeHasSameDomainUrl === false) {
      return pageQuery;
    } else {
      const operator = '&';
      const getUrl = getFullUrl();
      const queryString = (function (params) {
        if (typeof params === 'string' && params === '') return {};
        const obj: any = {};
        for (let i = 0; i < params.length; ++i) {
          const value = params[i].split('=', 2);
          if (value.length === 1) obj[value[0]] = '';
          else obj[value[0]] = decodeURIComponent(value[1].replace(/\+/g, ' '));
        }
        return obj;
      })(getUrl.split(operator));

      return queryString;
    }
  }
  function setIframeSrc() {
    const url = getIframeSrc();
    if (url) {
      (document.getElementById('myIframe') as HTMLIFrameElement).src = url;
    } else {
      // const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
      // iframe.src = iframe.src;
    }
    setTimeout(function () {
      document.getElementById('iframediv')!.style.display = 'block';
      document.getElementById('loaderAlign')!.style.display = 'none';
    }, 1000);
  }
  function validate(queryString: string, type: any) {
    if (queryString) {
      if (queryString[type]) {
        return true;
      }
      return false;
    }
    return false;
  }
  function getIframeSrc() {
    const queryString = getCurrentUrlParams();

    if (validate(queryString, 'categoryName')) {
      const categoryName = queryString['categoryName'];
      return generateUrl(categoryName.toLowerCase().trim(), true);
    } else if (validate(queryString, 'searchTerm')) {
      // const searchTerm = queryString['searchTerm'];
      return generateUrl('search-display-view-term', false);
    } else if (validate(queryString, 'tag')) {
      // const tag = queryString['tag'];
      return generateUrl('search-display-view-tags', false);
    } else {
      const currentURL = pageUrl;
      const url = currentURL.split('?');
      const urlArray = url[0];
      const urlHrefArray = urlArray.split('/');
      let categoryName = null;
      urlHrefArray.forEach(function (urlEntity) {
        categoryArray.forEach(function (category) {
          if (
            urlEntity.toLowerCase().trim() ===
            category.name.toLowerCase().trim()
          ) {
            categoryName = category.name.toLowerCase().trim();
          }
        });
      });
      return generateUrl(categoryName, false);
    }
  }
  function isConfiguratorPage() {
    const queryString = getCurrentUrlParams();
    if (validate(queryString, 'sNumber')) {
      return true;
    }
    return false;
  }
  function isCapConfiguratorPage() {
    const queryString = getCurrentUrlParams();
    if (validate(queryString, 'dNumber')) {
      return true;
    }
    return false;
  }
  function checkCategory(categoryName: any) {
    const category = categoryArray.filter(item => item.name === categoryName);
    if (category.length) {
      return true;
    }
    return false;
  }
  function generateUrl(categoryName: any, isCategoryName: any) {
    const currentIframeUrl = (
      document.getElementById('myIframe') as HTMLIFrameElement
    ).src;
    const queryString = getCurrentUrlParams();
    let replaceText = 'custom-sublimation';
    if (categoryName) {
      replaceText = 'custom-sublimation-' + categoryName;
      if (isConfiguratorPage()) {
        replaceText = 'Configurator';
        categoryName = categoryShareMapper[categoryName];
      } else if (isCapConfiguratorPage()) {
        replaceText = 'CapConfigurator';
        categoryName = categoryShareMapper[categoryName];
      } else if (!isCategoryName) {
        replaceText = 'SearchDisplayView';
        categoryName = categoryShareMapper[categoryName];
      } else if (
        categoryName === '5-day-turbo' ||
        categoryName === 'semi-sublimated'
      ) {
        replaceText = categoryName;
      } else if (!checkCategory(categoryName)) {
        categoryName = 'default-page';
        replaceText = 'custom-sublimation';
      }
    } else {
      categoryName = 'default-page';
      if (isConfiguratorPage()) {
        replaceText = 'Configurator';
      } else if (isCapConfiguratorPage()) {
        categoryName = 'custom-headwear';
        replaceText = 'CapConfigurator';
      }
    }
    const Index = categoryArray.findIndex(
      x => x.name.toLowerCase().trim() === categoryName
    );
    const categoryObj: any = categoryArray[Index];
    const url = currentIframeUrl.split('?');
    const urlArray = url[0];
    // const paramsArray = url[1];
    const urlHrefArray = urlArray.split('/');
    const urlHrefReplaceEntity = urlHrefArray[urlHrefArray.length - 1];
    url[0] = urlArray.replace(urlHrefReplaceEntity, replaceText);
    const newUrl = url.join('?');
    const href = new URL(newUrl);
    const categoryObjLength = Object.keys(categoryObj).length;
    if (categoryObjLength) {
      Object.keys(categoryObj).forEach(function (key) {
        href.searchParams.delete(key);
        let value;
        if (key == 'tag') {
          value = queryString['tag'];
          href.searchParams.set(key, value);
        } else if (key == 'searchTerm') {
          value = queryString['searchTerm'];
          href.searchParams.set(key, value);
        } else {
          href.searchParams.set(key, categoryObj[key]);
        }
      });
    }
    if (isConfiguratorPage() || isCapConfiguratorPage()) {
      Object.keys(queryString).forEach(function (key) {
        href.searchParams.delete(key);
        href.searchParams.set(key, queryString[key]);
      });
    }

    return href.toString();
  }
  function isScrolledIntoView() {
    const elem = document.getElementById('iframediv')!;
    const docViewTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    const docViewBottom = docViewTop + windowHeight;
    const elemTop = elem.offsetTop;
    const elemBottom = elemTop + elem.offsetHeight;
    return elemBottom <= docViewBottom;
  }

  function pageLoad() {
    setIframeSrc();
    window.onscroll = function () {
      if (isScrolledIntoView()) {
        sendDataToChild();
      }
    };
  }

  return (
    <SublimationStyles>
      <div className="container">
        <div className="Body-content">
          <h1>FreeStyle Sublimation</h1>
          <>
            <div id="loaderAlign">
              <div className="loader"></div>
            </div>
            <div
              id="iframediv"
              style={{ display: 'none', height: '2905px', minHeight: '600px' }}
            >
              <iframe
                title="augusta-sublimation"
                id="myIframe"
                scrolling="no"
                height="100%"
                width="100%"
                src="https://www.augustasportswear.com/custom-sublimation"
              ></iframe>
            </div>
          </>
        </div>
      </div>
    </SublimationStyles>
  );
}

const SublimationStyles = styled.div`
  .container {
    margin: 0 auto;
    padding: 4rem 1.5rem;
    max-width: 80rem;
    width: 100%;
  }

  .Body-content {
    /* padding: 3rem 0 0; */
    background-color: #fff;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2);
  }

  h1 {
    display: none;
    margin: 0 0 3rem;
    text-align: center;
  }

  .store-front {
    height: auto !important;
  }

  #loaderAlign {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loader {
    border: 16px solid #f3f3f3;
    border-radius: 50%;
    border-top: 16px solid #3498db;
    width: 120px;
    height: 120px;
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;
  }

  iframe {
    border: 2px solid #aaa;
    border: none;
    /* border-radius: 0.25rem; */
  }

  /* Safari */
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
