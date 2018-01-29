import * as React from 'react';
import { Component } from 'react';
import { State } from 'type-safe-state-js';
import * as InputList from './../../inputlist';
import { ViewModel } from './Dependency';

export namespace Props {
  /**
   * Prop type for an input form component.
   * @extends {React.Attributes} React attributes extension.
   */
  export interface Type extends React.Attributes {
    viewModel: ViewModel.Type;
  }
}

/**
 * Input form component.
 * @extends {Component<P, Self<any>>} Component implementation.
 * @template P Props type generics.
 */
export abstract class Self<P extends Props.Type> extends Component<P, State.Self<any>> {
  public static get displayName(): string {
    return 'Input form';
  }

  protected viewModel: ViewModel.Type;

  public constructor(props: P) {
    super(props);
    this.viewModel = props.viewModel;
  }

  /**
   * Handle confirm button click.
   */
  protected handleConfirmButtonClick = () => {
    this.viewModel.triggerConfirm();
  }

  /**
   * Get a input list component.
   * @returns {JSX.Element} An JSX Element instance.
   */
  protected createInputListComponent = (): JSX.Element => {
    let viewModel = this.viewModel;
    let inputs = viewModel.inputHeader.allInputs();
    let vm = viewModel.inputList_viewModel(inputs);
    return this.createInputList(vm);
  }

  /**
   * Create an input list component using a specified view model.
   * @param {InputList.Base.ViewModel.Type} vm An input list view model instance.
   * @returns {JSX.Element} A JSX Element instance.
   */
  protected abstract createInputList(vm: InputList.Base.ViewModel.Type): JSX.Element;
  public abstract render(): JSX.Element;
}