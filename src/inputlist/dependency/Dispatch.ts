import { Data } from 'react-base-utilities-js';
import * as InputCell from './../../inputcell';
import * as Base from './../base';

export namespace Provider {
  /**
   * Provide the necessary dependencies for a dispatch store-based view model.
   * @extends {InputCell.Dispatch.Provider.Type} Input cell provider extension.
   */
  export interface Type extends InputCell.Dispatch.Provider.Type {}
}

export namespace Model {
  /**
   * Model for dispatch store-based view model.
   * @extends {Base.Model.Type} Base model extension.
   */
  export interface Type extends Base.Model.Type {}

  /**
   * Model for dispatch store-based view model.
   * @implements {Type} Type implementation.
   */
  export class Self implements Type {
    private readonly provider: Provider.Type;
    private readonly baseModel: Base.Model.Type;

    public get inputItems(): Readonly<Data.Input.Type[]> {
      return this.baseModel.inputItems;
    }

    public constructor(provider: Provider.Type, inputs: Data.Input.Type[]) {
      this.provider = provider;
      this.baseModel = new Base.Model.Self(inputs);
    }

    public inputCell_model(input: Data.Input.Type): InputCell.Base.Model.Type {
      return new InputCell.Dispatch.Model.Self(this.provider, input);
    }
  }
}