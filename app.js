const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const questions = ref([]);
        const currentQuestion = ref(null);
        const answerSelected = ref(null);
        const isCorrect = ref(false);

        // Baraja un arreglo sin modificar el original (Fisher-Yates).
        const shuffle = (array) => {
            const copy = array.slice();
            for (let i = copy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy;
        };

        // Cola de preguntas ya barajada; así no se repite ninguna
        // hasta haber recorrido todo el banco.
        let questionQueue = [];

        const refillQueue = () => {
            questionQueue = shuffle(questions.value.map((_, i) => i));
        };

        const loadQuestions = async () => {
            const response = await fetch("questions.json");
            questions.value = await response.json();
            refillQueue();
            loadNewQuestion();
        };

        const loadNewQuestion = () => {
            if (questions.value.length === 0) return;
            if (questionQueue.length === 0) refillQueue();

            const source = questions.value[questionQueue.shift()];

            // Barajamos las opciones y recordamos cuál es la correcta
            // por su CONTENIDO, no por su posición original.
            const correctText = source.options[source.correctAnswer];
            const shuffledOptions = shuffle(source.options);

            currentQuestion.value = {
                text: source.text,
                options: shuffledOptions,
                correctAnswer: shuffledOptions.indexOf(correctText)
            };

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