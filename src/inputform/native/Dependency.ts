import { TextProperties, TextStyle, ViewProperties, ViewStyle } from 'react-native';
import { Try } from 'javascriptutilities';
import { Data } from 'react-base-utilities-js';
import * as InputList from './../../inputlist';

export namespace Properties {
  /**
   * Properties for a native input form container component.
   * @extends {ViewProperties} ViewProperties extension.
   */
  export interface ContainerType extends ViewProperties {}

  /**
   * Properties for a native input form confirm button component.
   * @extends {ViewProperties} ViewProperties extension.
   */
  export interface ButtonType extends ViewProperties {}

  /**
   * Properties for a native input form confirm button text component.
   * @extends {TextProperties} TextProperties extension.
   */
  export interface ButtonTextType extends TextProperties {}

  /**
   * Properties selector for a native input form component.
   */
  export interface SelectorType {
    containerProperties(header: Data.Input.Header): Try<ContainerType>;
    buttonProperties(header: Data.Input.Header): Try<ButtonType>;
    buttonTextProperties(header: Data.Input.Header): Try<ButtonTextType>;
  }

  /**
   * Provide properties for an input form component. 
   * @extends {InputList.Native.Properties.ProviderType} Input list properties
   * provider extension.
   */
  export interface ProviderType extends InputList.Native.Properties.ProviderType {
    inputForm?: Readonly<SelectorType>;
  }
}

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