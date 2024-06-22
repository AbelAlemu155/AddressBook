
const userData= require('../../data-access/user-data');
// in the model the sql tuples must be parsed into a javascript objects
// some validation tasks might be required... 
class User {
constructor(userDefinition) {
    let {id,email, name}= userDefinition;
    this.id=id; 
    this.email = email;
    this.name = name;

  }
  static fromObject(data){
    return new User({
     email: data.email,
     name: data.name,
     id: data.id
  });
  }
  toObject(){
    return {
      email: this.email,
      name: this.name,
      id: this.id
    };
  }
 
}
module.exports=User; 