import { Subscription } from 'rxjs';
import * as React from 'react';
import { Component } from 'react';
import { Nullable } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import { Component as ComponentUtil } from 'react-base-utilities-js';
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
 * @extends {Component<P, S>} Component extension.
 * @implements {ComponentUtil.TypeSafeStateConvertible.Type<ST, any>} State
 * convertible implementation.
 * @template P Props generics.
 * @template ST State generics.
 */
export abstract class Self<P extends Props.Type, ST> extends
  Component<P, ST> implements
  ComponentUtil.TypeSafeStateConvertible.Type<ST, any> {
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
      .map(v => this.convertTypeSafeStateToState(v))
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
    let state = this.convertStateToTypeSafeState(this.state);
    return this.viewModel.inputValueForState(state).getOrElse('');
  }

  public abstract convertTypeSafeStateToState(state: Nullable<S.Self<any>>): ST;
  public abstract convertStateToTypeSafeState(state: Nullable<ST>): S.Self<any>;
  public abstract render(): JSX.Element;
}