import { useState, useEffect } from 'react';
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
    question: 'Who invented gravity?',
    options: ['Isaac Newton', 'Benjamin Franklin', 'Axwell Gravity', 'none of the above'],
    correctAnswer: 'none of the above',
    explanation: 'No one discovered gravity as it has always existed',
    imageUrl: '/random/gravity.jpg' // Example image URL for the second question
  },
  {
    id: 3,
    question: 'Who founded apple',
    options: ['Steve Jobs & Wozniak', 'Steve jobs & Tim Cook', 'Bill Gates', 'none of the above'],
    correctAnswer: 'Steve Jobs & Wozniak',
    explanation: 'Apple was founded on April 1, 1976, by Steve Jobs and Steve Wozniak',
    imageUrl: '/random/apple.png' // Example image URL for the second question
  },
  // Add more questions here
];

export default function Home() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // Initial time left for each question
  let timer; // Declare timer variable outside of useEffect

  useEffect(() => {
    // Reset timer and selected option when moving to the next question
    setTimeLeft(15);
    setSelectedOption(null);
    setIsCorrect(null);

    // Start the countdown timer
    timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer); // Clear interval when time reaches 0
          setIsCorrect(false); // Trigger wrong answer behavior
          new Audio('/wrong.mp3').play();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup the interval on component unmount or when moving to the next question
    return () => clearInterval(timer);
  }, [currentQuestionIndex]); // Re-run effect when moving to the next question

  const handleAnswer = (correctAnswer, explanation) => (selectedOption) => {
    setSelectedOption(selectedOption);
    clearInterval(timer); // Clear the interval when an answer is selected

    if (correctAnswer === selectedOption) {
      setIsCorrect(true);
      new Audio('/correct.mp3').play();
    } else {
      setIsCorrect(false);
      new Audio('/wrong.mp3').play();
    }
  };

  const handleNext = () => {
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
            {questions[currentQuestionIndex].imageUrl && (
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
          <div className=" inset-0 flex flex-col items-center justify-center ">
            <p className="text-3xl font-bold animate-bounce">
              {isCorrect ? 'Correct' : 'Wrong'}
            </p>
            <div className=" ">
              {!isCorrect && (
                <p className="flex text-lg mt-4 text-center text-pretty break-normal ">
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

        {/* Countdown Timer */}
        {selectedOption === null && (
          <div className="absolute top-4 right-4 text-2xl font-bold">
            <span className={timeLeft <= 10 ? (timeLeft <= 5 ? 'text-red-500' : 'text-orange-500') : 'text-green-500'}>
              {timeLeft}
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
