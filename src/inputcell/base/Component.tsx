import { Subscription } from 'rxjs';
import * as React from 'react';
import { Component } from 'react';
import { Nullable } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import { ViewModel } from './Dependency';

export namespace Props {
  /**
   * Base prop type for input cell component.
   * @extends {React.Attributes} React attributes extension.
   */
  export interface Type extends React.Attributes {
    viewModel: Readonly<ViewModel.Type>;
  }
}

/**
 * Base input field component that provides some common functionalities. Extend
 * this class to provide platform-specific components.
 * @extends {Component<P,S.Self<any>>} Component extension.
 * @template P Props generics.
 */
export abstract class Self<P extends Props.Type> extends Component<P,S.Self<any>> {
  public static get displayName(): string {
    return 'Input cell';
  }

  protected readonly viewModel: ViewModel.Type;
  private readonly subscription: Subscription;

  public constructor(props: P) {
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
   * Handle text input from the input cell. 
   * @param {Nullable<string>} input A string value.
   */
  protected handleTextInput = (input: Nullable<string>): void => {
    this.viewModel.triggerInput(input);
  }

  /**
   * Get the current input value.
   * @returns {string} A string value.
   */
  protected currentInputValue = (): string => {
    return this.viewModel.inputValueForState(this.state).getOrElse('');
  }

  public abstract render(): JSX.Element;
}