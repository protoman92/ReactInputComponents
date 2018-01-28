import { Observable, Observer } from 'rxjs';
import { Nullable, Try } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import { DispatchReducer, ReduxStore as Store, ReduxStore } from 'reactive-rx-redux-js';
import { Data } from 'react-base-utilities-js';
import * as Base from './base';

export type ActionType<T> = Store.Dispatch.Action.Type<T>;

export namespace Action {
  export let UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';

  /**
   * Action for dispatch store-based view model.
   * @extends {Base.Action.Type} Base action extension.
   */
  export interface CreatorType extends Base.Action.Type {
    createUpdateAction(path: string, value: Nullable<string>): ActionType<Nullable<string>>;
  }

  /**
   * Action provider for dispatch store-based view model.
   * @extends {Base.Action.ProviderType} Base provider extension.
   */
  export interface ProviderType extends Base.Action.ProviderType {
    inputCell: CreatorType;
  }

  /**
   * Check if an action is part of this action set.
   * @param {Store.Dispatch.Action.Type<any>} action An action instance.
   * @returns {boolean} A boolean value.
   */
  export function isInstance(action: Store.Dispatch.Action.Type<any>): boolean {
    switch (action.id) {
      case UPDATE_INPUT_VALUE: return true;
      default: return false;
    }
  }

  /**
   * Create a default action creator, based on the paths provided by the base
   * action.
   * @param {Base.Action.Type} base A base action instance.
   * @returns {CreatorType} A CreatorType instance.
   */
  export let createDefault = (base: Base.Action.Type): CreatorType => {
    return {
      ...base,
      createUpdateAction: (path: string, value: Nullable<string>) => {
        return {
          id: UPDATE_INPUT_VALUE,
          fullValuePath: path,
          payload: value,
        };
      },
    };
  };
}

export namespace Reducer {
  /**
   * Create a default reducer for input actions.
   * @returns {DispatchReducer<any>} A DispatchReducer instance.
   */
  export let createDefault = (): DispatchReducer<any> => {
    return (state: S.Self<any>, action: ActionType<any>): S.Self<any> => {
      switch (action.id) {
        case Action.UPDATE_INPUT_VALUE:
          return state.updatingValue(action.fullValuePath, action.payload);

        default:
          return state;
      }
    };
  };
}

export namespace Provider {
  /**
   * Provider for dispatch store-based view model.
   * @extends {Base.Provider.Type} Base provider extension.
   */
  export interface Type extends Base.Provider.Type {
    action: Action.ProviderType;
    store: ReduxStore.Dispatch.Type;
  }
}

export namespace Model {
  /**
   * Dispatch store-based model implementation.
   * @extends {Base.Model.Type} Base model extension.
   */
  export interface Type extends Base.Model.Type {}

  /**
   * Dispatch store-based model implementation.
   * @implements {Type} Type implementation.
   */
  export class Self implements Type {
    private readonly provider: Provider.Type;
    private readonly baseModel: Base.Model.Type;

    public get inputItem(): Readonly<Data.Input.Type> {
      return this.baseModel.inputItem;
    }

    public get fullInputValuePath(): Readonly<Try<string>> {
      return this.baseModel.fullInputValuePath;
    }

    public get inputSubstatePath(): Readonly<Try<string>> {
      return this.baseModel.inputSubstatePath;
    }

    public constructor(provider: Provider.Type, input: Data.Input.Type) {
      this.provider = provider;
      this.baseModel = new Base.Model.Self(provider, input);
    }

    public inputTrigger = (): Try<Observer<Nullable<string>>> => {
      let provider = this.provider;
      let action = provider.action.inputCell;
      let actionTrigger = provider.store.actionTrigger();
      
      return this.fullInputValuePath
        .map(v => actionTrigger.mapObserver<Nullable<string>>(v1 => {
          return action.createUpdateAction(v, v1);
        }));
    }

    public inputStream = (): Observable<Try<string>> => {
      return this.baseModel.inputStream();
    }

    public inputValueForState = (state: S.Self<any>): Try<string> => {
      return this.baseModel.inputValueForState(state);
    }
  }
}