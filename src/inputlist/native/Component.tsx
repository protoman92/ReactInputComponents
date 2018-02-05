import * as React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { Try } from 'javascriptutilities';
import { Component, Data } from 'react-base-utilities-js';
import * as InputCell from './../../inputcell';
import * as Base from './../base';
import { Properties, Style } from './Dependency';

export namespace Props {
  /**
   * Props type for a native input list component.
   * @extends {Base.Component.Props.Type} Base component props extension.
   */
  export interface Type extends Base.Component.Props.Type {
    readonly propertiesProvider?: Readonly<Properties.ProviderType>;
    readonly styleProvider: Readonly<Style.ProviderType>;
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
    let props = this.props;

    let cellProps = {
      viewModel: vm,
      propertiesProvider: props.propertiesProvider,
      styleProvider: props.styleProvider,
    };

    return <InputCell.Native.Component.Self {...cellProps}/>;
  }

  /**
   * Extract keys for a list view.
   * @param {Data.Input.Type} item An input item.
   * @returns {string} A string value.
   */
  private keyExtractor = (item: Data.Input.Type): string => item.id;

  /**
   * Render item for a list view.
   * @param {ListRenderItemInfo<Data.Input.Type>} item An input item.
   * @returns {JSX.Element} A JSX Element instance.
   */
  private renderItem = (item: ListRenderItemInfo<Data.Input.Type>): JSX.Element => {
    let vm = this.viewModel.inputCell_viewModel(item.item);
    return this.createInputCell(vm);
  }

  public render(): JSX.Element {
    let viewModel = this.viewModel;
    let inputs = viewModel.inputItems.map(v => v);

    let properties = Try.unwrap(this.props.propertiesProvider)
      .flatMap(v => Try.unwrap(v.inputList))
      .flatMap(v => Try.unwrap(v.properties))
      .flatMap(v => v(inputs));

    return <FlatList
      {...properties.value}
      data={inputs}
      keyExtractor={this.keyExtractor.bind(this)}
      renderItem={this.renderItem.bind(this)}
      style={this.props.styleProvider.inputList.style(inputs).value}/>;
  }
}