export class LocalStorageModel extends Model {

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
      window.localStorage.removeItem("LocalStorageModel:" + item.key);
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
  static updateOrCreate(properties){
    console.log('LocalStorageModel.updateOrCreate()');

    this.hydrate(properties).save();
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
        if(!item.hasOwnProperty("key") || item.key === ""){
          throw new Error('Cannot hydrate model from an object without a "key" property in class LocalStorageModel');
        }

        if(item instanceof Object){
          result.push(new LocalStorageModel(item));
        }
      }
    }else if(data instanceof Object){
      if(!data.hasOwnProperty("key") || data.key === ""){
        throw new Error('Cannot hydrate model from an object without a "key" property in class LocalStorageModel');
      }

      result = new LocalStorageModel(data);
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
  static __find__(key, isSingle = false, properties = {}) {
    console.log('LocalStorageModel.__find__()');

    let data = window.localStorage.getItem("LocalStorageModel:" + key);

    if(data !== null){
      return this.hydrate(
        JSON.parse(
          window.localStorage.getItem("LocalStorageModel:" + key)
        )
      );
    }else{
      return data;
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

    window.localStorage.setItem("LocalStorageModel:" + this.key, JSON.stringify(this));

    return this;
  }
}
