const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const questions = ref([]);
        const currentQuestion = ref(null);
        const answerSelected = ref(null);
        const isCorrect = ref(false);

        const loadQuestions = async () => {
            const response = await fetch("questions.json");
            questions.value = await response.json();
            loadNewQuestion();
        };

        const loadNewQuestion = () => {
            if (questions.value.length === 0) return;

            const randomIndex = Math.floor(Math.random() * questions.value.length);
            currentQuestion.value = questions.value[randomIndex];
            answerSelected.value = null;
            isCorrect.value = false;
        };

        const selectAnswer = (index) => {
            answerSelected.value = index;
            isCorrect.value = index === currentQuestion.value.correctAnswer;
        };

        const getOptionClass = (index) => {
            if (answerSelected.value === null) {
                return "default-answer";
            }

            if (answerSelected.value === index && isCorrect.value) {
                return "correct-answer";
            }

            if (answerSelected.value === index && !isCorrect.value) {
                return "wrong-answer";
            }

            if (
                currentQuestion.value.correctAnswer === index &&
                answerSelected.value !== index
            ) {
                return "correct-answer";
            }

            return "default-answer";
        };

        onMounted(() => {
            loadQuestions();
        });

        return {
            currentQuestion,
            answerSelected,
            isCorrect,
            loadNewQuestion,
            selectAnswer,
            getOptionClass
        };
    }
}).mount("#app");