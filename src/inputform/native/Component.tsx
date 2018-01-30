import * as React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Try } from 'javascriptutilities';
import { Component } from 'react-base-utilities-js';
import * as InputList from './../../inputlist';
import * as Base from './../base';
import { Properties, Style } from './Dependency';

export namespace Props {
  /**
   * Props type for a native input form component.
   * @extends {Base.Component.Props.Type} Base props type extension.
   */
  export interface Type extends Base.Component.Props.Type {
    properties?: Readonly<Properties.ProviderType>;
    style: Readonly<Style.ProviderType>;
  }
}

/**
 * Native input form component.
 * @extends {Base.Component.Self<Props.Type>} Base component extension.
 */
export class Self extends Base.Component.Self<Props.Type> {
  public get platform(): Readonly<Component.Platform.Case> {
    return Component.Platform.Case.NATIVE_COMMON;
  }

  public createInputList(vm: InputList.Base.ViewModel.Type): JSX.Element {
    let props = this.props;

    let listProps = {
      viewModel: vm,
      properties: props.properties,
      style: props.style,
    };

    return <InputList.Native.Component.Self {...listProps}/>;
  }

  public render(): JSX.Element {
    let viewModel = this.viewModel;
    let header = viewModel.inputHeader;
    let style = this.props.style.inputForm;

    let properties = Try.unwrap(this.props.properties)
      .flatMap(v => Try.unwrap(v.inputForm));

    return (
      <View
        {...properties.flatMap(v => v.containerProperties(header)).value}
        style={style.containerStyle(header).value}>
        {this.createInputListComponent()}
        <TouchableOpacity
          {...properties.flatMap(v => v.buttonProperties(header)).value}
          onPress={this.handleConfirmButtonClick.bind(this)}
          style={style.buttonStyle(header).value}>
          <Text
            {...properties.flatMap(v => v.buttonTextProperties(header)).value}
            style={style.buttonTextStyle(header).value}>
            {header.confirmTitle}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}