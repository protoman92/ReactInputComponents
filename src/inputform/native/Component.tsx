import * as React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Component } from 'react-base-utilities-js';
import * as InputList from './../../inputlist';
import * as Base from './../base';
import { Style } from './Dependency';

export namespace Props {
  /**
   * Props type for a native input form component.
   * @extends {Base.Component.Props.Type} Base props type extension.
   */
  export interface Type extends Base.Component.Props.Type {
    style: Style.ProviderType;
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
    let props = { viewModel: vm, style: this.props.style };
    return <InputList.Native.Component.Self {...props}/>;
  }

  public render(): JSX.Element {
    let viewModel = this.viewModel;
    let header = viewModel.inputHeader;
    let style = this.props.style.inputForm;

    return (
      <View style={style.containerStyle(header).value}>
        {this.createInputListComponent()}
        <TouchableOpacity
          onPress={this.handleConfirmButtonClick.bind(this)}
          style={style.buttonStyle(header).value}>
          <Text style={style.buttonTextStyle(header).value}>
            {header.confirmTitle}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}