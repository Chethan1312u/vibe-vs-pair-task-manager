const form = document.querySelector("form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const filterButtons = document.querySelectorAll("[data-filter]");

const tasks = [];
let currentFilter = "all";

function renderTasks() {
	taskList.innerHTML = "";

	const visibleTasks = tasks.filter((task) => {
		if (currentFilter === "active") {
			return !task.completed;
		}

		if (currentFilter === "completed") {
			return task.completed;
		}

		return true;
	});

	visibleTasks.forEach((task) => {
		const taskItem = document.createElement("li");
		taskItem.textContent = task.title;

		if (task.completed) {
			taskItem.classList.add("completed");
		}

		taskItem.addEventListener("click", () => {
			task.completed = !task.completed;
			renderTasks();
		});

		taskList.appendChild(taskItem);
	});
}

filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		currentFilter = button.dataset.filter;
		renderTasks();
	});
});

form.addEventListener("submit", (event) => {
	event.preventDefault();

	const title = taskInput.value.trim();

	if (!title) {
		return;
	}

	tasks.push({
		title,
		completed: false,
	});

	taskInput.value = "";
	renderTasks();
});
