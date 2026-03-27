const LUXURY_STYLE_OPTION = {
  value: 'luxury',
  label: '✨ Luxury',
  desc: 'Premium high-end finishes and textures',
};

const FOLLOW_UP_QUESTIONS = {
  moisture_salt_priority: {
    id: 'moisture_salt_priority',
    question: 'For coastal/humid conditions, what is your top priority?',
    subtext: 'This helps us focus on durability in moisture and salt exposure.',
    options: [
      { value: 'moisture_resistance', label: '💧 Moisture Resistance', desc: 'Protect against humidity and water damage' },
      { value: 'salt_resistance', label: '🧂 Salt Resistance', desc: 'Handle salt-air corrosion better' },
      { value: 'both', label: '🛡️ Both Equally', desc: 'Balance moisture and salt protection' },
    ],
    required: true,
  },
  finish_texture_preference: {
    id: 'finish_texture_preference',
    question: 'What finish or texture do you prefer for a luxury look?',
    subtext: 'Your choice helps narrow premium recommendations.',
    options: [
      { value: 'matte', label: '⬜ Matte', desc: 'Soft, understated look' },
      { value: 'glossy', label: '✨ Glossy', desc: 'Polished and reflective finish' },
      { value: 'textured', label: '🧱 Textured', desc: 'Rich tactile surface' },
      { value: 'natural', label: '🌿 Natural', desc: 'Organic material-forward finish' },
    ],
    required: false,
  },
};

const equals = (value, expected) => String(value || '').toLowerCase() === String(expected || '').toLowerCase();

const cloneQuestion = (question) => ({
  ...question,
  options: Array.isArray(question.options) ? [...question.options] : [],
  required: question.required !== false,
});

const withStyleEnhancement = (question) => {
  if (question.id !== 'style') return question;

  const exists = question.options.some((option) => option.value === LUXURY_STYLE_OPTION.value);
  if (exists) return question;

  return {
    ...question,
    options: [...question.options, LUXURY_STYLE_OPTION],
  };
};

const shouldSkipQuestion = (category, questionId, answers) => {
  if (category === 'Roofing Solution' && questionId === 'style') {
    return equals(answers.concern, 'keep cost low');
  }

  if (category === 'Flooring Solution' && questionId === 'style') {
    return equals(answers.priority, 'affordable');
  }

  if (category === 'Wall Solution' && questionId === 'style') {
    return equals(answers.priority, 'budget');
  }

  if (category === 'Ceiling Solution' && questionId === 'style') {
    return equals(answers.goal, 'hide wiring');
  }

  return false;
};

const getFollowUps = (category, questionId, answers) => {
  const followUps = [];

  if (questionId === 'location' && equals(answers.location, 'coastal')) {
    followUps.push({
      ...FOLLOW_UP_QUESTIONS.moisture_salt_priority,
      reason: 'Shown because you selected a coastal location.',
    });
  }

  if (questionId === 'environment' && equals(answers.environment, 'humid')) {
    followUps.push({
      ...FOLLOW_UP_QUESTIONS.moisture_salt_priority,
      id: 'humidity_protection_priority',
      reason: 'Shown because you selected a humid environment.',
    });
  }

  if (questionId === 'style' && equals(answers.style, 'luxury')) {
    followUps.push({
      ...FOLLOW_UP_QUESTIONS.finish_texture_preference,
      reason: 'Shown because you selected a luxury style preference.',
    });
  }

  if (
    category === 'Roofing Solution' &&
    questionId === 'concern' &&
    equals(answers.concern, 'long-lasting')
  ) {
    followUps.push({
      id: 'durability_vs_cost',
      question: 'For long-lasting roofing, what trade-off do you prefer?',
      subtext: 'This clarifies durability priorities for scoring.',
      options: [
        { value: 'max_durability', label: '🛡️ Max Durability', desc: 'Prefer lifespan over upfront cost' },
        { value: 'balanced', label: '⚖️ Balanced', desc: 'Balance durability with cost' },
      ],
      required: false,
      reason: 'Shown because you selected long-lasting as your main concern.',
    });
  }

  return followUps;
};

export const buildQuestionFlow = (category, baseQuestions, answers) => {
  if (!category || !Array.isArray(baseQuestions)) return [];

  const flow = [];
  const seenIds = new Set();

  for (const rawQuestion of baseQuestions) {
    const question = withStyleEnhancement(cloneQuestion(rawQuestion));

    if (shouldSkipQuestion(category, question.id, answers)) continue;

    if (!seenIds.has(question.id)) {
      flow.push(question);
      seenIds.add(question.id);
    }

    const followUps = getFollowUps(category, question.id, answers);
    for (const followUp of followUps) {
      if (seenIds.has(followUp.id)) continue;
      flow.push(followUp);
      seenIds.add(followUp.id);
    }
  }

  return flow;
};

export const pruneInactiveAnswers = (answers, activeQuestions) => {
  const activeIds = new Set(activeQuestions.map((question) => question.id));
  const next = {};

  Object.entries(answers || {}).forEach(([key, value]) => {
    if (activeIds.has(key)) next[key] = value;
  });

  return next;
};

export const hasRequiredAnswer = (question, answers) => {
  if (!question || question.required === false) return true;
  const value = answers?.[question.id];
  return value !== undefined && value !== null && String(value).trim() !== '';
};

export const buildInputProfile = (activeQuestions, answers) => {
  const next = {};
  const activeIds = new Set(activeQuestions.map((question) => question.id));

  Object.entries(answers || {}).forEach(([key, value]) => {
    if (!activeIds.has(key)) return;
    if (value === undefined || value === null || String(value).trim() === '') return;
    next[key] = value;
  });

  return next;
};