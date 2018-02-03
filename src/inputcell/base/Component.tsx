import { Subscription } from 'rxjs';
import * as React from 'react';
import { Component } from 'react';
import { Nullable } from 'javascriptutilities';
import { State as S, StateType } from 'type-safe-state-js';
import { Component as ComponentUtil } from 'react-base-utilities-js';
import { ViewModel } from './Dependency';

export namespace Props {
  /**
   * Base prop type for input cell component.
   * @extends {React.Attributes} React attributes extension.
   */
  export interface Type extends React.Attributes {
    readonly viewModel: Readonly<ViewModel.Type>;
  }
}

/**
 * Base input field component that provides some common functionalities. Extend
 * this class to provide platform-specific components.
 * @extends {Component<P, S>} Component extension.
 * @implements {ComponentUtil.Custom.Type<P, StateType<any>>} Custom component
 * implementation.
 * @template P Props generics.
 */
export abstract class Self<P extends Props.Type> extends
  Component<P, StateType<any>> implements
  ComponentUtil.Custom.Type<P, StateType<any>> {
  public static get displayName(): string {
    return 'Input cell';
  }

  public abstract readonly platform: ComponentUtil.Platform.Case;
  protected readonly viewModel: ViewModel.Type;
  private readonly subscription: Subscription;

  public constructor(props: P) {
    super(props);
    this.viewModel = props.viewModel;
    this.subscription = new Subscription();
  }

  public componentWillMount(): void {
    let viewModel = this.viewModel;
    viewModel.initialize();
    ComponentUtil.Custom.connectState(this, viewModel, this.subscription);
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
   * @param {S.Type<any>} state A State instance.
   * @returns {string} A string value.
   */
  protected currentInputValue = (state: S.Type<any>): string => {
    return this.viewModel.inputValueForState(state).getOrElse('');
  }

  public abstract render(): JSX.Element;
}