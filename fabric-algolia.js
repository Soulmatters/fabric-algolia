/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'algoliasearch/dist/algoliasearch.min.js';
import algoliasearch from 'algoliasearch'
/**
 * `fabric-algolia`
 * Algolia search component
 *
 * @license Copyright (c) 2017 FabricElements. All rights reserved.
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class FabricAlgolia extends PolymerElement {
  /**
   * @return {string}
   */
  static get is() {
    return 'fabric-algolia';
  }

  /**
   * @return {object}
   */
  static get properties() {
    return {
      /**
       * Algolia Application ID
       */
      applicationId: {
        type: String,
        value: null,
      },
      /**
       * Algolia Api Key
       */
      apiKey: {
        type: String,
        value: null,
      },
      /**
       * Index
       */
      index: {
        type: String,
        value: null,
      },
      /**
       * Settings
       */
      settings: {
        type: Object,
        value: null,
      },
      /**
       * Response
       */
      response: {
        type: Object,
        value: null,
        notify: true,
        reflectToAttribute: true,
        readOnly: true,
      },
      /**
       * Error
       */
      error: {
        type: Object,
        value: null,
        notify: true,
        reflectToAttribute: true,
        readOnly: true,
      },
      /**
       * Query
       */
      query: {
        type: String,
        value: null,
        observer: '_queryObserver',
      },
    };
  }

  /**
   * Send query to Algolia & return results.
   *
   * @param {string} query
   * @return {*}
   * @private
   */
  _queryObserver(query) {
    this._setError(null);
    this._setResponse(null);

    if (!query) return;

    /**
     * Reference basic properties
     */
    const index = this.index;
    const applicationID = this.applicationId;
    const apiKey = this.apiKey;
    const settings = this.settings;

    let error = {
      'message': 'Something is missing: ',
      'status': 400,
    };

    if (!applicationID || !apiKey || !index) {
      if (!applicationID) error.message += 'applicationId, ';
      if (!apiKey) error.message += 'apiKey, ';
      if (!index) error.message += 'index';
      return this._setError(error);
    }

    /**
     * Set up algolia search
     */
      // eslint-disable-next-line no-undef
    const client = algoliasearch(applicationID, apiKey);
    const indexRef = client.initIndex(index);
    // Define search settings
    if (settings) indexRef.setSettings(settings);

    indexRef.search(query, (err, content) => {
      if (err) {
        return this._setError(content);
      }
      this._setResponse(content);
    });
  }
}

window.customElements.define(FabricAlgolia.is, FabricAlgolia);
