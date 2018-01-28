import { Observable, Observer } from 'rxjs';
import { Nullable, Try } from 'javascriptutilities';
import { State as S } from 'type-safe-state-js';
import { ReduxStore } from 'reactive-rx-redux-js';
import { Data } from 'react-base-utilities-js';
import * as Base from './base';

export namespace Action {
  /**
   * Action for rx store-based view model.
   */
  export interface Type extends Base.Action.Type {
    valueTrigger(input: Data.Input.Type): Try<Observer<Nullable<string>>>;
  }

  /**
   * Provide action for rx store-based view model.
   */
  export interface ProviderType {
    inputCell: Type;
  }
}

export namespace Provider {
  /**
   * Provide the relevant dependencies for rx store-based view model.
   */
  export interface Type extends ReduxStore.Provider.Type {
    action: Readonly<Action.ProviderType>;
  }
}

export namespace Model {
  /**
   * Rx store-based model implementation.
   * @extends {Base.Model.Type} Base model extension.
   */
  export interface Type extends Base.Model.Type {}

  /**
   * Rx store-based model implementation.
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

    public inputStream = (): Observable<Try<string>> => {
      return this.baseModel.inputStream();
    }

    public inputTrigger = (): Readonly<Try<Observer<Nullable<string>>>> => {
      return this.provider.action.inputCell.valueTrigger(this.inputItem);
    }

    public inputValueForState = (state: Readonly<Nullable<S.Self<any>>>): Try<string> => {
      return this.baseModel.inputValueForState(state);
    }
  }
}