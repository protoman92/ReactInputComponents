import { TextInputProperties, TextStyle } from 'react-native';
import { Try } from 'javascriptutilities';
import { Data } from 'react-base-utilities-js';

export namespace Properties {
  /**
   * Represent props, other than style for an input cell. Beware that this is
   * the props for the inner input component, not the wrapping component.
   * @extends {TextInputProperties} TextInputProperties extension.
   */
  export interface Type extends TextInputProperties {}

  /**
   * Props selector for an input cell component. 
   */
  export interface SelectorType {
    properties?(input: Data.Input.Type): Try<Type>;
  }

  /**
   * Provide an input cell props selector.
   */
  export interface ProviderType {
    readonly inputCell?: Readonly<SelectorType>;
  }
}

export namespace Style {
  /**
   * Represents style for an input cell.
   * @extends {TextStyle} TextStyle extension.
   */
  export interface Type extends TextStyle {}

  /**
   * Style selector for input cells. Depending on the input item, we may choose
   * different styles.
   */
  export interface SelectorType {
    style(input: Data.Input.Type): Try<Type>;
  }

  /**
   * Provide an input cell style selector.
   */
  export interface ProviderType {
    readonly inputCell: SelectorType;
  }
}