require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let personSchema = new mongoose.Schema({
  name : String,
  age : Number,
  favoriteFoods : [String]
});

let Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  let person = new Person({
    name:"Ionica Badea",
    age:22,
    favoriteFoods: ["Parmigiano", "Kinder"]
  });

  person.save((err, data) => {
    if (err) return done(err);
    done(null, data);  
  })
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if(err) return done(err);
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({name:personName}, (err, data) =>{
     if(err) return done(err);
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, data) => {
    if(err) return done(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({_id:personId}, (err, data) => {
    if(err) return done(err);
    done(null, data);
  });
};
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById({_id:personId}, (err, person) => {
    if(err) return done(err);
    if(!person) return done(new Error("Person not found"));

    person.favoriteFoods.push(foodToAdd);
    
    person.save((err, data) => {
      if(err) return done(err);
      done(null, person);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name:personName},
    { age:ageToSet },
    { new:true }, 
    (err, person) => {
     if(err) return done(err);
     done(null, person);
    });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove({_id:personId}, (err, data) =>{
    if(err) return done(err);
     done(null, data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name:nameToRemove}, (err, data) => {
    if(err) return done(err);
     done(null, data);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods:foodToSearch})
    .sort({name: 1})
    .limit(2)
    .select('-age')
    .exec((err, data) => {
     if(err) return done(err);
     console.log(data);
     done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
