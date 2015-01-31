import {Utility} from '../../../tungstenjs/src/utility';
import {Model} from '../../../tungstenjs/src/model';

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
  * @todo Implement this function
  * @static
  * @param {Object} attributes Attributes that will be used to hydrate a new model instance. See `hydrate` for more information
  * @returns {Model} Deferred instance of the newly created model
  *
  * Creates a new instance of the model, and performs a save operation.
  */
  static create(attributes){
    console.log('LocalStorageModel.create()');

    // Inspiration from Backbone.js; not sure if I like it, but lets see how it goes...
    //let four = () => {return (((1+Math.random())*0x10000)|0).toString(16).substring(1);}
    //attributes.guid = (four()+four()+"-"+four()+"-"+four()+"-"+four()+"-"+four()+four()+four());

    //$(this).trigger('create');

    return this.hydrate(attributes).save();
  }

  /**
  * @todo Implement this function
  * @static
  * @param {Array} items Model instances to be deleted
  * @returns {Boolean} Boolean expressing whether the operation was successful
  *
  * Destroys the model instances provided, and performs a delete operation.
  */
  static destroy(items){
    console.log('LocalStorageModel.destroy()');

    for(let item in items){
      if(item instanceof LocalStorageModel){
        // Remove item from array based on guid; throw error if no guid
      }
    }

    return true;
  }

  /**
  * @todo Implement this function
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

    /*
    // This is a bit of an anti-pattern right now, but will be cleaned up soon...
    let filtered = this.memoryRegistry.filter((item) => {
      if(Object.keys(attributes).length === 0){return true;}

      for(let key in attributes){
        let isMatch = (item[key] === attributes[key]);

        if(isMatch){
          Object.assign(item, properties);
          return true;
        }
      }
    });
    */
    this.memoryRegistry;

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
  * @todo Implement this function
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
}
