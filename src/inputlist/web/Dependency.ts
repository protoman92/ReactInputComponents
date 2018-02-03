import { Try } from 'javascriptutilities';
import { Component, Data } from 'react-base-utilities-js';
import * as InputCell from './../../inputcell';

export namespace Identity {
  /**
   * Identity for input list.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface Type extends Component.Web.Identity.Type {}

  /**
   * Select identity for input list component, based on the provided inputs.
   */
  export interface SelectorType {
    identity(inputs: Readonly<Data.Input.Type[]>): Try<Type>;
  }

  /**
   * Provide identity selector for input list component.
   * @extends {InputCell.Web.Identity.ProviderType} Input cell identity provider
   * extension.
   */
  export interface ProviderType extends InputCell.Web.Identity.ProviderType {
    readonly inputList?: SelectorType;
  }
}