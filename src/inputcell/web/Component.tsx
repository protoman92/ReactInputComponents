import * as React from 'react';
import { ChangeEvent } from 'react';
import { Try } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import { Component, Connector } from 'react-base-utilities-js';
import * as Base from './../base';
import { Identity } from './Dependency';

export namespace Props {
  /**
   * Prop type for input cell.
   * @extends {React.Attributes} React attributes extension.
   * @extends {Base.Component.Props.Type} Base component props extension.
   */
  export interface Type extends React.Attributes, Base.Component.Props.Type {
    readonly identityProvider?: Readonly<Identity.ProviderType>;
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
 * @extends {Base.Component.Self<Props.Type>} Base Component extension.
 */
export class Self extends Base.Component.Self<Props.Type> {
  public get platform(): Readonly<Component.Platform.Case> {
    return Component.Platform.Case.WEB;
  }

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
    let state = S.fromKeyValue(this.state);

    let identity = Try.unwrap(props.identityProvider)
      .flatMap(v => Try.unwrap(v.inputCell))
      .flatMap(v => v.identity(input));

    return (
      <input
        {...identity.value}
        onChange={this.handleTextInputEvent.bind(this)}
        placeholder={input.placeholder}
        value={this.currentInputValue(state)}/>
    );
  }
}