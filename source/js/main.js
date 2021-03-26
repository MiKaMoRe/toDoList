function $$(arg) {return document.querySelectorAll(arg)}
function $(arg) {return document.querySelector(arg)}

function isEmpty(str) {
    return (!str || 0 === str.length);
}
function cooldown(func, limit) {
	let lastFunc;
	let lastRan;
	return function() {
		let context = this;
		let args = arguments;
		if (!lastRan) {
			func.apply(context, args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc)
			lastFunc = setTimeout(function() {
				if ((Date.now() - lastRan) >= limit) {
					func.apply(context, args);
					lastRan = Date.now();
				}
			}, limit - (Date.now() - lastRan));
		}
	}
}
class Category{
	constructor(name, color){
		this.name = name,
		this.color = color,
		this.tasks = []
	}
	counterTaskDate(date){
		let counter = 0
		this.tasks.forEach(task => {
			task.date == date ? counter += 1 : counter += 0
		})
		return counter
	}
	counterTaskAll(){
		let counter = 0
		this.tasks.forEach(f => counter += 1)
		return counter
	}
}
class Task{
	constructor(name, time, date, color, category){
		this.name = name,
		this.time = time,
		this.date = date,
		this.color = color,
		this.category = category,
		this.complite = false
	}
}

/***********************************************************/
/************************* Events **************************/
/***********************************************************/

function radio_events(){
	$$(".radio-button__fake.task-list").forEach((elem, key) => {
		elem.addEventListener("click", f => {
			viewTasklist[key - 1].complite = true
			$$('.to-do-item__content')[key].classList.add('active');
			$$('.radio-button__dot')[key].classList.add('active');
		})

	})
}
function modal_window(){
	$('.modal-window__button').addEventListener("click", cooldown(f => {
		$('.modal-window__button').classList.toggle('active');
		$('.modal-window__window').classList.toggle('active');
	} , 1000));
}
function new_category_window(){
	// Нажатие на добавление категории
	$('.add-new-category').addEventListener("click", cooldown(f => {
		$('.new-category__wrapper').classList.toggle('active');
		$('body').classList.toggle('active');
		$('.modal-window__button').classList.toggle('active');
		$('.modal-window__window').classList.toggle('active');
	}, 100))
	// Нажатие на Cancel
	$('.new-category #cancel').addEventListener("click", cooldown(f => {
		$('.new-category__wrapper').classList.toggle('active');
		$('body').classList.toggle('active');
	} , 100));
	//  Нажатие на Done
	$('.new-category #done').addEventListener("click", cooldown(f => {
		$('.new-category__wrapper').classList.toggle('active');
		$('body').classList.toggle('active');
		if (!isEmpty($('.new-category #name').value)){

			let inputName = $('.new-category #name').value;
			let inputColor = $('.new-category #color').value;
			
			addNewCategory(
				inputName,
				inputColor
			)
		} else{
			alert('Category name cant be empty!')
		}
		categoriesAllPrint()
	} , 100));
}
function new_task_window(){
	// Нажатие на добавление задания
	$('.add-new-task').addEventListener("click", cooldown(f => {
		$('.new-task__wrapper').classList.toggle('active');
		$('body').classList.toggle('active');
		$('.modal-window__button').classList.toggle('active');
		$('.modal-window__window').classList.toggle('active');
	} , 100));
	// Нажатие на Cancel
	$('.new-task #cancel').addEventListener("click", cooldown(f => {
		$('.new-task__wrapper').classList.toggle('active');
		$('body').classList.toggle('active');
	} , 100));
	//  Нажатие на Done
	$('.new-task #done').addEventListener("click", cooldown(f => {
		$('.new-task__wrapper').classList.toggle('active');
		$('body').classList.toggle('active');
		if (!isEmpty($('.new-task__input input').value)){

			let inputDate = $('#settings-date').value;
			let inputTime = $('#settings-time').value;
			let time = isEmpty(inputTime) ? timeNow : inputTime;
			let date = isEmpty(inputDate) ? dateNow : inputDate.split('-').reverse().map(num => parseInt(num, 10)).join('.');

			
			addNewTask(
				$('.new-task__input input').value,
				time, 
				date,
				setting_category
			)
		} else{
			alert('Task cant be empty!')
		}
	} , 100));
}
function settings_events(){
	let lastEvent = ''

	$('#calendar').addEventListener("click", f => {
		if (lastEvent == 'calendar' || isEmpty(lastEvent) || !$('.settings__main').classList.contains('active')) {
			$('.settings__main').classList.toggle('active');
			$('.settings__wrapper').classList.toggle('active');
		}
		$('#choose_category').classList.remove('active');
		$('#calendar').classList.toggle('active');
		$('#alarm').classList.remove('active');
		$('#settings-time').classList.remove('active');
		$('#settings-date').classList.add('active');
		$('#settings-category').classList.remove('active');
		lastEvent = 'calendar';
	});
	$('#alarm').addEventListener("click", f => {
		if (lastEvent == 'alarm' || isEmpty(lastEvent) || !$('.settings__main').classList.contains('active')) {
			$('.settings__main').classList.toggle('active');
			$('.settings__wrapper').classList.toggle('active');
		}
		$('#choose_category').classList.remove('active');
		$('#calendar').classList.remove('active');
		$('#alarm').classList.toggle('active');
		$('#settings-time').classList.add('active');
		$('#settings-date').classList.remove('active');
		$('#settings-category').classList.remove('active');
		lastEvent = 'alarm';
	});
	$('#choose_category').addEventListener("click", e => {
		if (lastEvent == 'choose_category' || isEmpty(lastEvent) || !$('.settings__main').classList.contains('active')) {
			$('.settings__main').classList.toggle('active');
			$('.settings__wrapper').classList.toggle('active');
		}
		$('#choose_category').classList.toggle('active');
		$('#calendar').classList.remove('active');
		$('#alarm').classList.remove('active');
		$('#settings-time').classList.remove('active');
		$('#settings-date').classList.remove('active');
		$('#settings-category').classList.add('active');
		lastEvent = 'choose_category';
	});
}
function category_events(){
	$('.header__title').addEventListener("click", event => {
		printTasks($(".to-do-list__wrapper"), $(".to-do-item.example"))
	})
	$$('.category-item__wrapper.filter').forEach((block, key) => {
		block.addEventListener("click", e => {
			$(".to-do-list__wrapper").innerHTML = "";
			printTasks($(".to-do-list__wrapper"), $(".to-do-item"), categories_list[key].name)
		})
	})
	$$('.category-item__wrapper.set-category').forEach((block, key) => {
		block.addEventListener("click", e => {
			setting_category = categories_list[key].name
			$('.new-task__content .color-circle__wrapper div').style.backgroundColor = categories_list[key].color;
			$('#choose_category p').innerHTML = categories_list[key].name;
			$('#choose_category .color-circle__wrapper div').style.backgroundColor = categories_list[key].color;
		})
	})
}
function select_date_event(){
	$('.header__burger').addEventListener("click", e => {
		$('.header__burger').classList.toggle('active');
		$('.select-date__wrapper').classList.toggle('active');
	})
	$('#select-date').addEventListener("blur", e => {
		dateNow = e.target.value.split('-').reverse().map(num => parseInt(num, 10)).join('.');
		printTasks($(".to-do-list__wrapper"), $(".to-do-item.example"))
		categoriesAllPrint()
		$('.header__wrapper h1').innerHTML = dateNow
	})
}

/***********************************************************/
/***********************************************************/
/***********************************************************/

// Основные переменные
let viewTasklist = [];
let dateNow = new Date();
let categories_list = [];
let setting_category = 'Разное';
let timeNow = dateNow.getHours() + ':' + dateNow.getMinutes();
dateNow = dateNow.getDate() + '.' +  (dateNow.getMonth() + 1) + '.' + dateNow.getFullYear();

/************************************************************/
/************************* Actions **************************/
/************************************************************/

function addNewTask(name, time, date, category){
	categories_list.forEach(elem => {
		elem.name == category ? elem.tasks.push(new Task(name, time, date, elem.color, elem.name)) : false
	})
	printTasks($(".to-do-list__wrapper"), $(".to-do-item.example"))
	categoriesAllPrint()
	category_events()
}
function addNewCategory(name, color){
	if (categories_list.filter(category => category.name == name).length != 0){
		alert('Такая категория уже существует.')
		return false
	}
	categories_list.push(new Category(name, color))
}
function printTasks(target, example, filter = 0, date = dateNow){
	viewTasklist = []
	target.innerHTML = '';
	categoryFilter(filter).forEach(category => {
		category.tasks.filter(task => task.date == date).forEach((task, taskKey)=>{
			viewTasklist.push(task)
		})
	})
	viewTasklist.forEach(task => {
		let block = example.cloneNode(true)
		if (task.complite){
			block.querySelector(".radio-button__dot").classList.add("active")
			block.querySelector(".to-do-item__content").classList.add("active")
		}
		block.classList.remove("example");
		block.querySelector(".color-circle__wrapper div").style.backgroundColor = task.color;
		block.querySelector(".to-do-item__text").innerHTML = task.name;
		block.querySelector(".to-do-item__time").innerHTML = task.time;
		target.appendChild(block)
	})
	radio_events()
}
function categoryFilter(filter){
	if (filter != 0){
		return categories_list.filter(category => category.name == filter)
	} else {
		return categories_list
	}
}
function printCategory(target, example, date = dateNow){
	target.innerHTML = '';
	categories_list.forEach(category => {
		let block = example.cloneNode(true);
		block.classList.remove("example");
		if (target.id == "settings-category") {
			block.querySelector(".category-item__wrapper").classList.add("set-category");
			block.querySelector("span").innerHTML = "Всего " + category.counterTaskAll() + " задания";
		}else {
			block.querySelector(".category-item__wrapper").classList.add("filter");
			block.querySelector("span").innerHTML = category.counterTaskDate(date) + " задания";
		}
		block.querySelector(".category-item__wrapper").style.backgroundColor = category.color;
		block.querySelector("h2").innerHTML = category.name;
		target.appendChild(block)
	})
}
/***********************************************************/
/***********************************************************/
/***********************************************************/

// Установка дефолтного времени
$('#input-time').innerHTML = timeNow;
// Установка нового даты и времени
$('#settings-date').oninput = f => {
	$('#input-date').innerHTML = $('#settings-date').value.split('-').reverse().join('.')
}
$('#settings-time').oninput = f => {
	$('#input-time').innerHTML = $('#settings-time').value
}


// Тестовые категории
addNewCategory("Разное", "#b33434")
addNewCategory("Работа", "#b3b3ff")
addNewCategory("Семья", "#b3b300")
// Тестовые задания
addNewTask('Сдать назад', '21:00', '26.3.2021', 'Работа')
addNewTask('Пойти нахуй', '10:00', '26.3.2021', 'Работа')
addNewTask('Пойти вперед', '10:00', '26.3.2021', 'Семья')

function categoriesAllPrint(){
	printCategory($(".categories__contain"), $(".category-item.example"))
	printCategory($(".settings__categories"), $(".category-item.example"))
	category_events()
}
printTasks($(".to-do-list__wrapper"), $(".to-do-item.example"))
categoriesAllPrint()


// Events
select_date_event()
modal_window()
radio_events()
new_task_window()
new_category_window()
settings_events()
category_events()


