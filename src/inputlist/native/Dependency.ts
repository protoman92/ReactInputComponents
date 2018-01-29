import { ViewStyle } from 'react-native';
import { Try } from 'javascriptutilities';
import { Data } from 'react-base-utilities-js';
import * as InputCell from './../../inputcell';

export namespace Style {
  /**
   * Style for a native input list component.
   * @extends {ViewStyle} ViewStyle extension.
   */
  export interface Type extends ViewStyle {}

  /**
   * Select the appropriate style based on the input items.
   */
  export interface SelectorType {
    style(inputs: Data.Input.Type[]): Try<ViewStyle>;
  }

  /**
   * Provide styles for an input list component.
   * @extends {InputCell.Native.Style.ProviderType} Input cell style provider
   * extension.
   */
  export interface ProviderType extends InputCell.Native.Style.ProviderType {
    inputList: SelectorType;
  }
}