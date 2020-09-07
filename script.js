import faker from 'faker';
import wait from 'waait';

const tbody = document.querySelector('tbody');

let persons = Array.from({ length: 10 }, () => {
	return {
		id: faker.random.uuid(),
		lastName: faker.name.lastName(),
		firstName: faker.name.firstName(),
		jobTitle: faker.name.jobTitle(),
		jobArea: faker.name.jobArea(),
		phone: faker.phone.phoneNumber(),
		picture: faker.image.avatar(100, 100),
	};
});

console.log(persons);

const displayList = data => {
	tbody.innerHTML = data
		.map(
			(person, index) => `
    <tr data-id="${person.id}" class="${index % 2 ? 'even' : ''}">
        <td><img src="${person.picture}" alt="${person.firstName + ' ' + person.lastName}"/></td>
        <td>${person.lastName}</td>
        <td>${person.firstName}</td>
        <td>${person.jobTitle}</td>
        <td>${person.jobArea}</td>
        <td>${person.phone}</td>
        <td>
            <button class="edit" data-id="${person.id}">
                <svg viewBox="0 0 20 20" fill="currentColor" class="pencil w-6 h-6"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
            </button>
            <button class="delete" data-id="${person.id}">
                <svg viewBox="0 0 20 20" fill="currentColor" class="trash w-6 h-6"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            </button>
            </td>
    </tr>
`
		)
		.join('');
};

const editPartner = async id => {
	const person = persons.find(person => person.id === id);
	const result = await editPartnerPopup(person);
	if (result) {
		displayList(persons);
	}
};

async function destroyPopup(popup) {
	popup.classList.remove('open');
	// wait for 1 second, to let the animation do its work
	await wait(1000);
	// remove it from the dom
	popup.remove();
	// remove it from the javascript memory
	popup = null;
}

const editPartnerPopup = person => {
	return new Promise(async resolve => {
		// create the html form
		const popup = document.createElement('form');
		popup.classList.add('popup');
		popup.insertAdjacentHTML(
			'afterbegin',
			`<fieldset>
				<h3>Edit</h3>
                <label>Lastname</label>
				<input type="text" name="lastName" value="${person.lastName}"/>
                <label>Firstname</label>
				<input type="text" name="firstName" value="${person.firstName}"/>
                <label>Job title</label>
				<input type="text" name="jobTitle" value="${person.jobTitle}"/>
                <label>Job area</label>
				<input type="text" name="jobArea" value="${person.jobArea}"/>
                <label>Phone number</label>
				<input type="text" name="phone" value="${person.phone}"/>
				<button type="submit">Submit</button>
            </fieldset>
		`
		);

		const skipButton = document.createElement('button');
		skipButton.type = 'button'; // so it doesn't submit
		skipButton.textContent = 'Cancel';
		popup.firstElementChild.appendChild(skipButton);
		skipButton.addEventListener(
			'click',
			() => {
				resolve(null);
				destroyPopup(popup);
			},
			{ once: true }
		);

		popup.addEventListener(
			'submit',
			e => {
				e.preventDefault();
				// popup.input.value;
				person.firstName = e.target.firstName.value;
				person.lastName = e.target.lastName.value;
				person.jobTitle = e.target.jobTitle.value;
				person.jobArea = e.target.jobArea.value;
				person.phone = e.target.phone.value;
				resolve(person);
				destroyPopup(popup);
			},
			{ once: true }
		);

		document.body.appendChild(popup);
		await wait(50);
		popup.classList.add('open');
	});
};

const deletePartner = async id => {
	const person = persons.find(person => person.id === id);
	const result = await deleteDeletePopup(person);
	if (result) {
		persons = persons.filter(person => person.id !== result.id);
		displayList(persons);
	}
};

const deleteDeletePopup = person => {
	return new Promise(async resolve => {
		// create the html form
		const popup = document.createElement('form');
		popup.classList.add('popup');
		popup.insertAdjacentHTML(
			'afterbegin',
			`<fieldset>
				<h3>Delete ${person.firstName} ${person.lastName}</h3>
                <p>Are you sure you want to delete this person from the list?</p>
				<button type="submit">Delete</button>
            </fieldset>
		`
		);

		const skipButton = document.createElement('button');
		skipButton.type = 'button'; // so it doesn't submit
		skipButton.textContent = 'Cancel';
		popup.firstElementChild.appendChild(skipButton);
		skipButton.addEventListener(
			'click',
			() => {
				resolve(null);
				destroyPopup(popup);
			},
			{ once: true }
		);

		popup.addEventListener(
			'submit',
			e => {
				e.preventDefault();
				// popup.input.value;
				resolve(person);
				destroyPopup(popup);
			},
			{ once: true }
		);

		document.body.appendChild(popup);
		await wait(50);
		popup.classList.add('open');
	});
};

const handleClick = e => {
	const deleteButton = e.target.closest('button.delete');
	const editButton = e.target.closest('button.edit');

	if (editButton) {
		const idToEdit = editButton.dataset.id;
		editPartner(idToEdit);
	}

	if (deleteButton) {
		const idToDelete = deleteButton.dataset.id;
		deletePartner(idToDelete);
	}
};

tbody.addEventListener('click', handleClick);

displayList(persons);
