import * as React from 'react';
import { View } from 'react-native';
import { Try } from 'javascriptutilities';
import { Component } from 'react-base-utilities-js';
import { TouchableButton } from 'react-native-basic-components';
import * as InputList from './../../inputlist';
import * as Base from './../base';
import { Properties, Style } from './Dependency';

export namespace Props {
  /**
   * Props type for a native input form component.
   * @extends {Base.Component.Props.Type} Base props type extension.
   */
  export interface Type extends Base.Component.Props.Type {
    propertiesProvider?: Readonly<Properties.ProviderType>;
    styleProvider: Readonly<Style.ProviderType>;
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

  protected createInputList(vm: InputList.Base.ViewModel.Type): JSX.Element {
    let props = this.props;

    let listProps = {
      viewModel: vm,
      propertiesProvider: props.propertiesProvider,
      styleProvider: props.styleProvider,
    };

    return <InputList.Native.Component.Self {...listProps}/>;
  }

  public render(): JSX.Element {
    let props = this.props;
    let viewModel = this.viewModel;
    let header = viewModel.inputHeader;
    let style = props.styleProvider.inputForm;

    let properties = Try.unwrap(props.propertiesProvider)
      .flatMap(v => Try.unwrap(v.inputForm));

    let buttonProps: TouchableButton.Component.Props.Type = {
      id: header.title,
      styleProvider: props.styleProvider,
      propertiesProvider: props.propertiesProvider,
      value: header.confirmTitle,
      onPress: this.handleConfirmButtonClick.bind(this),
    };

    return (
      <View
        {...properties.flatMap(v => v.containerProperties(header)).value}
        style={style.containerStyle(header).value}>
        {this.createInputListComponent()}
        <TouchableButton.Component.Self {...buttonProps}/>
      </View>
    );
  }
}