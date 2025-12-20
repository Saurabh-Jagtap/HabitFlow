export const calculateLongestStreak = (habitLogs = []) => {
    // Longest streak logic

    // Start from the earliest habit log
    // Iterate through logs sorted by date (ascending)
    // Maintain a running count of consecutive completed days
    // Reset the count when a day is missing or completed is false
    // Track the maximum count reached at any point
    // Return the maximum streak

    habitLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

    let streak = 0;
    let maxStreak = 0;
    let previousDate = null;

    for (const log of habitLogs) {

        let currentDate = new Date(log.date);
        currentDate.setHours(0, 0, 0, 0);

        if (log.completed === false) {
            streak = 0;
            previousDate = null;
            continue
        }

        if (previousDate) {
            const dayDifference =
                (currentDate - previousDate) / (1000 * 60 * 60 * 24);

            if (dayDifference === 1) {
                streak++;
            } else {
                streak = 1;
            }
        } else {
            streak = 1;
        }

        previousDate = currentDate;
        maxStreak = Math.max(streak, maxStreak)

    }

    return maxStreak;

}