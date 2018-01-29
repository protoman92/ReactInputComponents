import { TextStyle } from 'react-native';
import { Try } from 'javascriptutilities';
import { Data } from 'react-base-utilities-js';

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
    inputCell: SelectorType;
  }
}