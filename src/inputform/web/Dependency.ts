import { Try } from 'javascriptutilities';
import { Component, Data } from 'react-base-utilities-js';
import * as InputList from './../../inputlist';

export namespace Identity {
  /**
   * Identity for input form.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface Type extends Component.Web.Identity.Type {}

  /**
   * Identity for input form confirm button.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface ButtonType extends Component.Web.Identity.Type {}

  /**
   * Select identity for input form, based on the input header.
   */
  export interface SelectorType {
    identity(header: Data.Input.Header): Try<Type>;
    button_identity(header: Data.Input.Header): Try<ButtonType>;
  }

  /**
   * Provide identity selector for input form component.
   * @extends {InputList.Identity.ProviderType} Input list identity provider
   * extension.
   */
  export interface ProviderType extends InputList.Web.Identity.ProviderType {
    readonly inputForm?: SelectorType;
  }
}