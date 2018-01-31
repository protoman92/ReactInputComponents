import { Nullable } from 'javascriptutilities';
import { Data, MVVM } from 'react-base-utilities-js';
import * as InputCell from './../../inputcell';

export namespace Provider {
  /**
   * Provide the necessary dependencies for an input list component.
   * @extends {InputCell.Base.Provider.Type} Input cell provider extension.
   */
  export interface Type extends InputCell.Base.Provider.Type {
  }
}

export namespace Model {
  /**
   * Provide model for input list.
   */
  export interface ProviderType  {
    inputList_model(inputs: Data.Input.Type[]): Type;
  }

  /**
   * Base model for an input list view model.
   * @extends {IInputCell.Base.Model.ProviderType} Input cell model provider
   * extension.
   */
  export interface Type extends InputCell.Base.Model.ProviderType {
    inputItems: Readonly<Data.Input.Type[]>;
  }

  /**
   * Base model for an input list view model. Note that this implementation
   * throws error when providing the input cell model, because the provision
   * depends on whether we are using a dispatch store- or rx store-based
   * approach.
   * @implements {Type} Type implementation.
   */
  export class Self implements Type {
    public readonly inputItems: Data.Input.Type[];

    public constructor(inputItems: Data.Input.Type[]) {
      this.inputItems = inputItems;
    }

    public inputCell_model(_input: Data.Input.Type): InputCell.Base.Model.Type {
      throw new Error(`Must override this for ${this}`);
    }
  }
}

export namespace ViewModel {
  /**
   * Provide view model for an input list component.
   */
  export interface ProviderType {
    inputList_viewModel(inputs: Data.Input.Type[]): Type;
  }

  /**
   * View model for an input list component.
   * @extends {MVVM.ViewModel.Type} View model extension.
   * @extends {InputCell.Base.ViewModel.ProviderType} Input cell VM provider
   * extension.
   */
  export interface Type extends MVVM.ViewModel.Type, InputCell.Base.ViewModel.ProviderType {
    inputItems: Readonly<Data.Input.Type[]>;
  }

  /**
   * View model for input list.
   * @implements {Type} View model implementation.
   */
  export class Self implements Type {
    private readonly provider: Provider.Type;
    private readonly model: Model.Type;

    public get screen(): Readonly<Nullable<MVVM.Navigation.Screen.BaseType>> {
      return undefined;
    }

    public get inputItems(): Readonly<Data.Input.Type[]> {
      return this.model.inputItems;
    }

    public constructor(provider: Provider.Type, model: Model.Type) {
      this.provider = provider;
      this.model = model;
    }

    public initialize = (): void => {};
    public deinitialize = (): void => {};

    public inputCell_viewModel(input: Data.Input.Type): InputCell.Base.ViewModel.Type {
      let provider = this.provider;
      let model = this.model.inputCell_model(input);
      return new InputCell.Base.ViewModel.Self(provider, model);
    }
  }
}