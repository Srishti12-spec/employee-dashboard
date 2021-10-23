// App modules used to create a separation of concerns (simple MVC)
// Acts as a simplified model

var to_delete;

const budgetController = (() => {
	const Expense = function (name, mob, desig, age) {
		this.name = name;
		this.mob = mob;
		this.desig = desig;
		this.age = age;
	};

	const items = [];

	return {
		addItem: (name, mob, desig, age) => {
			let newItem, id;
			// Generate a random ID
			id = (
				Date.now().toString(36) +
				Math.random()
					.toString(36)
					.substr(2, 5)
			).toUpperCase();
			// Create a new item based on type
			newItem = new Expense(name, mob, desig, age);

			// Push item into the data structure
			items.push(newItem);
			return newItem;
		},
		deleteItem: attr => {
			const name = attr.split('-')[0];
			const mob = attr.split('-')[1];
			// The find method would be more efficient but it is less compatible
			const removeIndex = items.map(item => item.mob).indexOf(mob);

			items.splice(removeIndex, 1);
		},
		testing: () => {
			console.log(data);
		}
	};
})();

// Handles the applications view
const UIController = (() => {
	const elements = {
		inputType: '.add__type',
		inputDesc: '.add__description',
		inputName: 'add__name',
		inputMob: 'add__mob',
		inputDesig: 'add__desig',
		inputAge: 'add__age',
		inputNameEdit: 'add__name-edit',
		inputMobEdit: 'add__mob-edit',
		inputDesigEdit: 'add__desig-edit',
		inputAgeEdit: 'add__age-edit',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		budgetLbl: '.budget__value',
		incomeLbl: '.budget__income--value',
		expensesLbl: '.budget__expenses--value',
		percentLbl: '.budget__expenses--percentage',
		container: '.container',
		expenseListItems: '.expenses__list > div',
		dateLbl: '.budget__title--month'
	};

	return {
		getInput: () => {
			return {
				name: document.getElementById(elements.inputName).value,
				mob: document.getElementById(elements.inputMob).value,
				desig: document.getElementById(elements.inputDesig).value,
				age: document.getElementById(elements.inputAge).value,
			};
		},
		getEditInput: () => {
			return {
				name: document.getElementById(elements.inputNameEdit).value,
				mob: document.getElementById(elements.inputMobEdit).value,
				desig: document.getElementById(elements.inputDesigEdit).value,
				age: document.getElementById(elements.inputAgeEdit).value,
			};
		},
		addListItem: (item, type) => {
			// Create HTML string for income / expense item
			let html = `
			<div class="item clearfix" id="${item.name}+${item.mob}">
				<div class="item__description">${item.name}</div>
				<div class="item__description">${item.mob}</div>
				<div class="item__description">${item.desig}</div>
				<div class="item__description">${item.age}</div>
				<div class="right clearfix">
					<div class="item__delete">
						<button class="item__delete--btn">
							<i class="ion-ios-close-outline" data-item="${item.name}+${item.mob}-delete">
							Delete
							</i>
						</button>
					</div>
				</div>
				<div class="right clearfix">
					<div class="item__delete">
						<button class="item__edit--btn">
							<i class="ion-ios-close-outline" data-item="${item.name}+${item.mob}-edit">
							Edit
							</i>
						</button>
					</div>
				</div>
			</div>
			`;
			// Insert HTML into the DOM
			document.querySelector(`.income__list`).insertAdjacentHTML('beforeend', html);
		},
		deleteListItem: id => {
			document.getElementById(id).remove();
		},
		getElements: () => {
			return elements;
		},
		displayDate: () => {
			const monthNames = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			];
			const dateElement = document.querySelector(elements.dateLbl);
			const date = new Date();
			dateElement.textContent =
				monthNames[date.getMonth()] + ' ' + date.getFullYear();
		},
		clearInputs: () => {
			// Converted node list into an array to demonstrate using the call method on the Array prototype
			const inputs = document.querySelectorAll(
				elements.inputDesc + ', ' + elements.inputValue
			);
			const inputsArr = Array.prototype.slice.call(inputs);
			inputsArr.forEach(input => {
				input.value = '';
			});
			// Set focus on first input element
			inputsArr[0].focus();
		}
	};
})();

// Serves as the controller of the application
const controller = ((budgetCtrl, UICtrl) => {
	const setupEventListeners = () => {
		const UIElements = UICtrl.getElements();
		document
			.querySelector(UIElements.inputBtn)
			.addEventListener('click', ctrlAddItem);

		// document.addEventListener('keypress', e => {
		// 	// 'which' is used to support older browsers
		// 	if (e.keyCode === 13 || e.which === 13) {
		// 		ctrlAddItem();
		// 	}
		// });

		document
			.querySelector(UIElements.container)
			.addEventListener('click', ctrlDeleteOrModify);

	};

	const ctrlAddItem = () => {
		// 1. Get field input value
		const input = UICtrl.getInput();
		if (input.name === '') {
			alert(
				'Please fill all fields before submitting.'
			);
			return false;
		}
		// 2. Add item to the budget controller
		const newItem = budgetCtrl.addItem(input.name, input.mob, input.desig, input.age);
		// 3. Add item to the UI
		UICtrl.addListItem(newItem);
		// 4. Clear input fields
		UICtrl.clearInputs();
	};

	const ctrlEditItemBtnClick = () => {
		// 1. Get field input value
		const input = UICtrl.getEditInput();
		if (input.name === '') {
			alert(
				'Please fill all fields before submitting.'
			);
			return false;
		}
		ctrlDeleteItem(to_delete);
		// 2. Add item to the budget controller
		const newItem = budgetCtrl.addItem(input.name, input.mob, input.desig, input.age);
		// 3. Add item to the UI
		UICtrl.addListItem(newItem);
		// 4. Clear input fields
		UICtrl.clearInputs();
	};

	const ctrlDeleteOrModify = e => {
		if (e.target && e.target.nodeName === 'I') {
			const attr = e.target.dataset.item;
			let data = attr.split('-');
			if (data[1] === 'delete')
				ctrlDeleteItem(data[0]);
			if (data[1] === 'edit')
				ctrlEditItem(data[0]);
		}
	};
	const ctrlDeleteItem = attr => {
		console.log(attr);
		UICtrl.deleteListItem(attr);
		// Delete item from budget array then recalculate and update budget
		budgetCtrl.deleteItem(attr);
	};

	const ctrlEditItem = attr => {
		to_delete = attr;
		let html = `
			<br>
			<input type="text" class="add__description" id="add__name-edit" placeholder="Name">
			<input type="text" class="add__description" id="add__mob-edit" placeholder="Mobile Number">
			<input type="text" class="add__description" id="add__desig-edit" placeholder="Designation">
			<input type="number" class="add__value" id="add__age-edit" placeholder="Age">
			<button class="edit__btn">
				<i class="ion-ios-checkmark-outline"></i>
			</button>
		`;
		// Insert HTML into the DOM
		document.getElementById(attr).insertAdjacentHTML('beforeend', html);
		document.querySelector(".edit__btn").addEventListener('click', ctrlEditItemBtnClick);
		// budgetCtrl.editItem(attr);
		// UICtrl.editListItem(attr);
	};

	return {
		init: () => {
			console.log('Start');
			// UICtrl.displayDate();
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();
