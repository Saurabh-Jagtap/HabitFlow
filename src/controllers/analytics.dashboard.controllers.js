import { Habit } from "../models/habit.models.js"
import { HabitLog } from "../models/habitLog.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { calculateLongestStreak } from "../utils/longestStreak.utils.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const getDashboardAnalytics = asyncHandler(async (req, res) => {
    // Dashboard analytics expects:
        // totalHabits
        // completedToday Habits
        // avgCompletion Rate
        // Best Streak Across Habits

    // Total Habits of user logic
    const habits = await Habit.find({ userId: req.user._id, isArchived: false })

    const totalHabits = habits.length;

    // CompletedToday logic
    const startofDay = new Date()
    startofDay.setHours(0, 0, 0, 0)

    const endofDay = new Date()
    endofDay.setHours(23, 59, 59, 999)

    const habitlog = await HabitLog.find({ userId: req.user._id, completed: true, date: {$gte: startofDay, $lte: endofDay} })
    const completedTodayHabits = habitlog.length;

    // Avg CompletionRate logic
    let sumCompletionRate = 0;

    // Fetch all habitlogs for the user
    const allhabitlogs = await HabitLog.find({ userId: req.user._id})
    const logMap = new Map()

    // Group logs by habitId using Map
    for (const log of allhabitlogs) {
        const habitId = log.habitId.toString()

        if (!logMap.has(habitId)) {
            logMap.set(habitId, [])
        }

        logMap.get(habitId).push(log)
    }

    // Calculate per-habit completion rate.
    for(const habit of habits){
        const habitId = habit._id.toString()

        const logs = logMap.get(habitId) || []
        const totalhabitLogs = logs.length

        if(totalhabitLogs === 0 ){
            sumCompletionRate += 0
            continue
        }

        const totalCompletions = logs.filter((log) => log.completed === true).length

        const completionRate = totalCompletions / totalhabitLogs

        sumCompletionRate += completionRate
    }

    let avgCompletionRate = 0;
    // Now avg of per habit completion rates
    if(totalHabits === 0){
        avgCompletionRate = 0;
    }else{
        avgCompletionRate = Math.round((sumCompletionRate / totalHabits) * 100);
    }

    // Best Streak across habits logic
        // Initialize bestStreak = 0
        // For each habit:
        // get logs via logMap.get(habitId) || []
        // compute longestStreak using helper
        // update bestStreak = Math.max(bestStreak, longestStreak)
        // Return bestStreak

        let bestStreak = 0;

        for(const habit of habits){
            const habitId = habit._id.toString()

            const logs = logMap.get(habitId) || []

            const longestStreak = calculateLongestStreak(logs)
            bestStreak = Math.max(bestStreak, longestStreak)
        }

    return res.status(200)
    .json(new ApiResponse(200, {TotalHabits: totalHabits, CompletedTodayHabits: completedTodayHabits, AvgCompletionRate: avgCompletionRate, BestStreak: bestStreak}))
})

export { getDashboardAnalytics }