

//Creation of Collection with Strict schema
db.createCollection("car", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "car",
            required: ["_id", "year", "make", "model", "miles"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    
                },
                year: {
                    bsonType: "string",
                },
                make: {
                    bsonType: "string",
                },
                model: {
                    bsonType: "string",
                },
                miles: {
                    bsonType: "number",
                }
            }
        }
    }
});

//Insert for newly defined schema
db.car.insertMany([
    {
        _id: ObjectId("60d5ec49f8e4a6b5f8c0e6c5"),
        year: "2020",
        make: "Toyota",
        model: "Camry",
        miles: 15000
    },
    {
        _id: ObjectId("60d5ec49f8e4a6b5f8c0e6c6"),
        year: "2018",
        make: "Honda",
        model: "Civic",
        miles: 30000
    },
    {
        _id: ObjectId("60d5ec49f8e4a6b5f8c0e6c7"),
        year: "2019",
        make: "Ford",
        model: "Focus",
        miles: 25000
    }
]);

//Validates Schema wont work
db.car.insertMany([
    {
        _id: ObjectId("60d5ec49f8e4a6b5f8c0e6c5"),
        factory: "Toyota",
        model: "Camry",
        miles: 15000
    }
]);

//Creation of Collection without schema
db.createCollection("car2");

//Insert Toy Car, Real Car, Car instance in a video Game
db.car2.insertMany([
    {
        _id: ObjectId("60d5ec49f8e4a6b5f8c0e6c5"),
        year: "2020",
        make: "Hotwheels",
        sizeInCm: 6,
        price: 5,
        shop: ""
    },
    {
        _id: ObjectId("60d5ec49f8e4a6b5f8c0e6c6"),
        year: "2018",
        make: "Honda",
        model: "Civic",
        miles: 30000
    },
    {
        _id: ObjectId("60d5ec49f8e4a6b5f8c0e6c7"),
        speedInKmh: "100",
        tuning: "lowered",
        player: "ILoveRacingGames"
    }
]);

//Wont execute just to show what it looks like:
//Update first where id is 60d5ec49f8e4a6b5f8c0e6c5
db.car2.updateOne(
    { id: "60d5ec49f8e4a6b5f8c0e6c5" },
    {
        $set: { price: 8, shop: "Superstore" }
    }
)
//Deletes first where price is 8 
db.car2.deleteOne({ price: 8 })

//Get the amount of Comedy movies rated higher than 2.0 on tomatoes released before 1990
db.movies.aggregate([
    {
      $match: {
        "tomatoes.viewer.rating": { $gt: 2.0 },
        genres: "Comedy",
        released: { $lt: new ISODate("1990-01-01T00:00:00Z") },
      }
    },
    {
      $count: "highlyRatedMovies"
    }
  ])


  //Gets the amount of movies of the Top 3 countries that were released before 1990 with the genre "Comedy" and a tomatoe rating greater than 2.0
  //Basically answering the question: Which country had the most amount of good Comedy movies released before 1990? Only shows top3
  db.movies.aggregate([
    {
      $match: { //Filter 
        genres: "Comedy",
        released: { $lt: new ISODate("1990-01-01T00:00:00Z") }, //lt = lass then
        "tomatoes.viewer.rating": { $gt: 2.0 }
      }
    },
    {
      $group: { 
        _id: "$countries",
        count: { $sum: 1 } //sum all countries that matched filter
      }
    },
    {
      $sort: { count: -1 } //sort in descending order
    },
    {
      $limit: 3 // Limit to 3 countries
    },
    {
        $project: { //change how the result is displayed
        _id: 0,
        country: "$_id",
        movieCount: "$count"
      } 
    }
  ])

  //Theaters closest to the fontys
  db.theaters.aggregate( [
    {
       $geoNear: {
          near: { type: "Point", coordinates: [ 51.35, 6.15 ] },
          spherical: true,
          distanceField: "calcDistance"
       }  
    },
    {
        $limit: 5
    },
 ] )


//Join (Lookup) Takes forever For each movie joins comments and displays them in
 db.movies.aggregate([
    {
      $lookup: {
        from: "comments",        
        localField: "_id",       
        foreignField: "movie_id",
        as: "movie_comments"     
      }
    },
    {
      $project: {
        title: 1,                
        year: 1,                 
        plot: 1,                 
        movie_comments: 1        
      }
    }
  ])
  


