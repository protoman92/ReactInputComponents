import * as React from 'react';
import { ChangeEvent } from 'react';
import { Try } from 'javascriptutilities';
import { Connector } from 'react-base-utilities-js';
import { Component as BaseComponent } from './../base';
import { Identity } from './Dependency';

export namespace Props {
  /**
   * Prop type for input cell.
   * @extends {React.Attributes} React attributes extension.
   * @extends {BaseComponent.Props.Type} Base component props extension.
   */
  export interface Type extends React.Attributes, BaseComponent.Props.Type {
    identity: Readonly<Identity.ProviderType>;
  }
}

/**
 * Create a default input cell component.
 * @param {Props.Type} props A Props type instance.
 * @returns {JSX.Element} A JSX Element.
 */
export let createDefault = (props: Props.Type): JSX.Element => {
  let wrapped = Connector.Lifecycle.connect()(Self);
  return React.createElement(wrapped, props);
};

/**
 * Use this component to handle web-based inputs. Common functionalities are
 * provided by the base component.
 * @extends {BaseComponent.Self} Base Component extension.
 */
export class Self extends BaseComponent.Self<Props.Type> {
  /**
   * Handle text inputs by triggering state update.
   * @param {ChangeEvent<HTMLInputElement>} e Change event.
   */
  private handleTextInputEvent = (e: ChangeEvent<HTMLInputElement>): void => {
    this.handleTextInput(e.target.value);
  }

  public render(): JSX.Element {
    let props = this.props;
    let viewModel = this.viewModel;
    let input = viewModel.inputItem;

    let identity = Try.unwrap(props.identity.inputCell)
      .flatMap(v => v.identity(input));
    
    return (
      <input
        {...identity.value}
        onChange={this.handleTextInputEvent.bind(this)}
        placeholder={input.placeholder}
        value={this.currentInputValue()}/>
    );
  }
}