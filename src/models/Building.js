import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 50 },
    phone: { type: String, trim: true, maxlength: 20 },
    email: {
      type: String,
      trim: true,
      maxlength: 100,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    role: { type: String, trim: true, maxlength: 30 }, // e.g., super, manager
  },
  { _id: false }
);

const LocationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const BuildingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    address: { type: String, required: true, trim: true, maxlength: 200 },
    location: { type: LocationSchema, required: true },
    accessNotes: { type: String, trim: true, maxlength: 500 },
    keyAccessCodes: { type: String, trim: true, maxlength: 100 },
    contacts: [ContactSchema],
    notes: { type: String, trim: true, maxlength: 1000 },
    assignedInspector: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["unchecked", "checked", "dueSoon"],
      default: "unchecked",
    },
    lastVisitedDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Building", BuildingSchema);
