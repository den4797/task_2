const myList = document.getElementById("list");
const doneList = document.getElementById("donelist");

let todo = [];
let toDone = [];

let temp;
let count = 0, countDone = 0, x = 0, y = 0;
let flag = "";

function saveCount() {
  let localCount = count;
  let localCountDone = countDone;
  localStorage.setItem("count", localCount);
  localStorage.setItem("countDone", localCountDone);
}

function getCount() {
  let localCount = localStorage.getItem("count");
  let localCountDone = localStorage.getItem("countDone");
  count = localCount;
  countDone = localCountDone;
}

function saveList() {
  let str = JSON.stringify(todo);
  let str1 = JSON.stringify(toDone);
  localStorage.setItem("todo", str);
  localStorage.setItem("toDone", str1);
}

function removeList(id) {
  const root = document.getElementById(id);

  while (root.firstChild) {
    root.removeChild(document.getElementById(id).firstChild);
  }

  if (myList.id === id) {
    todo = [];
    count = 0;
  } else {
    toDone = [];
    countDone = 0;
  }

  saveList();
  saveCount();
  displayTitle();
}

function displayTitle() {
  if (count === 0) {
    document.getElementById("noitem").style.display = "block";
  }
  if (count === 1) {
    document.getElementById("noitem").style.display = "none";
  }
  if (countDone === 0) {
    document.getElementById("doneitem").style.display = "block";
  }
  if (countDone === 1) {
    document.getElementById("doneitem").style.display = "none";
  }

}

function getList() {
  let str = localStorage.getItem("todo");
  let str1 = localStorage.getItem("toDone");

  todo = JSON.parse(str);
  toDone = JSON.parse(str1);

  if (!todo) {
    todo = [];
  }
  if (!toDone) {
    toDone = [];
  }
}

getCount();
getList();

let todoCount = count;
let toDoneCount = countDone;

while (todoCount > 0) {
  addItemTodo('todo');
  --todoCount;
}

while (toDoneCount > 0) {
  addItemTodo('toDone');
  --toDoneCount;
}

function addItemWhenenter(e) {
  e.keyCode === 13 &&
    addItemTodo('new');
}

function addItemTodo(flag) {
  const item = document.createElement("li");
  const span = document.createElement("span");
  const check = document.createElement("input");
  const spanImg = document.createElement("span");

  item.appendChild(check);
  item.appendChild(spanImg);
  item.appendChild(span);

  check.setAttribute('type', 'checkbox');

  check.classList.add("check-item");
  span.classList.add("list-item");
  spanImg.classList.add("glyphicon");
  spanImg.classList.add("glyphicon-remove");

  switch (flag) {
    case "todo": {
      span.innerHTML = todo[x];
      myList.appendChild(item);
      x++;
      document.getElementById("noitem").style.display = "none";
      break
    }
    case "toDone": {
      check.checked = true;
      span.innerHTML = toDone[y];
      doneList.appendChild(item);
      y++;
      document.getElementById("doneitem").style.display = "none";
      break
    }
    default: {
      const itemContent = document.getElementById("itemname");

      todo.push(itemContent.value);

      saveList();

      span.innerHTML = itemContent.value;
      myList.appendChild(item);
      itemContent.value = "";
      count++;

      saveCount();
      displayTitle();
    }
  }


  check.addEventListener("change", function () {
    const doneItem = this.parentElement;

    temp = doneItem.childNodes[2].innerHTML;

    if (myList.id === this.parentElement.parentElement.id) {
      myList.removeChild(doneItem);
      span.innerHTML = temp;
      doneList.appendChild(item);
      count--;
      countDone++;
      toDone.push(temp);

      for (let i = 0; i < todo.length; i++) {
        temp === todo[i] &&
          todo.splice(i, 1);
      }
    } else {
      doneList.removeChild(doneItem);
      span.innerHTML = temp;
      myList.appendChild(item);
      count++;
      countDone--;
      todo.push(temp);

      for (let i = 0; i < toDone.length; i++) {
        temp === toDone[i] &&
        toDone.splice(i, 1);
      }
    }

    saveList();
    saveCount();
    displayTitle();
  })

  span.addEventListener("dblclick", function () {
    let data = this.innerHTML;
    const parent = this.parentElement;

    span.innerHTML = "";

    const form = document.createElement("span");
    const text = document.createElement("input");
    const ok = document.createElement("button");
    const cancel = document.createElement("button");

    text.value = data;
    ok.innerHTML = "OK";
    cancel.innerHTML = "Cancel";

    form.appendChild(text);
    form.appendChild(ok);
    form.appendChild(cancel);
    span.appendChild(form);

    ok.addEventListener("click", function () {
      span.removeChild(form);

      for (let i = 0; i < todo.length; i++) {
        if (data === todo[i]) {
          todo[i] = text.value;
        }
      }
      for (let i = 0; i < toDone.length; i++) {
        if (data === toDone[i]) {
          toDone[i] = text.value;
        }
      }

      saveList();

      data = text.value;
      span.innerHTML = data;
      parent.appendChild(span);
    });

    cancel.addEventListener("click", function () {
      span.removeChild(form);
      span.innerHTML = data;
      parent.appendChild(span);
    });
  });

  spanImg.addEventListener("click", function () {
    const removeItem = this.parentElement;

    temp = removeItem.childNodes[2].innerHTML;

    if (myList.id === this.parentElement.parentElement.id) {
      myList.removeChild(removeItem);
      count--;

      for (let i = 0; i < todo.length; i++) {
        if (temp === todo[i])
          todo.splice(i, 1);
      }
    } else {
      doneList.removeChild(removeItem);
      countDone--;

      for (let i = 0; i < toDone.length; i++) {
        if (temp === toDone[i])
          toDone.splice(i, 1);
      }
    }
    saveList();
    saveCount();
    displayTitle();
  });
}
