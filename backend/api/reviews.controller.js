import ReviewsDAO from "../data access object/reviewsDAO.js";

export default class ReviewsController {
  //this method will create a new review
  //it will get information from the req.body
  //call all of that with a new date to the reviewsDAO method, addReview
  //we send back a json success message if it works
  static async apiPostReview(req, res, next) {
    try {
      const restaurantId = req.body.restaurant_id;
      const review = req.body.text;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };
      const date = new Date();

      const ReviewResponse = await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date
      );
      res.json({ status: "creation success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  //this method will update a review
  //we get the info we need from the req.body
  //and call that with the updateReview method
  //sends back a success message when successful
  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const text = req.body.text;
      const date = new Date();

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,
        text,
        date
      );

      var { error } = reviewResponse;
      if (error) {
        res.status(400).json({ error });
      }

      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review - user may not be original poster"
        );
      }

      res.json({ status: "update success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  //this delete method will take a query param instead
  //we normally dont get a req.body in deletes
  //but we will use it this time just to make sure that
  //the person trying to delete matches the person who created
  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.query.id;
      const userId = req.body.user_id;
      console.log(reviewId);
      if (!userId) {
        res.status(401).json({ error: "Missing user ID" });
        return;
      }
      const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);
      if (reviewResponse.deletedCount == 0) {
        res.status(401).json({ error: "User ID probably incorrect" });
        return;
      }
      res.json({ status: "delete success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
