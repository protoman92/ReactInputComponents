import { Subscription } from 'rxjs';
import * as React from 'react';
import { ChangeEvent, Component, ReactNode } from 'react';
import { Try } from 'javascriptutilities';
import { State } from 'type-safe-state-js';
import { Connector } from 'react-base-utilities-js';
import { ViewModel } from './../dependency/base';
import { Identity } from './Dependency';

export namespace Props {
  /**
   * Prop type for input cell.
   * @extends {React.Attributes} React attributes extension.
   */
  export interface Type extends React.Attributes {
    identity: Readonly<Identity.ProviderType>;
    viewModel: Readonly<ViewModel.Type>;
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
 * Use this component to handle inputs.
 * @extends {Component<PropType,State.Self<any>>} Component extension.
 */
export class Self extends Component<Props.Type,State.Self<any>> {
  public static get displayName(): string {
    return 'Input cell';
  }

  private readonly viewModel: ViewModel.Type;
  private readonly subscription: Subscription;

  public constructor(props: Props.Type) {
    super(props);
    this.viewModel = props.viewModel;
    this.subscription = new Subscription();
  }

  public componentWillMount(): void {
    this.viewModel.initialize();

    this.viewModel.stateStream()
      .mapNonNilOrEmpty(v => v)
      .distinctUntilChanged()
      .doOnNext(v => this.setState(v))
      .subscribe()
      .toBeDisposedBy(this.subscription);
  }

  public componentWillUnmount(): void {
    this.viewModel.deinitialize();
    this.subscription.unsubscribe();
  }

  /**
   * Handle text inputs by triggering state update.
   * @param {ChangeEvent<HTMLInputElement>} e Change event.
   */
  private handleTextInput = (e: ChangeEvent<HTMLInputElement>): void => {
    this.viewModel.triggerInput(e.target.value);
  }

  private currentInputValue = (): string => {
    return this.viewModel.inputValueForState(this.state).getOrElse('');
  }

  public render(): ReactNode {
    let props = this.props;
    let viewModel = this.viewModel;
    let input = viewModel.inputItem;

    let identity = Try.unwrap(props.identity.inputCell)
      .flatMap(v => v.identity(input));

    return (
      <input
        {...identity.value}
        onChange={this.handleTextInput.bind(this)}
        placeholder={input.placeholder}
        value={this.currentInputValue()}/>
    );
  }
}