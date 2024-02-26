import { useState } from 'react';
import Head from 'next/head';

const questions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['Paris', 'Rome', 'Berlin', 'London'],
    correctAnswer: 'Paris',
    explanation: 'Paris is the capital of France.',
    imageUrl: '/tower.jpg' // Example image URL for the first question
  },
  {
    id: 2,
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    explanation: '2 + 2 equals 4.',
    imageUrl: '/math.jpg' // Example image URL for the second question
  },
  // Add more questions here
];

export default function Home() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswer = (correctAnswer, explanation) => (selectedOption) => {
    setSelectedOption(selectedOption);
    if (correctAnswer === selectedOption) {
      setIsCorrect(true);
      new Audio('/correct.mp3').play();
    } else {
      setIsCorrect(false);
      new Audio('/wrong.mp3').play();
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className={`min-h-screen ${isCorrect !== null ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'polka'} flex items-center justify-center text-white`}>
      <Head>
        <title>Trivia Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4 relative">
        {isCorrect === null && currentQuestionIndex < questions.length && (
          <div className="mb-6">
            {questions[currentQuestionIndex].imageUrl && ( // Conditionally render image if imageUrl is provided
              <img src={questions[currentQuestionIndex].imageUrl} alt="Question" className="mb-2 rounded-lg" />
            )}
            <p className="text-lg font-semibold mb-2">
              {questions[currentQuestionIndex].question}
            </p>
            <div className="flex flex-col ">
              {questions[currentQuestionIndex].options.map((option, i) => (
                <button
                  key={i}
                  className={`py-2 px-4 font-semibold  ${
                    selectedOption === option
                      ? option === questions[currentQuestionIndex].correctAnswer
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'tile hover:bg-yellow'
                  } text-white font-semibold w-full`}
                  onClick={() =>
                    handleAnswer(
                      questions[currentQuestionIndex].correctAnswer,
                      questions[currentQuestionIndex].explanation
                    )(option)
                  }
                  disabled={selectedOption !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {isCorrect !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center ">
            <p className="text-3xl font-bold">
              {isCorrect ? 'Correct' : 'Wrong'}
            </p>
            <div className="mx-14 px-10 whitespace-nowrap">
              {!isCorrect && (
                <p className="text-lg mt-4 text-center ">
                  {questions[currentQuestionIndex].explanation}
                </p>
              )}
            </div>
            <button
              onClick={handleNext}
              className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
