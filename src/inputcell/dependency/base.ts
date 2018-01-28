import { Observable, Observer } from 'rxjs';
import { Nullable, Try } from 'javascriptutilities';
import { ReduxStore } from 'reactive-rx-redux-js';
import { State as S } from 'type-safe-state-js';
import { Data, MVVM } from 'react-base-utilities-js';

export namespace Action {
  /**
   * Base actions for input cell. This interface forms the basis for dispatch
   * and rx store-based input cell view models.
   */
  export interface Type {
    fullValuePath(input: Data.Input.Type): Try<string>;
  }

  /**
   * Provide action for input cell.
   */
  export interface ProviderType {
    inputCell: Readonly<Type>;
  }
}

export namespace Provider {
  /**
   * Provide the relevant dependencies for input cells.
   */
  export interface Type extends ReduxStore.Provider.Type {
    action: Readonly<Action.ProviderType>;
  }
}

export namespace Model {
  /**
   * Provide model for different input items.
   */
  export interface ProviderType {
    inputCell_model(item: Data.Input.Type): Try<Type>;
  }

  /**
   * Base model for input cell view model.
   */
  export interface Type {
    inputItem: Readonly<Data.Input.Type>;
    inputSubstatePath: Readonly<Try<string>>;
    fullInputValuePath: Readonly<Try<string>>;
    inputTrigger(): Try<Observer<Nullable<string>>>;
    inputStream(): Observable<Try<string>>;

    /**
     * Get the current input value from a state object to populate the input
     * view. This way, the input component does not handle its own input, but
     * instead simply hands it over to the view model to trigger state update.
     * As a result, we have only 1 source of truth for said component.
     * @param {Readonly<Nullable<S.Self<any>>>} state A State instance.
     * @returns {Try<string>} A Try string instance.
     */
    inputValueForState(state: Readonly<Nullable<S.Self<any>>>): Try<string>;
  }

  /**
   * Model for input cell.
   * @implements {Type} Type implementation.
   */
  export class Self implements Type {
    public readonly inputItem: Data.Input.Type;
    private readonly provider: Provider.Type;

    public get fullInputValuePath(): Readonly<Try<string>> {
      return this.provider.action.inputCell.fullValuePath(this.inputItem);
    }

    public get inputSubstatePath(): Readonly<Try<string>> {
      let separator = this.provider.substateSeparator;

      return this.fullInputValuePath
        .map(v => S.separateSubstateAndValuePaths(v, separator))
        .map(v => v[0]);
    }

    private get inputValuePath(): Readonly<Try<string>> {
      let separator = this.provider.substateSeparator;

      return this.fullInputValuePath
        .map(v => S.separateSubstateAndValuePaths(v, separator))
        .map(v => v[1]);
    }

    public constructor(provider: Provider.Type, input: Data.Input.Type) {
      this.provider = provider;
      this.inputItem = input;
    }

    public inputStream = (): Observable<Try<string>> => {
      try {
        let path = this.fullInputValuePath.getOrThrow();
        return this.provider.store.stringAtNode(path);
      } catch (e) {
        return Observable.of(Try.failure(e));
      }
    }

    public inputTrigger = (): Readonly<Try<Observer<Nullable<string>>>> => {
      throw new Error(`Must override this for ${this}`);
    }

    public inputValueForState = (state: Readonly<Nullable<S.Self<any>>>): Try<string> => {
      let path = this.inputValuePath;
      
      return Try.unwrap(state)
        .zipWith(path, (v1, v2) => v1.stringAtNode(v2))
        .flatMap(v => v);
    }
  }
}

export namespace ViewModel {
  /**
   * Provide view model for input cell.
   */
  export interface ProviderType {
    inputCell_viewModel(item: Data.Input.Type): Try<Type>;
  }

  /**
   * View model for input cell.
   * @extends {MVVM.ViewModel.ReduxType} Redux VM. extension.
   */
  export interface Type extends MVVM.ViewModel.ReduxType {
    inputItem: Readonly<Data.Input.Type>;
    inputStream(): Observable<Try<string>>;
    triggerInput(input: Nullable<string>): void;
    inputValueForState(state: Readonly<Nullable<S.Self<any>>>): Try<string>;
  }

  /**
   * View model for input cell. We only need to supply the correct model to
   * switch between dispatch store-based and Rx store-based Redux pattern.
   * @implements {Type} View model implementation.
   */
  export class Self implements Type  {
    private readonly provider: Provider.Type;
    private readonly model: Model.Type;

    public get screen(): Readonly<Nullable<MVVM.Navigation.Screen.Type>> {
      return undefined;
    }

    public get inputItem(): Readonly<Data.Input.Type> {
      return this.model.inputItem;
    }

    public constructor(provider: Provider.Type, model: Model.Type) {
      this.provider = provider;
      this.model = model; 
    }

    public initialize = (): void => {};
    public deinitialize = (): void => {};

    public stateStream = (): Observable<Try<S.Self<any>>> => {
      try {
        let substatePath = this.model.inputSubstatePath.getOrThrow();

        return this.provider.store.stateStream()
          .map(v => v.substateAtNode(substatePath));
      } catch (e) {
        return Observable.of(Try.failure(e));
      }
    }

    public inputStream = (): Observable<Try<string>> => {
      return this.model.inputStream();
    }

    public triggerInput = (input: Nullable<string>): void => {
      this.model.inputTrigger().map(v => v.next(input));
    }

    public inputValueForState = (state: Readonly<Nullable<S.Self<any>>>): Try<string> => {
      return this.model.inputValueForState(state);
    }
  }
}