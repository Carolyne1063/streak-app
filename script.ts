interface Habit {
    habitName: string;
    description: string;
    frequency: string;
    targetGoal: string;
    startDate: string;
}

const API_URL = 'http://localhost:3000/habits'; 

function addHabit(): void {
    let habitInput: HTMLInputElement = document.getElementById('habitInput') as HTMLInputElement;
    let descriptionInput: HTMLInputElement = document.getElementById('description') as HTMLInputElement;
    let frequencyInput: HTMLInputElement = document.getElementById('frequency') as HTMLInputElement;
    let targetGoalInput: HTMLInputElement = document.getElementById('targetGoal') as HTMLInputElement;
    let startDateInput: HTMLInputElement = document.getElementById('startDate') as HTMLInputElement;

    let habitName: string = habitInput.value.trim();
    let description: string = descriptionInput.value.trim();
    let frequency: string = frequencyInput.value.trim();
    let targetGoal: string = targetGoalInput.value.trim();
    let startDate: string = startDateInput.value.trim();
    console.log('Start Date:', startDate);


    if (habitName === '') {
        alert('Please enter a habit');
        return;
    }

    const habit: Habit = {
        habitName,
        description,
        frequency,
        targetGoal,
        startDate
    };

    addHabitToList(habit);
    saveHabitToLocalStorage(habit);
    saveHabitToAPI(habit);

    // Clear input fields after adding habit
    habitInput.value = '';
    descriptionInput.value = '';
    frequencyInput.value = '';
    targetGoalInput.value = '';
    startDateInput.value = '';
}

function addHabitToList(habit: Habit): void {
    const habitList: HTMLElement = document.querySelector('.habit-list') as HTMLElement;

    const habitCard: HTMLDivElement = document.createElement('div');
    habitCard.classList.add('habit-card');

    const habitIcon: HTMLElement = document.createElement('ion-icon');
    habitIcon.setAttribute('name', 'water-outline');

    function createParagraphWithText(text: string): HTMLParagraphElement {
        if (typeof text !== 'string') {
            throw new Error('Text must be a string');
        }
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        return paragraph;
    }

    function appendParagraphToElement(paragraph: HTMLParagraphElement, parentElement: HTMLElement) {
        parentElement.appendChild(paragraph);
    }

    const habitText = createParagraphWithText(habit.habitName);
    const descriptionText = createParagraphWithText(`Description: ${habit.description}`);
    const frequencyText = createParagraphWithText(`Frequency: ${habit.frequency}`);
    const targetGoalText = createParagraphWithText(`Target Goal: ${habit.targetGoal}`);
    const startDateText = createParagraphWithText(`Start Date: ${habit.startDate}`);

    // Calculate days since start date
    const currentDate = new Date();
    const startDate = new Date(habit.startDate);
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    const streak = createParagraphWithText(`Streak: ${dayDiff}`);

    appendParagraphToElement(habitText, habitCard);
    appendParagraphToElement(descriptionText, habitCard);
    appendParagraphToElement(frequencyText, habitCard);
    appendParagraphToElement(targetGoalText, habitCard);
    appendParagraphToElement(startDateText, habitCard);
    appendParagraphToElement(streak, habitCard);

    habitList.appendChild(habitCard);
}

function saveHabitToLocalStorage(habit: Habit): void {
    let habits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
    habits.push(habit);
    localStorage.setItem('habits', JSON.stringify(habits));
}

function loadHabitsFromLocalStorage(): void {
    let habits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
    habits.forEach(addHabitToList);
}

function saveHabitToAPI(habit: Habit): void {
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(habit)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Habit saved to API:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

// Function to toggle the display of the habit form
function toggleFormDisplay(): void {
    let form: HTMLElement = document.querySelector('.streak-form') as HTMLElement;
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Add an event listener to the "Add Habit" button to toggle form display
let addButton: HTMLButtonElement = document.querySelector('button') as HTMLButtonElement;
addButton.addEventListener('click', toggleFormDisplay);

// Load habits from localStorage when the page loads
window.addEventListener('load', loadHabitsFromLocalStorage);
