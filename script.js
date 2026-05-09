// ===== QUIZ DATA =====
const quizQuestions = [
    {
        question: "What is the main function of photosynthesis?",
        options: [
            "To break down glucose for energy",
            "To convert light energy into chemical energy stored in glucose",
            "To produce water for plants",
            "To absorb carbon dioxide from the atmosphere"
        ],
        correct: 1
    },
    {
        question: "Which pigment is primarily responsible for absorbing light in photosynthesis?",
        options: [
            "Carotenoid",
            "Xanthophyll",
            "Chlorophyll",
            "Hemoglobin"
        ],
        correct: 2
    },
    {
        question: "Where in the plant cell does photosynthesis occur?",
        options: [
            "In the mitochondria",
            "In the nucleus",
            "In the chloroplasts",
            "In the cell membrane"
        ],
        correct: 2
    },
    {
        question: "What are the two main stages of photosynthesis?",
        options: [
            "Glycolysis and Krebs cycle",
            "Light reactions and Calvin cycle",
            "Oxidation and reduction",
            "Absorption and reflection"
        ],
        correct: 1
    },
    {
        question: "Which gas is released as a byproduct during photosynthesis?",
        options: [
            "Nitrogen",
            "Oxygen",
            "Helium",
            "Hydrogen"
        ],
        correct: 1
    },
    {
        question: "What does the Calvin cycle produce?",
        options: [
            "Oxygen and water",
            "Glucose and ATP",
            "Chlorophyll and carotenoids",
            "Carbon dioxide and light"
        ],
        correct: 1
    }
];

// ===== LOAD QUIZ =====
document.addEventListener('DOMContentLoaded', function() {
    loadQuiz();
    setupSimulator();
});

function loadQuiz() {
    const quizContent = document.getElementById('quizContent');
    quizContent.innerHTML = '';

    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.innerHTML = `
            <h4>Question ${index + 1}: ${q.question}</h4>
            <div class="quiz-options">
                ${q.options.map((option, optIndex) => `
                    <label class="quiz-option">
                        <input type="radio" name="question-${index}" value="${optIndex}">
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
        quizContent.appendChild(questionDiv);
    });

    document.getElementById('submitQuiz').addEventListener('click', submitQuiz);
}

function submitQuiz() {
    let score = 0;
    let results = [];

    quizQuestions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question-${index}"]:checked`);
        const isCorrect = selected && parseInt(selected.value) === q.correct;
        
        if (isCorrect) {
            score++;
            results.push({
                index: index,
                question: q.question,
                correct: true,
                userAnswer: q.options[parseInt(selected.value)]
            });
        } else {
            results.push({
                index: index,
                question: q.question,
                correct: false,
                userAnswer: selected ? q.options[parseInt(selected.value)] : 'Not answered',
                correctAnswer: q.options[q.correct]
            });
        }
    });

    displayResults(score, results);
}

function displayResults(score, results) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const resultsDiv = document.getElementById('quizResults');
    
    let scoreClass = 'excellent';
    let message = '🌟 Excellent work!';
    if (percentage < 70) scoreClass = 'needs-improvement';
    if (percentage >= 70 && percentage < 90) scoreClass = 'good';

    let resultsHTML = `
        <h3>Quiz Results</h3>
        <div class="score-display ${scoreClass}">
            Score: ${score}/${quizQuestions.length} (${percentage}%) ${message}
        </div>
        <h4>Detailed Results:</h4>
    `;

    results.forEach(r => {
        if (r.correct) {
            resultsHTML += `
                <div class="result-detail correct">
                    <strong>✓ Question ${r.index + 1}:</strong> ${r.question}
                    <br>Your answer: ${r.userAnswer}
                </div>
            `;
        } else {
            resultsHTML += `
                <div class="result-detail incorrect">
                    <strong>✗ Question ${r.index + 1}:</strong> ${r.question}
                    <br>Your answer: ${r.userAnswer}
                    <br>Correct answer: ${r.correctAnswer}
                </div>
            `;
        }
    });

    resultsDiv.innerHTML = resultsHTML;
    resultsDiv.classList.remove('hidden');
    document.getElementById('submitQuiz').classList.add('hidden');
    document.getElementById('retakeQuiz').classList.remove('hidden');

    document.getElementById('retakeQuiz').addEventListener('click', retakeQuiz);
}

function retakeQuiz() {
    document.getElementById('quizContent').innerHTML = '';
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('submitQuiz').classList.remove('hidden');
    document.getElementById('retakeQuiz').classList.add('hidden');
    loadQuiz();
    window.scrollTo(0, document.getElementById('quiz').offsetTop - 100);
}

// ===== SIMULATOR SETUP =====
function setupSimulator() {
    const lightSlider = document.getElementById('light');
    const waterSlider = document.getElementById('water');
    const co2Slider = document.getElementById('co2');

    lightSlider.addEventListener('input', updateSimulator);
    waterSlider.addEventListener('input', updateSimulator);
    co2Slider.addEventListener('input', updateSimulator);
}

function updateSimulator() {
    const light = parseInt(document.getElementById('light').value);
    const water = parseInt(document.getElementById('water').value);
    const co2 = parseInt(document.getElementById('co2').value);

    // Update display values
    document.getElementById('lightValue').textContent = light;
    document.getElementById('waterValue').textContent = water;
    document.getElementById('co2Value').textContent = co2;

    // Calculate photosynthesis rate (simplified model)
    const efficiency = (light * water * co2) / 1000000;
    const glucose = (efficiency * 0.6).toFixed(2);
    const oxygen = (efficiency * 0.4).toFixed(2);

    // Update results
    document.getElementById('glucoseOutput').textContent = glucose;
    document.getElementById('oxygenOutput').textContent = oxygen;

    // Update plant animation and message
    updatePlantStatus(light, water, co2, efficiency);
}

function updatePlantStatus(light, water, co2, efficiency) {
    const plant = document.getElementById('plant');
    const message = document.getElementById('simulatorMessage');
    
    plant.classList.remove('thriving', 'struggling');

    if (light < 20 || water < 20 || co2 < 20) {
        plant.classList.add('struggling');
        message.textContent = '😟 Plant is struggling! At least one resource is too low.';
    } else if (light > 70 && water > 70 && co2 > 70) {
        plant.classList.add('thriving');
        message.textContent = '🌻 Excellent conditions! Plant is thriving with high photosynthesis rate!';
    } else if (efficiency > 0.3) {
        plant.classList.add('thriving');
        message.textContent = '😊 Good conditions! Photosynthesis is happening at a healthy rate.';
    } else {
        message.textContent = '⚠️ Adjust the sliders to improve photosynthesis conditions.';
    }
}

// Initialize simulator on page load
updateSimulator();