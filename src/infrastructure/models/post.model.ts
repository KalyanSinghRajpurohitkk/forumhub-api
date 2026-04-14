import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  user: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: {
    _id?: string;
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt?: Date;
  }[];
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    
  },
  { timestamps: true } //I used Timestamps everywhere to track when data is created or updated
);



export const Post = mongoose.model<IPost>("Post", postSchema);