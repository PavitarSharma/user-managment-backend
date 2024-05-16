import mongoose from "mongoose";

// Define the schema for the Counter model
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Sequence name
  sequence_value: { type: Number, default: 0 }, // Current value of the sequence
});

// Create the Counter model using the schema
const Counter = mongoose.model("Counter", counterSchema);

// Export the Counter model
export default Counter;
