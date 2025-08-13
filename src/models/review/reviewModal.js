import reviewSchema from "./reviewSchema.js";

export const createReview = (reviewObj) => {
  return reviewSchema(reviewObj).save();
};

export const getAllReviews = (filter) => {
  return reviewSchema.find(filter);
};
export const updateReview = (filter, update) => {
  return reviewSchema.findOneAndUpdate(filter, update);
};

export const deleteReviewById = (filter) => {
  return reviewSchema.findOneAndDelete(filter);
};
