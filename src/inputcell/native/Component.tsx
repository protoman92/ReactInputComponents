import * as React from 'react';
import { TextInput } from 'react-native';
import { Try } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import { Component } from 'react-base-utilities-js';
import * as Base from './../base';
import { Properties, Style } from './Dependency';

export namespace Props {
  /**
   * Props type for a native input cell component.
   * @extends {Base.Component.Props.Type} Base component extension.
   */
  export interface Type extends Base.Component.Props.Type {
    readonly propertiesProvider?: Readonly<Properties.ProviderType>;
    readonly styleProvider: Readonly<Style.ProviderType>;
  }
}

/**
 * Native input cell component.
 * @extends {Base.Component.Type<Props.Type>} Base component extension.
 */
export class Self extends Base.Component.Self<Props.Type> {
  public get platform(): Readonly<Component.Platform.Case> {
    return Component.Platform.Case.NATIVE_COMMON;
  }

  public render(): JSX.Element {
    let input = this.viewModel.inputItem;
    let state = S.fromKeyValue(this.state);

    let properties = Try.unwrap(this.props.propertiesProvider)
      .flatMap(v => Try.unwrap(v.inputCell))
      .flatMap(v => Try.unwrap(v.properties))
      .flatMap(v => v(input));

    return <TextInput
      {...properties.value}
      onChangeText={this.handleTextInput.bind(this)}
      style={this.props.styleProvider.inputCell.style(input).value}
      value={this.currentInputValue(state)}/>;
  }
}