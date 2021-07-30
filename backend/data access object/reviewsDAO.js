import mongodb from "mongodb";
//to get access to an ojbect id from mongodb
const ObjectId = mongodb.ObjectID;

//we will fill this with reviews from a collection from our db
let reviews;

export default class ReviewsDAO {
  //same with the restaurants dao, we initialize our connection
  //if the reviews variable is already filled with reviews, we return it
  //if not we hit the collection in our db and fill it there
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  //to create a review, we take all our params
  //and fill our reviewDoc object with it
  //we insert that into our db
  static async addReview(restaurantId, user, review, date) {
    try {
      const reviewDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        text: review,
        restaurant_id: ObjectId(restaurantId),
      };

      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  //to update our reviews, we take our params
  //we check the user id and review id first
  //if we get a match we set the new text and date
  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: ObjectId(reviewId) },
        { $set: { text: text, date: date } }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  //to delete a review
  //we check the user id and review id to make sure they match
  //only the id of the user who originally created the review can delete it
  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }
}
