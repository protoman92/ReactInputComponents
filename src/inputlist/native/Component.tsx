import * as React from 'react';
import { FlatList } from 'react-native';
import { Component, Data } from 'react-base-utilities-js';
import * as InputCell from './../../inputcell';
import * as Base from './../base';
import { Style } from './Dependency';

export namespace Props {
  /**
   * Props type for a native input list component.
   * @extends {Base.Component.Props.Type} Base component props extension.
   */
  export interface Type extends Base.Component.Props.Type {
    style: Style.ProviderType;
  }
}

/**
 * Native input list component. This is a simple flat list that does not have
 * section support, and is meant for straightforward inputs, such as login forms.
 * @extends {Base.Component.Self<Props.Type>} Base component extension.
 */
export class Self extends Base.Component.Self<Props.Type> {
  public get platform(): Readonly<Component.Platform.Case> {
    return Component.Platform.Case.NATIVE_COMMON;
  }

  protected createInputCell(vm: InputCell.Base.ViewModel.Type): JSX.Element {
    let props = { viewModel: vm, style: this.props.style };
    return <InputCell.Native.Component.Self {...props}/>;
  }

  /**
   * Extract keys for a list view.
   * @param {Data.Input.Type} item An input item.
   * @returns {string} A string value.
   */
  private keyExtractor = (item: Data.Input.Type): string => item.id;

  /**
   * Render item for a list view.
   * @param {Data.Input.Type} item An input item.
   * @returns {JSX.Element} A JSX Element instance.
   */
  private renderItem = (item: Data.Input.Type): JSX.Element => {
    let vm = this.viewModel.inputCell_viewModel(item);
    return this.createInputCell(vm);
  }

  public render(): JSX.Element {
    let viewModel = this.viewModel;
    let inputs = viewModel.inputItems.map(v => v);

    return <FlatList
      data={...inputs}
      keyExtractor={this.keyExtractor.bind(this)}
      renderItem={this.renderItem.bind(this)}/>;
  }
}