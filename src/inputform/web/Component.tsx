import * as React from 'react';
import { MouseEvent } from 'react';
import { Try } from 'javascriptutilities';
import { Component, Connector } from 'react-base-utilities-js';
import * as Base from './../base';
import { Identity } from './Dependency';
import * as InputList from '../../inputlist';

export namespace Props {
  /**
   * Prop type for web input form component.
   * @extends {React.Attributes} React attributes extension.
   * @extends {Base.Component.Props.Type} Base component props extension.
   */
  export interface Type extends React.Attributes, Base.Component.Props.Type {
    identity?: Identity.ProviderType;
  }
}

/**
 * Create a default input form component.
 * @param {Props.Type} props Props type instance.
 * @returns {JSX.Element} A JSX Element instance.
 */
export let createDefault = (props: Props.Type): JSX.Element => {
  let wrapped = Connector.Lifecycle.connect()(Self);
  return React.createElement(wrapped, props);
};

/**
 * Input form component.
 * @extends {Base.Component.Self<Props.Type>} Base Component extension.
 */
export class Self extends Base.Component.Self<Props.Type> {
  public get platform(): Readonly<Component.Platform.Case> {
    return Component.Platform.Case.WEB;
  }

  /**
   * Handle login button click.
   * @param {MouseEvent<HTMLButtonElement>} _e Click event.
   */
  private handleConfirmButtonEvent = (_e: MouseEvent<HTMLButtonElement>) => {
    this.handleConfirmButtonClick();
  }

  protected createInputList(vm: InputList.Base.ViewModel.Type): JSX.Element {
    let props: InputList.Web.Component.Props.Type = {
      viewModel: vm,
      identity: this.props.identity,
    };

    return InputList.Web.Component.createDefault(props);
  }

  public render(): JSX.Element {
    let viewModel = this.viewModel;
    let header = viewModel.inputHeader;

    let identity = Try.unwrap(this.props.identity)
      .flatMap(v => Try.unwrap(v.inputForm));

    let containerIdentity = identity.flatMap(v => v.identity(header));
    let buttonIdentity = identity.flatMap(v => v.button_identity(header));

    return (
      <div {...containerIdentity.value}>
        {this.createInputListComponent()}
        <button
          {...buttonIdentity.value}
          onClick={this.handleConfirmButtonEvent.bind(this)}>
          {header.confirmTitle}
        </button>
      </div>
    );
  }
}