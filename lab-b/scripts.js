class Todo {
  constructor() {
    this.tasks = [];
    this.load();
    this.term = "";
  }

  createTaskElement = (task, index) => {
    const item = document.createElement("div");
    item.className = "task";

    const text = document.createElement("span");
    text.innerHTML = this.highlight(task.text);

    const date = document.createElement("span");
    date.textContent = task.date || "";

    const btn = document.createElement("button");
    btn.textContent = "Usuń";
    btn.onclick = () => this.remove(index);

    text.onclick = () => {
      const input = document.createElement("input");
      input.value = task.text;

      item.innerHTML = "";
      item.appendChild(input);
      input.focus();

      input.onblur = () => {
        this.tasks[index].text = input.value;
        this.save();
        this.draw();
      };
    };

    date.onclick = () => {
      const input = document.createElement("input");
      input.type = "date";
      input.value = task.date;

      item.innerHTML = "";
      item.appendChild(input);
      input.focus();

      input.onblur = () => {
        this.tasks[index].date = input.value;
        this.save();
        this.draw();
      };
    };

    item.appendChild(text);
    item.appendChild(date);
    item.appendChild(btn);

    return item;
  };

  draw = () => {
    const list = document.getElementById("list");
    list.innerHTML = "";

    this.tasks.forEach((task, index) => {

      if (this.term.length >= 2 &&
        !task.text.toLowerCase().includes(this.term.toLowerCase())) {
        return;
      }

      const el = this.createTaskElement(task, index);
      list.appendChild(el);
    });
  }

  add = (text, date) => {
    if (text.length < 3) {
      alert("Minimum 3 znaki!");
      return;
    }

    if (text.length > 255) {
      alert("Maksymalnie 255 znaków!");
      return;
    }

    /* ============================= */
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(date) < today) {/* fragment pomiedzy liniami zostal wygenerowany przez ChatGPT */
        alert("Data musi być w przyszłości!");
        return;
      }
    }
    /* ============================= */

    this.tasks.push({ text, date });
    this.save();
    this.draw();
  }

  remove = (index) => {
    this.tasks.splice(index, 1);
    this.save();
    this.draw();
  }

  /* ============================= */
  save = () => {
    localStorage.setItem("tasks", JSON.stringify(this.tasks)); /* fragment pomiedzy liniami zostal wygenerowany przez ChatGPT */
  }
  /* ============================= */

  load = () => {
    const data = localStorage.getItem("tasks");
    if (data) {
      this.tasks = JSON.parse(data);
    }
  }

  /* ============================= */
  highlight = (text) => {
    if (this.term.length < 2) return text; /* fragment pomiedzy liniami zostal wygenerowany przez ChatGPT */

    const regex = new RegExp(`(${this.term})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
  /* ============================= */
}

const todo = new Todo();
document.todo = todo;
todo.draw();

document.getElementById("addBtn").onclick = () => {
  const text = document.getElementById("taskInput").value;
  const date = document.getElementById("dateInput").value;

  todo.add(text, date);

  document.getElementById("taskInput").value = "";
  document.getElementById("dateInput").value = "";
};

document.getElementById("search").oninput = (e) => {
  todo.term = e.target.value;
  todo.draw();
};
