import { create } from "zustand";

const QUESTION_BANK = {
  personal: [
    "Tell me about yourself.",
    "What makes you unique as a candidate?",
    "Why do you want to come to our program?",
    "Do you have any ties to this city?",
    "What will you bring to our fellowship?",
  ],
  career: [
    "Why cardiology?",
    "Where do you see yourself in 5 years?",
    "Where do you see yourself in 10 years?",
    "What subspecialty are you interested in?",
    "Do you see yourself in academics or private practice?",
  ],
  behavioral: [
    "What is your greatest weakness?",
    "Tell me about a time you disagreed with a nurse or colleague.",
    "Tell me about a mistake you made and how you handled it.",
    "Tell me about a difficult patient interaction.",
    "Tell me about an ethical dilemma you faced.",
  ],
  research: [
    "Tell me about your research.",
    "How did you get involved in this project?",
    "What are your research interests going forward?",
    "What grant would you apply for here?",
    "If you started a new project at our program today, what would you study?",
  ],
  clinical: [
    "Tell me about an interesting case you managed.",
    "Tell me about a diagnostic dilemma you've faced.",
    "How would you approach a patient with chest pain?",
    "Describe your approach to a difficult arrhythmia.",
    "Tell me about a case that challenged your clinical reasoning.",
  ],
  programFit: [
    "What do you know about our program?",
    "How does our program align with your goals?",
    "What do you know about our cath lab volume?",
    "What interests you about our fellowship structure?",
    "Why are you interested in our program specifically?",
  ],
};

export const useInterviewStore = create((set) => ({
  currentMode: "chat", // 'chat' or 'cards'
  category: "personal",
  currentQuestion: "",
  sessionHistory: [],
  score: 0,

  setMode: (mode) => set({ currentMode: mode }),
  setCategory: (category) => set({ category }),

  generateQuestion: (category = null) => {
    set((state) => {
      const cat = category || state.category;
      const questions = QUESTION_BANK[cat] || QUESTION_BANK.personal;
      const random = questions[Math.floor(Math.random() * questions.length)];
      return { currentQuestion: random, category: cat };
    });
  },

  addToHistory: (question, userAnswer, feedback) =>
    set((state) => ({
      sessionHistory: [
        ...state.sessionHistory,
        { question, userAnswer, feedback, timestamp: Date.now() },
      ],
    })),

  clearHistory: () => set({ sessionHistory: [] }),
}));

export const NOTECARDS = {
  fellowshipFacts: [
    {
      id: "fact-1",
      front: "What is the match rate for cardiology fellowship?",
      back: "Approximately 65-66%, meaning roughly one-third of applicants do not match.",
      category: "fellowshipFacts",
    },
    {
      id: "fact-2",
      front:
        "How much do research publications impact matching odds to cardiology fellowship?",
      back: "Applicants with 3+ publications during residency have roughly 4.5× higher odds of matching compared to those with none.",
      category: "fellowshipFacts",
    },
    {
      id: "fact-3",
      front: "Which exam score matters more for cardiology: Step 1 or Step 2?",
      back: "Step 2 CK trends and cardiology-specific ITE percentile scores carry more weight than Step 1 in matching outcomes.",
      category: "fellowshipFacts",
    },
    {
      id: "fact-4",
      front: "When does ERAS typically open for cardiology fellowship?",
      back: "Early June, with applications typically submitted starting July 1, interviews running August-November.",
      category: "fellowshipFacts",
    },
  ],
  researchTalking: [
    {
      id: "research-1",
      front: "What makes a strong 60-second research pitch?",
      back: "State the problem, your specific role, the key finding, and clinical relevance. Use concrete numbers, not vague descriptors.",
      category: "researchTalking",
    },
    {
      id: "research-2",
      front: "How should you discuss future research interests?",
      back: "Be specific about the topic or patient population, mention why it matters clinically, and connect it to the program's strengths if known.",
      category: "researchTalking",
    },
    {
      id: "research-3",
      front: "What if you have fewer than 3 publications?",
      back: "Emphasize quality over quantity, highlight your role in ongoing projects, and discuss your commitment to research during fellowship.",
      category: "researchTalking",
    },
  ],
  clinical: [
    {
      id: "clinical-1",
      front: "What is STEMI?",
      back: "ST-Elevation Myocardial Infarction: acute myocardial infarction with ST elevation on EKG, requires urgent reperfusion therapy.",
      category: "clinical",
    },
    {
      id: "clinical-2",
      front: "What does COCATS stand for?",
      back: "Competency-based training levels: levels I-IV indicate increasing independence in procedural skills (cath, echocardiography, etc.).",
      category: "clinical",
    },
    {
      id: "clinical-3",
      front: "What is the difference between a VAD and ECMO?",
      back: "VAD (ventricular assist device) provides long-term mechanical support for one ventricle; ECMO provides temporary extracorporeal support.",
      category: "clinical",
    },
  ],
  behavioral: [
    {
      id: "behavior-1",
      front: "What is the STAR method?",
      back: "Situation, Task, Action, Result. Use this structure for all behavioral answers to provide specific, structured responses.",
      category: "behavioral",
    },
    {
      id: "behavior-2",
      front: "What should you avoid when discussing a weakness?",
      back: "Don't minimize it, don't make it sound like a strength ('I work too hard'), and always include how you addressed or are addressing it.",
      category: "behavioral",
    },
    {
      id: "behavior-3",
      front: "How should you frame a mistake in an interview?",
      back: "Take ownership without blame-shifting, explain what you learned, and show concrete changes you made as a result.",
      category: "behavioral",
    },
  ],
};

export const useNotecardStore = create((set, get) => ({
  cards: NOTECARDS,
  masteredCards: new Set(),
  currentCardIndex: 0,
  filterCategory: null,
  isFlipped: false,

  setFilterCategory: (category) => {
    set({ filterCategory: category, currentCardIndex: 0, isFlipped: false });
  },

  toggleFlip: () => set((state) => ({ isFlipped: !state.isFlipped })),

  markMastered: (cardId) => {
    const state = get();
    state.masteredCards.add(cardId);
    set({ masteredCards: new Set(state.masteredCards) });
  },

  goToNext: () => {
    set((state) => ({
      currentCardIndex: state.currentCardIndex + 1,
      isFlipped: false,
    }));
  },

  getVisibleCards: () => {
    const state = get();
    const allCards = Object.values(state.cards).flat();
    if (state.filterCategory) {
      return allCards.filter((card) => card.category === state.filterCategory);
    }
    return allCards;
  },

  getMasteryPercent: () => {
    const state = get();
    const allCards = Object.values(state.cards).flat();
    const mastered = allCards.filter((card) =>
      state.masteredCards.has(card.id)
    );
    return Math.round((mastered.length / allCards.length) * 100);
  },
}));
