import * as React from 'react';
import { Try } from 'javascriptutilities';
import { Connector, Data } from 'react-base-utilities-js';
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
    identity: Identity.ProviderType;
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
  protected createInputCell(input: Data.Input.Type): JSX.Element {
    let identity = this.props.identity;
    let viewModel = this.viewModel.inputCell_viewModel(input);
    let props: InputCell.Web.Component.Props.Type = { viewModel, identity };
    return <InputCell.Web.Component.Self key={input.id} {...props}/>;
  }

  public render(): JSX.Element {
    let inputs = this.viewModel.inputItems;

    let identity = Try.unwrap(this.props.identity.inputList)
      .flatMap(v => v.identity(inputs));

    return (<div {...identity}>{this.createInputCells()}</div>);
  }
}