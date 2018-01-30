import * as React from 'react';
import { TextInput } from 'react-native';
import { Try } from 'javascriptutilities';
import { Component } from 'react-base-utilities-js';
import * as Base from './../base';
import { Properties, Style } from './Dependency';

export namespace Props {
  /**
   * Props type for native input cell component.
   * @extends {Base.Component.Props.Type} Base component extension.
   */
  export interface Type extends Base.Component.Props.Type {
    properties?: Readonly<Properties.ProviderType>;
    style: Readonly<Style.ProviderType>;
  }
}

/**
 * Native input cell component.
 * @extends {Base.Component.Self<Props.Type>} Base component extension.
 */
export class Self extends Base.Component.Self<Props.Type> {
  public get platform(): Readonly<Component.Platform.Case> {
    return Component.Platform.Case.NATIVE_COMMON;
  }

  public render(): JSX.Element {
    let input = this.viewModel.inputItem;

    let properties = Try.unwrap(this.props.properties)
      .flatMap(v => Try.unwrap(v.inputCell))
      .flatMap(v => v.properties(input));

    console.log(properties);

    return <TextInput
      {...properties.value}
      onChangeText={this.handleTextInput.bind(this)}
      style={this.props.style.inputCell.style(input).value}
      value={this.currentInputValue()}/>;
  }
}