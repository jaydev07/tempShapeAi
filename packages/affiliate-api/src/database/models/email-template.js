import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  body: String,
});

const EmailTemplate = mongoose.model('EmailTemplate', schema);
export default EmailTemplate;