import { ViewProperties, ViewStyle } from 'react-native';
import { Try } from 'javascriptutilities';
import { Data } from 'react-base-utilities-js';
import { TouchableButton } from 'react-native-basic-components';
import * as InputList from './../../inputlist';

export namespace Properties {
  /**
   * Properties for a native input form container component.
   * @extends {ViewProperties} ViewProperties extension.
   */
  export interface ContainerType extends ViewProperties {}

  /**
   * Properties selector for a native input form component.
   */
  export interface SelectorType {
    containerProperties?(header: Data.Input.Header): Try<ContainerType>;
  }

  /**
   * Provide properties for an input form component.
   * @extends {TouchableButton.Properties.ProviderType} Touchable button
   * properties provider extension.
   * @extends {InputList.Native.Properties.ProviderType} Input list properties
   * provider extension.
   */
  export interface ProviderType extends
    TouchableButton.Properties.ProviderType,
    InputList.Native.Properties.ProviderType {
    readonly inputForm?: Readonly<SelectorType>;
  }
}

export namespace Style {
  /**
   * Style for a native input form container component.
   * @extends {ViewStyle} ViewStyle extension.
   */
  export interface ContainerType extends ViewStyle {}

  /**
   * Style selector for a native input form component.
   */
  export interface SelectorType {
    containerStyle(header: Data.Input.Header): Try<ContainerType>;
  }

  /**
   * Provide styles for a native input form component.
   * @extends {TouchableButton.Style.ProviderType} Touchable button style
   * provider extension.
   * @extends {InputList.Native.Style.ProviderType} Input list style provider
   * extension.
   */
  export interface ProviderType extends
    TouchableButton.Style.ProviderType,
    InputList.Native.Style.ProviderType {
    readonly inputForm: SelectorType;
  }
}