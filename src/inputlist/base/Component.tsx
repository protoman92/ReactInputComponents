import * as React from 'react';
import { Component } from 'react';
import { StateType } from 'type-safe-state-js';
import { Component as ComponentUtil } from 'react-base-utilities-js';
import * as InputCell from '../../inputcell';
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
 * @extends {Component<PropType, ST>} Component extension.
 * @implements {ComponentUtil.Type.Type<T, StateType<any>>} Custom component
 * implementation.
 * @template P Props type generics.
 */
export abstract class Self<P extends Props.Type> extends
  Component<P, StateType<any>> implements
  ComponentUtil.Custom.Type<P, StateType<any>> {
  public static get displayName(): string {
    return 'Input list';
  }

  public abstract readonly platform: ComponentUtil.Platform.Case;
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
   * Create input cell components.
   * @returns {JSX.Element[]} An Array of JSX Elements.
   */
  protected createInputCells(): JSX.Element[] {
    let viewModel = this.viewModel;

    return viewModel.inputItems
      .map(v => viewModel.inputCell_viewModel(v))
      .map(v => this.createInputCell(v));
  }

  /**
   * Create an input cell component.
   * @param {InputCell.Base.ViewModel.Type} vm An input cell view model instance.
   * @returns {JSX.Element} A JSX Element instance.
   */
  protected abstract createInputCell(vm: InputCell.Base.ViewModel.Type): JSX.Element;

  public abstract render(): JSX.Element;
}