import { TextStyle, ViewStyle } from 'react-native';
import { Try } from 'javascriptutilities';
import { Data } from 'react-base-utilities-js';
import * as InputList from './../../inputlist';

export namespace Style {
  /**
   * Style for a native input form container component.
   * @extends {ViewStyle} ViewStyle extension.
   */
  export interface ContainerType extends ViewStyle {}

  /**
   * Style for a native input form confirm button component.
   * @extends {ViewStyle} ViewStyle extension.
   */
  export interface ButtonType extends ViewStyle {}

  /**
   * Style for a native input form confirm button text component. 
   * @extends {TextStyle} TextStyle extension.
   */
  export interface ButtonTextType extends TextStyle {}

  /**
   * Style selector for a native input form component.
   */
  export interface SelectorType {
    containerStyle(header: Data.Input.Header): Try<ContainerType>;
    buttonStyle(header: Data.Input.Header): Try<ButtonType>;
    buttonTextStyle(header: Data.Input.Header): Try<ButtonTextType>;
  }

  /**
   * Provide styles for a native input form component.
   * @extends {InputList.Native.Style.ProviderType} Input list style provide
   * extension.
   */
  export interface ProviderType extends InputList.Native.Style.ProviderType {
    inputForm: SelectorType;
  }
}