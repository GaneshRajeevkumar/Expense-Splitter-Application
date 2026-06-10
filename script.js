let participants = [];
let expenses = [];

function setupParticipants() {
    const numParticipants = document.getElementById('numParticipants').value;
    const participantNames = document.getElementById('participantNames');
    participantNames.innerHTML = '';

    if (!numParticipants || numParticipants < 1) return;

    for (let i = 0; i < numParticipants; i++) {
        const div = document.createElement('div');
        div.className = 'input-group fade-in';
        div.style.animationDelay = `${i * 0.1}s`;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Participant ${i + 1} Name`;
        input.className = 'participantName';
        
        div.appendChild(input);
        participantNames.appendChild(div);
    }

    const button = document.createElement('button');
    button.textContent = 'Continue to Expenses';
    button.className = 'primary-btn mt-4 fade-in';
    button.style.animationDelay = `${numParticipants * 0.1}s`;
    button.onclick = addParticipants;
    participantNames.appendChild(button);
}

function addParticipants() {
    const nameInputs = document.querySelectorAll('.participantName');
    participants = []; // Reset on add
    nameInputs.forEach(input => {
        if (input.value.trim()) participants.push(input.value.trim());
    });

    if (participants.length > 0) {
        document.getElementById('setup').classList.add('hidden');
        document.getElementById('addExpenses').classList.remove('hidden');
        updatePaidBySelect();
    }
}

function updatePaidBySelect() {
    const expensePaidBy = document.getElementById('expensePaidBy');
    expensePaidBy.innerHTML = '<option value="" disabled selected>Who paid?</option>';

    participants.forEach(participant => {
        const option = document.createElement('option');
        option.value = participant;
        option.textContent = participant;
        expensePaidBy.appendChild(option);
    });
}

function addExpense() {
    const description = document.getElementById('expenseDescription').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const paidBy = document.getElementById('expensePaidBy').value;

    if (description && amount && paidBy) {
        expenses.push({ description, amount, paidBy });
        updateExpensesList();
        
        // Reset inputs
        document.getElementById('expenseDescription').value = '';
        document.getElementById('expenseAmount').value = '';
        document.getElementById('expensePaidBy').selectedIndex = 0;
    }
}

function updateExpensesList() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.className = 'fade-in';
        li.style.animationDelay = '0.1s';
        
        const textSpan = document.createElement('span');
        textSpan.textContent = `${expense.description}`;
        
        const amountSpan = document.createElement('span');
        amountSpan.innerHTML = `<strong>$${expense.amount.toFixed(2)}</strong> <small>by ${expense.paidBy}</small>`;
        
        li.appendChild(textSpan);
        li.appendChild(amountSpan);
        expensesList.appendChild(li);
    });
}

function showBill() {
    const fileInput = document.getElementById('uploadBill');
    const billContainer = document.getElementById('billContainer');
    billContainer.innerHTML = '';

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.className = 'fade-in';
            img.src = e.target.result;
            billContainer.appendChild(img);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function calculateSplit() {
    if (expenses.length === 0) {
        alert("Please add at least one expense.");
        return;
    }

    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    const balance = {};
    participants.forEach(participant => balance[participant] = 0);

    expenses.forEach(expense => {
        const splitAmount = expense.amount / participants.length;
        participants.forEach(participant => balance[participant] -= splitAmount);
        balance[expense.paidBy] += expense.amount; // The person who paid gets the amount added back
    });

    participants.forEach((participant, index) => {
        const li = document.createElement('li');
        li.className = 'fade-in';
        li.style.animationDelay = `${index * 0.1}s`;
        
        const isOwed = balance[participant] >= 0;
        const amount = Math.abs(balance[participant]).toFixed(2);
        
        const nameSpan = document.createElement('span');
        nameSpan.innerHTML = `<strong>${participant}</strong>`;
        
        const statusSpan = document.createElement('span');
        if (isOwed) {
            statusSpan.style.color = 'var(--success-color)';
            statusSpan.textContent = `is owed $${amount}`;
        } else {
            statusSpan.style.color = 'var(--danger-color)';
            statusSpan.textContent = `owes $${amount}`;
        }
        
        li.appendChild(nameSpan);
        li.appendChild(statusSpan);
        resultsList.appendChild(li);
    });

    document.getElementById('addExpenses').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
}