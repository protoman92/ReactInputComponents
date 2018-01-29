import * as React from 'react';
import { Component } from 'react';
import { State } from 'type-safe-state-js';
import { Data } from 'react-base-utilities-js';
import { ViewModel } from './Dependency';

export namespace Props {
  /**
   * Prop types for input list.
   * @extends {React.Attributes} React attributes extension.
   */
  export interface Type extends React.Attributes {
    viewModel: Readonly<ViewModel.Type>;
  }
}

/**
 * Use this component to handle multiple inputs.
 * @extends {Component<PropType, State.Self<any>>} Component extension.
 * @template P Props type generics.
 */
export abstract class Self<P extends Props.Type> extends Component<P, State.Self<any>> {
  public static get displayName(): string {
    return 'Input list';
  }

  protected readonly viewModel: ViewModel.Type;

  public constructor(props: P) {
    super(props);
    this.viewModel = props.viewModel;
  }

  public componentWillMount() {
    this.viewModel.initialize();
  }

  public componentWillUnmount() {
    this.viewModel.deinitialize();
  }

  /**
   * Create an input cell component.
   * @param {Data.Input.Type} input An input item.
   * @returns {JSX.Element} A JSX Element instance.
   */
  protected abstract createInputCell(input: Data.Input.Type): JSX.Element;

  /**
   * Create input cell components.
   * @returns {JSX.Element[]} An Array of JSX Elements.
   */
  protected createInputCells(): JSX.Element[] {
    return this.viewModel.inputItems.map(v => this.createInputCell(v));
  }

  public abstract render(): JSX.Element;
}