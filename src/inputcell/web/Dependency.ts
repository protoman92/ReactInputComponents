import { Try } from 'javascriptutilities';
import { Component, Data } from 'react-base-utilities-js';

export namespace Identity {
  /**
   * Identity for input cell.
   * @extends {Component.Web.Identity.Type} Common identity extension.
   */
  export interface Type extends Component.Web.Identity.Type {
    readonly type: Data.InputType.Web.Case;
  }

  /**
   * Select identity for input cell, based on the input.
   */
  export interface SelectorType {
    identity(item: Data.Input.Type): Try<Type>;
  }

  /**
   * Provide identity selector for input cell.
   */
  export interface ProviderType {
    readonly inputCell?: SelectorType;
  }
}