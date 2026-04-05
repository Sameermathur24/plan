import './src/style.css'
import './src/background.js'
import { triggerConfetti } from './src/confetti.js'

const questions = [
  {
    id: 'intro',
    title: "Hey Aashna, Ik you have a busy life but are you up for some fun on 11th April - Saturday? ✨",
    options: ['Yes! Let\'s go', 'Sign me up!'],
    type: 'choice'
  },
  {
    id: 'scene',
    title: "Perfect! What's the energy for the day? ⚡️",
    options: ['Cafe + Board Games', 'Arcade', 'Fine-Dine', 'Movie'],
    type: 'choice'
  },
  {
    id: 'gamer',
    title: "How competitive are we feeling today? 🕹️",
    options: ['Playing to Win', 'Casual & Chill', 'I\'ll just watch'],
    type: 'choice'
  },
  {
    id: 'cuisine',
    title: "And for the food situation, what are you craving? 🍕",
    options: ['Indian', 'Italian', 'Asian', 'Continental', 'Surprise Me'],
    type: 'choice'
  },
];

let currentQuestionIndex = 0;
const selections = {};

const cardContainer = document.getElementById('card-container');

function createCard(question) {
  const card = document.createElement('div');
  card.className = 'card active';
  card.id = `card-${question.id}`;
  
  const title = document.createElement('h2');
  title.innerText = question.title;
  card.appendChild(title);

  if (question.type === 'choice') {
    const grid = document.createElement('div');
    grid.className = 'options-grid';
    question.options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerText = option;
      btn.onclick = () => handleChoice(question.id, option);
      grid.appendChild(btn);
    });
    card.appendChild(grid);
  }
  
  return card;
}

function handleChoice(id, value) {
  if (selections[id]) return; // Prevent double trigger
  selections[id] = value;
  triggerConfetti();
  nextQuestion();
}

function nextQuestion() {
  const currentCard = cardContainer.querySelector('.card.active');
  if (currentCard) {
    currentCard.classList.remove('active');
    currentCard.classList.add('hidden');
    setTimeout(() => {
      currentCard.remove();
      renderNext();
    }, 400);
  } else {
    renderNext();
  }
}

function renderNext() {
  currentQuestionIndex++;
  if (currentQuestionIndex <= questions.length) {
    const question = questions[currentQuestionIndex - 1];

    // Conditional Skip Logic: Only ask "gamer" question for Cafe + Board Games or Arcade
    if (question.id === 'gamer') {
      const sceneSelection = selections['scene'];
      if (sceneSelection !== 'Cafe + Board Games' && sceneSelection !== 'Arcade') {
        renderNext(); // Skip to next question
        return;
      }
    }

    const newCard = createCard(question);
    cardContainer.appendChild(newCard);
  } else {
    showSubmitCard();
  }
}

function showSubmitCard() {
  const card = document.createElement('div');
  card.className = 'card active';
  
  const title = document.createElement('h2');
  title.innerText = 'Ready to submit?';
  card.appendChild(title);

  const btn = document.createElement('button');
  btn.className = 'submit-btn';
  btn.innerText = "Let's Go!";
  btn.onclick = () => {
    triggerConfetti();
    showSendingState();
  };
  card.appendChild(btn);

  cardContainer.appendChild(card);
}

async function submitToGoogleForm() {
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfw_qv-3ICKaZrK35Ij7CrIgVo4hzXuCUJcOYOgsjnMUsgWvg/formResponse';
  
  const mappings = {
    'Cafe + Board Games': 'Cafe',
    'Arcade': 'Arcade',
    'Fine-Dine': 'fine dine',
    'Movie': 'Movie',
    'Playing to Win': 'competitive',
    'Casual & Chill': 'casual',
    "I'll just watch": 'just watch',
    'Indian': 'indian',
    'Italian': 'italian',
    'Asian': 'asian',
    'Continental': 'continental',
    'Surprise Me': 'surprise me',
    "Yes! Let's go": 'Option 1',
    "Sign me up!": 'Option 2'
  };

  const formData = new URLSearchParams();
  formData.append('entry.758634490', mappings[selections['intro']] || selections['intro']);
  formData.append('entry.276271924', mappings[selections['scene']] || selections['scene']);
  formData.append('entry.292349101', mappings[selections['cuisine']] || selections['cuisine']);
  
  if (selections['gamer']) {
    formData.append('entry.397002179', mappings[selections['gamer']] || selections['gamer']);
  }

  formData.append('fvv', '1');
  formData.append('fbzx', '-2856387655256458764');
  formData.append('pageHistory', '0');
  formData.append('submissionTimestamp', Math.floor(Date.now() * 1000).toString());

  console.log('Submitting form data:', Object.fromEntries(formData));

  try {
    const response = await fetch(FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    console.log('Form submission response:', response);
  } catch (error) {
    console.error('Form submission error:', error);
  }
}

function showSendingState() {
  const card = document.createElement('div');
  card.className = 'card active';
  
  const title = document.createElement('h2');
  title.innerText = 'Sending your plan...';
  card.appendChild(title);

  const loader = document.createElement('div');
  loader.className = 'loader';
  card.appendChild(loader);

  cardContainer.appendChild(card);

  // Submit to Form and then show success
  submitToGoogleForm();
  
  setTimeout(() => {
    card.remove();
    showSuccess();
  }, 2000);
}

function showSuccess() {
  const card = document.createElement('div');
  card.className = 'card active card-success';
  
  const title = document.createElement('h2');
  title.innerText = 'Plan Submitted!';
  card.appendChild(title);

  const msg = document.createElement('p');
  msg.style.fontSize = '1.4rem';
  msg.style.fontWeight = '700';
  msg.innerText = 'Looking forward to meeting you on 11th!';
  card.appendChild(msg);

  cardContainer.appendChild(card);
  triggerConfetti();
  triggerConfetti();
}

// Initial Render
renderNext();
