'use client';

import React, { useState } from 'react';
import { StepRendererProps, FlashcardStep, MCQStep, InputStep } from '@/types';
import { Volume2, RotateCcw, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { clsx } from 'clsx';

export function StepRenderer({ step, onAnswer, onNext }: StepRendererProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleFlashcardFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleMCQSelect = (optionIndex: number) => {
    if (showFeedback) return;

    setSelectedOption(optionIndex);
    const correct = optionIndex === (step as MCQStep).correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct);
  };

  const handleInputSubmit = () => {
    if (showFeedback) return;

    const inputStep = step as InputStep;
    const userAnswer = inputStep.caseSensitive === false
      ? inputValue.toLowerCase().trim()
      : inputValue.trim();
    const correctAnswer = inputStep.caseSensitive === false
      ? inputStep.correctAnswer.toLowerCase().trim()
      : inputStep.correctAnswer.trim();

    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct);
  };

  const handleNext = () => {
    console.log('StepRenderer: Moving to next step');
    // Reset state for next step
    setShowAnswer(false);
    setSelectedOption(null);
    setInputValue('');
    setShowFeedback(false);
    setIsCorrect(false);
    setShowHint(false);

    // Call the parent's onNext function
    try {
      onNext();
    } catch (error) {
      console.error('Error in onNext callback:', error);
    }
  };

  const renderFlashcard = (flashcardStep: FlashcardStep) => (
    <div className="text-center space-y-6">
      <div
        className={clsx(
          'card-medieval p-8 cursor-pointer transition-all duration-500 min-h-[200px] flex items-center justify-center',
          showAnswer && 'bg-[var(--surface-light)]'
        )}
        onClick={handleFlashcardFlip}
      >
        <div className="space-y-4">
          {!showAnswer ? (
            <>
              <h3 className="text-3xl font-bold text-[var(--text-primary)]">
                {flashcardStep.word}
              </h3>
              {flashcardStep.pronunciation && (
                <div className="flex items-center justify-center space-x-2">
                  <Volume2 className="text-[var(--secondary)]" size={20} />
                  <span className="text-[var(--text-secondary)]">
                    /{flashcardStep.pronunciation}/
                  </span>
                </div>
              )}
              <p className="text-[var(--text-muted)]">
                Click to reveal translation
              </p>
            </>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-[var(--secondary)]">
                {flashcardStep.translation}
              </h3>
              {flashcardStep.example && (
                <div className="text-sm text-[var(--text-secondary)] italic">
                  <p>&quot;{flashcardStep.example}&quot;</p>
                </div>
              )}
              <div className="flex items-center justify-center space-x-2 text-[var(--text-muted)]">
                <RotateCcw size={16} />
                <span>Click to flip back</span>
              </div>
            </>
          )}
        </div>
      </div>

      {showAnswer && (
        <button
          onClick={handleNext}
          className="btn-medieval"
        >
          Continue Quest
        </button>
      )}
    </div>
  );

  const renderMCQ = (mcqStep: MCQStep) => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          {mcqStep.question}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mcqStep.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleMCQSelect(index)}
            disabled={showFeedback}
            className={clsx(
              'p-4 rounded-lg border-2 text-left transition-all',
              showFeedback
                ? index === mcqStep.correctAnswer
                  ? 'border-[var(--success)] bg-[var(--success)]/20 text-[var(--success)]'
                  : selectedOption === index
                  ? 'border-[var(--error)] bg-[var(--error)]/20 text-[var(--error)]'
                  : 'border-[var(--border)] text-[var(--text-muted)]'
                : 'border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--secondary)] hover:bg-[var(--secondary)]/10 cursor-pointer'
            )}
          >
            <div className="flex items-center space-x-3">
              <div className={clsx(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold',
                showFeedback && index === mcqStep.correctAnswer && 'border-[var(--success)] text-[var(--success)]',
                showFeedback && selectedOption === index && index !== mcqStep.correctAnswer && 'border-[var(--error)] text-[var(--error)]'
              )}>
                {String.fromCharCode(65 + index)}
              </div>
              <span>{option}</span>
              {showFeedback && index === mcqStep.correctAnswer && (
                <CheckCircle className="text-[var(--success)] ml-auto" size={20} />
              )}
              {showFeedback && selectedOption === index && index !== mcqStep.correctAnswer && (
                <XCircle className="text-[var(--error)] ml-auto" size={20} />
              )}
            </div>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className="space-y-4">
          <div className={clsx(
            'p-4 rounded-lg border',
            isCorrect
              ? 'border-[var(--success)] bg-[var(--success)]/20 text-[var(--success)]'
              : 'border-[var(--error)] bg-[var(--error)]/20 text-[var(--error)]'
          )}>
            <div className="flex items-center space-x-2 mb-2">
              {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span className="font-bold">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {mcqStep.explanation && (
              <p className="text-sm">{mcqStep.explanation}</p>
            )}
          </div>

          <button
            onClick={handleNext}
            className="btn-medieval w-full"
          >
            Continue Quest
          </button>
        </div>
      )}
    </div>
  );

  const renderInput = (inputStep: InputStep) => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          {inputStep.question}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !showFeedback && handleInputSubmit()}
            disabled={showFeedback}
            className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors text-center text-xl"
            placeholder="Type your answer..."
          />
        </div>

        {inputStep.hint && (
          <div className="text-center">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-2 text-[var(--secondary)] hover:text-[var(--secondary-dark)] transition-colors mx-auto"
            >
              <Lightbulb size={16} />
              <span className="text-sm">{showHint ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
            {showHint && (
              <p className="text-sm text-[var(--text-muted)] mt-2 italic">
                {inputStep.hint}
              </p>
            )}
          </div>
        )}

        {!showFeedback && (
          <button
            onClick={handleInputSubmit}
            disabled={!inputValue.trim()}
            className="btn-medieval w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        )}
      </div>

      {showFeedback && (
        <div className="space-y-4">
          <div className={clsx(
            'p-4 rounded-lg border',
            isCorrect
              ? 'border-[var(--success)] bg-[var(--success)]/20 text-[var(--success)]'
              : 'border-[var(--error)] bg-[var(--error)]/20 text-[var(--error)]'
          )}>
            <div className="flex items-center space-x-2 mb-2">
              {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span className="font-bold">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {!isCorrect && (
              <p className="text-sm">
                The correct answer is: <strong>{inputStep.correctAnswer}</strong>
              </p>
            )}
          </div>

          <button
            onClick={handleNext}
            className="btn-medieval w-full"
          >
            Continue Quest
          </button>
        </div>
      )}
    </div>
  );

  switch (step.type) {
    case 'flashcard':
      return renderFlashcard(step as FlashcardStep);
    case 'mcq':
      return renderMCQ(step as MCQStep);
    case 'input':
      return renderInput(step as InputStep);
    default:
      return <div>Unknown step type</div>;
  }
}

export default StepRenderer;
