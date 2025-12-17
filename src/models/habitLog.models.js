import mongoose, { Schema } from "mongoose";

const habitLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    habitId: {
        type: Schema.Types.ObjectId,
        ref: "Habit",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
},{timestamps:true})

habitLogSchema.index({habitId: 1, date: 1},{unique: true})

export const HabitLog = mongoose.model("HabitLog", habitLogSchema)