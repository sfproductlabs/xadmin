import React from 'react';
import ScrollToTop from 'react-scroll-up';
import classnames from 'classnames';

import { i18n } from '../libs/elements';

import en from '../libs/elements/locale/lang/en';
import de from '../libs/elements/locale/lang/de';

import locales from './locales';
import pages from './pages';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    window.addEventListener("hashchange", () => {
      window.scrollTo(0, 0);

      this.setPage();
    }, false);
  }

  componentDidMount() {
    this.setPage(() => {
      if (!this.state.locale) {
        this.setLocale(localStorage.getItem('ELEMENT_LANGUAGE') || 'en-US');
      }
    });
  }

  componentDidUpdate(props, state) {
    if (state.locale != this.state.locale) {
      switch(this.state.locale) {
        case 'de-DE':
          i18n.use(de); break;
        default:
          i18n.use(en); break;
      }
    }
  }

  getLocale(key) {
    const map = locales[this.state.locale] || {};

    return key.split('.').reduce((a, b) => {
      const parent = map[a];

      if (b) {
        return (parent || {})[b];
      }

      return parent;
    });
  }

  setLocale(locale) {
    window.location.hash = `/${locale}/${this.state.page}`;
  }

  getPage() {
    const routes = location.hash.match(/(?:\/(.+))?\/(.+)/);

    if (routes) {
      if (locales.hasOwnProperty(routes[1])) {
        this.setState({ locale: routes[1] }, () => {
          localStorage.setItem('ELEMENT_LANGUAGE', this.state.locale);
        });
      }

      return routes[2];
    }

    return 'quick-start';
  }

  setPage(fn) {
    this.setState({ page: this.getPage() }, fn);
  }

  getComponent(page) {
    this.components = this.components || Object.assign(Object.values(pages.reports).reduce((a, b) => {
      return Object.assign(a, b);
    }, {}), pages.documents);

    const result = this.components[page];

    if (result) {
      return React.createElement(result.default, {
        locale: {
          show: this.getLocale('markdown.show'),
          hide: this.getLocale('markdown.hide')
        }
      });
    }
  }

  render() {
    return (
      <div className="app">
        <header className="header">
          <div className="container">
            <h1>
              MSGXC
            </h1>
            <ul className="nav">
              {/* <li className="nav-item">
                <a href={`https://github.com/sfproductlabs/msgxc/wiki`} target="_blank" rel="noopener noreferrer">{this.getLocale('misc.guide')}</a>
              </li>
              <li className="nav-item">
                <a className="active">{this.getLocale('misc.component')}</a>
              </li>
              <li className="nav-item">
                <a href={`https://github.com/sfproductlabs/msgxc`} target="_blank" rel="noopener noreferrer">{this.getLocale('misc.resource')}</a>
              </li> */}
              {/* <li className="nav-item">
                <span className={classnames('nav-lang', { active: this.state.locale === 'de-DE'})} onClick={this.setLocale.bind(this, 'de-DE')}>De</span>
                <span> / </span>
                <span className={classnames('nav-lang', { active: this.state.locale === 'en-US'})} onClick={this.setLocale.bind(this, 'en-US')}>En</span>
              </li> */}
            </ul>
          </div>
        </header>
        <div className="main container">
          <nav className="side-nav">
            <ul>
              <li className="nav-item">
                <a>{this.getLocale('misc.administration')}</a>
                <ul className="pure-menu-list sub-nav">
                  {
                    Object.keys(pages.documents).map(page => {
                      return (
                        <li className="nav-item" key={page}>
                          <a href={`#/${this.state.locale}/${page}`} className={page === this.state.page ? 'active' : ''}>{this.getLocale(`page.${page}`)}</a>
                        </li>
                      )
                    })
                  }
                </ul>
              </li>
              <li className="nav-item">
                <a>{this.getLocale('misc.reports')}</a>
                {
                  Object.keys(pages.reports).map(group => {
                    return (
                      <div className="nav-group" key={group}>
                        <div className="nav-group__title">{group}</div>
                        <ul className="pure-menu-list">
                          {
                            Object.keys(pages.reports[group]).map(page => {
                              return (
                                <li key={page} className="nav-item">
                                  <a href={`#/${this.state.locale}/${page}`} className={page === this.state.page ? 'active' : ''}>{this.getLocale(`page.${page}`)}</a>
                                </li>
                              )
                            })
                          }
                        </ul>
                      </div>
                    )
                  })
                }
              </li>
            </ul>
          </nav>
          <div className="content">
            { this.getComponent(this.state.page) }
            <ScrollToTop showUnder={210}>
              <div className="page-component-up">
                <i className="el-icon-caret-top"></i>
              </div>
            </ScrollToTop>
          </div>
        </div>
        <footer className="footer">
          <div className="container">
            <div className="footer-main">
              <p className="footer-main-title">MSGXC</p>
              <a href="https://github.com/sfproductlabs/msgxc/issues" target="_blank" rel="noopener noreferrer" className="footer-main-link">{this.getLocale('misc.feedback')}</a>              
            </div>
            <div className="footer-social">
              <a href="//github.com/sfproductlabs/msgxc" target="_blank" rel="noopener noreferrer">
                <img src={require('./assets/github.png')} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}
