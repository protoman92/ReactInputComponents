import { ScrollViewProperties, ViewStyle } from 'react-native';
import { Try } from 'javascriptutilities';
import { Data } from 'react-base-utilities-js';
import * as InputCell from './../../inputcell';

export namespace Properties {
  /**
   * Properties for a native input list component.
   * @extends {ScrollViewProperties} ScrollViewProperties extension.
   */
  export interface Type extends ScrollViewProperties {}

  /**
   * Select the appropriate properties based on the input items.
   */
  export interface SelectorType {
    properties(inputs: Data.Input.Type[]): Try<Type>;
  }

  /**
   * Provide properties for an input list component.
   * @extends {InputCell.Native.Properties.ProviderType} Input cell properties
   * provider extension.
   */
  export interface ProviderType extends InputCell.Native.Properties.ProviderType {
    inputList?: Readonly<SelectorType>;
  }
}

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
    style(inputs: Data.Input.Type[]): Try<Type>;
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