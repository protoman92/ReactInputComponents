import * as React from 'react';
import { Try } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import { Component, Connector } from 'react-base-utilities-js';
import * as InputCell from './../../inputcell';
import * as Base from './../base';
import { Identity } from './Dependency';

export namespace Props {
  /**
   * Prop types for input list.
   * @extends {React.Attributes} React attributes extension.
   * @extends {Base.Component.Props.Type} Base props type extension.
   */
  export interface Type extends React.Attributes, Base.Component.Props.Type {
    identityProvider?: Readonly<Identity.ProviderType>;
  }
}

/**
 * Create a default web input list component.
 * @param {Props.Type} props A Props type instance.
 * @returns {JSX.Element} A JSX Element instance.
 */
export let createDefault = (props: Props.Type): JSX.Element => {
  let wrapped = Connector.Lifecycle.connect()(Self);
  return React.createElement(wrapped, props);
};

/**
 * Use this component to handle multiple web inputs.
 * @extends {Base.Component.Self<Props.Type>} Base Component extension.
 */
export class Self extends Base.Component.Self<Props.Type> {
  public get platform(): Readonly<Component.Platform.Case> {
    return Component.Platform.Case.WEB;
  }

  protected createInputCell(vm: InputCell.Base.ViewModel.Type): JSX.Element {
    let input = vm.inputItem;
    let identityProvider = this.props.identityProvider;
    let props: InputCell.Web.Component.Props.Type = { viewModel: vm, identityProvider };
    return <InputCell.Web.Component.Self key={input.id} {...props}/>;
  }

  public convertStateToTypeSafeState(state: S.Type<any>): S.Type<any> {
    return state;
  }

  public convertTypeSafeStateToState(state: S.Type<any>): S.Type<any> {
    return state;
  }

  public render(): JSX.Element {
    let inputs = this.viewModel.inputItems;

    let identity = Try.unwrap(this.props.identityProvider)
      .flatMap(v => Try.unwrap(v.inputList))
      .flatMap(v => v.identity(inputs));

    return (<div {...identity}>{this.createInputCells()}</div>);
  }
}