"use strict";
const API_URL = 'http://localhost:3000/habits';
function addHabit() {
    let habitInput = document.getElementById('habitInput');
    let descriptionInput = document.getElementById('description');
    let frequencyInput = document.getElementById('frequency');
    let targetGoalInput = document.getElementById('targetGoal');
    let startDateInput = document.getElementById('startDate');
    let habitName = habitInput.value.trim();
    let description = descriptionInput.value.trim();
    let frequency = frequencyInput.value.trim();
    let targetGoal = targetGoalInput.value.trim();
    let startDate = startDateInput.value.trim();
    console.log('Start Date:', startDate);
    if (habitName === '') {
        alert('Please enter a habit');
        return;
    }
    const habit = {
        habitName,
        description,
        frequency,
        targetGoal,
        startDate
    };
    // Save habit to API and update the list dynamically
    saveHabitToAPI(habit);
    // Clear input fields after adding habit
    habitInput.value = '';
    descriptionInput.value = '';
    frequencyInput.value = '';
    targetGoalInput.value = '';
    startDateInput.value = '';
}
function addHabitToList(habit) {
    const habitList = document.querySelector('.habit-list');
    const habitCard = document.createElement('div');
    habitCard.classList.add('habit-card');
    const habitIcon = document.createElement('ion-icon');
    habitIcon.setAttribute('name', 'sunny-outline');
    function createParagraphWithText(text) {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        return paragraph;
    }
    function appendParagraphToElement(paragraph, parentElement) {
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
    const streak = createParagraphWithText(`Streak: ${dayDiff} days`);
    habitCard.appendChild(habitIcon);
    appendParagraphToElement(habitText, habitCard);
    appendParagraphToElement(descriptionText, habitCard);
    appendParagraphToElement(frequencyText, habitCard);
    appendParagraphToElement(targetGoalText, habitCard);
    appendParagraphToElement(startDateText, habitCard);
    appendParagraphToElement(streak, habitCard);
    habitList.appendChild(habitCard);
}
function saveHabitToAPI(habit) {
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
        // Add the habit to the list dynamically after saving to the API
        addHabitToList(habit);
    })
        .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
function loadHabitsFromAPI() {
    fetch(API_URL)
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then((habits) => {
        habits.forEach(addHabitToList);
    })
        .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
// Function to toggle the display of the habit form
function toggleFormDisplay() {
    let form = document.querySelector('.streak-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
// Add an event listener to the "Add Habit" button to toggle form display
let addButton = document.querySelector('button');
addButton.addEventListener('click', toggleFormDisplay);
// Load habits from the API when the page loads
window.addEventListener('load', loadHabitsFromAPI);
