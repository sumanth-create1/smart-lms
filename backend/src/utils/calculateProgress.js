const calculateProgress = (progress, totalLectures) => {

    if (totalLectures === 0) {
        return 0;
    }

    const completedLectures = progress.lectures.filter(
        lecture => lecture.completed
    ).length;

    return Math.round(
        (completedLectures / totalLectures) * 100
    );
};

export default calculateProgress;