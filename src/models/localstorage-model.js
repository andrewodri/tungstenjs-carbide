import {Utility} from '../../../tungstenjs/src/utility';
import {Model} from '../../../tungstenjs/src/model';

/**
 * @class LocalStorageModel
 * @author Andrew Odri andrew@affirmix.com
 *
 * This class is extends the base model class with functionality for interacting with browser storage.
 *
 * In order to track model instances before and after serialization, as well as before and after changea are committed, two registries have been added to the instance: The memory registry for uncomitted changes, and the stroage registry that reads and writes to and from browser storage.
 *
 * All the standard functions of a typical model have been implemented, such as `updateOrCreate`, `findOrFail`, `hydrate`, etc., to make dealing with local storage as simple as possible, and to easily migrate from other model implementations if needed.
 */
export class LocalStorageModel extends Model {

  static get memoryRegistry(){
    if(!this.hasOwnProperty("__memoryRegistry__")){
      this.__memoryRegistry__ = this.storageRegistry;
    }

    return this.__memoryRegistry__;
  }

  static set memoryRegistry(data){
    if(data instanceof Array){
      this.__memoryRegistry__ = data;
    }else{
      throw new Error('Cannot write to memoryRegistry because it is not an Array in class LocalStorageModel');
    }
  }

  static get storageRegistry(){
    let storageJson = window.localStorage.getItem("LocalStorageModel");

    if(storageJson !== null){
      let storageData = JSON.parse(storageJson);

      if(storageData instanceof Array){
        this.__storageRegistry__ = storageData;
      }else{
        throw new Error('Cannot read from storageRegistry because it is not an Array in class LocalStorageModel');
      }
    }else{
      this.__storageRegistry__ = [];
    }

    return this.__storageRegistry__;
  }

  static set storageRegistry(data){
    if(data instanceof Array){
      window.localStorage.setItem("LocalStorageModel", JSON.stringify(data));

      this.__storageRegistry__ = data;
    }else{
      throw new Error('Cannot write to storageRegistry because it is not an Array in class LocalStorageModel');
    }
  }

  /**
   * @static
   * @param {Object} attributes Attributes that will be used to hydrate a new model instance. See `hydrate` for more information
   * @returns {Model} Deferred instance of the newly created model
   *
   * Creates a new instance of the model, and performs a save operation.
   */
  static create(attributes){
    console.log('LocalStorageModel.create()');

    return this.hydrate(attributes).save();
  }

  /**
   * @static
   * @param {Array} items Model instances to be deleted
   * @returns {Boolean} Boolean expressing whether the operation was successful
   *
   * Destroys the model instances provided, and performs a delete operation.
   */
  static destroy(items){
    console.log('LocalStorageModel.destroy()');

    for(let item in items){
      if(item instanceof this.classReference){
        item.delete();
      }
    }

    return true;
  }

  /**
   * @static
   * @param {Object} attributes Attributes used to return the models that need to be updated
   * @param {Object} properties Properties that model instances will be updated with
   * @returns {Array} Deferred instance of the updated or created model(s)
   *
   * Create or update a model matching the attributes, and fill it with values.
   */
  static updateOrCreate(attributes, properties){
    console.log('LocalStorageModel.updateOrCreate()');

    let result = this.__find__(attributes, false, properties);

    if(result instanceof Array && result.length == 1){
      return result[0];
    }else if (result instanceof Array && result.length > 1){
      return result;
    }else{
      return this.create(
        Object.assign({}, attributes, properties)
      );
    }
  }

  /**
   * @static
   * @param {Array|Object} data Data needed to instantiate new model instances
   * @returns {Array|Model} Newly instantiated model/models
   *
   * Instantiates a model/models based on the data provided. This is called immediately after `filter`.
   */
  static hydrate(data) {
    console.log('LocalStorageModel.hydrate()');

    let result = false;

    if(data instanceof Array){
      result = [];

      for(let item of data){
        if(item instanceof Object){
          result.push(new this.classReference(item));
        }
      }
    }else if(data instanceof Object){
      result = new this.classReference(data);
    }else{
      throw new Error('Cannot hydrate model from a non-object in class LocalStorageModel');
    }

    return result;
  }

  /**
   * @static
   * @param {Object} attributes An object containing properties that correspond to the attributes in the templated RESTful URL, if not overriden by custom functionality
   * @param {Boolean} isSingle An optional boolean that defines whether one or many models are returned. Defaults to false.
   * @param {Object} properties An optional object containing properties that need to be be updated in the model(s) returned. Defaults to {}.
   * @returns {Array|Model} Deferred instance of the Models that are found
   *
   * Internal function that finds and returns any available instances of the model.
   */
  static __find__(attributes, isSingle = false, properties = {}) {
    console.log('LocalStorageModel.__find__()');

    this.memoryRegistry;

    // This seems like the perfect task for Array.fliter(), however there is bigger fish to fry at this point...
    let filtered = []
    if(Object.keys(attributes).length > 0){
      this.__memoryRegistry__.forEach((currentValue, index, array) => {
        let isMatch = true;

        for(let key in attributes){
          if(currentValue[key] !== attributes[key]){
            isMatch = false;
          }
        }

        if(isMatch){
          array[index] = Object.assign(currentValue, properties);
          filtered.push(currentValue);
        }
      });
    }else{
      filtered = this.__memoryRegistry__;
    }

    if(Object.keys(properties).length > 0){
      this.storageRegistry = this.__memoryRegistry__;
    }

    if(filtered !== null){
      if(isSingle) {
        return this.hydrate(filtered[0]);
      }else{
        return this.hydrate(filtered);
      }
    }else{
      return null;
    }
  }

  /**
   * @constructor
   * @param {Object} attributes This provides properties and objects that are to be merged with the model instance.
   * @returns {Model} Instance of the saved model
   *
   * Constructs the model instance by merging the attributes with the new model instance.
   *
   * It then generates a GUID if one is not already present, as this is essential for identifing local storage model instances before and after serialization.
   *
   * The memoryRegistry is then populated by ensuring that the getter is called, and the newly created instance either overwrites it's match in memoryRegistry, or is pushed onto the memoryRegistry array.
   */
  constructor(attributes) {
    console.log('localStorageModel.constructor()');

    Object.assign(this, attributes);

    if(!this.hasOwnProperty("guid")){
      this.guid = Utility.generateGuid();
    }

    this.classReference.memoryRegistry

    let index = this.classReference.__memoryRegistry__.findIndex((item) => {
      return (item.guid === this.guid);
    });

    this.classReference.memoryRegistry;

    if(index < 0){
      this.classReference.__memoryRegistry__.push(this);
    }else{
      this.classReference.__memoryRegistry__[index] = this;
    }
  }

  /**
   * @returns {Model} Instance of the saved model
   *
   * Performs a save operation.
   */
  save() {
    console.log('localStorageModel.save()');

    let index = this.classReference.memoryRegistry.findIndex((item) => {
      return (item.guid === this.guid);
    });

    this.classReference.storageRegistry = this.classReference.__memoryRegistry__;

    // Overwrite object with matching guid in storage registry; get it first

    return this;
  }

  /**
   * @returns {Model} Instance of the model to be deleted
   *
   * Performs a delete operation.
   */
  delete() {
    console.log('localStorageModel.save()');

    let index = this.classReference.memoryRegistry.findIndex((item) => {
      return (item.guid === this.guid);
    });

    this.classReference.__memoryRegistry__.splice(index, 1);

    this.classReference.storageRegistry = this.classReference.__memoryRegistry__;

    return this;
  }
}
