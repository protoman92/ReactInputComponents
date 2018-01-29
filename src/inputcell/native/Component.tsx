import * as React from 'react';
import { TextInput } from 'react-native';
import { Nullable } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import * as Base from './../base';
import { Style } from './Dependency';

export namespace Props {
  /**
   * Props type for native input cell component.
   * @extends {Base.Component.Props.Type} Base component extension.
   */
  export interface Type extends Base.Component.Props.Type {
    style: Style.ProviderType;
  }
}

/**
 * Native input cell component.
 * @extends {Base.Component.Self<Props.Type, {}>} Base component extension.
 */
export class Self extends Base.Component.Self<Props.Type, {}> {
  /**
   * Handle text input event.
   * @param {Nullable<string>} text A string value.
   */
  private handleTextInputEvent = (text: Nullable<string>): void => {
    this.handleTextInput(text);
  }

  public convertStateToTypeSafeState(state: Nullable<{}>): S.Self<any> {
    return state !== undefined && state !== null ? S.fromKeyValue(state) : S.empty();
  }

  public convertTypeSafeStateToState(state: S.Self<any>): {} {
    return state.flatten();
  }

  public render(): JSX.Element {
    let input = this.viewModel.inputItem;

    return <TextInput
      onChangeText={this.handleTextInputEvent.bind(this)}
      style={this.props.style.inputCell.style(input).value}
      value={this.currentInputValue()}/>;
  }
}